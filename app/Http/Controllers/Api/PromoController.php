<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ApplyPromoRequest;
use App\Http\Resources\PromoResource;
use App\Models\Promo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PromoController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Promo::valid();

        if ($request->has('search')) {
            $query->where('code', 'like', '%' . $request->search . '%')
                ->orWhere('name', 'like', '%' . $request->search . '%');
        }

        $promos = $query->orderBy('created_at', 'desc')->paginate(15);

        return PromoResource::collection($promos);
    }

    public function show(string $code): PromoResource
    {
        $promo = Promo::where('code', $code)->firstOrFail();

        return new PromoResource($promo);
    }

    public function apply(ApplyPromoRequest $request): JsonResponse
    {
        $promo = Promo::where('code', $request->code)->valid()->first();

        if (!$promo) {
            return response()->json([
                'message' => 'Invalid or expired promo code',
            ], 400);
        }

        $orderAmount = $request->order_amount;

        if ($orderAmount < $promo->min_order_amount) {
            return response()->json([
                'message' => 'Minimum order amount is Rp ' . number_format($promo->min_order_amount),
            ], 400);
        }

        $discount = $promo->calculateDiscount($orderAmount);

        return response()->json([
            'message' => 'Promo applied successfully',
            'data' => [
                'code' => $promo->code,
                'name' => $promo->name,
                'discount' => $discount,
                'final_amount' => $orderAmount - $discount,
            ],
        ]);
    }
}
