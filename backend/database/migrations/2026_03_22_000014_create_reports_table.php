<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('report_type', [
                'property_issue',
                'host_behavior',
                'guest_behavior',
                'unsafe_content',
                'payment_issue',
                'fraud',
                'other'
            ]);
            $table->morphs('reportable');
            $table->text('description');
            $table->json('evidence')->nullable();
            $table->enum('status', ['open', 'investigating', 'resolved', 'rejected'])->default('open');
            $table->text('admin_notes')->nullable();
            $table->foreignId('assigned_admin_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
            $table->index(['report_type', 'status']);
            $table->index('assigned_admin_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
