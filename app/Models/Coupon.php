<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'issued_for_order_id',
        'redeemed_order_id',
        'code',
        'discount_percent',
        'is_redeemed',
        'expires_at',
    ];

    protected $casts = [
        'discount_percent' => 'integer',
        'is_redeemed' => 'boolean',
        'expires_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function issuedForOrder(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'issued_for_order_id');
    }

    public function redeemedOrder(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'redeemed_order_id');
    }

    public function isExpired(): bool
    {
        if (!$this->expires_at) {
            return false;
        }

        return $this->expires_at->isPast();
    }
}

