<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\Game;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Models\Promo;
use App\Models\PromoUsage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function checkout(Request $request): Response
    {
        $data = $request->validate([
            'product_id' => ['required', 'integer'],
            'target_user_id' => ['required', 'string', 'max:100'],
            'quantity' => ['nullable', 'integer', 'min:1', 'max:10'],
        ]);

        $product = Product::query()
            ->with(['game'])
            ->whereKey($data['product_id'])
            ->where('is_active', true)
            ->firstOrFail();

        $quantity = (int) ($data['quantity'] ?? 1);
        $unitPrice = $product->getEffectivePrice();
        $totalAmount = $unitPrice * $quantity;

        $paymentMethods = PaymentMethod::query()
            ->active()
            ->orderBy('sort_order')
            ->get()
            ->map(fn (PaymentMethod $method) => [
                'id' => $method->id,
                'name' => $method->name,
                'code' => $method->code,
                'type' => $method->type,
                'account_number' => $method->account_number,
                'account_name' => $method->account_name,
                'min_amount' => (float) $method->min_amount,
                'max_amount' => $method->max_amount ? (float) $method->max_amount : null,
            ])
            ->values();

        $availableCoupons = collect();
        if (Schema::hasTable('coupons')) {
            $availableCoupons = Coupon::query()
                ->where('user_id', $request->user()->id)
                ->where('is_redeemed', false)
                ->where(function ($q) {
                    $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
                })
                ->orderByDesc('discount_percent')
                ->limit(20)
                ->get()
                ->map(fn (Coupon $coupon) => [
                    'code' => $coupon->code,
                    'discount_percent' => $coupon->discount_percent,
                    'expires_at' => $coupon->expires_at,
                ])
                ->values();
        }

        return Inertia::render('checkout/index', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'price' => (float) $unitPrice,
                'base_price' => (float) $product->price,
                'original_price' => $product->original_price ? (float) $product->original_price : null,
                'is_flash_sale_active' => $product->isFlashSaleActive(),
                'package_type' => $product->package_type,
                'game_currency_amount' => $product->game_currency_amount,
                'bonus_amount' => $product->bonus_amount,
                'stock' => $product->stock,
                'in_stock' => $product->stock === -1 || $product->stock >= $quantity,
            ],
            'game' => $product->game ? [
                'id' => $product->game->id,
                'name' => $product->game->name,
                'slug' => $product->game->slug,
            ] : null,
            'target_user_id' => $data['target_user_id'],
            'quantity' => $quantity,
            'pricing' => [
                'unit_price' => (float) $unitPrice,
                'total_amount' => (float) $totalAmount,
            ],
            'paymentMethods' => $paymentMethods,
            'availableCoupons' => $availableCoupons,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id' => ['required', 'integer'],
            'target_user_id' => ['required', 'string', 'max:100'],
            'quantity' => ['required', 'integer', 'min:1', 'max:10'],
            'payment_method' => ['required', 'string', 'max:50'],
            'discount_code' => ['nullable', 'string', 'max:50'],
        ]);

        $userId = $request->user()->id;

        $order = DB::transaction(function () use ($data, $userId) {
            $product = Product::query()
                ->whereKey($data['product_id'])
                ->where('is_active', true)
                ->lockForUpdate()
                ->firstOrFail();

            if ($product->stock !== -1 && $product->stock < $data['quantity']) {
                abort(422, 'Stock tidak mencukupi.');
            }

            $paymentMethod = PaymentMethod::query()
                ->active()
                ->where('code', $data['payment_method'])
                ->firstOrFail();

            $unitPrice = $product->getEffectivePrice();
            $totalAmount = $unitPrice * $data['quantity'];

            $discountAmount = 0.0;
            $discountCode = $data['discount_code'] ? strtoupper(trim($data['discount_code'])) : null;
            $appliedCoupon = null;
            $appliedPromo = null;

            if ($discountCode) {
                $coupon = Coupon::query()
                    ->where('user_id', $userId)
                    ->where('code', $discountCode)
                    ->where('is_redeemed', false)
                    ->where(function ($q) {
                        $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
                    })
                    ->lockForUpdate()
                    ->first();

                if ($coupon) {
                    $discountAmount = ($totalAmount * $coupon->discount_percent) / 100;
                    $appliedCoupon = $coupon;
                } else {
                    $promo = Promo::query()
                        ->valid()
                        ->where('code', $discountCode)
                        ->lockForUpdate()
                        ->first();

                    if ($promo && $promo->isValid()) {
                        $discountAmount = $promo->calculateDiscount($totalAmount);
                        $appliedPromo = $promo;
                    }
                }
            }

            $finalAmount = max(0, $totalAmount - $discountAmount);

            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'user_id' => $userId,
                'game_id' => $product->game_id,
                'product_id' => $product->id,
                'target_user_id' => $data['target_user_id'],
                'quantity' => $data['quantity'],
                'total_amount' => $totalAmount,
                'discount_amount' => $discountAmount,
                'final_amount' => $finalAmount,
                'status' => Order::STATUS_PROCESSING,
                'payment_status' => Order::PAYMENT_STATUS_PAID,
                'payment_method' => $paymentMethod->code,
                'paid_at' => now(),
                'admin_notes' => 'AUTO: paid (no payment gateway)',
            ]);

            Payment::create([
                'order_id' => $order->id,
                'payment_method' => $paymentMethod->code,
                'payment_number' => 'PAY-' . now()->format('Ymd') . '-' . Str::upper(Str::random(8)),
                'amount' => $finalAmount,
                'status' => Payment::STATUS_SUCCESS,
                'paid_at' => now(),
                'metadata' => [
                    'payment_method_name' => $paymentMethod->name,
                    'account_number' => $paymentMethod->account_number,
                    'account_name' => $paymentMethod->account_name,
                ],
            ]);

            if ($appliedPromo) {
                PromoUsage::create([
                    'user_id' => $userId,
                    'promo_id' => $appliedPromo->id,
                    'order_id' => $order->id,
                    'discount_amount' => $discountAmount,
                    'used_at' => now(),
                ]);

                $appliedPromo->increment('used_count');
            }

            if ($appliedCoupon) {
                $appliedCoupon->update([
                    'is_redeemed' => true,
                    'redeemed_order_id' => $order->id,
                ]);
            }

            if ($product->stock !== -1) {
                $product->decrement('stock', $data['quantity']);
            }

            return $order;
        });

        $orderId = $order->id;
        app()->terminating(function () use ($orderId) {
            try {
                Order::query()
                    ->whereKey($orderId)
                    ->where('status', Order::STATUS_PROCESSING)
                    ->update([
                        'status' => Order::STATUS_COMPLETED,
                    ]);
            } catch (\Throwable $e) {
            }
        });

        return redirect()->route('orders.wheel', ['orderNumber' => $order->order_number]);
    }

    public function index(Request $request): Response
    {
        $orders = Order::query()
            ->with(['game', 'product', 'payment'])
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->paginate(15)
            ->through(function (Order $order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'payment_method' => $order->payment_method,
                    'final_amount' => (float) $order->final_amount,
                    'created_at' => $order->created_at,
                    'game' => $order->game ? [
                        'id' => $order->game->id,
                        'name' => $order->game->name,
                        'slug' => $order->game->slug,
                    ] : null,
                    'product' => $order->product ? [
                        'id' => $order->product->id,
                        'name' => $order->product->name,
                        'slug' => $order->product->slug,
                    ] : null,
                ];
            });

        return Inertia::render('orders/index', [
            'orders' => $orders,
        ]);
    }

    public function show(Request $request, string $orderNumber): Response
    {
        $order = Order::query()
            ->with(['game', 'product', 'payment'])
            ->where('order_number', $orderNumber)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        return Inertia::render('orders/show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'payment_method' => $order->payment_method,
                'target_user_id' => $order->target_user_id,
                'quantity' => $order->quantity,
                'total_amount' => (float) $order->total_amount,
                'discount_amount' => (float) $order->discount_amount,
                'final_amount' => (float) $order->final_amount,
                'created_at' => $order->created_at,
                'paid_at' => $order->paid_at,
                'game' => $order->game ? [
                    'id' => $order->game->id,
                    'name' => $order->game->name,
                    'slug' => $order->game->slug,
                ] : null,
                'product' => $order->product ? [
                    'id' => $order->product->id,
                    'name' => $order->product->name,
                    'slug' => $order->product->slug,
                ] : null,
                'payment' => $order->payment ? [
                    'id' => $order->payment->id,
                    'status' => $order->payment->status,
                    'payment_number' => $order->payment->payment_number,
                    'payment_reference' => $order->payment->payment_reference,
                    'amount' => (float) $order->payment->amount,
                    'paid_at' => $order->payment->paid_at,
                    'metadata' => $order->payment->metadata,
                ] : null,
            ],
        ]);
    }

    public function wheel(Request $request, string $orderNumber): Response
    {
        $order = Order::query()
            ->where('order_number', $orderNumber)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $couponSystemReady = Schema::hasTable('coupons');
        $coupon = null;
        if ($couponSystemReady) {
            $coupon = Coupon::query()
                ->where('issued_for_order_id', $order->id)
                ->where('user_id', $request->user()->id)
                ->first();
        }

        $segments = collect(range(3, 15))->map(fn (int $percent) => [
            'percent' => $percent,
        ])->values();

        return Inertia::render('orders/wheel', [
            'orderNumber' => $order->order_number,
            'segments' => $segments,
            'couponSystemReady' => $couponSystemReady,
            'coupon' => $coupon ? [
                'code' => $coupon->code,
                'discount_percent' => $coupon->discount_percent,
                'expires_at' => $coupon->expires_at,
            ] : null,
            'spinResult' => null,
        ]);
    }

    public function spinWheel(Request $request, string $orderNumber): Response
    {
        $order = Order::query()
            ->where('order_number', $orderNumber)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $couponSystemReady = Schema::hasTable('coupons');

        $segments = collect(range(3, 15))->map(fn (int $percent) => [
            'percent' => $percent,
        ])->values();

        if (!$couponSystemReady) {
            return Inertia::render('orders/wheel', [
                'orderNumber' => $order->order_number,
                'segments' => $segments,
                'couponSystemReady' => false,
                'coupon' => null,
                'spinResult' => null,
            ]);
        }

        $existing = Coupon::query()
            ->where('issued_for_order_id', $order->id)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existing) {
            $index = $segments->search(fn ($s) => $s['percent'] === (int) $existing->discount_percent);
            $index = $index === false ? null : (int) $index;

            return Inertia::render('orders/wheel', [
                'orderNumber' => $order->order_number,
                'segments' => $segments,
                'couponSystemReady' => true,
                'coupon' => [
                    'code' => $existing->code,
                    'discount_percent' => $existing->discount_percent,
                    'expires_at' => $existing->expires_at,
                ],
                'spinResult' => [
                    'segmentIndex' => $index,
                    'discount_percent' => $existing->discount_percent,
                    'code' => $existing->code,
                ],
            ]);
        }

        $percent = $this->drawCouponPercent();
        $code = $this->generateCouponCode();

        $coupon = Coupon::create([
            'user_id' => $request->user()->id,
            'issued_for_order_id' => $order->id,
            'code' => $code,
            'discount_percent' => $percent,
            'is_redeemed' => false,
            'expires_at' => now()->addDays(7),
        ]);

        $index = $segments->search(fn ($s) => $s['percent'] === (int) $coupon->discount_percent);
        $index = $index === false ? null : (int) $index;

        return Inertia::render('orders/wheel', [
            'orderNumber' => $order->order_number,
            'segments' => $segments,
            'couponSystemReady' => true,
            'coupon' => [
                'code' => $coupon->code,
                'discount_percent' => $coupon->discount_percent,
                'expires_at' => $coupon->expires_at,
            ],
            'spinResult' => [
                'segmentIndex' => $index,
                'discount_percent' => $coupon->discount_percent,
                'code' => $coupon->code,
            ],
        ]);
    }

    private function drawCouponPercent(): int
    {
        $weights = [
            3 => 22,
            4 => 20,
            5 => 18,
            6 => 16,
            7 => 14,
            8 => 12,
            9 => 10,
            10 => 8,
            11 => 6,
            12 => 4,
            13 => 3,
            14 => 2,
            15 => 1,
        ];

        $total = array_sum($weights);
        $roll = random_int(1, $total);

        foreach ($weights as $percent => $weight) {
            $roll -= $weight;
            if ($roll <= 0) {
                return (int) $percent;
            }
        }

        return 3;
    }

    private function generateCouponCode(): string
    {
        do {
            $code = 'GACHA-' . Str::upper(Str::random(8));
        } while (Coupon::query()->where('code', $code)->exists());

        return $code;
    }
}
