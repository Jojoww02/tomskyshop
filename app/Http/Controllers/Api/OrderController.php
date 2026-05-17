<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Promo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Order::with(['game', 'product', 'user']);

        if ($request->user()) {
            $query->where('user_id', $request->user()->id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(15);

        return OrderResource::collection($orders);
    }

    public function store(StoreOrderRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $product = Product::findOrFail($validated['product_id']);
        $game = Game::findOrFail($validated['game_id']);

        $totalAmount = $product->price * ($validated['quantity'] ?? 1);
        $discountAmount = 0;
        $promoId = null;

        if (!empty($validated['promo_code'])) {
            $promo = Promo::where('code', $validated['promo_code'])->valid()->first();
            
            if ($promo) {
                $discountAmount = $promo->calculateDiscount($totalAmount);
                $promoId = $promo->id;
            }
        }

        $finalAmount = $totalAmount - $discountAmount;

        DB::beginTransaction();
        try {
            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'user_id' => $request->user()?->id,
                'game_id' => $game->id,
                'product_id' => $product->id,
                'target_user_id' => $validated['target_user_id'],
                'quantity' => $validated['quantity'] ?? 1,
                'total_amount' => $totalAmount,
                'discount_amount' => $discountAmount,
                'final_amount' => $finalAmount,
                'status' => Order::STATUS_PENDING,
                'payment_status' => Order::PAYMENT_STATUS_UNPAID,
                'payment_method' => $validated['payment_method'] ?? null,
            ]);

            if ($promoId) {
                PromoUsage::create([
                    'user_id' => $request->user()?->id,
                    'promo_id' => $promoId,
                    'order_id' => $order->id,
                    'discount_amount' => $discountAmount,
                    'used_at' => now(),
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Order created successfully',
                'data' => new OrderResource($order->load(['game', 'product'])),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Request $request, string $orderNumber): OrderResource
    {
        $order = Order::where('order_number', $orderNumber)->firstOrFail();

        if ($request->user() && $order->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            abort(403, 'Unauthorized');
        }

        return new OrderResource($order->load(['game', 'product', 'user', 'payment']));
    }

    public function update(UpdateOrderRequest $request, Order $order): JsonResponse
    {
        $order->update($request->validated());

        return response()->json([
            'message' => 'Order updated successfully',
            'data' => new OrderResource($order),
        ]);
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:pending,processing,completed,failed,cancelled',
            'admin_notes' => 'nullable|string',
        ]);

        $order->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
        ]);

        if ($request->status === Order::STATUS_COMPLETED) {
            $order->update([
                'payment_status' => Order::PAYMENT_STATUS_PAID,
                'paid_at' => now(),
            ]);
        }

        return response()->json([
            'message' => 'Order status updated successfully',
            'data' => new OrderResource($order),
        ]);
    }

    public function destroy(Order $order): JsonResponse
    {
        if ($order->status !== Order::STATUS_PENDING) {
            return response()->json([
                'message' => 'Cannot delete order with status: ' . $order->status,
            ], 400);
        }

        $order->delete();

        return response()->json([
            'message' => 'Order deleted successfully',
        ]);
    }
}
