<?php

namespace App\Http\Controllers\Api;

use App\Models\Payment;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class PaymentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = auth()->user();
        $payments = Payment::where('payer_id', $user->id)->paginate();

        return $this->paginatedResponse($payments);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'reservation_id' => 'required|exists:reservations,id',
            'payment_method' => 'required|in:credit,debit,pix,bank,credit_card,debit_card,bank_transfer'
        ]);

        $reservation = Reservation::find($validated['reservation_id']);

        $paymentMethod = match ($validated['payment_method']) {
            'credit' => 'credit_card',
            'debit' => 'debit_card',
            'bank' => 'bank_transfer',
            default => $validated['payment_method'],
        };

        $payment = Payment::create([
            'reservation_id' => $reservation->id,
            'payer_id' => auth()->id(),
            'total_amount' => $reservation->total_price,
            'host_amount' => ($reservation->total_price - $reservation->platform_fee) * 0.9,
            'cohost_amount' => 0, // Calculate if co-hosts exist
            'platform_fee' => $reservation->platform_fee,
            'payment_method' => $paymentMethod,
            'status' => 'pending',
            'gateway_transaction_id' => 'TXN_' . uniqid(),
            'processed_at' => now()
        ]);

        $reservation->update(['payment_id' => $payment->id, 'status' => 'confirmed']);

        return $this->jsonResponse($payment, 201);
    }

    public function show(Payment $payment): JsonResponse
    {
        // TODO: Implement authorization policy
        // $this->authorize('view', $payment);

        return $this->jsonResponse($payment->load(['reservation', 'payer']));
    }

    public function status(Payment $payment): JsonResponse
    {
        return $this->jsonResponse(['status' => $payment->status]);
    }

    public function refund(Request $request, Payment $payment): JsonResponse
    {
        $payment->update([
            'status' => 'refunded',
            'refunded_at' => now(),
            'refund_reason' => $request->reason
        ]);

        return response()->json($payment);
    }
}
