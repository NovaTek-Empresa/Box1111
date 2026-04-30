<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MercadoPagoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    protected $mercadoPago;

    public function __construct(MercadoPagoService $mercadoPago)
    {
        $this->mercadoPago = $mercadoPago;
    }

    /**
     * Receber notificações do Mercado Pago
     * POST /api/webhooks/mercadopago
     * 
     * Tipos de notificação:
     * - payment: Notificação de pagamento
     * - plan: Notificação de plano de assinatura
     * - subscription: Notificação de assinatura
     * - invoice: Notificação de fatura
     * - charge: Notificação de cobrança
     */
    public function mercadoPago(Request $request)
    {
        try {
            $data = $request->all();

            Log::info('Webhook Mercado Pago recebido', [
                'type' => $data['type'] ?? 'unknown',
                'data_id' => $data['data']['id'] ?? 'unknown'
            ]);

            // Processar notificação
            $result = $this->mercadoPago->processWebhookNotification($data);

            return response()->json($result);
        } catch (\Exception $e) {
            Log::error('Erro ao processar webhook Mercado Pago', [
                'error' => $e->getMessage(),
                'data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao processar webhook',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verificação de saúde do webhook
     * GET /api/webhooks/mercadopago/health
     */
    public function health()
    {
        return response()->json([
            'status' => 'ok',
            'timestamp' => now()->toIso8601String()
        ]);
    }
}
