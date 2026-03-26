<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->text('description');
            $table->enum('type', ['percentage', 'fixed_amount', 'free_cleaning', 'free_first_night']);
            $table->decimal('value', 14, 2);
            $table->decimal('max_discount', 14, 2)->nullable();
            $table->integer('usage_limit')->nullable();
            $table->integer('usage_count')->default(0);
            $table->integer('usage_limit_per_user')->default(1);
            $table->decimal('minimum_booking_value', 14, 2)->nullable();
            $table->boolean('active')->default(true);
            $table->timestamp('starts_at');
            $table->timestamp('expires_at');
            $table->json('applicable_properties')->nullable();
            $table->json('applicable_users')->nullable();
            $table->timestamps();
            $table->index(['code', 'active']);
            $table->index('expires_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
