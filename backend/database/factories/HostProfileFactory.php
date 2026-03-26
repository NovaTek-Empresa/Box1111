<?php

namespace Database\Factories;

use App\Models\HostProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class HostProfileFactory extends Factory
{
    protected $model = HostProfile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'creci' => $this->faker->numerify('###########'),
            'bio' => $this->faker->paragraph,
            'status' => $this->faker->randomElement(['pending', 'approved', 'rejected']),
            'total_properties' => $this->faker->numberBetween(1, 20),
            'total_reservations' => $this->faker->numberBetween(5, 500),
            'average_rating' => $this->faker->randomFloat(2, 3.5, 5.0),
            'is_cohost' => $this->faker->boolean(20),
            'verified_at' => $this->faker->dateTime,
        ];
    }
}
