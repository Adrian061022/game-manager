<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'balance' => 1000.00,
        ]);

        // Create regular test user
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'user@example.com',
            'password' => bcrypt('password'),
            'role' => 'user',
            'balance' => 500.00,
        ]);

        // Create categories with real game genres
        $action = \App\Models\Category::create(['name' => 'Action', 'slug' => 'action']);
        $rpg = \App\Models\Category::create(['name' => 'RPG', 'slug' => 'rpg']);
        $strategy = \App\Models\Category::create(['name' => 'Strategy', 'slug' => 'strategy']);
        $survival = \App\Models\Category::create(['name' => 'Survival', 'slug' => 'survival']);
        $shooter = \App\Models\Category::create(['name' => 'Shooter', 'slug' => 'shooter']);
        $racing = \App\Models\Category::create(['name' => 'Racing', 'slug' => 'racing']);

        // Create real games with Steam header images
        $games = [
            [
                'title' => 'Counter-Strike 2',
                'description' => 'For over two decades, Counter-Strike has offered an elite competitive experience, one shaped by millions of players from across the globe. And now the next chapter in the CS story is about to begin. This is Counter-Strike 2.',
                'price' => 0,
                'cover_image' => 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',
                'category_id' => $shooter->id,
            ],
            [
                'title' => 'Elden Ring',
                'description' => 'THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.',
                'price' => 14990,
                'cover_image' => 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg',
                'category_id' => $rpg->id,
            ],
            [
                'title' => 'Red Dead Redemption 2',
                'description' => 'Winner of over 175 Game of the Year Awards and recipient of over 250 perfect scores, RDR2 is the epic tale of outlaw Arthur Morgan and the infamous Van der Linde gang, on the run across America at the dawn of the modern age.',
                'price' => 17990,
                'cover_image' => 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg',
                'category_id' => $action->id,
            ],
            [
                'title' => 'Cyberpunk 2077',
                'description' => 'Cyberpunk 2077 is an open-world, action-adventure RPG set in the dark future of Night City — a dangerous megalopolis obsessed with power, glamor, and ceaseless body modification.',
                'price' => 11990,
                'cover_image' => 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg',
                'category_id' => $rpg->id,
            ],
            [
                'title' => 'The Witcher 3: Wild Hunt',
                'description' => 'You are Geralt of Rivia, mercenary monster slayer. Before you stands a war-torn, monster-infested continent you can explore at will. Your current contract? Tracking down Ciri — the Child of Prophecy, a living weapon that can alter the shape of the world.',
                'price' => 9990,
                'cover_image' => 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg',
                'category_id' => $rpg->id,
            ],
            [
                'title' => 'Grand Theft Auto V',
                'description' => 'When a young street hustler, a retired bank robber and a terrifying psychopath find themselves entangled with some of the most frightening and deranged elements of the criminal underworld, the U.S. government and the entertainment industry, they must pull off a series of dangerous heists to survive.',
                'price' => 7990,
                'cover_image' => 'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg',
                'category_id' => $action->id,
            ],
            [
                'title' => 'Baldur\'s Gate 3',
                'description' => 'Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power.',
                'price' => 19990,
                'cover_image' => 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg',
                'category_id' => $rpg->id,
            ],
            [
                'title' => 'Palworld',
                'description' => 'Fight, farm, build and work alongside mysterious creatures called "Pals" in this completely new multiplayer, open-world survival and crafting game!',
                'price' => 8990,
                'cover_image' => 'https://cdn.cloudflare.steamstatic.com/steam/apps/1623730/header.jpg',
                'category_id' => $survival->id,
            ],
            [
                'title' => 'Civilization VI',
                'description' => 'Civilization VI is the newest installment in the award winning Civilization Franchise. Expand your empire, advance your culture and go head-to-head against history\'s greatest leaders. Will your civilization stand the test of time?',
                'price' => 14990,
                'cover_image' => 'https://cdn.cloudflare.steamstatic.com/steam/apps/289070/header.jpg',
                'category_id' => $strategy->id,
            ],
            [
                'title' => 'Forza Horizon 5',
                'description' => 'Your Ultimate Horizon Adventure awaits! Explore the vibrant and ever-evolving open world landscapes of Mexico with limitless, fun driving action in hundreds of the world\'s greatest cars.',
                'price' => 17990,
                'cover_image' => 'https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/header.jpg',
                'category_id' => $racing->id,
            ],
            [
                'title' => 'Hades',
                'description' => 'Defy the god of the dead as you hack and slash out of the Underworld in this rogue-like dungeon crawler from the creators of Bastion, Transistor, and Pyre.',
                'price' => 5990,
                'cover_image' => 'https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg',
                'category_id' => $action->id,
            ],
            [
                'title' => 'Sekiro: Shadows Die Twice',
                'description' => 'Carve your own clever path to vengeance in the award winning adventure from developer FromSoftware, creators of Bloodborne and the Dark Souls series.',
                'price' => 14990,
                'cover_image' => 'https://cdn.cloudflare.steamstatic.com/steam/apps/814380/header.jpg',
                'category_id' => $action->id,
            ],
        ];

        foreach ($games as $gameData) {
            \App\Models\Game::create($gameData);
        }
    }
}