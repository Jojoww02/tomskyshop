<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Game;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Models\Promo;
use Illuminate\Database\Seeder;

class GameTopUpSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'MOBA', 'slug' => 'moba', 'icon' => 'gamepad'],
            ['name' => 'FPS', 'slug' => 'fps', 'icon' => 'target'],
            ['name' => 'RPG', 'slug' => 'rpg', 'icon' => 'sword'],
            ['name' => 'Battle Royale', 'slug' => 'battle-royale', 'icon' => 'crosshair'],
            ['name' => 'Simulation', 'slug' => 'simulation', 'icon' => 'truck'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        $games = [
            [
                'name' => 'Mobile Legends',
                'slug' => 'mobile-legends',
                'description' => 'Game MOBA mobile paling populer di Indonesia dengan jutaan pemain aktif setiap hari. Nikmati gameplay kompetitif dan grafis yang stunning.',
                'category_id' => 1,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Free Fire',
                'slug' => 'free-fire',
                'description' => 'Battle royale action game yang bisa dimainkan di berbagai perangkat. Bertarunglah menjadi yang terakhir dan raih Booyah!',
                'category_id' => 4,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Genshin Impact',
                'slug' => 'genshin-impact',
                'description' => 'Open world RPG game dengan grafis stunning dan gameplay yang adiktif. Jelajahi dunia Teyvat yang luas.',
                'category_id' => 3,
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'PUBG Mobile',
                'slug' => 'pubg-mobile',
                'description' => 'Battle royale shooter game dengan gameplay realistis. Jedaki Erangel dan menjadi survivor terakhir.',
                'category_id' => 4,
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Valorant',
                'slug' => 'valorant',
                'description' => 'Tactical FPS game dari Riot Games. Kombinasikan kemampuan agent dan strategi tim untuk menang.',
                'category_id' => 2,
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'Honor of Kings',
                'slug' => 'honor-of-kings',
                'description' => 'Game MOBA mobile dari Tencent Games dengan berbagai hero unik dan gameplay yang seru.',
                'category_id' => 1,
                'is_active' => true,
                'sort_order' => 6,
            ],
            [
                'name' => 'Call of Duty Mobile',
                'slug' => 'cod-mobile',
                'description' => 'FPS game legendaris dalam versi mobile dengan mode multiplayer dan battle royale.',
                'category_id' => 2,
                'is_active' => true,
                'sort_order' => 7,
            ],
            [
                'name' => 'League of Legends Wild Rift',
                'slug' => 'lol-wild-rift',
                'description' => 'Versi mobile dari game MOBA terpopuler di dunia dengan gameplay yang dioptimalkan untuk mobile.',
                'category_id' => 1,
                'is_active' => true,
                'sort_order' => 8,
            ],
        ];

        foreach ($games as $game) {
            Game::create($game);
        }

        $products = [
            // Mobile Legends Products
            ['game_id' => 1, 'name' => '86 Diamonds', 'slug' => '86-diamonds', 'description' => 'Paket 86 Diamonds untuk Mobile Legends', 'price' => 20000, 'original_price' => 22000, 'package_type' => 'diamonds', 'game_currency_amount' => '86', 'bonus_amount' => '0', 'is_featured' => true],
            ['game_id' => 1, 'name' => '172 Diamonds', 'slug' => '172-diamonds', 'description' => 'Paket 172 Diamonds untuk Mobile Legends', 'price' => 40000, 'original_price' => 44000, 'package_type' => 'diamonds', 'game_currency_amount' => '172', 'bonus_amount' => '8', 'is_featured' => true],
            ['game_id' => 1, 'name' => '257 Diamonds', 'slug' => '257-diamonds', 'description' => 'Paket 257 Diamonds untuk Mobile Legends', 'price' => 60000, 'original_price' => 66000, 'package_type' => 'diamonds', 'game_currency_amount' => '257', 'bonus_amount' => '12', 'is_featured' => true],
            ['game_id' => 1, 'name' => '429 Diamonds', 'slug' => '429-diamonds', 'description' => 'Paket 429 Diamonds untuk Mobile Legends', 'price' => 100000, 'original_price' => 110000, 'package_type' => 'diamonds', 'game_currency_amount' => '429', 'bonus_amount' => '21', 'is_featured' => true],
            ['game_id' => 1, 'name' => '514 Diamonds', 'slug' => '514-diamonds', 'description' => 'Paket 514 Diamonds untuk Mobile Legends', 'price' => 120000, 'original_price' => 132000, 'package_type' => 'diamonds', 'game_currency_amount' => '514', 'bonus_amount' => '25', 'is_featured' => true],
            ['game_id' => 1, 'name' => '706 Diamonds', 'slug' => '706-diamonds', 'description' => 'Paket 706 Diamonds untuk Mobile Legends', 'price' => 165000, 'original_price' => 181500, 'package_type' => 'diamonds', 'game_currency_amount' => '706', 'bonus_amount' => '35', 'is_featured' => false],
            ['game_id' => 1, 'name' => '878 Diamonds', 'slug' => '878-diamonds', 'description' => 'Paket 878 Diamonds untuk Mobile Legends', 'price' => 205000, 'original_price' => 225500, 'package_type' => 'diamonds', 'game_currency_amount' => '878', 'bonus_amount' => '43', 'is_featured' => false],
            ['game_id' => 1, 'name' => '1412 Diamonds', 'slug' => '1412-diamonds', 'description' => 'Paket 1412 Diamonds untuk Mobile Legends', 'price' => 330000, 'original_price' => 363000, 'package_type' => 'diamonds', 'game_currency_amount' => '1412', 'bonus_amount' => '70', 'is_featured' => false],

            // Free Fire Products
            ['game_id' => 2, 'name' => '50 UC', 'slug' => '50-uc', 'description' => 'Paket 50 UC untuk Free Fire', 'price' => 7000, 'original_price' => 8000, 'package_type' => 'uc', 'game_currency_amount' => '50', 'bonus_amount' => '0', 'is_featured' => true],
            ['game_id' => 2, 'name' => '100 UC', 'slug' => '100-uc', 'description' => 'Paket 100 UC untuk Free Fire', 'price' => 14000, 'original_price' => 16000, 'package_type' => 'uc', 'game_currency_amount' => '100', 'bonus_amount' => '5', 'is_featured' => true],
            ['game_id' => 2, 'name' => '200 UC', 'slug' => '200-uc', 'description' => 'Paket 200 UC untuk Free Fire', 'price' => 28000, 'original_price' => 32000, 'package_type' => 'uc', 'game_currency_amount' => '200', 'bonus_amount' => '10', 'is_featured' => true],
            ['game_id' => 2, 'name' => '500 UC', 'slug' => '500-uc', 'description' => 'Paket 500 UC untuk Free Fire', 'price' => 70000, 'original_price' => 80000, 'package_type' => 'uc', 'game_currency_amount' => '500', 'bonus_amount' => '25', 'is_featured' => false],
            ['game_id' => 2, 'name' => '1000 UC', 'slug' => '1000-uc', 'description' => 'Paket 1000 UC untuk Free Fire', 'price' => 140000, 'original_price' => 160000, 'package_type' => 'uc', 'game_currency_amount' => '1000', 'bonus_amount' => '50', 'is_featured' => false],

            // Genshin Impact Products
            ['game_id' => 3, 'name' => '60 Genesis Crystal', 'slug' => '60-genesis-crystal', 'description' => 'Paket 60 Genesis Crystal untuk Genshin Impact', 'price' => 12000, 'original_price' => 14000, 'package_type' => 'genesis_crystal', 'game_currency_amount' => '60', 'bonus_amount' => '0', 'is_featured' => true],
            ['game_id' => 3, 'name' => '300 Genesis Crystal', 'slug' => '300-genesis-crystal', 'description' => 'Paket 300 Genesis Crystal untuk Genshin Impact', 'price' => 60000, 'original_price' => 70000, 'package_type' => 'genesis_crystal', 'game_currency_amount' => '300', 'bonus_amount' => '30', 'is_featured' => true],
            ['game_id' => 3, 'name' => '980 Genesis Crystal', 'slug' => '980-genesis-crystal', 'description' => 'Paket 980 Genesis Crystal untuk Genshin Impact', 'price' => 195000, 'original_price' => 220000, 'package_type' => 'genesis_crystal', 'game_currency_amount' => '980', 'bonus_amount' => '110', 'is_featured' => false],
            ['game_id' => 3, 'name' => '3280 Genesis Crystal', 'slug' => '3280-genesis-crystal', 'description' => 'Paket 3280 Genesis Crystal untuk Genshin Impact', 'price' => 650000, 'original_price' => 750000, 'package_type' => 'genesis_crystal', 'game_currency_amount' => '3280', 'bonus_amount' => '400', 'is_featured' => false],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }

        $paymentMethods = [
            ['name' => 'Bank BCA', 'code' => 'bca', 'type' => 'bank', 'account_number' => '1234567890', 'account_name' => 'PT TomSky Shop', 'min_amount' => 10000, 'is_active' => true, 'sort_order' => 1],
            ['name' => 'Bank BNI', 'code' => 'bni', 'type' => 'bank', 'account_number' => '0987654321', 'account_name' => 'PT TomSky Shop', 'min_amount' => 10000, 'is_active' => true, 'sort_order' => 2],
            ['name' => 'Bank BRI', 'code' => 'bri', 'type' => 'bank', 'account_number' => '6789012345', 'account_name' => 'PT TomSky Shop', 'min_amount' => 10000, 'is_active' => true, 'sort_order' => 3],
            ['name' => 'Bank Mandiri', 'code' => 'mandiri', 'type' => 'bank', 'account_number' => '2345678901', 'account_name' => 'PT TomSky Shop', 'min_amount' => 10000, 'is_active' => true, 'sort_order' => 4],
            ['name' => 'GoPay', 'code' => 'gopay', 'type' => 'ewallet', 'account_number' => '081234567890', 'account_name' => 'PT TomSky Shop', 'min_amount' => 5000, 'is_active' => true, 'sort_order' => 5],
            ['name' => 'OVO', 'code' => 'ovo', 'type' => 'ewallet', 'account_number' => '081234567890', 'account_name' => 'PT TomSky Shop', 'min_amount' => 5000, 'is_active' => true, 'sort_order' => 6],
            ['name' => 'DANA', 'code' => 'dana', 'type' => 'ewallet', 'account_number' => '081234567890', 'account_name' => 'PT TomSky Shop', 'min_amount' => 5000, 'is_active' => true, 'sort_order' => 7],
            ['name' => 'ShopeePay', 'code' => 'shopeepay', 'type' => 'ewallet', 'account_number' => '081234567890', 'account_name' => 'PT TomSky Shop', 'min_amount' => 5000, 'is_active' => true, 'sort_order' => 8],
            ['name' => 'Telkomsel', 'code' => 'tsel', 'type' => 'pulsa', 'account_number' => '081234567890', 'account_name' => 'PT TomSky Shop', 'min_amount' => 10000, 'is_active' => true, 'sort_order' => 9],
            ['name' => 'XL', 'code' => 'xl', 'type' => 'pulsa', 'account_number' => '081234567890', 'account_name' => 'PT TomSky Shop', 'min_amount' => 10000, 'is_active' => true, 'sort_order' => 10],
        ];

        foreach ($paymentMethods as $method) {
            PaymentMethod::create($method);
        }

        $promos = [
            [
                'code' => 'HEMAT10',
                'name' => 'Diskon 10%',
                'description' => 'Dapatkan diskon 10% untuk setiap transaksi',
                'type' => 'percentage',
                'discount_value' => 10,
                'min_order_amount' => 50000,
                'max_discount' => 20000,
                'usage_limit' => 1000,
                'used_count' => 0,
                'start_date' => now(),
                'end_date' => now()->addYear(),
                'is_active' => true,
            ],
            [
                'code' => 'WELCOME',
                'name' => 'Welcome Bonus Rp 5.000',
                'description' => 'Bonus Rp 5.000 untuk member baru',
                'type' => 'fixed',
                'discount_value' => 5000,
                'min_order_amount' => 50000,
                'max_discount' => null,
                'usage_limit' => 500,
                'used_count' => 0,
                'start_date' => now(),
                'end_date' => now()->addYear(),
                'is_active' => true,
            ],
            [
                'code' => 'HEMAT50',
                'name' => 'Diskon Rp 50.000',
                'description' => 'Diskon flat Rp 50.000',
                'type' => 'fixed',
                'discount_value' => 50000,
                'min_order_amount' => 500000,
                'max_discount' => null,
                'usage_limit' => 100,
                'used_count' => 0,
                'start_date' => now(),
                'end_date' => now()->addYear(),
                'is_active' => true,
            ],
        ];

        foreach ($promos as $promo) {
            Promo::create($promo);
        }

        $this->command->info('Game Top-Up seeder completed successfully!');
        $this->command->info('Created ' . Category::count() . ' categories');
        $this->command->info('Created ' . Game::count() . ' games');
        $this->command->info('Created ' . Product::count() . ' products');
        $this->command->info('Created ' . PaymentMethod::count() . ' payment methods');
        $this->command->info('Created ' . Promo::count() . ' promos');
    }
}
