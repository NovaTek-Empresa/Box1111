<?php

namespace Tests\Integration;

use App\Models\User;
use App\Models\HostProfile;
use App\Models\Property;
use App\Models\Reservation;
use App\Models\Payment;
use App\Models\Review;
use App\Models\Favorite;
use App\Models\CoHost;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ApiIntegrationTest extends TestCase
{
    use RefreshDatabase;

    private $user;
    private $host;
    private $hostProfile;
    private $property;
    private $token;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test users
        $this->user = User::factory()->create([
            'email' => 'guest@test.com',
            'api_token' => \Str::random(80)
        ]);

        $hostUser = User::factory()->create([
            'email' => 'host@test.com',
            'api_token' => \Str::random(80)
        ]);

        $this->hostProfile = HostProfile::factory()->create(['user_id' => $hostUser->id]);
        $this->property = Property::factory()->create(['host_id' => $this->hostProfile->id]);
        $this->token = 'Bearer ' . $this->user->api_token;
    }

    /** @test */
    public function test_auth_login_flow()
    {
        $user = User::factory()->create([
            'email' => 'login@test.com',
            'password' => bcrypt('password123')
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'login@test.com',
            'password' => 'password123'
        ]);

        $response->assertOk()
            ->assertJsonStructure(['user', 'token'])
            ->assertJsonPath('user.email', 'login@test.com');
    }

    /** @test */
    public function test_auth_login_invalid_credentials()
    {
        $response = $this->postJson('/api/login', [
            'email' => 'nonexistent@test.com',
            'password' => 'wrongpassword'
        ]);

        $response->assertUnauthorized();
    }

    /** @test */
    public function test_auth_register_flow()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'New User',
            'email' => 'newuser@test.com',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ]);

        $response->assertCreated()
            ->assertJsonStructure(['user', 'token'])
            ->assertJsonPath('user.name', 'New User');

        $this->assertDatabaseHas('users', ['email' => 'newuser@test.com']);
    }

    /** @test */
    public function test_get_authenticated_user()
    {
        $response = $this->getJson('/api/user', [
            'Authorization' => $this->token
        ]);

        $response->assertOk()
            ->assertJsonPath('email', $this->user->email)
            ->assertJsonPath('name', $this->user->name);
    }

    /** @test */
    public function test_logout_clears_token()
    {
        $response = $this->postJson('/api/logout', [], [
            'Authorization' => $this->token
        ]);

        $response->assertOk();
    }

    /** @test */
    public function test_get_all_properties_public()
    {
        Property::factory(5)->create();

        $response = $this->getJson('/api/properties');

        $response->assertOk()
            ->assertJsonStructure(['data', 'meta']);
    }

    /** @test */
    public function test_get_property_by_id()
    {
        $response = $this->getJson("/api/properties/{$this->property->id}");

        $response->assertOk()
            ->assertJsonPath('id', $this->property->id)
            ->assertJsonPath('title', $this->property->title);
    }

    /** @test */
    public function test_search_properties_by_city()
    {
        $response = $this->getJson('/api/properties?city=' . $this->property->city);

        $response->assertOk()
            ->assertJsonStructure(['data']);
    }

    /** @test */
    public function test_create_property_requires_auth()
    {
        $response = $this->postJson('/api/properties', [
            'title' => 'New Property',
            'description' => 'A beautiful property',
            'property_type' => 'apartment',
            'city' => 'São Paulo',
            'state' => 'SP',
            'bedrooms' => 2,
            'bathrooms' => 1,
            'guests_capacity' => 4,
            'nightly_price' => 150.00
        ]);

        $response->assertUnauthorized();
    }

    /** @test */
    public function test_create_property_authenticated()
    {
        // Create host profile for this user first
        HostProfile::factory()->create(['user_id' => $this->user->id]);

        $response = $this->postJson('/api/properties', [
            'title' => 'New Property',
            'description' => 'A beautiful property',
            'property_type' => 'apartment',
            'city' => 'São Paulo',
            'state' => 'SP',
            'bedrooms' => 2,
            'bathrooms' => 1,
            'guests_capacity' => 4,
            'nightly_price' => 150.00
        ], ['Authorization' => $this->token]);

        $response->assertCreated()
            ->assertJsonPath('title', 'New Property');

        $this->assertDatabaseHas('properties', ['title' => 'New Property']);
    }

    /** @test */
    public function test_create_reservation()
    {
        $response = $this->postJson('/api/reservations', [
            'property_id' => $this->property->id,
            'check_in' => now()->addDays(5)->format('Y-m-d'),
            'check_out' => now()->addDays(10)->format('Y-m-d'),
            'guests_count' => 2,
            'guest_notes' => 'Looking forward to the stay'
        ], ['Authorization' => $this->token]);

        $response->assertCreated()
            ->assertJsonPath('status', 'pending')
            ->assertJsonPath('guests_count', 2);

        $this->assertDatabaseHas('reservations', [
            'property_id' => $this->property->id,
            'guest_id' => $this->user->id,
            'status' => 'pending'
        ]);
    }

    /** @test */
    public function test_create_reservation_invalid_dates()
    {
        $response = $this->postJson('/api/reservations', [
            'property_id' => $this->property->id,
            'check_in' => now()->addDays(10)->format('Y-m-d'),
            'check_out' => now()->addDays(5)->format('Y-m-d'),
            'guests_count' => 2
        ], ['Authorization' => $this->token]);

        $response->assertUnprocessable();
    }

    /** @test */
    public function test_confirm_reservation()
    {
        $reservation = Reservation::factory()->create([
            'guest_id' => $this->user->id,
            'property_id' => $this->property->id,
            'status' => 'pending'
        ]);

        $response = $this->postJson(
            "/api/reservations/{$reservation->id}/confirm",
            [],
            ['Authorization' => 'Bearer ' . $this->hostProfile->user->api_token]
        );

        $response->assertOk()
            ->assertJsonPath('status', 'confirmed');

        $this->assertDatabaseHas('reservations', [
            'id' => $reservation->id,
            'status' => 'confirmed'
        ]);
    }

    /** @test */
    public function test_cancel_reservation()
    {
        $reservation = Reservation::factory()->create([
            'guest_id' => $this->user->id,
            'status' => 'pending'
        ]);

        $response = $this->postJson(
            "/api/reservations/{$reservation->id}/cancel",
            ['reason' => 'Guest requested cancellation'],
            ['Authorization' => $this->token]
        );

        $response->assertOk()
            ->assertJsonPath('status', 'cancelled');
    }

    /** @test */
    public function test_complete_payment_flow()
    {
        $reservation = Reservation::factory()->create([
            'guest_id' => $this->user->id,
            'property_id' => $this->property->id,
            'total_price' => 500.00,
            'status' => 'confirmed'
        ]);

        $response = $this->postJson('/api/payments', [
            'reservation_id' => $reservation->id,
            'payment_method' => 'credit'
        ], ['Authorization' => $this->token]);

        $response->assertCreated()
            ->assertJsonPath('status', 'pending')
            ->assertJsonPath('total_amount', 500.00);

        $this->assertDatabaseHas('payments', [
            'reservation_id' => $reservation->id,
            'payer_id' => $this->user->id
        ]);
    }

    /** @test */
    public function test_get_payment_status()
    {
        $payment = Payment::factory()->create([
            'status' => 'completed'
        ]);

        $response = $this->getJson(
            "/api/payments/{$payment->id}/status",
            ['Authorization' => $this->token]
        );

        $response->assertOk()
            ->assertJsonPath('status', 'completed');
    }

    /** @test */
    public function test_create_review_after_completion()
    {
        $reservation = Reservation::factory()->create([
            'guest_id' => $this->user->id,
            'property_id' => $this->property->id,
            'status' => 'completed'
        ]);

        $response = $this->postJson('/api/reviews', [
            'reservation_id' => $reservation->id,
            'review_type' => 'guest_to_property',
            'rating' => 5,
            'comment' => 'Amazing property! Highly recommended.'
        ], ['Authorization' => $this->token]);

        $response->assertCreated()
            ->assertJsonPath('rating', 5)
            ->assertJsonPath('review_type', 'guest_to_property');

        $this->assertDatabaseHas('reviews', [
            'reservation_id' => $reservation->id,
            'reviewer_id' => $this->user->id
        ]);
    }

    /** @test */
    public function test_cannot_review_incomplete_reservation()
    {
        $reservation = Reservation::factory()->create([
            'guest_id' => $this->user->id,
            'status' => 'pending'
        ]);

        $response = $this->postJson('/api/reviews', [
            'reservation_id' => $reservation->id,
            'review_type' => 'guest_to_property',
            'rating' => 5,
            'comment' => 'Test'
        ], ['Authorization' => $this->token]);

        $response->assertBadRequest();
    }

    /** @test */
    public function test_add_property_to_favorites()
    {
        $response = $this->postJson('/api/favorites', [
            'property_id' => $this->property->id
        ], ['Authorization' => $this->token]);

        $response->assertCreated();

        $this->assertDatabaseHas('favorites', [
            'user_id' => $this->user->id,
            'property_id' => $this->property->id
        ]);
    }

    /** @test */
    public function test_remove_from_favorites()
    {
        $favorite = Favorite::factory()->create([
            'user_id' => $this->user->id,
            'property_id' => $this->property->id
        ]);

        $response = $this->deleteJson(
            "/api/favorites/{$favorite->id}",
            [],
            ['Authorization' => $this->token]
        );

        $response->assertOk();

        $this->assertDatabaseMissing('favorites', ['id' => $favorite->id]);
    }

    /** @test */
    public function test_get_user_favorites()
    {
        Favorite::factory(3)->create(['user_id' => $this->user->id]);

        $response = $this->getJson('/api/favorites', [
            'Authorization' => $this->token
        ]);

        $response->assertOk()
            ->assertJsonStructure(['data', 'meta']);
    }

    /** @test */
    public function test_create_cohost_assignment()
    {
        $cohostUser = User::factory()->create();
        $cohostProfile = HostProfile::factory()->create(['user_id' => $cohostUser->id]);

        $response = $this->postJson('/api/cohosts', [
            'property_id' => $this->property->id,
            'cohost_id' => $cohostProfile->id,
            'revenue_split_percentage' => 20
        ], ['Authorization' => 'Bearer ' . $this->hostProfile->user->api_token]);

        $response->assertCreated()
            ->assertJsonPath('status', 'pending')
            ->assertJsonPath('revenue_split_percentage', 20);

        $this->assertDatabaseHas('co_hosts', [
            'property_id' => $this->property->id,
            'cohost_id' => $cohostProfile->id
        ]);
    }

    /** @test */
    public function test_cohost_accept_invitation()
    {
        $cohost = CoHost::factory()->create([
            'property_id' => $this->property->id,
            'status' => 'pending'
        ]);

        $response = $this->postJson(
            "/api/cohosts/{$cohost->id}/accept",
            [],
            ['Authorization' => 'Bearer ' . $cohost->cohost->user->api_token]
        );

        $response->assertOk()
            ->assertJsonPath('status', 'active');
    }

    /** @test */
    public function test_get_user_reservations()
    {
        Reservation::factory(3)->create(['guest_id' => $this->user->id]);

        $response = $this->getJson('/api/reservations', [
            'Authorization' => $this->token
        ]);

        $response->assertOk()
            ->assertJsonStructure(['data', 'meta']);
    }

    /** @test */
    public function test_get_host_reservations()
    {
        Reservation::factory(3)->create(['host_id' => $this->hostProfile->id]);

        $response = $this->getJson(
            '/api/reservations?as=host',
            ['Authorization' => 'Bearer ' . $this->hostProfile->user->api_token]
        );

        $response->assertOk()
            ->assertJsonStructure(['data', 'meta']);
    }

    /** @test */
    public function test_csrf_token_endpoint()
    {
        $response = $this->getJson('/csrf-token');

        $response->assertOk()
            ->assertJsonStructure(['token']);
    }
}
