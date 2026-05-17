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
            $table->foreignId('order_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('payment_method', 50);
            $table->string('payment_number', 100)->nullable();
            $table->decimal('amount', 15, 2);
            $table->string('status', 30)->default('pending');
            $table->string('payment_proof_url', 500)->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->string('payment_reference', 255)->nullable();
            $table->jsonb('metadata')->nullable();
            $table->timestamps();
            
            $table->index('order_id');
            $table->index('status');
            $table->index('payment_reference');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
