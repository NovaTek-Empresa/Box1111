<?php

namespace App\Http\Controllers\Api;

use App\Models\Message;
use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'conversation_id' => 'required|exists:conversations,id'
        ]);

        $conversation = Conversation::findOrFail($validated['conversation_id']);
        $this->authorize('view', $conversation);

        $messages = $conversation->messages()
            ->with('sender')
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return $this->paginatedResponse($messages);
    }

    public function show(Message $message): JsonResponse
    {
        $this->authorize('view', $message);

        return $this->jsonResponse($message->load(['sender', 'conversation']));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'conversation_id' => 'required|exists:conversations,id',
            'content' => 'required_without:file|string|max:1000',
            'type' => 'sometimes|in:text,image,file,location',
            'file' => 'nullable|file|max:10240', // 10MB max
            'location_data' => 'nullable|array'
        ]);

        $conversation = Conversation::findOrFail($validated['conversation_id']);
        $this->authorize('participate', $conversation);

        $messageData = [
            'sender_id' => auth()->id(),
            'type' => $validated['type'] ?? 'text',
            'content' => $validated['content'] ?? null
        ];

        // Handle file upload
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('messages/' . $conversation->id, 'private');
            
            $messageData['file_path'] = $path;
            $messageData['file_name'] = $file->getClientOriginalName();
            $messageData['file_size'] = $file->getSize();
            $messageData['file_mime_type'] = $file->getMimeType();
            $messageData['type'] = $this->getMessageTypeFromFile($file);
        }

        // Handle location data
        if (isset($validated['location_data'])) {
            $messageData['content'] = json_encode($validated['location_data']);
            $messageData['type'] = 'location';
        }

        $message = $conversation->messages()->create($messageData);

        // Update conversation
        $conversation->update([
            'last_message_id' => $message->id,
            'updated_at' => now()
        ]);

        // Mark as read for sender
        $message->update(['read_at' => now()]);

        return $this->jsonResponse($message->load('sender'), 201);
    }

    public function update(Request $request, Message $message): JsonResponse
    {
        $this->authorize('update', $message);

        // Only allow editing text messages within 15 minutes
        if ($message->type !== 'text' || $message->created_at->diffInMinutes(now()) > 15) {
            return response()->json([
                'error' => 'Message can no longer be edited'
            ], 400);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:1000'
        ]);

        $message->update([
            'content' => $validated['content'],
            'edited' => true,
            'edited_at' => now()
        ]);

        return $this->jsonResponse($message);
    }

    public function destroy(Message $message): JsonResponse
    {
        $this->authorize('delete', $message);

        // Only allow deleting within 1 hour
        if ($message->created_at->diffInHours(now()) > 1) {
            return response()->json([
                'error' => 'Message can no longer be deleted'
            ], 400);
        }

        // Delete file if exists
        if ($message->file_path) {
            Storage::delete($message->file_path);
        }

        $message->delete();

        return $this->jsonResponse(['message' => 'Message deleted']);
    }

    public function markAsRead(Message $message): JsonResponse
    {
        $this->authorize('view', $message);

        if ($message->sender_id !== auth()->id()) {
            $message->update(['read_at' => now()]);
        }

        return $this->jsonResponse($message);
    }

    public function downloadFile(Message $message): JsonResponse
    {
        $this->authorize('view', $message);

        if (!$message->file_path) {
            return response()->json(['error' => 'No file attached'], 404);
        }

        if (!Storage::exists($message->file_path)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        $file = Storage::get($message->file_path);
        
        return response($file, 200, [
            'Content-Type' => $message->file_mime_type,
            'Content-Disposition' => 'attachment; filename="' . $message->file_name . '"'
        ]);
    }

    public function typing(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'conversation_id' => 'required|exists:conversations,id',
            'is_typing' => 'required|boolean'
        ]);

        $conversation = Conversation::findOrFail($validated['conversation_id']);
        $this->authorize('participate', $conversation);

        // In a real implementation, this would use WebSocket or Pusher
        // For now, we'll just store it in cache for a short time
        $key = "typing:{$conversation->id}:" . auth()->id();
        
        if ($validated['is_typing']) {
            cache()->put($key, true, 10); // 10 seconds
        } else {
            cache()->forget($key);
        }

        return $this->jsonResponse(['status' => 'updated']);
    }

    private function getMessageTypeFromFile($file): string
    {
        $mimeType = $file->getMimeType();
        
        if (str_starts_with($mimeType, 'image/')) {
            return 'image';
        } elseif (str_starts_with($mimeType, 'video/')) {
            return 'video';
        } elseif (str_starts_with($mimeType, 'audio/')) {
            return 'audio';
        } elseif (in_array($mimeType, ['application/pdf'])) {
            return 'document';
        }
        
        return 'file';
    }
}
