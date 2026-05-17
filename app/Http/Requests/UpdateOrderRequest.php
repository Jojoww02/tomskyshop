<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'status' => 'sometimes|in:pending,processing,completed,failed,cancelled',
            'payment_status' => 'sometimes|in:unpaid,paid,failed',
            'payment_method' => 'nullable|string',
            'admin_notes' => 'nullable|string',
        ];
    }
}
