<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'game_id',
        'name',
        'slug',
        'description',
        'price',
        'original_price',
        'flash_sale_price',
        'image_url',
        'package_type',
        'game_currency_amount',
        'bonus_amount',
        'is_featured',
        'is_flash_sale',
        'flash_sale_ends_at',
        'is_active',
        'stock',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'flash_sale_price' => 'decimal:2',
        'is_featured' => 'boolean',
        'is_flash_sale' => 'boolean',
        'flash_sale_ends_at' => 'datetime',
        'is_active' => 'boolean',
        'stock' => 'integer',
    ];

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function getDiscountPercentage(): ?int
    {
        if ($this->original_price && $this->original_price > $this->price) {
            return round((($this->original_price - $this->price) / $this->original_price) * 100);
        }
        return null;
    }

    public function isFlashSaleActive(): bool
    {
        if (!$this->is_flash_sale || !$this->flash_sale_price) {
            return false;
        }

        if (!$this->flash_sale_ends_at) {
            return true;
        }

        return $this->flash_sale_ends_at->isFuture();
    }

    public function getEffectivePrice(): float
    {
        if ($this->isFlashSaleActive()) {
            return (float) $this->flash_sale_price;
        }

        return (float) $this->price;
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
