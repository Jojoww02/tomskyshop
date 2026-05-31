<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $orders = Order::query()
            ->with(['user', 'game', 'product', 'payment'])
            ->when($request->string('status')->toString(), fn ($q, $status) => $q->where('status', $status))
            ->orderByDesc('created_at')
            ->paginate(20)
            ->through(function (Order $order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'target_user_id' => $order->target_user_id,
                    'quantity' => $order->quantity,
                    'final_amount' => (float) $order->final_amount,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'payment_method' => $order->payment_method,
                    'created_at' => $order->created_at,
                    'user' => $order->user ? [
                        'id' => $order->user->id,
                        'name' => $order->user->name,
                        'email' => $order->user->email,
                    ] : null,
                    'game' => $order->game ? [
                        'id' => $order->game->id,
                        'name' => $order->game->name,
                    ] : null,
                    'product' => $order->product ? [
                        'id' => $order->product->id,
                        'name' => $order->product->name,
                    ] : null,
                    'payment' => $order->payment ? [
                        'id' => $order->payment->id,
                        'status' => $order->payment->status,
                        'payment_number' => $order->payment->payment_number,
                        'amount' => (float) $order->payment->amount,
                        'paid_at' => $order->payment->paid_at,
                    ] : null,
                ];
            });

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'filters' => [
                'status' => $request->string('status')->toString() ?: null,
            ],
            'statusOptions' => [
                Order::STATUS_PENDING,
                Order::STATUS_PROCESSING,
                Order::STATUS_COMPLETED,
                Order::STATUS_FAILED,
                Order::STATUS_CANCELLED,
            ],
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['user', 'game', 'product', 'payment', 'promoUsage.promo']);

        return Inertia::render('admin/orders/show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'target_user_id' => $order->target_user_id,
                'quantity' => $order->quantity,
                'total_amount' => (float) $order->total_amount,
                'discount_amount' => (float) $order->discount_amount,
                'final_amount' => (float) $order->final_amount,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'payment_method' => $order->payment_method,
                'paid_at' => $order->paid_at,
                'admin_notes' => $order->admin_notes,
                'created_at' => $order->created_at,
                'updated_at' => $order->updated_at,
                'user' => $order->user ? [
                    'id' => $order->user->id,
                    'name' => $order->user->name,
                    'email' => $order->user->email,
                ] : null,
                'game' => $order->game ? [
                    'id' => $order->game->id,
                    'name' => $order->game->name,
                ] : null,
                'product' => $order->product ? [
                    'id' => $order->product->id,
                    'name' => $order->product->name,
                ] : null,
                'payment' => $order->payment ? [
                    'id' => $order->payment->id,
                    'status' => $order->payment->status,
                    'payment_number' => $order->payment->payment_number,
                    'amount' => (float) $order->payment->amount,
                    'paid_at' => $order->payment->paid_at,
                    'payment_reference' => $order->payment->payment_reference,
                    'metadata' => $order->payment->metadata,
                ] : null,
                'promo' => $order->promoUsage && $order->promoUsage->promo ? [
                    'code' => $order->promoUsage->promo->code,
                    'discount_amount' => (float) $order->promoUsage->discount_amount,
                ] : null,
            ],
            'statusOptions' => [
                Order::STATUS_PENDING,
                Order::STATUS_PROCESSING,
                Order::STATUS_COMPLETED,
                Order::STATUS_FAILED,
                Order::STATUS_CANCELLED,
            ],
        ]);
    }

    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:pending,processing,completed,failed,cancelled'],
            'admin_notes' => ['nullable', 'string'],
        ]);

        $order->update([
            'status' => $data['status'],
            'admin_notes' => $data['admin_notes'] ?? null,
        ]);

        if ($data['status'] === Order::STATUS_COMPLETED) {
            $order->update([
                'payment_status' => Order::PAYMENT_STATUS_PAID,
                'paid_at' => now(),
            ]);

            if ($order->payment) {
                $order->payment->update([
                    'status' => Payment::STATUS_SUCCESS,
                    'paid_at' => now(),
                ]);
            }
        }

        if ($data['status'] === Order::STATUS_FAILED) {
            $order->update([
                'payment_status' => Order::PAYMENT_STATUS_FAILED,
            ]);

            if ($order->payment) {
                $order->payment->update([
                    'status' => Payment::STATUS_FAILED,
                ]);
            }
        }

        return redirect()->route('admin.orders.show', $order->order_number);
    }
}

