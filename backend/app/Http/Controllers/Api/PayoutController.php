<?php

namespace App\Http\Controllers\Api;

use App\Models\Payout;
use App\Models\BankAccount;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class PayoutController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = auth()->user()->payouts();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $payouts = $query->orderBy('created_at', 'desc')->paginate();

        return $this->paginatedResponse($payouts);
    }

    public function show(Payout $payout): JsonResponse
    {
        $this->authorize('view', $payout);

        return $this->jsonResponse($payout->load(['bankAccount', 'reservation.property']));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'bank_account_id' => 'required|exists:bank_accounts,id',
            'amount' => 'required|numeric|min:1',
            'description' => 'nullable|string|max:255'
        ]);

        $bankAccount = BankAccount::findOrFail($validated['bank_account_id']);
        $this->authorize('use', $bankAccount);

        // Check if user has sufficient balance (simplified logic)
        $userBalance = $this->calculateUserBalance();
        if ($userBalance < $validated['amount']) {
            return response()->json([
                'error' => 'Insufficient balance',
                'available_balance' => $userBalance
            ], 400);
        }

        $payout = auth()->user()->payouts()->create([
            'bank_account_id' => $validated['bank_account_id'],
            'amount' => $validated['amount'],
            'description' => $validated['description'] ?? 'Payout request',
            'status' => 'pending',
            'fee' => $this->calculatePayoutFee($validated['amount']),
            'net_amount' => $validated['amount'] - $this->calculatePayoutFee($validated['amount'])
        ]);

        return $this->jsonResponse($payout, 201);
    }

    public function update(Request $request, Payout $payout): JsonResponse
    {
        $this->authorize('update', $payout);

        $validated = $request->validate([
            'status' => 'required|in:pending,processing,completed,failed,cancelled',
            'gateway_transaction_id' => 'nullable|string|max:255',
            'failure_reason' => 'nullable|string|max:255',
            'processed_at' => 'nullable|date'
        ]);

        $payout->update($validated);

        return $this->jsonResponse($payout);
    }

    public function destroy(Payout $payout): JsonResponse
    {
        $this->authorize('delete', $payout);

        if ($payout->status === 'processing' || $payout->status === 'completed') {
            return response()->json([
                'error' => 'Cannot delete payout that is being processed or has been completed'
            ], 400);
        }

        $payout->update(['status' => 'cancelled']);

        return $this->jsonResponse(['message' => 'Payout cancelled']);
    }

    public function summary(Request $request): JsonResponse
    {
        $user = auth()->user();
        
        $pendingPayouts = $user->payouts()->where('status', 'pending')->sum('amount');
        $completedPayouts = $user->payouts()->where('status', 'completed')->sum('amount');
        $availableBalance = $this->calculateUserBalance();

        return $this->jsonResponse([
            'available_balance' => $availableBalance,
            'pending_payouts' => $pendingPayouts,
            'completed_payouts' => $completedPayouts,
            'total_earnings' => $availableBalance + $pendingPayouts + $completedPayouts
        ]);
    }

    private function calculateUserBalance(): float
    {
        // Simplified balance calculation
        // In production, this would calculate from completed reservations and payments
        $totalEarnings = auth()->user()
            ->hostProfile
            ->properties()
            ->with(['reservations' => function ($query) {
                $query->where('status', 'completed');
            }])
            ->get()
            ->sum(function ($property) {
                return $property->reservations->sum('total_price');
            });

        $totalPayouts = auth()->user()->payouts()->where('status', 'completed')->sum('amount');

        return max(0, $totalEarnings - $totalPayouts);
    }

    private function calculatePayoutFee(float $amount): float
    {
        // Simple fee calculation: 2% + R$ 2.00 fixed
        return ($amount * 0.02) + 2.00;
    }
}
