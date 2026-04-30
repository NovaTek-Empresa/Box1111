<?php

namespace App\Policies;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PaymentPolicy
{
    public function view(User $user, Payment $payment): bool
    {
        return $payment->payer_id === $user->id || 
               $payment->reservation->host_id === $user->hostProfile?->id;
    }

    public function create(User $user): bool
    {
        return true; // Any authenticated user can create payments
    }

    public function update(User $user, Payment $payment): bool
    {
        return $payment->payer_id === $user->id || 
               $payment->reservation->host_id === $user->hostProfile?->id;
    }

    public function refund(User $user, Payment $payment): bool
    {
        return $payment->reservation->host_id === $user->hostProfile?->id;
    }

    public function viewStatus(User $user, Payment $payment): bool
    {
        return $payment->payer_id === $user->id || 
               $payment->reservation->host_id === $user->hostProfile?->id;
    }
}
