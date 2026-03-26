<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('insurance_claims', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained('reservations')->onDelete('cascade');
            $table->foreignId('claimant_id')->constrained('users')->onDelete('cascade');
            $table->enum('claim_type', [
                'property_damage',
                'cleanliness_issue',
                'missing_items',
                'safety_concern',
                'guest_damage',
                'other'
            ]);
            $table->text('description');
            $table->json('evidence')->nullable();
            $table->decimal('claim_amount', 14, 2);
            $table->enum('status', ['filed', 'under_review', 'approved', 'rejected', 'paid'])->default('filed');
            $table->text('resolution_notes')->nullable();
            $table->decimal('approved_amount', 14, 2)->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
            $table->index(['reservation_id', 'status']);
            $table->index('claimant_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('insurance_claims');
    }
};
