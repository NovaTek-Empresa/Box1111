<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('type', [
                'reservation_request',
                'reservation_confirmed',
                'reservation_rejected',
                'reservation_canceled',
                'payment_received',
                'payment_failed',
                'review_posted',
                'message_received',
                'host_verified',
                'cohost_invited',
                'cohost_accepted',
                'property_reported',
                'system_alert'
            ]);
            $table->morphs('notifiable');
            $table->json('data')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'read_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
