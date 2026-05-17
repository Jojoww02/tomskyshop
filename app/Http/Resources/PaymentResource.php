<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'payment_method' => $this->payment_method,
            'payment_number' => $this->payment_number,
            'amount' => (float) $this->amount,
            'status' => $this->status,
            'payment_proof_url' => $this->payment_proof_url,
            'paid_at' => $this->paid_at,
            'payment_reference' => $this->payment_reference,
            'metadata' => $this->metadata,
            'order' => new OrderResource($this->whenLoaded('order')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
