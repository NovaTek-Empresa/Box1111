<?php

namespace App\Http\Controllers\Api;

use App\Models\Payout;
use App\Models\BankAccount;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class PayoutController extends Controller
{
    /**
     * Helper: get the HostProfile for the current user, or return null.
     */
    private function getHostProfile()
    {
        return auth()->user()->hostProfile;
    }

    public function index(Request $request): JsonResponse
    {
        $hostProfile = $this->getHostProfile();

        if (!$hostProfile) {
            return response()->json(['message' => 'Perfil de anfitrião não encontrado'], 404);
        }

        $query = $hostProfile->payouts();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $payouts = $query->orderBy('created_at', 'desc')->paginate(15);

        return $this->paginatedResponse($payouts);
    }

    public function show(Payout $payout): JsonResponse
    {
        $hostProfile = $this->getHostProfile();

        if (!$hostProfile || $payout->host_id !== $hostProfile->id) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        return $this->jsonResponse($payout->load(['bankAccount']));
    }

    public function store(Request $request): JsonResponse
    {
        $hostProfile = $this->getHostProfile();

        if (!$hostProfile) {
            return response()->json(['message' => 'Perfil de anfitrião não encontrado'], 404);
        }

        $validated = $request->validate([
            'bank_account_id' => 'required|exists:bank_accounts,id',
            'amount'          => 'required|numeric|min:1',
        ]);

        // Verify the bank account belongs to this host
        $bankAccount = BankAccount::where('id', $validated['bank_account_id'])
            ->where('host_id', $hostProfile->id)
            ->first();

        if (!$bankAccount) {
            return response()->json(['message' => 'Conta bancária não encontrada'], 404);
        }

        $availableBalance = $this->calculateBalance($hostProfile);

        if ($availableBalance < $validated['amount']) {
            return response()->json([
                'error'             => 'Saldo insuficiente',
                'available_balance' => $availableBalance,
            ], 400);
        }

        $fee       = $this->calculateFee($validated['amount']);
        $netAmount = $validated['amount'] - $fee;

        $payout = $hostProfile->payouts()->create([
            'bank_account_id' => $validated['bank_account_id'],
            'amount'          => $validated['amount'],
            'fees'            => $fee,
            'net_amount'      => $netAmount,
            'status'          => 'pending',
        ]);

        return $this->jsonResponse($payout, 201);
    }

    public function update(Request $request, Payout $payout): JsonResponse
    {
        $hostProfile = $this->getHostProfile();

        if (!$hostProfile || $payout->host_id !== $hostProfile->id) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        $validated = $request->validate([
            'status'                 => 'required|in:pending,processing,completed,failed,cancelled',
            'gateway_transaction_id' => 'nullable|string|max:255',
            'failure_reason'         => 'nullable|string|max:255',
            'processed_at'           => 'nullable|date',
        ]);

        $payout->update($validated);

        return $this->jsonResponse($payout);
    }

    public function destroy(Payout $payout): JsonResponse
    {
        $hostProfile = $this->getHostProfile();

        if (!$hostProfile || $payout->host_id !== $hostProfile->id) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        if (in_array($payout->status, ['processing', 'completed'])) {
            return response()->json([
                'error' => 'Não é possível cancelar um saque em processamento ou concluído',
            ], 400);
        }

        $payout->update(['status' => 'cancelled']);

        return $this->jsonResponse(['message' => 'Saque cancelado']);
    }

    public function summary(Request $request): JsonResponse
    {
        $hostProfile = $this->getHostProfile();

        if (!$hostProfile) {
            return $this->jsonResponse([
                'available_balance' => 0,
                'pending_payouts'   => 0,
                'completed_payouts' => 0,
                'total_earnings'    => 0,
            ]);
        }

        $pendingPayouts   = $hostProfile->payouts()->where('status', 'pending')->sum('amount');
        $completedPayouts = $hostProfile->payouts()->where('status', 'completed')->sum('net_amount');
        $availableBalance = $this->calculateBalance($hostProfile);

        return $this->jsonResponse([
            'available_balance' => $availableBalance,
            'pending_payouts'   => $pendingPayouts,
            'completed_payouts' => $completedPayouts,
            'total_earnings'    => $availableBalance + $pendingPayouts + $completedPayouts,
        ]);
    }

    // -------------------------------------------------------
    // Helpers
    // -------------------------------------------------------

    private function calculateBalance($hostProfile): float
    {
        // Sum of completed reservations for all properties of this host
        $totalEarnings = $hostProfile->properties()
            ->with(['reservations' => function ($q) {
                $q->where('status', 'completed');
            }])
            ->get()
            ->sum(fn($p) => $p->reservations->sum('total_price'));

        $totalPaidOut = $hostProfile->payouts()
            ->where('status', 'completed')
            ->sum('amount');

        return max(0, $totalEarnings - $totalPaidOut);
    }

    private function calculateFee(float $amount): float
    {
        // 2% + R$ 2.00 fixo
        return round(($amount * 0.02) + 2.00, 2);
    }
}
