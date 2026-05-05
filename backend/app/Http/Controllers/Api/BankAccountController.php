<?php

namespace App\Http\Controllers\Api;

use App\Models\BankAccount;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class BankAccountController extends Controller
{
    /**
     * Return the host profile for the authenticated user, or a 404 JSON response.
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

        $bankAccounts = $hostProfile->bankAccounts()->paginate(15);

        return $this->paginatedResponse($bankAccounts);
    }

    public function show(BankAccount $bankAccount): JsonResponse
    {
        $hostProfile = $this->getHostProfile();

        if (!$hostProfile || $bankAccount->host_id !== $hostProfile->id) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        return $this->jsonResponse($bankAccount);
    }

    public function store(Request $request): JsonResponse
    {
        $hostProfile = $this->getHostProfile();

        if (!$hostProfile) {
            return response()->json(['message' => 'Perfil de anfitrião não encontrado'], 404);
        }

        $jsonInput = file_get_contents('php://input');
        if ($jsonInput) {
            $data = json_decode($jsonInput, true);
            if (json_last_error() === JSON_ERROR_NONE && $data) {
                $validated = validator($data, [
                    'bank_name'           => 'required|string|max:100',
                    'bank_code'           => 'nullable|string|max:10',
                    'account_number'      => 'required|string|max:30',
                    'account_type'        => 'required|in:checking,savings',
                    'account_holder_name' => 'required|string|max:255',
                    'account_document'    => 'nullable|string|max:20',
                ])->validate();

                $bankAccount = $hostProfile->bankAccounts()->create($validated);

                return $this->jsonResponse($bankAccount, 201);
            }
        }

        return response()->json(['message' => 'Invalid JSON data'], 400);
    }

    public function update(Request $request, BankAccount $bankAccount): JsonResponse
    {
        $hostProfile = $this->getHostProfile();

        if (!$hostProfile || $bankAccount->host_id !== $hostProfile->id) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        $validated = $request->validate([
            'bank_name'           => 'sometimes|string|max:100',
            'bank_code'           => 'nullable|string|max:10',
            'account_number'      => 'sometimes|string|max:30',
            'account_type'        => 'sometimes|in:checking,savings',
            'account_holder_name' => 'sometimes|string|max:255',
            'account_document'    => 'nullable|string|max:20',
        ]);

        $bankAccount->update($validated);

        return $this->jsonResponse($bankAccount);
    }

    public function destroy(BankAccount $bankAccount): JsonResponse
    {
        $hostProfile = $this->getHostProfile();

        if (!$hostProfile || $bankAccount->host_id !== $hostProfile->id) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        $bankAccount->delete();

        return $this->jsonResponse(['message' => 'Conta bancária removida']);
    }

    public function setDefault(Request $request, BankAccount $bankAccount): JsonResponse
    {
        $hostProfile = $this->getHostProfile();

        if (!$hostProfile || $bankAccount->host_id !== $hostProfile->id) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        // This is informational only since the schema doesn't have is_default.
        // The "default" account is simply the most-recently used one.
        return $this->jsonResponse($bankAccount);
    }
}
