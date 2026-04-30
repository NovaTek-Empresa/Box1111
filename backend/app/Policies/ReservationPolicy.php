<?php

namespace App\Policies;

use App\Models\Reservation;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ReservationPolicy
{
    public function view(User $user, Reservation $reservation): bool
    {
        return $reservation->guest_id === $user->id || 
               $reservation->host_id === $user->hostProfile?->id;
    }

    public function create(User $user): bool
    {
        return true; // Any authenticated user can create reservations
    }

    public function update(User $user, Reservation $reservation): bool
    {
        return $reservation->guest_id === $user->id || 
               $reservation->host_id === $user->hostProfile?->id;
    }

    public function delete(User $user, Reservation $reservation): bool
    {
        return $reservation->guest_id === $user->id || 
               $reservation->host_id === $user->hostProfile?->id;
    }

    public function confirm(User $user, Reservation $reservation): bool
    {
        return $reservation->host_id === $user->hostProfile?->id;
    }

    public function cancel(User $user, Reservation $reservation): bool
    {
        return $reservation->guest_id === $user->id || 
               $reservation->host_id === $user->hostProfile?->id;
    }

    public function checkin(User $user, Reservation $reservation): bool
    {
        return $reservation->guest_id === $user->id || 
               $reservation->host_id === $user->hostProfile?->id;
    }

    public function checkout(User $user, Reservation $reservation): bool
    {
        return $reservation->guest_id === $user->id || 
               $reservation->host_id === $user->hostProfile?->id;
    }
}
