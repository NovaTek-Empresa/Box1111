<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('action', [
                'user_created',
                'user_updated',
                'user_deleted',
                'user_suspended',
                'user_restored',
                'property_approved',
                'property_rejected',
                'property_removed',
                'host_verified',
                'host_rejected',
                'payment_refunded',
                'report_resolved',
                'document_verified',
                'ban_issued',
                'system_config_changed'
            ]);
            $table->morphs('auditable');
            $table->json('changes')->nullable();
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();
            $table->index(['admin_id', 'created_at']);
            $table->index('action');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
