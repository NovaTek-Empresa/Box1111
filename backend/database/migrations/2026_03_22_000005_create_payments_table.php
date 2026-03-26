<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('reservation_id')->nullable();
            $table->foreignId('payer_id')->constrained('users')->onDelete('cascade');
            $table->decimal('total_amount', 12, 2);
            $table->decimal('host_amount', 12, 2);
            $table->decimal('cohost_amount', 12, 2)->default(0)->nullable();
            $table->decimal('platform_fee', 12, 2)->default(0);
            $table->enum('payment_method', ['credit_card', 'debit_card', 'pix', 'bank_transfer'])->default('credit_card');
            $table->enum('status', ['pending', 'processing', 'completed', 'failed', 'refunded'])->default('pending');
            $table->string('gateway_transaction_id')->nullable()->comment('Stripe, PayPal, etc');
            $table->text('gateway_response')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('refunded_at')->nullable();
            $table->text('refund_reason')->nullable();
            $table->timestamps();
            $table->index('status');
            $table->index('payer_id');
            $table->index('reservation_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
