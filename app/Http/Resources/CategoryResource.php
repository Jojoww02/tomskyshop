<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'icon' => $this->icon,
            'is_active' => $this->is_active,
            'games_count' => $this->when($this->relationLoaded('games'), fn() => $this->games->count()),
            'games' => GameResource::collection($this->whenLoaded('games')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
