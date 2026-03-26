<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('host_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->string('creci')->nullable()->comment('CRECI registration');
            $table->text('bio')->nullable();
            $table->string('document_url')->nullable()->comment('Verified document');
            $table->string('selfie_url')->nullable()->comment('Identity verification selfie');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->integer('total_properties')->default(0);
            $table->integer('total_reservations')->default(0);
            $table->decimal('average_rating', 3, 2)->default(0);
            $table->boolean('is_cohost')->default(false);
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('host_profiles');
    }
};
