<?php

namespace Database\Factories;

use App\Models\CoHost;
use App\Models\Property;
use App\Models\HostProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

class CoHostFactory extends Factory
{
    protected $model = CoHost::class;

    public function definition(): array
    {
        return [
            'property_id' => Property::factory(),
            'cohost_id' => HostProfile::factory(),
            'revenue_split_percentage' => $this->faker->numberBetween(10, 40),
            'status' => $this->faker->randomElement(['pending', 'active', 'inactive']),
        ];
    }
}
