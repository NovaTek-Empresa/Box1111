<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('calendar_availability', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained('properties')->onDelete('cascade');
            $table->date('date_specific');
            $table->enum('status', ['available', 'booked', 'blocked', 'reserved'])->default('available');
            $table->unsignedBigInteger('reservation_id')->nullable()->comment('Will add FK after reservations table exists');
            $table->text('note')->nullable();
            $table->timestamps();
            $table->unique(['property_id', 'date_specific']);
            $table->index(['property_id', 'date_specific']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('calendar_availability');
    }
};
