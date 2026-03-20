<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GameResource;
use App\Models\Game;
use Illuminate\Http\Request;

class LibraryController extends Controller
{
    /**
     * Get user's game library
     */
    public function index(Request $request)
    {
        $games = $request->user()->games()->with('category')->get();

        return GameResource::collection($games);
    }

    /**
     * Purchase a game (add to library)
     */
    public function purchase(Request $request, Game $game)
    {
        $user = $request->user();

        // Check if already owns the game
        if ($user->ownsGame($game->id)) {
            return response()->json([
                'message' => 'You already own this game'
            ], 400);
        }

        // Check if user has enough balance
        if ($user->balance < $game->price) {
            return response()->json([
                'message' => 'Insufficient balance. Please add funds to your account.',
                'required' => $game->price,
                'current_balance' => $user->balance
            ], 400);
        }

        // Deduct price from balance and add game to library
        if ($user->deductBalance($game->price)) {
            $user->games()->attach($game->id, [
                'purchased_at' => now()
            ]);

            return response()->json([
                'message' => 'Game purchased successfully',
                'data' => new GameResource($game->load('category')),
                'new_balance' => $user->fresh()->balance
            ], 201);
        }

        return response()->json([
            'message' => 'Purchase failed'
        ], 500);
    }

    /**
     * Add funds to user balance
     */
    public function addFunds(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1|max:10000'
        ]);

        $user = $request->user();
        $user->addBalance($request->amount);

        return response()->json([
            'message' => 'Funds added successfully',
            'new_balance' => $user->fresh()->balance
        ]);
    }

    /**
     * Check if user owns a game
     */
    public function checkOwnership(Request $request, Game $game)
    {
        $owns = $request->user()->ownsGame($game->id);

        return response()->json([
            'owns' => $owns
        ]);
    }
}