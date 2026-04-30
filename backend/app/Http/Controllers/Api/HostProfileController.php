<?php

namespace App\Http\Controllers\Api;

use App\Models\HostProfile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class HostProfileController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = HostProfile::with('user')->where('status', 'approved');

        if ($search = $request->query('q')) {
            $query->whereHas('user', function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })->orWhere('bio', 'like', "%{$search}%");
        }

        if ($region = $request->query('region')) {
            $query->where('bio', 'like', "%{$region}%");
        }

        if ($minRating = $request->query('min_rating')) {
            $query->where('average_rating', '>=', $minRating);
        }

        $profiles = $query->paginate(12);

        return $this->paginatedResponse($profiles);
    }

    public function show(HostProfile $hostProfile): JsonResponse
    {
        return $this->jsonResponse($hostProfile->load('user'));
    }

    public function store(Request $request): JsonResponse
    {
        // Try to get JSON data from file_get_contents as fallback
        $jsonInput = file_get_contents('php://input');
        if ($jsonInput) {
            $data = json_decode($jsonInput, true);
            if (json_last_error() === JSON_ERROR_NONE && $data) {
                $user = auth()->user();
                if (! $user) {
                    return response()->json(['message' => 'Não autenticado'], 401);
                }

                $validated = validator($data, [
                    'name' => ['required', 'string', 'max:255'],
                    'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
                    'phone' => ['nullable', 'string', 'max:30'],
                    'cpf' => ['nullable', 'string', 'max:20'],
                    'experience' => ['nullable', 'string', 'max:50'],
                    'availability' => ['nullable', 'string', 'max:50'],
                    'services' => ['nullable', 'array'],
                    'services.*' => ['string', 'max:50'],
                    'street' => ['nullable', 'string', 'max:255'],
                    'number' => ['nullable', 'string', 'max:50'],
                    'neighborhood' => ['nullable', 'string', 'max:255'],
                    'city' => ['nullable', 'string', 'max:255'],
                    'state' => ['nullable', 'string', 'max:10'],
                    'region' => ['nullable', 'string', 'max:255'],
                ])->validate();

                $user->update([
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'phone' => $data['phone'] ?? $user->phone,
                ]);

                $bio = [
                    'cpf' => $data['cpf'] ?? null,
                    'experience' => $data['experience'] ?? null,
                    'availability' => $data['availability'] ?? null,
                    'services' => $data['services'] ?? [],
                    'address' => [
                        'street' => $data['street'] ?? null,
                        'number' => $data['number'] ?? null,
                        'neighborhood' => $data['neighborhood'] ?? null,
                        'city' => $data['city'] ?? null,
                        'state' => $data['state'] ?? null,
                        'region' => $data['region'] ?? null,
                    ],
                ];

                $profile = HostProfile::updateOrCreate([
                    'user_id' => $user->id,
                ], [
                    'bio' => json_encode($bio, JSON_UNESCAPED_UNICODE),
                    'status' => 'pending',
                    'is_cohost' => true,
                ]);

                return $this->jsonResponse(['profile' => $profile], 201);
            }
        }
        
        return response()->json(['message' => 'Invalid JSON data'], 400);
    }
}
