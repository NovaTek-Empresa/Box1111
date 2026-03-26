<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('analytics_data', function (Blueprint $table) {
            $table->id();
            $table->enum('metric_type', [
                'property_views',
                'property_bookings',
                'host_earnings',
                'guest_spending',
                'search_query',
                'page_view',
                'conversion_rate',
                'user_retention',
                'host_performance'
            ]);
            $table->nullableMorphs('entity');
            $table->json('dimensions')->nullable();
            $table->json('metrics')->nullable();
            $table->date('date');
            $table->timestamps();
            $table->unique(['metric_type', 'entity_type', 'entity_id', 'date']);
            $table->index(['metric_type', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytics_data');
    }
};
