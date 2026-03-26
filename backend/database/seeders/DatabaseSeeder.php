<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\HostProfile;
use App\Models\Property;
use App\Models\Reservation;
use App\Models\Review;
use App\Models\Favorite;
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
        // Create test users
        $testUser = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
            'phone' => '11999999999'
        ]);

        $adminUser = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password123'),
            'phone' => '11988888888'
        ]);

        // Create 10 regular guest users
        $users = User::factory(10)->create();

        // Create 5 host users with profiles and properties
        for ($i = 0; $i < 5; $i++) {
            $hostUser = User::factory()->create();
            $hostProfile = HostProfile::factory()->create(['user_id' => $hostUser->id]);

            // Create 3 properties per host
            for ($j = 0; $j < 3; $j++) {
                Property::factory()->create(['host_id' => $hostProfile->id]);
            }
        }

        // Create 10 reservations
        Reservation::factory(10)->create();

        // Create some favorites
        foreach ($users->random(5) as $user) {
            foreach (Property::inRandomOrder()->limit(3)->get() as $property) {
                Favorite::create([
                    'user_id' => $user->id,
                    'property_id' => $property->id
                ]);
            }
        }

        $this->command->info('Database seeded successfully with test data!');
    }
}


