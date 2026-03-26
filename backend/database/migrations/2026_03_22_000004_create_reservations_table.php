<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained('properties')->onDelete('cascade');
            $table->foreignId('guest_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('host_id')->constrained('host_profiles')->onDelete('cascade');
            $table->date('check_in');
            $table->date('check_out');
            $table->integer('guests_count');
            $table->integer('nights');
            $table->decimal('nightly_price', 10, 2);
            $table->decimal('cleaning_fee', 10, 2)->default(0);
            $table->decimal('platform_fee', 10, 2)->default(0);
            $table->decimal('total_price', 12, 2);
            $table->enum('status', ['pending', 'confirmed', 'checked_in', 'completed', 'cancelled', 'rejected'])->default('pending');
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('checked_in_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->longText('cancellation_reason')->nullable();
            $table->text('guest_notes')->nullable();
            $table->text('host_notes')->nullable();
            $table->unsignedBigInteger('payment_id')->nullable();
            $table->timestamps();
            $table->index(['property_id', 'check_in', 'check_out']);
            $table->index('status');
            $table->index('guest_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
