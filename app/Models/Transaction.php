<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'type',
        'amount',
        'balance_before',
        'balance_after',
        'reference_type',
        'reference_id',
        'description',
        'created_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'balance_before' => 'decimal:2',
        'balance_after' => 'decimal:2',
        'created_at' => 'datetime',
    ];

    const TYPE_TOPUP = 'topup';
    const TYPE_WITHDRAWAL = 'withdrawal';
    const TYPE_PURCHASE = 'purchase';
    const TYPE_REFUND = 'refund';
    const TYPE_BONUS = 'bonus';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
