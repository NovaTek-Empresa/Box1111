<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Payment;
use App\Models\Reservation;

class MercadoPagoService
{
    private $baseUrl = 'https://api.mercadopago.com';
    private $accessToken;
    private $userId;
    private $posId;

    public function __construct()
    {
        $this->accessToken = config('services.mercadopago.access_token');
        $this->userId = config('services.mercadopago.user_id');
        $this->posId = config('services.mercadopago.pos_id');
    }

    /**
     * Criar uma preferência de pagamento (pagamento via redirecionamento)
     */
    public function createPaymentPreference($reservation, $user)
    {
        $items = [
            [
                'title' => 'Aluguel: ' . $reservation->property->title,
                'description' => 'Check-in: ' . $reservation->check_in . ' | Check-out: ' . $reservation->check_out,
                'quantity' => 1,
                'unit_price' => (float)$reservation->total_price,
                'category_id' => 'home_rental',
                'currency_id' => 'BRL'
            ]
        ];

        $payload = [
            'items' => $items,
            'payer' => [
                'name' => $user->first_name,
                'surname' => $user->last_name,
                'email' => $user->email,
                'phone' => [
                    'area_code' => '11',
                    'number' => $this->sanitizePhone($user->phone ?? '999999999')
                ],
                'address' => [
                    'street_name' => 'N/A',
                    'street_number' => 1,
                    'zip_code' => '00000000'
                ],
                'date_created' => $user->created_at
            ],
            'back_urls' => [
                'success' => config('app.frontend_url') . '/payment/success',
                'failure' => config('app.frontend_url') . '/payment/failure',
                'pending' => config('app.frontend_url') . '/payment/pending'
            ],
            'auto_return' => 'approved',
            'notification_url' => config('app.url') . '/api/webhooks/mercadopago',
            'external_reference' => 'RESERVATION_' . $reservation->id,
            'expires' => true,
            'expiration_date_from' => now()->toIso8601String(),
            'expiration_date_to' => now()->addDays(7)->toIso8601String()
        ];

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->accessToken,
                'X-Idempotency-Key' => uniqid('mp_'),
            ])->post($this->baseUrl . '/checkout/preferences', $payload);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Mercado Pago - Erro ao criar preferência', [
                'status' => $response->status(),
                'response' => $response->json()
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('Mercado Pago - Exception ao criar preferência', [
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Criar ponto de venda (Point of Sale) para QR code
     */
    public function createPointOfSale($reservation, $user)
    {
        $payload = [
            'name' => 'Pagamento - Aluguel ' . $reservation->id,
            'type' => 'PAYMENT_FORM',
            'fixed_amount' => true,
            'amount' => (float)$reservation->total_price,
            'description' => 'Aluguel: ' . $reservation->property->title,
            'store_id' => config('services.mercadopago.store_id'),
        ];

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->accessToken,
            ])->post($this->baseUrl . '/pos', $payload);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Mercado Pago - Erro ao criar POS', [
                'status' => $response->status(),
                'response' => $response->json()
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('Mercado Pago - Exception ao criar POS', [
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Gerar QR code para pagamento
     */
    public function generateQRCode($reservation, $user)
    {
        try {
            // Criar preferência de pagamento
            $preference = $this->createPaymentPreference($reservation, $user);

            if (!$preference) {
                return null;
            }

            // Retornar dados para gerar QR code no frontend
            return [
                'preference_id' => $preference['id'],
                'init_point' => $preference['init_point'],
                'qr_code_url' => $preference['point_of_interaction']['qr_code']['image'] ?? null,
            ];
        } catch (\Exception $e) {
            Log::error('Mercado Pago - Erro ao gerar QR code', [
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Verificar status de um pagamento
     */
    public function getPaymentStatus($paymentId)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->accessToken,
            ])->get($this->baseUrl . '/v1/payments/' . $paymentId);

            if ($response->successful()) {
                return $response->json();
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Mercado Pago - Erro ao obter status de pagamento', [
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Processar notificação de webhook do Mercado Pago
     */
    public function processWebhookNotification($data)
    {
        try {
            // Verificar tipo de notificação
            if ($data['type'] != 'payment') {
                return [
                    'success' => false,
                    'message' => 'Tipo de notificação não suportado'
                ];
            }

            // Buscar pagamento no Mercado Pago
            $paymentData = $this->getPaymentStatus($data['data']['id']);

            if (!$paymentData) {
                return [
                    'success' => false,
                    'message' => 'Pagamento não encontrado'
                ];
            }

            // Extrair referência da reserva
            $externalReference = $paymentData['external_reference'] ?? null;

            if (!$externalReference || !str_starts_with($externalReference, 'RESERVATION_')) {
                return [
                    'success' => false,
                    'message' => 'Referência de reserva inválida'
                ];
            }

            $reservationId = str_replace('RESERVATION_', '', $externalReference);
            $reservation = Reservation::find($reservationId);

            if (!$reservation) {
                return [
                    'success' => false,
                    'message' => 'Reserva não encontrada'
                ];
            }

            // Verificar se pagamento já foi processado
            $existingPayment = Payment::where('gateway_transaction_id', $paymentData['id'])->first();

            if ($existingPayment) {
                return [
                    'success' => true,
                    'message' => 'Pagamento já processado',
                    'payment_id' => $existingPayment->id
                ];
            }

            // Criar registro de pagamento
            $payment = new Payment();
            $payment->reservation_id = $reservation->id;
            $payment->payer_id = $reservation->guest_id;
            $payment->total_amount = $reservation->total_price;
            $payment->platform_fee = $reservation->platform_fee;
            $payment->host_amount = $reservation->total_price - $reservation->platform_fee;
            $payment->cohost_amount = 0; // TODO: Implementar distribuição entre cohosts
            $payment->payment_method = $paymentData['payment_method_id'] ?? 'unknown';
            $payment->gateway_transaction_id = $paymentData['id'];
            $payment->gateway_response = $paymentData;

            // Processar status
            if ($paymentData['status'] == 'approved') {
                $payment->status = 'completed';
                $payment->processed_at = now();

                // Confirmar reserva
                $reservation->status = 'confirmed';
                $reservation->confirmed_at = now();
                $reservation->payment_id = $payment->id;
                $reservation->save();

                $message = 'Pagamento aprovado com sucesso';
            } elseif ($paymentData['status'] == 'pending') {
                $payment->status = 'pending';
                $message = 'Pagamento pendente de aprovação';
            } elseif ($paymentData['status'] == 'rejected') {
                $payment->status = 'failed';
                $message = 'Pagamento rejeitado';
            } else {
                $payment->status = $paymentData['status'];
                $message = 'Status de pagamento: ' . $paymentData['status'];
            }

            $payment->save();

            Log::info('Mercado Pago - Webhook processado com sucesso', [
                'payment_id' => $payment->id,
                'reservation_id' => $reservation->id,
                'status' => $payment->status
            ]);

            return [
                'success' => true,
                'message' => $message,
                'payment_id' => $payment->id,
                'status' => $payment->status
            ];
        } catch (\Exception $e) {
            Log::error('Mercado Pago - Erro ao processar webhook', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao processar notificação: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Sanitizar número de telefone
     */
    private function sanitizePhone($phone)
    {
        // Remove tudo exceto números
        $phone = preg_replace('/\D/', '', $phone);

        // Se tiver menos de 11 dígitos, preenche com 9s
        if (strlen($phone) < 11) {
            $phone = str_pad($phone, 11, '9', STR_PAD_RIGHT);
        }

        // Retorna apenas os últimos 9 dígitos (sem DDD)
        return substr($phone, -9);
    }

    /**
     * Obter lista de pagamentos de uma reserva
     */
    public function getReservationPayments($reservationId)
    {
        return Payment::where('reservation_id', $reservationId)->get();
    }

    /**
     * Reembolsar pagamento
     */
    public function refundPayment($paymentId, $amount = null)
    {
        try {
            $payload = [];

            if ($amount) {
                $payload['amount'] = (float)$amount;
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->accessToken,
            ])->post($this->baseUrl . '/v1/payments/' . $paymentId . '/refunds', $payload);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Mercado Pago - Erro ao reembolsar pagamento', [
                'payment_id' => $paymentId,
                'status' => $response->status(),
                'response' => $response->json()
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('Mercado Pago - Exception ao reembolsar pagamento', [
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }
}
