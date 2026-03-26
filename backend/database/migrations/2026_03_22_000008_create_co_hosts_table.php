<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('co_hosts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained('properties')->onDelete('cascade');
            $table->foreignId('cohost_id')->constrained('host_profiles')->onDelete('cascade');
            $table->integer('revenue_split_percentage')->default(50)->comment('0-100');
            $table->enum('status', ['pending', 'active', 'inactive', 'removed'])->default('pending');
            $table->text('responsibilities')->nullable();
            $table->timestamp('joined_at')->nullable();
            $table->timestamp('removed_at')->nullable();
            $table->timestamps();
            $table->unique(['property_id', 'cohost_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('co_hosts');
    }
};
