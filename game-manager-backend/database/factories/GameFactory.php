<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Game>
 */
class GameFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Array of possible realistic prices (including some free games)
        $prices = [
            0,      // Free
            0,      // Free (higher chance)
            1990,   // Budget indie
            2990,   // Budget indie
            3990,   // Budget indie
            4990,   // Standard indie
            5990,   // Standard indie
            6990,   // Standard indie
            7990,   // Premium indie
            8990,   // Premium indie
            9990,   // AAA discounted
            11990,  // AAA discounted
            14990,  // AAA standard
            17990,  // AAA standard
            19990,  // AAA premium
            24990,  // AAA premium
            29990,  // AAA deluxe
        ];

        return [
            'title' => fake()->unique()->sentence(3),
            'description' => fake()->paragraph(5),
            'price' => fake()->randomElement($prices),
            'cover_image' => fake()->imageUrl(460, 215, 'games', true),
            'category_id' => \App\Models\Category::factory(),
        ];
    }
}