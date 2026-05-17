<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PromoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'description' => $this->description,
            'type' => $this->type,
            'discount_value' => (float) $this->discount_value,
            'min_order_amount' => (float) $this->min_order_amount,
            'max_discount' => $this->max_discount ? (float) $this->max_discount : null,
            'usage_limit' => $this->usage_limit,
            'used_count' => $this->used_count,
            'remaining_uses' => $this->usage_limit ? $this->usage_limit - $this->used_count : null,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'is_active' => $this->is_active,
            'is_valid' => $this->isValid(),
            'discount_text' => $this->type === 'percentage' 
                ? $this->discount_value . '%' 
                : 'Rp ' . number_format($this->discount_value),
            'usages' => PromoUsageResource::collection($this->whenLoaded('usages')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
