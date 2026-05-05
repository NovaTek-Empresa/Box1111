<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Drop foreign key first if it exists
        Schema::table('calendar_availability', function (Blueprint $table) {
            $table->dropForeign(['property_id']);
        });

        // Rename the table
        Schema::rename('calendar_availability', 'calendar_availabilities');

        // Re-add foreign key with correct table name
        Schema::table('calendar_availabilities', function (Blueprint $table) {
            $table->foreign('property_id')
                ->references('id')
                ->on('properties')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        // Drop foreign key first
        Schema::table('calendar_availabilities', function (Blueprint $table) {
            $table->dropForeign(['property_id']);
        });

        // Rename back
        Schema::rename('calendar_availabilities', 'calendar_availability');

        // Re-add foreign key
        Schema::table('calendar_availability', function (Blueprint $table) {
            $table->foreign('property_id')
                ->references('id')
                ->on('properties')
                ->onDelete('cascade');
        });
    }
};
