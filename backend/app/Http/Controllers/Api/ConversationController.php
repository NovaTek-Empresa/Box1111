<?php

namespace App\Http\Controllers\Api;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class ConversationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = auth()->user()->conversations1()
            ->orWhere('user_2', auth()->id());

        if ($request->has('property_id')) {
            $query->where('property_id', $request->property_id);
        }

        $conversations = $query->with(['lastMessage', 'property', 'user1', 'user2'])
            ->orderBy('updated_at', 'desc')
            ->paginate();

        return $this->paginatedResponse($conversations);
    }

    public function show(Conversation $conversation): JsonResponse
    {
        $this->authorize('view', $conversation);

        $conversation->load([
            'messages' => function ($query) {
                $query->orderBy('created_at', 'asc')->take(50);
            },
            'property',
            'user1',
            'user2'
        ]);

        // Mark messages as read
        $conversation->messages()
            ->where('sender_id', '!=', auth()->id())
            ->where('read_at', null)
            ->update(['read_at' => now()]);

        return $this->jsonResponse($conversation);
    }

    public function store(Request $request): JsonResponse
    {
        // Try to get JSON data from file_get_contents as fallback
        $jsonInput = file_get_contents('php://input');
        if ($jsonInput) {
            $data = json_decode($jsonInput, true);
            if (json_last_error() === JSON_ERROR_NONE && $data) {
                $validated = validator($data, [
                    'user_2' => 'required|exists:users,id|different:' . auth()->id(),
                    'property_id' => 'nullable|exists:properties,id',
                    'initial_message' => 'required|string|max:1000'
                ])->validate();

                // Check if conversation already exists
                $existingConversation = Conversation::where(function ($query) use ($validated) {
                    $query->where('user_1', auth()->id())
                          ->where('user_2', $validated['user_2']);
                })->orWhere(function ($query) use ($validated) {
                    $query->where('user_1', $validated['user_2'])
                          ->where('user_2', auth()->id());
                })->first();

                if ($existingConversation) {
                    return response()->json([
                        'error' => 'Conversation already exists',
                        'conversation_id' => $existingConversation->id
                    ], 400);
                }

                $conversation = Conversation::create([
                    'user_1' => auth()->id(),
                    'user_2' => $validated['user_2'],
                    'property_id' => $validated['property_id'] ?? null
                ]);

                // Create initial message
                $message = $conversation->messages()->create([
                    'sender_id' => auth()->id(),
                    'content' => $validated['initial_message'],
                    'type' => 'text'
                ]);

                $conversation->update(['last_message_id' => $message->id]);

                return $this->jsonResponse($conversation->load('lastMessage'), 201);
            }
        }
        
        return response()->json(['message' => 'Invalid JSON data'], 400);
    }

    public function update(Request $request, Conversation $conversation): JsonResponse
    {
        $this->authorize('update', $conversation);

        $validated = $request->validate([
            'status' => 'sometimes|in:active,archived,blocked',
            'property_id' => 'sometimes|nullable|exists:properties,id'
        ]);

        $conversation->update($validated);

        return $this->jsonResponse($conversation);
    }

    public function destroy(Conversation $conversation): JsonResponse
    {
        $this->authorize('delete', $conversation);

        $conversation->messages()->delete();
        $conversation->delete();

        return $this->jsonResponse(['message' => 'Conversation deleted']);
    }

    public function markAsRead(Request $request, Conversation $conversation): JsonResponse
    {
        $this->authorize('view', $conversation);

        $conversation->messages()
            ->where('sender_id', '!=', auth()->id())
            ->where('read_at', null)
            ->update(['read_at' => now()]);

        return $this->jsonResponse(['message' => 'Messages marked as read']);
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $count = Conversation::where(function ($query) {
            $query->where('user_1', auth()->id())
                  ->orWhere('user_2', auth()->id());
        })->whereHas('messages', function ($query) {
            $query->where('sender_id', '!=', auth()->id())
                  ->where('read_at', null);
        })->count();

        return $this->jsonResponse(['unread_conversations' => $count]);
    }

    public function archive(Conversation $conversation): JsonResponse
    {
        $this->authorize('update', $conversation);

        $conversation->update(['status' => 'archived']);

        return $this->jsonResponse($conversation);
    }

    public function unarchive(Conversation $conversation): JsonResponse
    {
        $this->authorize('update', $conversation);

        $conversation->update(['status' => 'active']);

        return $this->jsonResponse($conversation);
    }
}
