<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGameRequest;
use App\Http\Requests\UpdateGameRequest;
use App\Http\Resources\GameResource;
use App\Http\Resources\GameDetailResource;
use App\Models\Game;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class GameController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Game::with('category')->active();

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $games = $query->orderBy('sort_order')->paginate(12);

        return GameResource::collection($games);
    }

    public function show(string $slug): GameDetailResource
    {
        $game = Game::with(['category', 'products' => function ($query) {
            $query->active()->orderBy('price');
        }])->where('slug', $slug)->firstOrFail();

        return new GameDetailResource($game);
    }

    public function store(StoreGameRequest $request): JsonResponse
    {
        $game = Game::create($request->validated());

        return response()->json([
            'message' => 'Game created successfully',
            'data' => new GameResource($game),
        ], 201);
    }

    public function update(UpdateGameRequest $request, Game $game): JsonResponse
    {
        $game->update($request->validated());

        return response()->json([
            'message' => 'Game updated successfully',
            'data' => new GameResource($game),
        ]);
    }

    public function destroy(Game $game): JsonResponse
    {
        $game->delete();

        return response()->json([
            'message' => 'Game deleted successfully',
        ]);
    }
}
