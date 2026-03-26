<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition(): array
    {
        $reservation = Reservation::factory()->create();
        $total = $this->faker->randomFloat(2, 100, 5000);

        return [
            'reservation_id' => $reservation->id,
            'payer_id' => User::factory()->create()->id,
            'total_amount' => $total,
            'host_amount' => $total * 0.8,
            'cohost_amount' => 0,
            'platform_fee' => $total * 0.1,
            'payment_method' => $this->faker->randomElement(['credit_card', 'debit_card', 'pix', 'bank_transfer']),
            'status' => $this->faker->randomElement(['pending', 'completed', 'failed']),
            'gateway_transaction_id' => 'TXN_' . uniqid(),
            'processed_at' => now(),
        ];
    }
}
