<?php

namespace App\Http\Controllers\Api;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = auth()->user()->notifications();

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('read')) {
            $query->where('read', $request->boolean('read'));
        }

        $notifications = $query->orderBy('created_at', 'desc')->paginate(20);

        return $this->paginatedResponse($notifications);
    }

    public function show(Notification $notification): JsonResponse
    {
        $this->authorize('view', $notification);

        return $this->jsonResponse($notification);
    }

    public function store(Request $request): JsonResponse
    {
        // Try to get JSON data from file_get_contents as fallback
        $jsonInput = file_get_contents('php://input');
        if ($jsonInput) {
            $data = json_decode($jsonInput, true);
            if (json_last_error() === JSON_ERROR_NONE && $data) {
                $validated = validator($data, [
                    'user_id' => 'required|exists:users,id',
                    'title' => 'required|string|max:255',
                    'message' => 'required|string|max:1000',
                    'type' => 'required|in:info,warning,success,error',
                    'action_url' => 'nullable|url',
                    'action_text' => 'nullable|string|max:50',
                    'expires_at' => 'nullable|date|after:now'
                ])->validate();

                $notification = Notification::create($validated);

                return $this->jsonResponse($notification, 201);
            }
        }
        
        return response()->json(['message' => 'Invalid JSON data'], 400);
    }

    public function markAsRead(Request $request, Notification $notification): JsonResponse
    {
        $this->authorize('update', $notification);

        $notification->update([
            'read' => true,
            'read_at' => now()
        ]);

        return $this->jsonResponse($notification);
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        auth()->user()->notifications()
            ->where('read', false)
            ->update([
                'read' => true,
                'read_at' => now()
            ]);

        return $this->jsonResponse(['message' => 'All notifications marked as read']);
    }

    public function destroy(Notification $notification): JsonResponse
    {
        $this->authorize('delete', $notification);

        $notification->delete();

        return $this->jsonResponse(['message' => 'Notification deleted']);
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $count = auth()->user()->notifications()
            ->where('read', false)
            ->count();

        return $this->jsonResponse(['unread_count' => $count]);
    }
}
