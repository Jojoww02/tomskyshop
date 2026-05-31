<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('issued_for_order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('redeemed_order_id')->nullable()->constrained('orders')->nullOnDelete();
            $table->string('code', 50)->unique();
            $table->unsignedTinyInteger('discount_percent');
            $table->boolean('is_redeemed')->default(false);
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->unique(['issued_for_order_id']);
            $table->index(['user_id', 'is_redeemed']);
            $table->index('expires_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};

