<?php

use App\Http\Controllers\GameController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
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
            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => $product->price,
                'original_price' => $product->original_price,
                'package_type' => $product->package_type,
                'game_currency_amount' => $product->game_currency_amount,
                'bonus_amount' => $product->bonus_amount,
                'discount_percentage' => $product->getDiscountPercentage(),
                'game' => $product->game ? [
                    'name' => $product->game->name,
                    'slug' => $product->game->slug,
                ] : null,
            ];
        });

    return Inertia::render('Home', [
        'games' => $games,
        'categories' => $categories,
        'featuredProducts' => $featuredProducts,
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
        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description,
            'price' => $product->price,
            'original_price' => $product->original_price,
            'package_type' => $product->package_type,
            'game_currency_amount' => $product->game_currency_amount,
            'bonus_amount' => $product->bonus_amount,
            'is_featured' => $product->is_featured,
            'discount_percentage' => $product->getDiscountPercentage(),
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

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('orders/{orderNumber}', [OrderController::class, 'show'])->name('orders.show');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
