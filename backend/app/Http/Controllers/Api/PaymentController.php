<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Reservation;
use App\Services\MercadoPagoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    protected $mercadoPago;

    public function __construct(MercadoPagoService $mercadoPago)
    {
        $this->mercadoPago = $mercadoPago;
    }

    /**
     * Listar pagamentos do usuário autenticado
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            $perPage = $request->get('per_page', 15);

            // Pagamentos que o usuário fez como guest
            $payments = Payment::where('payer_id', $user->id)
                ->with('reservation.property', 'reservation.host')
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            return response()->json([
                'data' => $payments->items(),
                'meta' => [
                    'total' => $payments->total(),
                    'per_page' => $payments->perPage(),
                    'current_page' => $payments->currentPage(),
                    'last_page' => $payments->lastPage()
                ],
                'links' => [
                    'first' => $payments->url(1),
                    'last' => $payments->url($payments->lastPage()),
                    'prev' => $payments->previousPageUrl(),
                    'next' => $payments->nextPageUrl()
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao listar pagamentos', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Erro ao listar pagamentos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter detalhes de um pagamento
     */
    public function show(Request $request, Payment $payment)
    {
        try {
            $user = $request->user();

            // Verificar se o usuário tem permissão
            if ($payment->payer_id != $user->id && $payment->reservation->host->user_id != $user->id) {
                return response()->json([
                    'message' => 'Não autorizado'
                ], 403);
            }

            return response()->json([
                'data' => $payment->load('reservation.property', 'reservation.host', 'payer')
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao obter pagamento', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Erro ao obter pagamento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Criar pagamento para uma reserva
     * POST /api/payments
     * {
     *   "reservation_id": 1,
     *   "payment_method": "qr_code" // ou "redirect"
     * }
     */
    public function store(Request $request)
    {
        // Try to get JSON data from file_get_contents as fallback
        $jsonInput = file_get_contents('php://input');
        if ($jsonInput) {
            $data = json_decode($jsonInput, true);
            if (json_last_error() === JSON_ERROR_NONE && $data) {
                try {
                    $validated = validator($data, [
                        'reservation_id' => 'required|exists:reservations,id',
                        'payment_method' => 'required|in:qr_code,redirect'
                    ])->validate();

                    $user = $request->user();
                    $reservation = Reservation::with('property', 'host')->find($validated['reservation_id']);

                    // Verificar se o usuário é o guest da reserva
                    if ($reservation->guest_id != $user->id) {
                        return response()->json([
                            'message' => 'Você não pode pagar uma reserva que não é sua'
                        ], 403);
                    }

                    // Verificar se a reserva já está paga
                    if ($reservation->payment_id) {
                        $existingPayment = Payment::find($reservation->payment_id);
                        if ($existingPayment && in_array($existingPayment->status, ['completed', 'pending'])) {
                            return response()->json([
                                'message' => 'Esta reserva já foi paga',
                                'payment' => $existingPayment
                            ], 400);
                        }
                    }

                    // Gerar QR code / Preferência de pagamento
                    if ($validated['payment_method'] == 'qr_code') {
                        $qrData = $this->mercadoPago->generateQRCode($reservation, $user);

                        if (!$qrData) {
                            return response()->json([
                                'message' => 'Erro ao gerar QR code'
                            ], 500);
                        }

                        return response()->json([
                            'message' => 'QR Code gerado com sucesso',
                            'payment_method' => 'qr_code',
                            'data' => $qrData,
                            'reservation_id' => $reservation->id,
                            'amount' => $reservation->total_price,
                            'currency' => 'BRL'
                        ]);
                    } else {
                        // Método de redirecionamento
                        $preference = $this->mercadoPago->createPaymentPreference($reservation, $user);

                        if (!$preference) {
                            return response()->json([
                                'message' => 'Erro ao criar preferência de pagamento'
                            ], 500);
                        }

                        return response()->json([
                            'message' => 'Preferência de pagamento criada com sucesso',
                            'payment_method' => 'redirect',
                            'data' => [
                                'preference_id' => $preference['id'],
                                'init_point' => $preference['init_point'],
                                'checkout_url' => $preference['init_point']
                            ],
                            'reservation_id' => $reservation->id,
                            'amount' => $reservation->total_price,
                            'currency' => 'BRL'
                        ]);
                    }
                } catch (\Illuminate\Validation\ValidationException $e) {
                    return response()->json([
                        'message' => 'Dados inválidos',
                        'errors' => $e->errors()
                    ], 422);
                } catch (\Exception $e) {
                    Log::error('Erro ao criar pagamento', [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);

                    return response()->json([
                        'message' => 'Erro ao criar pagamento',
                        'error' => $e->getMessage()
                    ], 500);
                }
            }
        }
        
        return response()->json(['message' => 'Invalid JSON data'], 400);
    }

    /**
     * Obter status de um pagamento
     * GET /api/payments/{payment}/status
     */
    public function status(Request $request, Payment $payment)
    {
        try {
            $user = $request->user();

            // Verificar permissão
            if ($payment->payer_id != $user->id && $payment->reservation->host->user_id != $user->id) {
                return response()->json([
                    'message' => 'Não autorizado'
                ], 403);
            }

            // Se tem transaction ID, buscar status no Mercado Pago
            if ($payment->gateway_transaction_id) {
                $mpStatus = $this->mercadoPago->getPaymentStatus($payment->gateway_transaction_id);

                if ($mpStatus) {
                    // Atualizar status localmente se tiver mudado
                    $newStatus = $this->mapMercadoPagoStatus($mpStatus['status']);

                    if ($newStatus != $payment->status) {
                        $payment->status = $newStatus;
                        $payment->gateway_response = $mpStatus;

                        if ($newStatus == 'completed') {
                            $payment->processed_at = now();
                            $payment->reservation->status = 'confirmed';
                            $payment->reservation->confirmed_at = now();
                            $payment->reservation->save();
                        }

                        $payment->save();
                    }
                }
            }

            return response()->json([
                'data' => [
                    'id' => $payment->id,
                    'status' => $payment->status,
                    'amount' => $payment->total_amount,
                    'reservation_id' => $payment->reservation_id,
                    'processed_at' => $payment->processed_at,
                    'gateway_transaction_id' => $payment->gateway_transaction_id
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao obter status de pagamento', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Erro ao obter status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reembolsar um pagamento
     * POST /api/payments/{payment}/refund
     * {
     *   "amount": 100.00, // opcional - se não informar, reembolsa tudo
     *   "reason": "Cancelamento da reserva"
     * }
     */
    public function refund(Request $request, Payment $payment)
    {
        try {
            $user = $request->user();

            // Verificar permissão - apenas host pode reembolsar
            $reservation = $payment->reservation;
            if ($reservation->host->user_id != $user->id) {
                return response()->json([
                    'message' => 'Apenas o host pode processar reembolsos'
                ], 403);
            }

            // Validar dados
            $request->validate([
                'amount' => 'nullable|numeric|min:0.01',
                'reason' => 'nullable|string|max:255'
            ]);

            // Verificar se pagamento pode ser reembolsado
            if (!in_array($payment->status, ['completed', 'pending'])) {
                return response()->json([
                    'message' => 'Este pagamento não pode ser reembolsado'
                ], 400);
            }

            // Executar reembolso no Mercado Pago
            $amount = $request->get('amount');
            $refundResult = $this->mercadoPago->refundPayment(
                $payment->gateway_transaction_id,
                $amount
            );

            if (!$refundResult) {
                return response()->json([
                    'message' => 'Erro ao processar reembolso'
                ], 500);
            }

            // Atualizar pagamento
            if ($amount) {
                $payment->refunded_at = now();
                $payment->refund_reason = $request->get('reason', 'Reembolso parcial');
                // TODO: Implementar lógica de reembolso parcial
            } else {
                $payment->status = 'refunded';
                $payment->refunded_at = now();
                $payment->refund_reason = $request->get('reason', 'Reembolso total');

                // Cancelar reserva se necessário
                $reservation->status = 'cancelled';
                $reservation->cancelled_at = now();
                $reservation->cancellation_reason = $request->get('reason');
                $reservation->save();
            }

            $payment->save();

            return response()->json([
                'message' => 'Reembolso processado com sucesso',
                'data' => [
                    'payment_id' => $payment->id,
                    'status' => $payment->status,
                    'refunded_at' => $payment->refunded_at,
                    'refund_result' => $refundResult
                ]
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Dados inválidos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Erro ao reembolsar pagamento', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Erro ao processar reembolso',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mapear status do Mercado Pago para status local
     */
    private function mapMercadoPagoStatus($mpStatus)
    {
        return match ($mpStatus) {
            'approved', 'authorized' => 'completed',
            'pending', 'in_process', 'in_mediation' => 'pending',
            'rejected', 'cancelled', 'refunded' => $mpStatus,
            default => 'pending'
        };
    }
}
