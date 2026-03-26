<?php

namespace Database\Factories;

use App\Models\Review;
use App\Models\Reservation;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewFactory extends Factory
{
    protected $model = Review::class;

    public function definition(): array
    {
        $reservation = Reservation::factory()->create(['status' => 'completed']);

        return [
            'reservation_id' => $reservation->id,
            'reviewer_id' => $reservation->guest_id,
            'property_id' => $reservation->property_id,
            'host_id' => $reservation->host_id,
            'review_type' => 'guest_to_property',
            'rating' => $this->faker->numberBetween(3, 5),
            'comment' => $this->faker->paragraph,
            'published_at' => $this->faker->dateTime,
        ];
    }
}
