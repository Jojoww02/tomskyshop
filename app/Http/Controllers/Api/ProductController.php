<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    public function index(Request $request, string $gameSlug): AnonymousResourceCollection
    {
        $query = Product::whereHas('game', function ($q) use ($gameSlug) {
            $q->where('slug', $gameSlug);
        })->active();

        if ($request->has('featured')) {
            $query->featured();
        }

        if ($request->has('package_type')) {
            $query->where('package_type', $request->package_type);
        }

        $products = $query->orderBy('price')->paginate(12);

        return ProductResource::collection($products);
    }

    public function show(string $gameSlug, string $slug): ProductResource
    {
        $product = Product::whereHas('game', function ($q) use ($gameSlug) {
            $q->where('slug', $gameSlug);
        })->where('slug', $slug)->firstOrFail();

        return new ProductResource($product);
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = Product::create($request->validated());

        return response()->json([
            'message' => 'Product created successfully',
            'data' => new ProductResource($product),
        ], 201);
    }

    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $product->update($request->validated());

        return response()->json([
            'message' => 'Product updated successfully',
            'data' => new ProductResource($product),
        ]);
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully',
        ]);
    }
}
