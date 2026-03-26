<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained('reservations')->onDelete('cascade');
            $table->foreignId('reviewer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('property_id')->constrained('properties')->onDelete('cascade');
            $table->foreignId('host_id')->constrained('host_profiles')->onDelete('cascade');
            $table->enum('review_type', ['guest_to_property', 'guest_to_host', 'host_to_guest'])->default('guest_to_property');
            $table->integer('rating')->comment('1-5 stars');
            $table->text('comment')->nullable();
            $table->json('categories')->nullable()->comment('JSON: cleanliness, communication, etc');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->unique(['reservation_id', 'reviewer_id', 'review_type']);
            $table->index('property_id');
            $table->index('host_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
