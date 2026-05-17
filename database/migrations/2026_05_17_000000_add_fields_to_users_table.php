<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 20)->nullable()->after('password');
            $table->string('user_id', 100)->nullable()->after('phone');
            $table->string('role', 20)->default('user')->after('user_id');
            $table->decimal('balance', 15, 2)->default(0)->after('role');
            $table->boolean('is_active')->default(true)->after('balance');
            
            $table->index('phone');
            $table->index('role');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'user_id', 'role', 'balance', 'is_active']);
        });
    }
};
