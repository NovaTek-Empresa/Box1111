<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BankAccount extends Model
{
    protected $fillable = [
        'host_id',
        'account_type',
        'bank_code',
        'bank_name',
        'account_number',
        'account_holder_name',
        'account_document',
        'status',
        'verified_at',
        'available_balance',
        'verification_response'
    ];

    protected $casts = [
        'verified_at' => 'datetime',
        'last_payout_at' => 'datetime',
        'verification_response' => 'json'
    ];

    public function host(): BelongsTo
    {
        return $this->belongsTo(HostProfile::class);
    }

    public function payouts(): HasMany
    {
        return $this->hasMany(Payout::class);
    }
}
