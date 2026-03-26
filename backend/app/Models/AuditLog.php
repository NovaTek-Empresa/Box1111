<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class AuditLog extends Model
{
    protected $fillable = [
        'admin_id',
        'action',
        'auditable_type',
        'auditable_id',
        'changes',
        'ip_address',
        'user_agent'
    ];

    protected $casts = [
        'changes' => 'json'
    ];

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id')->nullable();
    }

    public function auditable(): MorphTo
    {
        return $this->morphTo();
    }
}
