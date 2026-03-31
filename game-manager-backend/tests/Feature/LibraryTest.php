<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Game;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LibraryTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test user can purchase a game with sufficient balance
     */
    public function test_user_can_purchase_game_with_sufficient_balance(): void
    {
        // Arrange
        $user = User::factory()->create([
            'balance' => 10000
        ]);
        $category = Category::factory()->create();
        $game = Game::factory()->create([
            'category_id' => $category->id,
            'price' => 5000
        ]);

        // Act
        $response = $this->actingAs($user)
            ->postJson("/api/library/purchase/{$game->id}", [
                'payment_method' => 'balance'
            ]);

        // Assert
        $response->assertStatus(201);
        $response->assertJson([
            'message' => 'Játék sikeresen megvásárolva'
        ]);
        $this->assertDatabaseHas('user_game', [
            'user_id' => $user->id,
            'game_id' => $game->id
        ]);
        $this->assertEquals(5000, $user->fresh()->balance);
    }

    /**
     * Test user cannot purchase game with insufficient balance
     */
    public function test_user_cannot_purchase_game_with_insufficient_balance(): void
    {
        // Arrange
        $user = User::factory()->create([
            'balance' => 1000
        ]);
        $category = Category::factory()->create();
        $game = Game::factory()->create([
            'category_id' => $category->id,
            'price' => 5000
        ]);

        // Act
        $response = $this->actingAs($user)
            ->postJson("/api/library/purchase/{$game->id}", [
                'payment_method' => 'balance'
            ]);

        // Assert
        $response->assertStatus(400);
        $response->assertJson([
            'message' => 'Nincs elég egyenleged. Kérlek, tölts fel a fiókodat.'
        ]);
    }

    /**
     * Test user cannot purchase the same game twice
     */
    public function test_user_cannot_purchase_same_game_twice(): void
    {
        // Arrange
        $user = User::factory()->create([
            'balance' => 20000
        ]);
        $category = Category::factory()->create();
        $game = Game::factory()->create([
            'category_id' => $category->id,
            'price' => 5000
        ]);

        // First purchase
        $user->games()->attach($game->id, ['purchased_at' => now()]);

        // Act - Try to purchase again
        $response = $this->actingAs($user)
            ->postJson("/api/library/purchase/{$game->id}");

        // Assert
        $response->assertStatus(400);
        $response->assertJson([
            'message' => 'Már megvetted ezt a játékot'
        ]);
    }

    /**
     * Test user can add funds to balance
     */
    public function test_user_can_add_funds_to_balance(): void
    {
        // Arrange
        $user = User::factory()->create([
            'balance' => 1000
        ]);

        // Act
        $response = $this->actingAs($user)
            ->postJson('/api/library/add-funds', [
                'amount' => 5000
            ]);

        // Assert
        $response->assertStatus(200);
        $response->assertJson([
            'message' => 'Egyenleg sikeresen feltöltve'
        ]);
        $this->assertEquals(6000, $user->fresh()->balance);
    }

    /**
     * Test user can view their library
     */
    public function test_user_can_view_their_library(): void
    {
        // Arrange
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $games = Game::factory()->count(3)->create([
            'category_id' => $category->id
        ]);
        
        foreach ($games as $game) {
            $user->games()->attach($game->id, ['purchased_at' => now()]);
        }

        // Act
        $response = $this->actingAs($user)->getJson('/api/library');

        // Assert
        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }
}
