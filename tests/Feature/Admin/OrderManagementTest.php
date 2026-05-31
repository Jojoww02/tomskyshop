<?php

namespace Tests\Feature\Admin;

use App\Models\Game;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_orders_and_accept_and_complete_order()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'user']);

        $game = Game::create([
            'name' => 'Mobile Legends',
            'slug' => 'mobile-legends',
            'is_active' => true,
            'sort_order' => 0,
        ]);

        $product = Product::create([
            'game_id' => $game->id,
            'name' => '86 Diamonds',
            'slug' => '86-diamonds',
            'description' => null,
            'price' => 20000,
            'original_price' => null,
            'flash_sale_price' => null,
            'is_flash_sale' => false,
            'flash_sale_ends_at' => null,
            'package_type' => 'diamonds',
            'game_currency_amount' => '86',
            'bonus_amount' => '0',
            'is_featured' => true,
            'is_active' => true,
            'stock' => -1,
        ]);

        $order = Order::create([
            'order_number' => Order::generateOrderNumber(),
            'user_id' => $user->id,
            'game_id' => $game->id,
            'product_id' => $product->id,
            'target_user_id' => '12345',
            'quantity' => 1,
            'total_amount' => 20000,
            'discount_amount' => 0,
            'final_amount' => 20000,
            'status' => Order::STATUS_PENDING,
            'payment_status' => Order::PAYMENT_STATUS_UNPAID,
            'payment_method' => 'bca',
        ]);

        Payment::create([
            'order_id' => $order->id,
            'payment_method' => 'bca',
            'payment_number' => 'PAY-TEST-0001',
            'amount' => 20000,
            'status' => Payment::STATUS_PENDING,
            'metadata' => [],
        ]);

        $this->actingAs($admin, 'web');

        $this->get('/admin/orders')
            ->assertOk()
            ->assertSee('admin\\/orders\\/index');

        $this->put('/admin/orders/'.$order->order_number.'/status', [
            'status' => 'processing',
        ])->assertRedirect('/admin/orders/'.$order->order_number);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'processing',
        ]);

        $this->put('/admin/orders/'.$order->order_number.'/status', [
            'status' => 'completed',
        ])->assertRedirect('/admin/orders/'.$order->order_number);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'completed',
            'payment_status' => 'paid',
        ]);

        $this->assertDatabaseHas('payments', [
            'order_id' => $order->id,
            'status' => 'success',
        ]);
    }
}

