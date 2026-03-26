<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CoHost extends Model
{
    use HasFactory;
    protected $fillable = [
        'property_id',
        'cohost_id',
        'revenue_split_percentage',
        'status',
        'responsibilities',
        'joined_at',
        'removed_at'
    ];

    protected $casts = [
        'joined_at' => 'datetime',
        'removed_at' => 'datetime'
    ];

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function cohost(): BelongsTo
    {
        return $this->belongsTo(HostProfile::class, 'cohost_id');
    }
}
