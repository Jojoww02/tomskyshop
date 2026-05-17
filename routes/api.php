<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\GameController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\PaymentMethodController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\PromoController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{slug}', [CategoryController::class, 'show']);

    Route::get('/games', [GameController::class, 'index']);
    Route::get('/games/{slug}', [GameController::class, 'show']);
    Route::get('/games/{gameSlug}/products', [ProductController::class, 'index']);
    Route::get('/games/{gameSlug}/products/{slug}', [ProductController::class, 'show']);

    Route::get('/payment-methods', [PaymentMethodController::class, 'index']);
    Route::get('/payment-methods/types', [PaymentMethodController::class, 'types']);
    Route::get('/payment-methods/{code}', [PaymentMethodController::class, 'show']);

    Route::get('/promos', [PromoController::class, 'index']);
    Route::get('/promos/{code}', [PromoController::class, 'show']);
    Route::post('/promos/apply', [PromoController::class, 'apply']);

    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{orderNumber}', [OrderController::class, 'show']);

    Route::post('/payments', [PaymentController::class, 'store']);
    Route::get('/payments/{orderId}', [PaymentController::class, 'show']);
    Route::post('/payments/confirm', [PaymentController::class, 'confirm']);
    Route::post('/payments/callback', [PaymentController::class, 'callback']);

    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
        Route::put('/user/profile', [AuthController::class, 'updateProfile']);
        Route::put('/user/password', [AuthController::class, 'updatePassword']);

        Route::middleware('admin')->prefix('admin')->group(function () {
            Route::post('/games', [GameController::class, 'store']);
            Route::put('/games/{game}', [GameController::class, 'update']);
            Route::delete('/games/{game}', [GameController::class, 'destroy']);

            Route::post('/products', [ProductController::class, 'store']);
            Route::put('/products/{product}', [ProductController::class, 'update']);
            Route::delete('/products/{product}', [ProductController::class, 'destroy']);

            Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus']);
            Route::delete('/orders/{order}', [OrderController::class, 'destroy']);

            Route::get('/payments', [PaymentController::class, 'index']);
        });
    });
});
