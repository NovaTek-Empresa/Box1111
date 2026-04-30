<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\UserDocument;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->has('role')) {
            if ($request->role === 'host') {
                $query->whereHas('hostProfile');
            } elseif ($request->role === 'guest') {
                $query->whereDoesntHave('hostProfile');
            }
        }

        $users = $query->paginate(15);

        return $this->paginatedResponse($users);
    }

    public function show(User $user): JsonResponse
    {
        $user->load(['hostProfile', 'documents', 'guestReservations.property', 'payments']);
        
        // Hide sensitive data
        unset($user->api_token);
        unset($user->password);

        return $this->jsonResponse($user);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:30',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'nullable|in:guest,host'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            'api_token' => bin2hex(random_bytes(32))
        ]);

        // Create host profile if role is host
        if ($validated['role'] === 'host') {
            $user->hostProfile()->create([
                'status' => 'pending',
                'bio' => json_encode([
                    'experience' => null,
                    'services' => [],
                    'address' => null
                ])
            ]);
        }

        return $this->jsonResponse($user, 201);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $this->authorize('update', $user);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'phone' => 'sometimes|string|max:30',
            'password' => 'sometimes|string|min:6|confirmed',
            'avatar' => 'sometimes|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $path = $avatar->store('avatars', 'public');
            $validated['avatar'] = Storage::url($path);
        }

        $user->update($validated);

        return $this->jsonResponse($user);
    }

    public function destroy(User $user): JsonResponse
    {
        $this->authorize('delete', $user);

        // Soft delete by setting email to null and adding deleted_at timestamp
        $user->update([
            'email' => null,
            'deleted_at' => now()
        ]);

        return $this->jsonResponse(['message' => 'User deactivated']);
    }

    public function documents(Request $request, User $user): JsonResponse
    {
        $this->authorize('view', $user);

        $documents = $user->documents()->paginate();

        return $this->paginatedResponse($documents);
    }

    public function uploadDocument(Request $request, User $user): JsonResponse
    {
        $this->authorize('update', $user);

        $validated = $request->validate([
            'document_type' => 'required|in:id_card,passport,driver_license,proof_of_address',
            'document_number' => 'required|string|max:50',
            'file' => 'required|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'expiry_date' => 'nullable|date|after:today'
        ]);

        $file = $request->file('file');
        $path = $file->store('documents/' . $user->id, 'private');

        $document = $user->documents()->create([
            'document_type' => $validated['document_type'],
            'document_number' => $validated['document_number'],
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'file_mime_type' => $file->getMimeType(),
            'expiry_date' => $validated['expiry_date'] ?? null,
            'status' => 'pending'
        ]);

        return $this->jsonResponse($document, 201);
    }

    public function verifyDocument(Request $request, User $user, UserDocument $document): JsonResponse
    {
        $this->authorize('verify', $document);

        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'rejection_reason' => 'required_if:status,rejected|string|max:255'
        ]);

        $document->update([
            'status' => $validated['status'],
            'rejection_reason' => $validated['rejection_reason'] ?? null,
            'verified_at' => now(),
            'verified_by' => auth()->id()
        ]);

        return $this->jsonResponse($document);
    }
}
