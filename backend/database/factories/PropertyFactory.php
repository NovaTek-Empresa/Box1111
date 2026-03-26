<?php

namespace Database\Factories;

use App\Models\Property;
use App\Models\HostProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

class PropertyFactory extends Factory
{
    protected $model = Property::class;

    public function definition(): array
    {
        return [
            'host_id' => HostProfile::factory(),
            'title' => $this->faker->sentence,
            'description' => $this->faker->paragraph(5),
            'property_type' => $this->faker->randomElement(['apartment', 'house', 'condo', 'villa', 'loft']),
            'street_address' => $this->faker->streetAddress,
            'neighborhood' => $this->faker->citySuffix,
            'city' => $this->faker->city,
            'state' => $this->faker->stateAbbr,
            'postal_code' => $this->faker->postcode,
            'latitude' => $this->faker->latitude,
            'longitude' => $this->faker->longitude,
            'bedrooms' => $this->faker->numberBetween(1, 5),
            'bathrooms' => $this->faker->numberBetween(1, 4),
            'guests_capacity' => $this->faker->numberBetween(2, 12),
            'nightly_price' => $this->faker->randomFloat(2, 50, 500),
            'cleaning_fee' => $this->faker->randomFloat(2, 20, 100),
            'amenities' => json_encode(['WiFi', 'TV', 'Kitchen', 'Heating', 'Air Conditioning']),
            'rules' => json_encode(['No smoking', 'No pets', 'No parties']),
            'cancellation_policy' => 'flexible',
            'status' => 'active',
            'image_url' => $this->faker->imageUrl,
            'total_reviews' => $this->faker->numberBetween(0, 100),
            'average_rating' => $this->faker->randomFloat(2, 3.5, 5.0),
            'listed_at' => $this->faker->dateTime,
        ];
    }
}
