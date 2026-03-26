<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;
    protected $fillable = [
        'reservation_id',
        'payer_id',
        'total_amount',
        'host_amount',
        'cohost_amount',
        'platform_fee',
        'payment_method',
        'status',
        'gateway_transaction_id',
        'gateway_response',
        'processed_at',
        'refunded_at',
        'refund_reason'
    ];

    protected $casts = [
        'total_amount' => 'float',
        'host_amount' => 'float',
        'cohost_amount' => 'float',
        'platform_fee' => 'float',
        'gateway_response' => 'json',
        'processed_at' => 'datetime',
        'refunded_at' => 'datetime'
    ];

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    public function payer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'payer_id');
    }
}
