<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Property extends Model
{
    use HasFactory;
    protected $fillable = [
        'host_id',
        'title',
        'description',
        'property_type',
        'street_address',
        'neighborhood',
        'city',
        'state',
        'postal_code',
        'latitude',
        'longitude',
        'bedrooms',
        'bathrooms',
        'guests_capacity',
        'cleaning_fee',
        'nightly_price',
        'amenities',
        'rules',
        'cancellation_policy',
        'status',
        'image_url',
        'total_reviews',
        'average_rating',
        'listed_at'
    ];

    protected $casts = [
        'amenities' => 'json',
        'rules' => 'json',
        'listed_at' => 'datetime',
        'average_rating' => 'float'
    ];

    public function host(): BelongsTo
    {
        return $this->belongsTo(HostProfile::class, 'host_id');
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    public function availability(): HasMany
    {
        return $this->hasMany(CalendarAvailability::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function coHosts(): HasMany
    {
        return $this->hasMany(CoHost::class);
    }
}
