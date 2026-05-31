<?php

namespace Tests\Feature\Admin;

use App\Models\Game;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_open_edit_product_page_by_id()
    {
        $admin = User::factory()->create(['role' => 'admin']);
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

        $this->actingAs($admin, 'web');

        $this->get(route('admin.products.edit', ['product' => $product->id], absolute: false))
            ->assertOk()
            ->assertSee($product->name);
    }

    public function test_admin_can_update_product()
    {
        $admin = User::factory()->create(['role' => 'admin']);
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

        $this->actingAs($admin, 'web');

        $this->put(route('admin.products.update', ['product' => $product->id], absolute: false), [
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
            'is_featured' => false,
            'is_active' => true,
            'stock' => -1,
        ])->assertRedirect(route('admin.products.index', absolute: false));

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'is_featured' => false,
        ]);
    }
}

