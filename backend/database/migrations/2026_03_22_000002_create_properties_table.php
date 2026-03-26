<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('host_id')->constrained('host_profiles')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('property_type')->comment('casa, apartamento, sobrado, etc');
            $table->string('street_address')->nullable();
            $table->string('neighborhood')->nullable();
            $table->string('city');
            $table->string('state', 2);
            $table->string('postal_code', 10)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->integer('bedrooms')->default(1);
            $table->integer('bathrooms')->default(1);
            $table->integer('guests_capacity')->default(2);
            $table->decimal('cleaning_fee', 10, 2)->default(0);
            $table->decimal('nightly_price', 10, 2);
            $table->text('amenities')->nullable()->comment('JSON array');
            $table->text('rules')->nullable();
            $table->text('cancellation_policy')->nullable();
            $table->enum('status', ['active', 'inactive', 'pending', 'blocked'])->default('active');
            $table->string('image_url')->nullable()->comment('Featured image');
            $table->integer('total_reviews')->default(0);
            $table->decimal('average_rating', 3, 2)->default(0);
            $table->timestamp('listed_at')->nullable();
            $table->timestamps();
            $table->index(['city', 'state']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
