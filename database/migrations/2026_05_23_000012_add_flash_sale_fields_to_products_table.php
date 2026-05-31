<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('is_flash_sale')->default(false)->after('is_featured');
            $table->decimal('flash_sale_price', 12, 2)->nullable()->after('original_price');
            $table->timestamp('flash_sale_ends_at')->nullable()->after('flash_sale_price');

            $table->index('is_flash_sale');
            $table->index('flash_sale_ends_at');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['is_flash_sale']);
            $table->dropIndex(['flash_sale_ends_at']);
            $table->dropColumn(['is_flash_sale', 'flash_sale_price', 'flash_sale_ends_at']);
        });
    }
};

