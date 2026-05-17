<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentMethodResource;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PaymentMethodController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = PaymentMethod::active();

        if ($request->has('type')) {
            $query->ofType($request->type);
        }

        $paymentMethods = $query->orderBy('sort_order')->get();

        return PaymentMethodResource::collection($paymentMethods);
    }

    public function show(string $code): PaymentMethodResource
    {
        $paymentMethod = PaymentMethod::where('code', $code)->firstOrFail();

        return new PaymentMethodResource($paymentMethod);
    }

    public function types(): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'data' => [
                [
                    'code' => 'bank',
                    'name' => 'Bank Transfer',
                    'icon' => 'building-columns',
                ],
                [
                    'code' => 'ewallet',
                    'name' => 'E-Wallet',
                    'icon' => 'wallet',
                ],
                [
                    'code' => 'pulsa',
                    'name' => 'Pulsa',
                    'icon' => 'phone',
                ],
            ],
        ]);
    }
}
