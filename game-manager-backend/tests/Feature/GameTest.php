<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Game;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GameTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that the games index endpoint returns a list of games.
     */
    public function test_returns_all_games(): void
    {
        // Arrange
        $category = Category::factory()->create([
            'name' => 'Action',
            'slug' => 'action'
        ]);
        
        $games = Game::factory()->count(5)->create([
            'category_id' => $category->id
        ]);
        
        // Act
        $response = $this->getJson('api/games');
        
        // Assert
        $response->assertStatus(200);
        $this->assertGreaterThan(0, count($response->json('data')));
    }
}
