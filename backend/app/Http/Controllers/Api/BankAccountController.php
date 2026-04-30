<?php

namespace App\Http\Controllers\Api;

use App\Models\BankAccount;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class BankAccountController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $bankAccounts = auth()->user()->bankAccounts()->paginate();

        return $this->paginatedResponse($bankAccounts);
    }

    public function show(BankAccount $bankAccount): JsonResponse
    {
        $this->authorize('view', $bankAccount);

        return $this->jsonResponse($bankAccount);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'bank_name' => 'required|string|max:100',
            'bank_code' => 'required|string|max:10',
            'agency_number' => 'required|string|max:20',
            'account_number' => 'required|string|max:30',
            'account_type' => 'required|in:checking,savings',
            'account_holder_name' => 'required|string|max:255',
            'account_holder_document' => 'required|string|max:20',
            'is_default' => 'boolean',
            'pix_key_type' => 'nullable|in:cpf,cnpj,email,phone,random',
            'pix_key' => 'nullable|string|max:255|required_with:pix_key_type'
        ]);

        // If setting as default, unset other defaults
        if ($validated['is_default'] ?? false) {
            auth()->user()->bankAccounts()->update(['is_default' => false]);
        }

        $bankAccount = auth()->user()->bankAccounts()->create($validated);

        return $this->jsonResponse($bankAccount, 201);
    }

    public function update(Request $request, BankAccount $bankAccount): JsonResponse
    {
        $this->authorize('update', $bankAccount);

        $validated = $request->validate([
            'bank_name' => 'sometimes|string|max:100',
            'bank_code' => 'sometimes|string|max:10',
            'agency_number' => 'sometimes|string|max:20',
            'account_number' => 'sometimes|string|max:30',
            'account_type' => 'sometimes|in:checking,savings',
            'account_holder_name' => 'sometimes|string|max:255',
            'account_holder_document' => 'sometimes|string|max:20',
            'is_default' => 'boolean',
            'pix_key_type' => 'nullable|in:cpf,cnpj,email,phone,random',
            'pix_key' => 'nullable|string|max:255|required_with:pix_key_type'
        ]);

        // If setting as default, unset other defaults
        if (($validated['is_default'] ?? false) && !$bankAccount->is_default) {
            auth()->user()->bankAccounts()->where('id', '!=', $bankAccount->id)->update(['is_default' => false]);
        }

        $bankAccount->update($validated);

        return $this->jsonResponse($bankAccount);
    }

    public function destroy(BankAccount $bankAccount): JsonResponse
    {
        $this->authorize('delete', $bankAccount);

        // Prevent deletion of default account if user has other accounts
        if ($bankAccount->is_default && auth()->user()->bankAccounts()->count() > 1) {
            return response()->json([
                'error' => 'Cannot delete default bank account. Please set another account as default first.'
            ], 400);
        }

        $bankAccount->delete();

        return $this->jsonResponse(['message' => 'Bank account deleted']);
    }

    public function setDefault(Request $request, BankAccount $bankAccount): JsonResponse
    {
        $this->authorize('update', $bankAccount);

        // Unset all other defaults
        auth()->user()->bankAccounts()->where('id', '!=', $bankAccount->id)->update(['is_default' => false]);

        // Set this as default
        $bankAccount->update(['is_default' => true]);

        return $this->jsonResponse($bankAccount);
    }
}
