<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'game_id' => $this->game_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => (float) $this->price,
            'original_price' => $this->original_price ? (float) $this->original_price : null,
            'image_url' => $this->image_url,
            'package_type' => $this->package_type,
            'game_currency_amount' => $this->game_currency_amount,
            'bonus_amount' => $this->bonus_amount,
            'is_featured' => $this->is_featured,
            'is_active' => $this->is_active,
            'stock' => $this->stock,
            'in_stock' => $this->stock === -1 || $this->stock > 0,
            'discount_percentage' => $this->getDiscountPercentage(),
            'game' => new GameResource($this->whenLoaded('game')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
