<?php

namespace App\Http\Controllers\Api;

use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class ConversationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        // Build query for conversations where the authenticated user is participant
        $query = Conversation::where(function ($q) {
            $q->where('user_1', auth()->id())
              ->orWhere('user_2', auth()->id());
        });

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $conversations = $query
            ->with(['user1', 'user2', 'messages' => function ($q) {
                $q->latest()->limit(1);
            }])
            ->orderBy('updated_at', 'desc')
            ->paginate(20);

        return $this->paginatedResponse($conversations);
    }

    public function show(Conversation $conversation): JsonResponse
    {
        // Check authorization manually (user must be participant)
        if ($conversation->user_1 !== auth()->id() && $conversation->user_2 !== auth()->id()) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        $conversation->load([
            'messages' => function ($query) {
                $query->with('sender')->orderBy('created_at', 'asc')->limit(100);
            },
            'user1',
            'user2',
        ]);

        // Mark incoming messages as read
        $conversation->messages()
            ->where('sender_id', '!=', auth()->id())
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return $this->jsonResponse($conversation);
    }

    public function store(Request $request): JsonResponse
    {
        $jsonInput = file_get_contents('php://input');
        if ($jsonInput) {
            $data = json_decode($jsonInput, true);
            if (json_last_error() === JSON_ERROR_NONE && $data) {
                $validated = validator($data, [
                    'user_2'          => 'required|exists:users,id|different:' . auth()->id(),
                    'reservation_id'  => 'nullable|exists:reservations,id',
                    'subject'         => 'nullable|string|max:255',
                    'initial_message' => 'required|string|max:2000',
                ])->validate();

                // Check if conversation already exists between these two users
                $existing = Conversation::where(function ($q) use ($validated) {
                    $q->where('user_1', auth()->id())
                      ->where('user_2', $validated['user_2']);
                })->orWhere(function ($q) use ($validated) {
                    $q->where('user_1', $validated['user_2'])
                      ->where('user_2', auth()->id());
                })->first();

                if ($existing) {
                    // Return existing conversation with a 200 instead of error
                    return $this->jsonResponse([
                        'conversation'    => $existing->load(['user1', 'user2']),
                        'already_existed' => true,
                    ]);
                }

                $conversation = Conversation::create([
                    'user_1'         => auth()->id(),
                    'user_2'         => $validated['user_2'],
                    'reservation_id' => $validated['reservation_id'] ?? null,
                    'subject'        => $validated['subject'] ?? null,
                    'status'         => 'active',
                ]);

                // Create the opening message
                $conversation->messages()->create([
                    'sender_id' => auth()->id(),
                    'content'   => $validated['initial_message'],
                ]);

                // Update conversation timestamp
                $conversation->touch();

                return $this->jsonResponse($conversation->load(['user1', 'user2']), 201);
            }
        }

        return response()->json(['message' => 'Invalid JSON data'], 400);
    }

    public function update(Request $request, Conversation $conversation): JsonResponse
    {
        if ($conversation->user_1 !== auth()->id() && $conversation->user_2 !== auth()->id()) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        $validated = $request->validate([
            'status'  => 'sometimes|in:active,archived,blocked',
            'subject' => 'sometimes|nullable|string|max:255',
        ]);

        $conversation->update($validated);

        return $this->jsonResponse($conversation);
    }

    public function destroy(Conversation $conversation): JsonResponse
    {
        if ($conversation->user_1 !== auth()->id() && $conversation->user_2 !== auth()->id()) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        $conversation->messages()->delete();
        $conversation->delete();

        return $this->jsonResponse(['message' => 'Conversa removida']);
    }

    public function markAsRead(Request $request, Conversation $conversation): JsonResponse
    {
        if ($conversation->user_1 !== auth()->id() && $conversation->user_2 !== auth()->id()) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        $conversation->messages()
            ->where('sender_id', '!=', auth()->id())
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return $this->jsonResponse(['message' => 'Mensagens marcadas como lidas']);
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $count = Conversation::where(function ($q) {
            $q->where('user_1', auth()->id())
              ->orWhere('user_2', auth()->id());
        })->whereHas('messages', function ($q) {
            $q->where('sender_id', '!=', auth()->id())
              ->whereNull('read_at');
        })->count();

        return $this->jsonResponse(['unread_conversations' => $count]);
    }

    public function archive(Conversation $conversation): JsonResponse
    {
        if ($conversation->user_1 !== auth()->id() && $conversation->user_2 !== auth()->id()) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        $conversation->update(['status' => 'archived', 'archived_at' => now()]);

        return $this->jsonResponse($conversation);
    }

    public function unarchive(Conversation $conversation): JsonResponse
    {
        if ($conversation->user_1 !== auth()->id() && $conversation->user_2 !== auth()->id()) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        $conversation->update(['status' => 'active', 'archived_at' => null]);

        return $this->jsonResponse($conversation);
    }
}
