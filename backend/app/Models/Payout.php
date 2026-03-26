<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payout extends Model
{
    protected $fillable = [
        'host_id',
        'bank_account_id',
        'status',
        'amount',
        'fees',
        'net_amount',
        'gateway_transaction_id',
        'gateway_response',
        'failure_reason',
        'processed_at'
    ];

    protected $casts = [
        'gateway_response' => 'json',
        'processed_at' => 'datetime'
    ];

    public function host(): BelongsTo
    {
        return $this->belongsTo(HostProfile::class);
    }

    public function bankAccount(): BelongsTo
    {
        return $this->belongsTo(BankAccount::class);
    }
}
