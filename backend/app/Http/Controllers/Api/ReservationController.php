<?php

namespace App\Http\Controllers\Api;

use App\Models\Reservation;
use App\Models\CalendarAvailability;
use Illuminate\Support\Facades\Schema;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class ReservationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = auth()->user();

        if ($request->has('as') && $request->as === 'host') {
            $reservations = Reservation::whereHas('property', function ($q) use ($user) {
                $q->where('host_id', $user->hostProfile->id ?? null);
            })->paginate();
        } else {
            $reservations = $user->guestReservations()->paginate();
        }

        return $this->paginatedResponse($reservations);
    }

    public function show(Reservation $reservation): JsonResponse
    {
        // TODO: Implement authorization policy
        // $this->authorize('view', $reservation);

        return $this->jsonResponse($reservation->load(['property', 'guest', 'host', 'payment', 'reviews']));
    }

    public function store(Request $request): JsonResponse
    {
        // Try to get JSON data from file_get_contents as fallback
        $jsonInput = file_get_contents('php://input');
        if ($jsonInput) {
            $data = json_decode($jsonInput, true);
            if (json_last_error() === JSON_ERROR_NONE && $data) {
                $validated = validator($data, [
                    'property_id' => 'required|exists:properties,id',
                    'check_in' => 'required|date',
                    'check_out' => 'required|date|after:check_in',
                    'guests_count' => 'required|integer|min:1',
                    'guest_notes' => 'string|nullable'
                ])->validate();

                $property = \App\Models\Property::find($validated['property_id']);

                // Check availability
                $conflicting = false;

                if (Schema::hasTable('calendar_availabilities')) {
                    $conflicting = CalendarAvailability::where('property_id', $property->id)
                        ->whereBetween('date_specific', [$validated['check_in'], now()->parse($validated['check_out'])->subDay()])
                        ->where('status', '!=', 'available')
                        ->exists();
                }

                if ($conflicting) {
                    return response()->json(['error' => 'Property not available for selected dates'], 400);
                }

                $nights = now()->parse($validated['check_in'])->diffInDays($validated['check_out']);
                $nightly_price = $property->nightly_price;
                $cleaning_fee = $property->cleaning_fee;
                $platform_fee = (($nightly_price * $nights) + $cleaning_fee) * 0.10;
                $total = ($nightly_price * $nights) + $cleaning_fee + $platform_fee;

                $reservation = auth()->user()->guestReservations()->create([
                    'property_id' => $property->id,
                    'host_id' => $property->host_id,
                    'check_in' => $validated['check_in'],
                    'check_out' => $validated['check_out'],
                    'guests_count' => $validated['guests_count'],
                    'nights' => $nights,
                    'nightly_price' => $nightly_price,
                    'cleaning_fee' => $cleaning_fee,
                    'platform_fee' => $platform_fee,
                    'total_price' => $total,
                    'status' => 'pending',
                    'guest_notes' => $validated['guest_notes'] ?? null
                ]);

                // Block calendar
                if (Schema::hasTable('calendar_availabilities')) {
                    for ($i = 0; $i < $nights; $i++) {
                        $date = now()->parse($validated['check_in'])->addDays($i);
                        CalendarAvailability::create([
                            'property_id' => $property->id,
                            'date_specific' => $date,
                            'status' => 'reserved',
                            'reservation_id' => $reservation->id
                        ]);
                    }
                }

                return $this->jsonResponse($reservation, 201);
            }
        }
        
        return response()->json(['message' => 'Invalid JSON data'], 400);
    }

    public function confirm(Reservation $reservation): JsonResponse
    {
        // TODO: Implement authorization policy
        // $this->authorize('confirm', $reservation);

        $reservation->update([
            'status' => 'confirmed',
            'confirmed_at' => now()
        ]);

        return $this->jsonResponse($reservation);
    }

    public function cancel(Request $request, Reservation $reservation): JsonResponse
    {
        $reservation->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $request->reason ?? null
        ]);

        // Unblock calendar
        if (Schema::hasTable('calendar_availabilities')) {
            CalendarAvailability::where('reservation_id', $reservation->id)->delete();
        }

        return $this->jsonResponse($reservation);
    }

    public function checkin(Reservation $reservation): JsonResponse
    {
        // TODO: Implement authorization policy
        // $this->authorize('update', $reservation);

        $reservation->update([
            'status' => 'checked_in',
            'checked_in_at' => now()
        ]);

        return $this->jsonResponse($reservation);
    }

    public function checkout(Reservation $reservation): JsonResponse
    {
        // TODO: Implement authorization policy
        // $this->authorize('update', $reservation);

        $reservation->update([
            'status' => 'completed',
            'completed_at' => now()
        ]);

        return response()->json($reservation);
    }
}
