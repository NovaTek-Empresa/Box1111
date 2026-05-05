<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->integer('views')->default(0)->after('average_rating');
            $table->integer('requests')->default(0)->after('views');
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            if (Schema::hasColumn('properties', 'views')) {
                $table->dropColumn('views');
            }
            if (Schema::hasColumn('properties', 'requests')) {
                $table->dropColumn('requests');
            }
        });
    }
};
