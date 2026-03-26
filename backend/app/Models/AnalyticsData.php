<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class AnalyticsData extends Model
{
    protected $fillable = [
        'metric_type',
        'entity_type',
        'entity_id',
        'dimensions',
        'metrics',
        'date'
    ];

    protected $casts = [
        'dimensions' => 'json',
        'metrics' => 'json',
        'date' => 'date'
    ];

    public function entity(): MorphTo
    {
        return $this->morphTo();
    }
}
