<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PromoUsageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'promo_id' => $this->promo_id,
            'order_id' => $this->order_id,
            'discount_amount' => (float) $this->discount_amount,
            'used_at' => $this->used_at,
            'user' => new UserResource($this->whenLoaded('user')),
            'promo' => new PromoResource($this->whenLoaded('promo')),
            'order' => new OrderResource($this->whenLoaded('order')),
        ];
    }
}
