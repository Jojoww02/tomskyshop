<?php

use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\OrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function (Request $request) {
    if ($request->user() && $request->user()->role === 'admin') {
        return redirect()->route('admin.dashboard');
    }

    $games = \App\Models\Game::with(['category'])
        ->active()
        ->orderBy('sort_order')
        ->limit(8)
        ->get()
        ->map(function ($game) {
            return [
                'id' => $game->id,
                'name' => $game->name,
                'slug' => $game->slug,
                'description' => $game->description,
                'image_url' => $game->image_url,
                'category' => $game->category ? [
                    'name' => $game->category->name,
                    'slug' => $game->category->slug,
                ] : null,
                'products_count' => $game->products()->count(),
            ];
        });

    $categories = \App\Models\Category::active()
        ->orderBy('name')
        ->get()
        ->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'icon' => $category->icon,
            ];
        });

    $featuredProducts = \App\Models\Product::with(['game'])
        ->active()
        ->featured()
        ->limit(4)
        ->get()
        ->map(function ($product) {
            $isFlashSaleActive = $product->isFlashSaleActive();
            $basePrice = (float) $product->price;
            $effectivePrice = (float) $product->getEffectivePrice();
            $flashSalePrice = $product->flash_sale_price ? (float) $product->flash_sale_price : null;

            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => $effectivePrice,
                'base_price' => $basePrice,
                'original_price' => $product->original_price ? (float) $product->original_price : null,
                'flash_sale_price' => $flashSalePrice,
                'is_flash_sale' => (bool) $product->is_flash_sale,
                'is_flash_sale_active' => $isFlashSaleActive,
                'flash_sale_ends_at' => $product->flash_sale_ends_at,
                'package_type' => $product->package_type,
                'game_currency_amount' => $product->game_currency_amount,
                'bonus_amount' => $product->bonus_amount,
                'stock' => $product->stock,
                'in_stock' => $product->stock === -1 || $product->stock > 0,
                'discount_percentage' => $isFlashSaleActive && $flashSalePrice !== null && $basePrice > 0 && $basePrice > $flashSalePrice
                    ? round((($basePrice - $flashSalePrice) / $basePrice) * 100)
                    : $product->getDiscountPercentage(),
                'game' => $product->game ? [
                    'name' => $product->game->name,
                    'slug' => $product->game->slug,
                ] : null,
            ];
        });

    $flashSaleProducts = \App\Models\Product::with(['game'])
        ->active()
        ->where('is_flash_sale', true)
        ->whereNotNull('flash_sale_ends_at')
        ->where('flash_sale_ends_at', '>', now())
        ->get()
        ->map(function ($product) {
            $basePrice = (float) $product->price;
            $flashSalePrice = (float) $product->flash_sale_price;

            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'originalPrice' => $product->original_price ? (float) $product->original_price : $basePrice,
                'flashPrice' => $flashSalePrice,
                'discount' => $basePrice > 0 && $basePrice > $flashSalePrice
                    ? round((($basePrice - $flashSalePrice) / $basePrice) * 100)
                    : 0,
                'game' => $product->game ? $product->game->name : '',
                'game_slug' => $product->game ? $product->game->slug : '',
                'flash_sale_ends_at' => $product->flash_sale_ends_at,
            ];
        });

    return Inertia::render('Home', [
        'games' => $games,
        'categories' => $categories,
        'featuredProducts' => $featuredProducts,
        'flashSaleProducts' => $flashSaleProducts,
    ]);
})->name('home');

Route::get('/games', function () {
    $games = \App\Models\Game::with(['category'])
        ->active()
        ->orderBy('sort_order')
        ->get()
        ->map(function ($game) {
            return [
                'id' => $game->id,
                'name' => $game->name,
                'slug' => $game->slug,
                'description' => $game->description,
                'image_url' => $game->image_url,
                'category' => $game->category ? [
                    'name' => $game->category->name,
                    'slug' => $game->category->slug,
                ] : null,
                'products_count' => $game->products()->count(),
            ];
        });

    $categories = \App\Models\Category::active()
        ->orderBy('name')
        ->get()
        ->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'icon' => $category->icon,
            ];
        });

    return Inertia::render('games/index', [
        'games' => $games,
        'categories' => $categories,
    ]);
})->name('games.index');

Route::get('/games/{slug}', function (string $slug) {
    $game = \App\Models\Game::with(['category', 'products' => function ($query) {
        $query->active()->orderBy('price');
    }])
        ->where('slug', $slug)
        ->firstOrFail();

    $products = $game->products->map(function ($product) {
        $isFlashSaleActive = $product->isFlashSaleActive();
        $basePrice = (float) $product->price;
        $effectivePrice = (float) $product->getEffectivePrice();
        $flashSalePrice = $product->flash_sale_price ? (float) $product->flash_sale_price : null;

        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description,
            'price' => $effectivePrice,
            'base_price' => $basePrice,
            'original_price' => $product->original_price ? (float) $product->original_price : null,
            'flash_sale_price' => $flashSalePrice,
            'is_flash_sale' => (bool) $product->is_flash_sale,
            'is_flash_sale_active' => $isFlashSaleActive,
            'flash_sale_ends_at' => $product->flash_sale_ends_at,
            'package_type' => $product->package_type,
            'game_currency_amount' => $product->game_currency_amount,
            'bonus_amount' => $product->bonus_amount,
            'is_featured' => $product->is_featured,
            'stock' => $product->stock,
            'in_stock' => $product->stock === -1 || $product->stock > 0,
            'discount_percentage' => $isFlashSaleActive && $flashSalePrice !== null && $basePrice > 0 && $basePrice > $flashSalePrice
                ? round((($basePrice - $flashSalePrice) / $basePrice) * 100)
                : $product->getDiscountPercentage(),
        ];
    });

    return Inertia::render('games/show', [
        'game' => [
            'id' => $game->id,
            'name' => $game->name,
            'slug' => $game->slug,
            'description' => $game->description,
            'image_url' => $game->image_url,
            'banner_url' => $game->banner_url,
            'category' => $game->category ? [
                'name' => $game->category->name,
            ] : null,
        ],
        'products' => $products,
    ]);
})->name('games.show');

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('dashboard', function () {
        return redirect()->route('admin.dashboard');
    })->name('dashboard');
});

Route::middleware(['auth'])->group(function () {
    Route::get('checkout', [OrderController::class, 'checkout'])->name('checkout');
    Route::post('orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('orders/{orderNumber}', [OrderController::class, 'show'])->name('orders.show');
    Route::get('orders/{orderNumber}/wheel', [OrderController::class, 'wheel'])->name('orders.wheel');
    Route::post('orders/{orderNumber}/wheel', [OrderController::class, 'spinWheel'])->name('orders.wheel.spin');
});

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', function () {
        $dailyData = [];
        $now = now();
        for ($i = 6; $i >= 0; $i--) {
            $date = $now->copy()->subDays($i)->format('Y-m-d');
            $ordersCount = \App\Models\Order::whereDate('created_at', $date)->count();
            $salesTotal = \App\Models\Order::whereDate('created_at', $date)
                ->where('status', \App\Models\Order::STATUS_COMPLETED)
                ->sum('final_amount');
            $dailyData[] = [
                'date' => $now->copy()->subDays($i)->format('d M'),
                'orders' => $ordersCount,
                'sales' => (float) $salesTotal,
            ];
        }

        // Get orders by status
        $ordersByStatus = [
            'pending' => \App\Models\Order::where('status', \App\Models\Order::STATUS_PENDING)->count(),
            'processing' => \App\Models\Order::where('status', \App\Models\Order::STATUS_PROCESSING)->count(),
            'completed' => \App\Models\Order::where('status', \App\Models\Order::STATUS_COMPLETED)->count(),
            'failed' => \App\Models\Order::where('status', \App\Models\Order::STATUS_FAILED)->count(),
            'cancelled' => \App\Models\Order::where('status', \App\Models\Order::STATUS_CANCELLED)->count(),
        ];

        // Get active users (users who have sessions in last 5 minutes)
        $activeUsers = \Illuminate\Support\Facades\DB::table('sessions')
            ->where('last_activity', '>=', now()->subMinutes(5)->timestamp)
            ->whereNotNull('user_id')
            ->distinct('user_id')
            ->count('user_id');

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'games' => \App\Models\Game::count(),
                'products' => \App\Models\Product::count(),
                'orders' => \App\Models\Order::count(),
                'users' => \App\Models\User::count(),
                'activeUsers' => $activeUsers,
                'totalSales' => (float) \App\Models\Order::where('status', \App\Models\Order::STATUS_COMPLETED)->sum('final_amount'),
                'pendingOrders' => \App\Models\Order::where('status', \App\Models\Order::STATUS_PENDING)->count(),
            ],
            'dailyData' => $dailyData,
            'ordersByStatus' => $ordersByStatus,
        ]);
    })->name('dashboard');

    Route::get('/products', [AdminProductController::class, 'index'])->name('products.index');
    Route::get('/products/create', [AdminProductController::class, 'create'])->name('products.create');
    Route::post('/products', [AdminProductController::class, 'store'])->name('products.store');
    Route::get('/products/{product:id}/edit', [AdminProductController::class, 'edit'])->name('products.edit');
    Route::put('/products/{product:id}', [AdminProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product:id}', [AdminProductController::class, 'destroy'])->name('products.destroy');

    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order:order_number}', [AdminOrderController::class, 'show'])->name('orders.show');
    Route::put('/orders/{order:order_number}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.status');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
