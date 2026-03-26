<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CalendarAvailability extends Model
{
    protected $fillable = [
        'property_id',
        'date_specific',
        'status',
        'reservation_id',
        'note'
    ];

    protected $casts = [
        'date_specific' => 'date'
    ];

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class)->nullable();
    }
}
