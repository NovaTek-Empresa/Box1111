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

        // "read" filter: true = already read (read_at IS NOT NULL), false = unread
        if ($request->has('read')) {
            if ($request->boolean('read')) {
                $query->whereNotNull('read_at');
            } else {
                $query->whereNull('read_at');
            }
        }

        $notifications = $query->orderBy('created_at', 'desc')->paginate(20);

        return $this->paginatedResponse($notifications);
    }

    public function show(Notification $notification): JsonResponse
    {
        if ($notification->user_id !== auth()->id()) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        return $this->jsonResponse($notification);
    }

    public function store(Request $request): JsonResponse
    {
        $jsonInput = file_get_contents('php://input');
        if ($jsonInput) {
            $decoded = json_decode($jsonInput, true);
            if (json_last_error() === JSON_ERROR_NONE && $decoded) {
                $validated = validator($decoded, [
                    'user_id'    => 'required|exists:users,id',
                    'type'       => 'required|in:reservation_request,reservation_confirmed,reservation_rejected,reservation_canceled,payment_received,payment_failed,review_posted,message_received,host_verified,cohost_invited,cohost_accepted,property_reported,system_alert',
                    'title'      => 'nullable|string|max:255',
                    'message'    => 'nullable|string|max:1000',
                    'icon'       => 'nullable|string|max:100',
                    'action_url' => 'nullable|string|max:500',
                ])->validate();

                $notification = Notification::create([
                    'user_id' => $validated['user_id'],
                    'type'    => $validated['type'],
                    'data'    => [
                        'title'      => $validated['title'] ?? null,
                        'message'    => $validated['message'] ?? null,
                        'icon'       => $validated['icon'] ?? null,
                        'action_url' => $validated['action_url'] ?? null,
                    ],
                ]);

                return $this->jsonResponse($notification, 201);
            }
        }

        return response()->json(['message' => 'Invalid JSON data'], 400);
    }

    public function markAsRead(Request $request, Notification $notification): JsonResponse
    {
        if ($notification->user_id !== auth()->id()) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        $notification->update(['read_at' => now()]);

        return $this->jsonResponse($notification);
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        auth()->user()->notifications()
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return $this->jsonResponse(['message' => 'Todas as notificações marcadas como lidas']);
    }

    public function destroy(Notification $notification): JsonResponse
    {
        if ($notification->user_id !== auth()->id()) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        $notification->delete();

        return $this->jsonResponse(['message' => 'Notificação removida']);
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $count = auth()->user()->notifications()
            ->whereNull('read_at')
            ->count();

        return $this->jsonResponse(['unread_count' => $count]);
    }
}
