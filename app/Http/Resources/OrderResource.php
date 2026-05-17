<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'user_id' => $this->user_id,
            'game_id' => $this->game_id,
            'product_id' => $this->product_id,
            'target_user_id' => $this->target_user_id,
            'quantity' => $this->quantity,
            'total_amount' => (float) $this->total_amount,
            'discount_amount' => (float) $this->discount_amount,
            'final_amount' => (float) $this->final_amount,
            'status' => $this->status,
            'payment_status' => $this->payment_status,
            'payment_method' => $this->payment_method,
            'payment_proof_url' => $this->payment_proof_url,
            'paid_at' => $this->paid_at,
            'admin_notes' => $this->admin_notes,
            'game' => new GameResource($this->whenLoaded('game')),
            'product' => new ProductResource($this->whenLoaded('product')),
            'user' => new UserResource($this->whenLoaded('user')),
            'payment' => new PaymentResource($this->whenLoaded('payment')),
            'promo_usage' => $this->whenLoaded('promoUsage'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
