<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $products = Product::query()
            ->with(['game'])
            ->when($request->integer('game_id'), fn ($q, $gameId) => $q->where('game_id', $gameId))
            ->orderBy('game_id')
            ->orderBy('price')
            ->paginate(20)
            ->through(function (Product $product) {
                return [
                    'id' => $product->id,
                    'game_id' => $product->game_id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'price' => (float) $product->price,
                    'original_price' => $product->original_price ? (float) $product->original_price : null,
                    'flash_sale_price' => $product->flash_sale_price ? (float) $product->flash_sale_price : null,
                    'is_flash_sale' => $product->is_flash_sale,
                    'flash_sale_ends_at' => $product->flash_sale_ends_at,
                    'is_flash_sale_active' => $product->isFlashSaleActive(),
                    'effective_price' => $product->getEffectivePrice(),
                    'package_type' => $product->package_type,
                    'game_currency_amount' => $product->game_currency_amount,
                    'bonus_amount' => $product->bonus_amount,
                    'is_featured' => $product->is_featured,
                    'is_active' => $product->is_active,
                    'stock' => $product->stock,
                    'game' => $product->game ? [
                        'id' => $product->game->id,
                        'name' => $product->game->name,
                    ] : null,
                    'created_at' => $product->created_at,
                    'updated_at' => $product->updated_at,
                ];
            });

        $games = Game::query()
            ->active()
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Game $game) => [
                'id' => $game->id,
                'name' => $game->name,
            ]);

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'games' => $games,
            'filters' => [
                'game_id' => $request->integer('game_id'),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/products/form', [
            'mode' => 'create',
            'product' => null,
            'games' => Game::active()
                ->orderBy('sort_order')
                ->get()
                ->map(fn (Game $game) => [
                    'id' => $game->id,
                    'name' => $game->name,
                ]),
        ]);
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('admin/products/form', [
            'mode' => 'edit',
            'product' => [
                'id' => $product->id,
                'game_id' => $product->game_id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'price' => (float) $product->price,
                'original_price' => $product->original_price ? (float) $product->original_price : null,
                'flash_sale_price' => $product->flash_sale_price ? (float) $product->flash_sale_price : null,
                'is_flash_sale' => $product->is_flash_sale,
                'flash_sale_ends_at' => $product->flash_sale_ends_at?->toISOString(),
                'package_type' => $product->package_type,
                'game_currency_amount' => $product->game_currency_amount,
                'bonus_amount' => $product->bonus_amount,
                'is_featured' => $product->is_featured,
                'is_active' => $product->is_active,
                'stock' => $product->stock,
            ],
            'games' => Game::active()
                ->orderBy('sort_order')
                ->get()
                ->map(fn (Game $game) => [
                    'id' => $game->id,
                    'name' => $game->name,
                ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateProduct($request);

        if (!$data['is_flash_sale']) {
            $data['flash_sale_price'] = null;
            $data['flash_sale_ends_at'] = null;
        }

        Product::create($data);

        return redirect()->route('admin.products.index');
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $data = $this->validateProduct($request, $product);

        if (!$data['is_flash_sale']) {
            $data['flash_sale_price'] = null;
            $data['flash_sale_ends_at'] = null;
        }

        $product->update($data);

        return redirect()->route('admin.products.index');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return redirect()->route('admin.products.index');
    }

    private function validateProduct(Request $request, ?Product $product = null): array
    {
        $gameId = $request->integer('game_id');

        return $request->validate([
            'game_id' => ['required', 'integer', 'exists:games,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('products')
                    ->where(fn ($q) => $q->where('game_id', $gameId))
                    ->ignore($product?->id),
            ],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'original_price' => ['nullable', 'numeric', 'min:0'],
            'flash_sale_price' => ['nullable', 'numeric', 'min:0'],
            'is_flash_sale' => ['required', 'boolean'],
            'flash_sale_ends_at' => ['nullable', 'date'],
            'package_type' => ['nullable', 'string', 'max:50'],
            'game_currency_amount' => ['nullable', 'string', 'max:50'],
            'bonus_amount' => ['nullable', 'string', 'max:50'],
            'is_featured' => ['required', 'boolean'],
            'is_active' => ['required', 'boolean'],
            'stock' => ['required', 'integer', 'min:-1'],
        ]);
    }
}

