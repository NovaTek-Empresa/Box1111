<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bank_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('host_id')->constrained('host_profiles')->onDelete('cascade');
            $table->enum('account_type', ['checking', 'savings']);
            $table->string('bank_code')->nullable();
            $table->string('bank_name');
            $table->string('account_number');
            $table->string('account_holder_name');
            $table->string('account_document')->nullable();
            $table->enum('status', ['pending', 'verified', 'failed'])->default('pending');
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('last_payout_at')->nullable();
            $table->decimal('available_balance', 14, 2)->default(0);
            $table->json('verification_response')->nullable();
            $table->timestamps();
            $table->unique(['host_id', 'account_number']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bank_accounts');
    }
};
