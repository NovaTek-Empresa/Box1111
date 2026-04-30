<?php

namespace App\Policies;

use App\Models\Property;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PropertyPolicy
{
    public function view(User $user, Property $property): bool
    {
        return true; // Properties are public
    }

    public function create(User $user): bool
    {
        return $user->hostProfile !== null;
    }

    public function update(User $user, Property $property): bool
    {
        return $property->host_id === $user->hostProfile?->id;
    }

    public function delete(User $user, Property $property): bool
    {
        return $property->host_id === $user->hostProfile?->id;
    }

    public function manageReservations(User $user, Property $property): bool
    {
        return $property->host_id === $user->hostProfile?->id;
    }

    public function viewAnalytics(User $user, Property $property): bool
    {
        return $property->host_id === $user->hostProfile?->id;
    }
}
