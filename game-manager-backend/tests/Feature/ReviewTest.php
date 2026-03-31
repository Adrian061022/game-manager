<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Game;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test authenticated user can create a review
     */
    public function test_authenticated_user_can_create_review(): void
    {
        // Arrange
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $game = Game::factory()->create([
            'category_id' => $category->id
        ]);

        // Act
        $response = $this->actingAs($user)
            ->postJson("/api/games/{$game->id}/reviews", [
                'rating' => 5,
                'comment' => 'Nagyon jó játék!'
            ]);

        // Assert
        $response->assertStatus(201);
        $response->assertJson([
            'message' => 'Értékelés sikeresen hozzáadva!'
        ]);
        $this->assertDatabaseHas('reviews', [
            'user_id' => $user->id,
            'game_id' => $game->id,
            'rating' => 5,
            'comment' => 'Nagyon jó játék!'
        ]);
    }

    /**
     * Test user cannot review the same game twice
     */
    public function test_user_cannot_review_same_game_twice(): void
    {
        // Arrange
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $game = Game::factory()->create([
            'category_id' => $category->id
        ]);

        // Create first review
        Review::create([
            'user_id' => $user->id,
            'game_id' => $game->id,
            'rating' => 5,
            'comment' => 'Első értékelés'
        ]);

        // Act - Try to create second review
        $response = $this->actingAs($user)
            ->postJson("/api/games/{$game->id}/reviews", [
                'rating' => 4,
                'comment' => 'Második próba'
            ]);

        // Assert
        $response->assertStatus(422);
        $response->assertJson([
            'message' => 'Már értékelted ezt a játékot. Szerkeszd a meglévő értékelést.'
        ]);
    }

    /**
     * Test user can update their own review
     */
    public function test_user_can_update_their_own_review(): void
    {
        // Arrange
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $game = Game::factory()->create([
            'category_id' => $category->id
        ]);
        $review = Review::create([
            'user_id' => $user->id,
            'game_id' => $game->id,
            'rating' => 3,
            'comment' => 'Original comment'
        ]);

        // Act
        $response = $this->actingAs($user)
            ->putJson("/api/games/{$game->id}/reviews/{$review->id}", [
                'rating' => 5,
                'comment' => 'Updated comment'
            ]);

        // Assert
        $response->assertStatus(200);
        $response->assertJson([
            'message' => 'Értékelés frissítve!'
        ]);
        $this->assertDatabaseHas('reviews', [
            'id' => $review->id,
            'rating' => 5,
            'comment' => 'Updated comment'
        ]);
    }

    /**
     * Test user cannot update another user's review
     */
    public function test_user_cannot_update_another_users_review(): void
    {
        // Arrange
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $category = Category::factory()->create();
        $game = Game::factory()->create([
            'category_id' => $category->id
        ]);
        $review = Review::create([
            'user_id' => $user1->id,
            'game_id' => $game->id,
            'rating' => 5,
            'comment' => 'User 1 review'
        ]);

        // Act
        $response = $this->actingAs($user2)
            ->putJson("/api/games/{$game->id}/reviews/{$review->id}", [
                'rating' => 1,
                'comment' => 'Trying to change'
            ]);

        // Assert
        $response->assertStatus(403);
        $response->assertJson([
            'message' => 'Nincs jogosultságod ezt az értékelést módosítani.'
        ]);
    }

    /**
     * Test user can delete their own review
     */
    public function test_user_can_delete_their_own_review(): void
    {
        // Arrange
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $game = Game::factory()->create([
            'category_id' => $category->id
        ]);
        $review = Review::create([
            'user_id' => $user->id,
            'game_id' => $game->id,
            'rating' => 5,
            'comment' => 'Test review'
        ]);

        // Act
        $response = $this->actingAs($user)
            ->deleteJson("/api/games/{$game->id}/reviews/{$review->id}");

        // Assert
        $response->assertStatus(200);
        $response->assertJson([
            'message' => 'Értékelés törölve!'
        ]);
        // Check soft delete - record exists but has deleted_at timestamp
        $this->assertSoftDeleted('reviews', [
            'id' => $review->id
        ]);
    }

    /**
     * Test anyone can view game reviews
     */
    public function test_anyone_can_view_game_reviews(): void
    {
        // Arrange
        $category = Category::factory()->create();
        $game = Game::factory()->create([
            'category_id' => $category->id
        ]);
        $users = User::factory()->count(3)->create();
        
        foreach ($users as $user) {
            Review::create([
                'user_id' => $user->id,
                'game_id' => $game->id,
                'rating' => 5,
                'comment' => 'Great game!'
            ]);
        }

        // Act
        $response = $this->getJson("/api/games/{$game->id}/reviews");

        // Assert
        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
        $response->assertJsonStructure([
            'data',
            'meta' => ['average_rating', 'total_reviews']
        ]);
    }
}
