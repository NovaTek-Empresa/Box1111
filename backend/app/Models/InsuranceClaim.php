<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InsuranceClaim extends Model
{
    protected $fillable = [
        'reservation_id',
        'claimant_id',
        'claim_type',
        'description',
        'evidence',
        'claim_amount',
        'status',
        'resolution_notes',
        'approved_amount',
        'approved_at',
        'paid_at'
    ];

    protected $casts = [
        'evidence' => 'json',
        'approved_at' => 'datetime',
        'paid_at' => 'datetime'
    ];

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    public function claimant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'claimant_id');
    }
}
