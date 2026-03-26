<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HostProfile extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'creci',
        'bio',
        'doc_url',
        'selfie_url',
        'status',
        'total_earnings',
        'total_bookings',
        'total_reviews',
        'rating',
        'is_cohost',
        'verified_at'
    ];

    protected $casts = [
        'verified_at' => 'datetime',
        'is_cohost' => 'boolean',
        'rating' => 'float'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function properties(): HasMany
    {
        return $this->hasMany(Property::class, 'host_id');
    }

    public function coHostProperties(): HasMany
    {
        return $this->hasMany(CoHost::class, 'cohost_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'host_id');
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class, 'host_id');
    }

    public function bankAccounts(): HasMany
    {
        return $this->hasMany(BankAccount::class);
    }

    public function payouts(): HasMany
    {
        return $this->hasMany(Payout::class);
    }
}
