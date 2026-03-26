<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Promotion extends Model
{
    protected $fillable = [
        'code',
        'description',
        'type',
        'value',
        'max_discount',
        'usage_limit',
        'usage_count',
        'usage_limit_per_user',
        'minimum_booking_value',
        'active',
        'starts_at',
        'expires_at',
        'applicable_properties',
        'applicable_users'
    ];

    protected $casts = [
        'active' => 'boolean',
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
        'applicable_properties' => 'json',
        'applicable_users' => 'json'
    ];

    public function usages(): HasMany
    {
        return $this->hasMany(PromotionUsage::class);
    }
}
