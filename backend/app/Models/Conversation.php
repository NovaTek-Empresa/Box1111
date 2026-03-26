<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conversation extends Model
{
    protected $fillable = [
        'user_1',
        'user_2',
        'reservation_id',
        'subject',
        'status',
        'archived_at'
    ];

    protected $casts = [
        'archived_at' => 'datetime'
    ];

    public function user1(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_1');
    }

    public function user2(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_2');
    }

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class)->nullable();
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }
}
