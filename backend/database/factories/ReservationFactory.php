<?php

namespace Database\Factories;

use App\Models\Reservation;
use App\Models\Property;
use App\Models\HostProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReservationFactory extends Factory
{
    protected $model = Reservation::class;

    public function definition(): array
    {
        $property = Property::inRandomOrder()->first() ?? Property::factory()->create();
        $check_in = $this->faker->dateTimeBetween('now', '+30 days');
        $check_out = $this->faker->dateTimeBetween($check_in, '+60 days');
        $nights = $check_out->diff($check_in)->days;
        $nightly_price = $property->nightly_price ?: $this->faker->randomFloat(2, 50, 300);
        $cleaning_fee = $property->cleaning_fee ?: $this->faker->randomFloat(2, 20, 100);
        $platform_fee = (($nightly_price * $nights) + $cleaning_fee) * 0.10;
        $total = ($nightly_price * $nights) + $cleaning_fee + $platform_fee;

        return [
            'property_id' => $property->id,
            'guest_id' => User::inRandomOrder()->first()?->id ?? User::factory()->create()->id,
            'host_id' => $property->host_id,
            'check_in' => $check_in,
            'check_out' => $check_out,
            'guests_count' => $this->faker->numberBetween(1, 6),
            'nights' => $nights,
            'nightly_price' => $nightly_price,
            'cleaning_fee' => $cleaning_fee,
            'platform_fee' => $platform_fee,
            'total_price' => $total,
            'status' => $this->faker->randomElement(['pending', 'confirmed', 'completed']),
            'guest_notes' => $this->faker->sentence,
        ];
    }
}
