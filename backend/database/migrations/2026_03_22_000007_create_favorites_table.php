<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('property_id')->nullable()->constrained('properties')->onDelete('cascade');
            $table->foreignId('host_id')->nullable()->constrained('host_profiles')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['user_id', 'property_id']); // Ensure one favorite per property per user
            $table->unique(['user_id', 'host_id']);    // Ensure one favorite per host per user
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};
