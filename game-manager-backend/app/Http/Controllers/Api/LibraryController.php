<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GameResource;
use App\Models\Game;
use App\Models\Transaction;
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
                'message' => 'Már megvetted ezt a játékot'
            ], 400);
        }

        // Get payment method from request (default: 'balance')
        $paymentMethod = $request->input('payment_method', 'balance');

        // Only check and deduct balance if paying with balance
        if ($paymentMethod === 'balance') {
            // Check if user has enough balance
            if ($user->balance < $game->price) {
                return response()->json([
                    'message' => 'Nincs elég egyenleged. Kérlek, tölts fel a fiókodat.',
                    'required' => $game->price,
                    'current_balance' => $user->balance
                ], 400);
            }

            // Deduct price from balance
            $user->deductBalance($game->price);
        }

        // Add game to library
        $user->games()->attach($game->id, [
            'purchased_at' => now()
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'type'    => 'purchase',
            'amount'  => $game->price,
            'game_id' => $game->id,
            'payment_method' => $paymentMethod,
        ]);

        return response()->json([
            'message' => 'Játék sikeresen megvásárolva',
            'data' => new GameResource($game->load('category')),
            'new_balance' => $user->fresh()->balance
        ], 201);
    }

    /**
     * Add funds to user balance
     */
    public function addFunds(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:100|max:500000'
        ]);

        $user = $request->user();
        $user->addBalance($request->amount);

        Transaction::create([
            'user_id' => $user->id,
            'type'    => 'top_up',
            'amount'  => $request->amount,
            'game_id' => null,
        ]);

        return response()->json([
            'message' => 'Egyenleg sikeresen feltöltve',
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

    /**
     * Get a user's public library by user ID
     */
    public function getUserLibrary($userId)
    {
        $user = \App\Models\User::find($userId);

        if (!$user) {
            return response()->json([
                'message' => 'Felhasználó nem található'
            ], 404);
        }

        // Check if profile is public
        if (!$user->is_public) {
            return response()->json([
                'message' => 'Ennek a felhasználónak a profilja privát',
                'data' => []
            ], 403);
        }

        $games = $user->games()->with('category')->get();

        return GameResource::collection($games);
    }
}