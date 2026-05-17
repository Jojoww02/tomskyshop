<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\ConfirmPaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentMethod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Payment::with('order');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $payments = $query->orderBy('created_at', 'desc')->paginate(15);

        return PaymentResource::collection($payments);
    }

    public function show(string $orderId): PaymentResource
    {
        $payment = Payment::where('order_id', $orderId)
            ->orWhere('id', $orderId)
            ->firstOrFail();

        return new PaymentResource($payment->load('order'));
    }

    public function store(StorePaymentRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $order = Order::findOrFail($validated['order_id']);

        if ($order->payment_status === Order::PAYMENT_STATUS_PAID) {
            return response()->json([
                'message' => 'Order already paid',
            ], 400);
        }

        $paymentMethod = PaymentMethod::where('code', $validated['payment_method'])->first();

        if (!$paymentMethod) {
            return response()->json([
                'message' => 'Invalid payment method',
            ], 400);
        }

        DB::beginTransaction();
        try {
            $payment = Payment::create([
                'order_id' => $order->id,
                'payment_method' => $validated['payment_method'],
                'payment_number' => $this->generatePaymentNumber($validated['payment_method']),
                'amount' => $order->final_amount,
                'status' => Payment::STATUS_PENDING,
            ]);

            $order->update([
                'payment_method' => $validated['payment_method'],
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Payment created successfully',
                'data' => new PaymentResource($payment->load('order')),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create payment',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function confirm(ConfirmPaymentRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $order = Order::findOrFail($validated['order_id']);
        $payment = Payment::where('order_id', $order->id)->first();

        if (!$payment) {
            return response()->json([
                'message' => 'Payment not found',
            ], 404);
        }

        DB::beginTransaction();
        try {
            $payment->update([
                'status' => Payment::STATUS_SUCCESS,
                'paid_at' => now(),
                'payment_reference' => $validated['payment_reference'] ?? Str::random(20),
                'payment_proof_url' => $validated['payment_proof'] ?? null,
            ]);

            $order->update([
                'payment_status' => Order::PAYMENT_STATUS_PAID,
                'paid_at' => now(),
                'status' => Order::STATUS_PROCESSING,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Payment confirmed successfully',
                'data' => new PaymentResource($payment->load('order')),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to confirm payment',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function callback(Request $request): JsonResponse
    {
        $request->validate([
            'order_id' => 'required',
            'status' => 'required|in:pending,success,failed,expired',
            'payment_reference' => 'nullable|string',
        ]);

        $order = Order::findOrFail($request->order_id);
        $payment = Payment::where('order_id', $order->id)->first();

        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        $statusMap = [
            'success' => Payment::STATUS_SUCCESS,
            'failed' => Payment::STATUS_FAILED,
            'expired' => Payment::STATUS_EXPIRED,
            'pending' => Payment::STATUS_PENDING,
        ];

        $payment->update([
            'status' => $statusMap[$request->status] ?? Payment::STATUS_PENDING,
            'payment_reference' => $request->payment_reference,
            'paid_at' => $request->status === 'success' ? now() : null,
        ]);

        if ($request->status === 'success') {
            $order->update([
                'payment_status' => Order::PAYMENT_STATUS_PAID,
                'paid_at' => now(),
                'status' => Order::STATUS_PROCESSING,
            ]);
        }

        return response()->json(['message' => 'Callback processed']);
    }

    private function generatePaymentNumber(string $method): string
    {
        $prefix = match ($method) {
            'bca' => 'BCA',
            'bni' => 'BNI',
            'bri' => 'BRI',
            'mandiri' => 'MANDIRI',
            'gopay' => 'GOPAY',
            'ovo' => 'OVO',
            'dana' => 'DANA',
            'shopeepay' => 'SPP',
            'tsel', 'xl' => 'PULSA',
            default => 'PAY',
        };

        return $prefix . now()->format('YmdHis') . str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);
    }
}
