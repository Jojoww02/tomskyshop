<?php

namespace Tests\Feature;

use App\Models\Coupon;
use App\Models\Game;
use App\Models\Order;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderCheckoutAndWheelTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_open_checkout_and_create_order_then_spin_coupon_wheel()
    {
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

        PaymentMethod::create([
            'name' => 'Bank BCA',
            'code' => 'bca',
            'type' => 'bank',
            'account_number' => '1234567890',
            'account_name' => 'PT TomSky Shop',
            'min_amount' => 10000,
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $this->actingAs($user, 'web');

        $this->get('/checkout?product_id='.$product->id.'&target_user_id=12345')
            ->assertOk()
            ->assertSee('checkout\\/index');

        $this->post('/orders', [
            'product_id' => $product->id,
            'target_user_id' => '12345',
            'quantity' => 1,
            'payment_method' => 'bca',
            'discount_code' => null,
        ])->assertRedirect();

        $order = Order::query()->where('user_id', $user->id)->first();
        $this->assertNotNull($order);

        $this->get('/orders/'.$order->order_number.'/wheel')
            ->assertOk()
            ->assertSee('orders\\/wheel');

        $this->post('/orders/'.$order->order_number.'/wheel')
            ->assertOk();

        $this->assertDatabaseHas('coupons', [
            'user_id' => $user->id,
            'issued_for_order_id' => $order->id,
            'is_redeemed' => false,
        ]);

        $coupon = Coupon::query()->where('issued_for_order_id', $order->id)->first();
        $this->assertNotNull($coupon);
        $this->assertGreaterThanOrEqual(3, $coupon->discount_percent);
        $this->assertLessThanOrEqual(15, $coupon->discount_percent);
    }
}
