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
        // Admin can see all statuses, public only sees approved
        $query = HostProfile::with('user');

        if (!$request->has('all')) {
            $query->where('status', 'approved');
        }

        if ($search = $request->query('q')) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            })->orWhere('bio', 'like', "%{$search}%");
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($minRating = $request->query('min_rating')) {
            $query->where('rating', '>=', $minRating);
        }

        $profiles = $query->paginate(15);

        return $this->paginatedResponse($profiles);
    }

    public function show(HostProfile $hostProfile): JsonResponse
    {
        return $this->jsonResponse($hostProfile->load(['user', 'properties']));
    }

    public function store(Request $request): JsonResponse
    {
        $jsonInput = file_get_contents('php://input');
        if ($jsonInput) {
            $data = json_decode($jsonInput, true);
            if (json_last_error() === JSON_ERROR_NONE && $data) {
                $user = auth()->user();
                if (!$user) {
                    return response()->json(['message' => 'Não autenticado'], 401);
                }

                validator($data, [
                    'name'         => ['required', 'string', 'max:255'],
                    'email'        => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
                    'phone'        => ['nullable', 'string', 'max:30'],
                    'cpf'          => ['nullable', 'string', 'max:20'],
                    'experience'   => ['nullable', 'string', 'max:50'],
                    'availability' => ['nullable', 'string', 'max:50'],
                    'services'     => ['nullable', 'array'],
                    'services.*'   => ['string', 'max:50'],
                    'street'       => ['nullable', 'string', 'max:255'],
                    'number'       => ['nullable', 'string', 'max:50'],
                    'neighborhood' => ['nullable', 'string', 'max:255'],
                    'city'         => ['nullable', 'string', 'max:255'],
                    'state'        => ['nullable', 'string', 'max:10'],
                    'region'       => ['nullable', 'string', 'max:255'],
                ])->validate();

                $user->update([
                    'name'  => $data['name'],
                    'email' => $data['email'],
                    'phone' => $data['phone'] ?? $user->phone,
                ]);

                $bio = [
                    'cpf'          => $data['cpf'] ?? null,
                    'experience'   => $data['experience'] ?? null,
                    'availability' => $data['availability'] ?? null,
                    'services'     => $data['services'] ?? [],
                    'address'      => [
                        'street'       => $data['street'] ?? null,
                        'number'       => $data['number'] ?? null,
                        'neighborhood' => $data['neighborhood'] ?? null,
                        'city'         => $data['city'] ?? null,
                        'state'        => $data['state'] ?? null,
                        'region'       => $data['region'] ?? null,
                    ],
                ];

                $profile = HostProfile::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'bio'       => json_encode($bio, JSON_UNESCAPED_UNICODE),
                        'status'    => $user->hostProfile ? $user->hostProfile->status : 'pending',
                        'is_cohost' => true,
                    ]
                );

                // Update user role