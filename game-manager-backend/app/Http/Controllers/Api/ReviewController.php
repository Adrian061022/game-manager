<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Game;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Get all reviews for a game
     */
    public function index(Game $game)
    {
        $reviews = $game->reviews()
            ->with('user:id,name,profile_picture')
            ->orderBy('created_at', 'desc')
            ->get();

        $averageRating = $reviews->avg('rating');
        $totalReviews = $reviews->count();

        return response()->json([
            'data' => $reviews,
            'meta' => [
                'average_rating' => $averageRating ? round($averageRating, 1) : 0,
                'total_reviews' => $totalReviews,
            ]
        ]);
    }

    /**
     * Store a new review
     */
    public function store(Request $request, Game $game)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        // Check if user already reviewed this game
        $existingReview = Review::where('user_id', $request->user()->id)
            ->where('game_id', $game->id)
            ->first();

        if ($existingReview) {
            return response()->json([
                'message' => 'Már értékelted ezt a játékot. Szerkeszd a meglévő értékelést.',
            ], 422);
        }

        $review = Review::create([
            'user_id' => $request->user()->id,
            'game_id' => $game->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        $review->load('user:id,name,profile_picture');

        return response()->json([
            'message' => 'Értékelés sikeresen hozzáadva!',
            'data' => $review,
        ], 201);
    }

    /**
     * Update a review
     */
    public function update(Request $request, Game $game, Review $review)
    {
        // Check if user is the owner or admin
        if ($review->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Nincs jogosultságod ezt az értékelést módosítani.',
            ], 403);
        }

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $review->update([
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        $review->load('user:id,name,profile_picture');

        return response()->json([
            'message' => 'Értékelés frissítve!',
            'data' => $review,
        ]);
    }

    /**
     * Delete a review
     */
    public function destroy(Request $request, Game $game, Review $review)
    {
        // Check if user is the owner or admin
        if ($review->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Nincs jogosultságod ezt az értékelést törölni.',
            ], 403);
        }

        $review->delete();

        return response()->json([
            'message' => 'Értékelés törölve!',
        ]);
    }
}