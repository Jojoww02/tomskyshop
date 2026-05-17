<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'game_id' => 'required|exists:games,id',
            'product_id' => 'required|exists:products,id',
            'target_user_id' => 'required|string|max:100',
            'quantity' => 'nullable|integer|min:1|max:100',
            'payment_method' => 'nullable|string|exists:payment_methods,code',
            'promo_code' => 'nullable|string|exists:promos,code',
        ];
    }

    public function messages(): array
    {
        return [
            'game_id.required' => 'Please select a game',
            'product_id.required' => 'Please select a product',
            'target_user_id.required' => 'Please enter your Game ID',
        ];
    }
}
