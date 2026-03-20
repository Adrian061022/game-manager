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
        return [
            'title' => fake()->unique()->sentence(3),
            'description' => fake()->paragraph(5),
            'price' => fake()->randomFloat(2, 4.99, 59.99),
            'cover_image' => fake()->imageUrl(460, 215, 'games', true),
            'category_id' => \App\Models\Category::factory(),
        ];
    }
}