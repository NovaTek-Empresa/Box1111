<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\CoHostController;
use App\Http\Controllers\Api\HostProfileController;

// Authentication endpoints (no CSRF protection)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('authenticate-bearer');

Route::put('/user', [AuthController::class, 'update'])->middleware('authenticate-bearer');

// Public routes
Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{property}', [PropertyController::class, 'show']);
Route::get('/host-profiles', [HostProfileController::class, 'index']);
Route::get('/host-profiles/{host_profile}', [HostProfileController::class, 'show']);
Route::get('/reviews', [ReviewController::class, 'index']);

// Protected routes (require authentication)
Route::middleware('authenticate-bearer')->group(function () {
    Route::post('/host-profiles', [HostProfileController::class, 'store']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Properties
    Route::post('/properties', [PropertyController::class, 'store']);
    Route::put('/properties/{property}', [PropertyController::class, 'update']);
    Route::delete('/properties/{property}', [PropertyController::class, 'destroy']);
    Route::get('/properties/{property}/availability', [PropertyController::class, 'availability']);

    // Reservations
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::get('/reservations/{reservation}', [ReservationController::class, 'show']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::post('/reservations/{reservation}/confirm', [ReservationController::class, 'confirm']);
    Route::post('/reservations/{reservation}/cancel', [ReservationController::class, 'cancel']);
    Route::post('/reservations/{reservation}/checkin', [ReservationController::class, 'checkin']);
    Route::post('/reservations/{reservation}/checkout', [ReservationController::class, 'checkout']);

    // Payments
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::get('/payments/{payment}', [PaymentController::class, 'show']);
    Route::post('/payments', [PaymentController::class, 'store']);
    Route::get('/payments/{payment}/status', [PaymentController::class, 'status']);
    Route::post('/payments/{payment}/refund', [PaymentController::class, 'refund']);

    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

    // Favorites
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{favorite}', [FavoriteController::class, 'destroy']);
    Route::get('/favorites/check', [FavoriteController::class, 'check']);

    // Co-hosts
    Route::get('/properties/{property}/cohosts', [CoHostController::class, 'index']);
    Route::post('/cohosts', [CoHostController::class, 'store']);
    Route::put('/cohosts/{coHost}', [CoHostController::class, 'update']);
    Route::delete('/cohosts/{coHost}', [CoHostController::class, 'destroy']);
    Route::post('/cohosts/{coHost}/accept', [CoHostController::class, 'accept']);
});

