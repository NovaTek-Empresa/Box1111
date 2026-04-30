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
use App\Http\Controllers\Api\WebhookController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\BankAccountController;
use App\Http\Controllers\Api\PayoutController;
use App\Http\Controllers\Api\ConversationController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\PromotionController;
use App\Http\Controllers\Api\ReportController;

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

// Webhooks (public routes - no authentication needed)
Route::post('/webhooks/mercadopago', [WebhookController::class, 'mercadoPago']);
Route::get('/webhooks/mercadopago/health', [WebhookController::class, 'health']);

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

    // Users (Admin only for most operations)
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);
    Route::get('/users/{user}/documents', [UserController::class, 'documents']);
    Route::post('/users/{user}/documents', [UserController::class, 'uploadDocument']);
    Route::put('/users/{user}/documents/{document}', [UserController::class, 'verifyDocument']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::get('/notifications/{notification}', [NotificationController::class, 'show']);
    Route::put('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);

    // Bank Accounts
    Route::get('/bank-accounts', [BankAccountController::class, 'index']);
    Route::post('/bank-accounts', [BankAccountController::class, 'store']);
    Route::get('/bank-accounts/{bankAccount}', [BankAccountController::class, 'show']);
    Route::put('/bank-accounts/{bankAccount}', [BankAccountController::class, 'update']);
    Route::delete('/bank-accounts/{bankAccount}', [BankAccountController::class, 'destroy']);
    Route::put('/bank-accounts/{bankAccount}/set-default', [BankAccountController::class, 'setDefault']);

    // Payouts
    Route::get('/payouts', [PayoutController::class, 'index']);
    Route::get('/payouts/summary', [PayoutController::class, 'summary']);
    Route::post('/payouts', [PayoutController::class, 'store']);
    Route::get('/payouts/{payout}', [PayoutController::class, 'show']);
    Route::put('/payouts/{payout}', [PayoutController::class, 'update']);
    Route::delete('/payouts/{payout}', [PayoutController::class, 'destroy']);

    // Conversations
    Route::get('/conversations', [ConversationController::class, 'index']);
    Route::get('/conversations/unread-count', [ConversationController::class, 'unreadCount']);
    Route::post('/conversations', [ConversationController::class, 'store']);
    Route::get('/conversations/{conversation}', [ConversationController::class, 'show']);
    Route::put('/conversations/{conversation}', [ConversationController::class, 'update']);
    Route::delete('/conversations/{conversation}', [ConversationController::class, 'destroy']);
    Route::put('/conversations/{conversation}/read', [ConversationController::class, 'markAsRead']);
    Route::put('/conversations/{conversation}/archive', [ConversationController::class, 'archive']);
    Route::put('/conversations/{conversation}/unarchive', [ConversationController::class, 'unarchive']);

    // Messages
    Route::get('/messages', [MessageController::class, 'index']);
    Route::post('/messages', [MessageController::class, 'store']);
    Route::get('/messages/{message}', [MessageController::class, 'show']);
    Route::put('/messages/{message}', [MessageController::class, 'update']);
    Route::delete('/messages/{message}', [MessageController::class, 'destroy']);
    Route::put('/messages/{message}/read', [MessageController::class, 'markAsRead']);
    Route::get('/messages/{message}/download', [MessageController::class, 'downloadFile']);
    Route::post('/messages/typing', [MessageController::class, 'typing']);

    // Promotions
    Route::get('/promotions', [PromotionController::class, 'index']);
    Route::post('/promotions/validate', [PromotionController::class, 'validate']);
    Route::post('/promotions/use', [PromotionController::class, 'use']);
    Route::get('/promotions/{promotion}', [PromotionController::class, 'show']);
    Route::post('/promotions', [PromotionController::class, 'store']);
    Route::put('/promotions/{promotion}', [PromotionController::class, 'update']);
    Route::delete('/promotions/{promotion}', [PromotionController::class, 'destroy']);
    Route::get('/promotions/{promotion}/usage', [PromotionController::class, 'usage']);

    // Reports
    Route::get('/reports', [ReportController::class, 'index']);
    Route::get('/reports/statistics', [ReportController::class, 'statistics']);
    Route::post('/reports/bulk-update', [ReportController::class, 'bulkUpdate']);
    Route::get('/reports/my-reports', [ReportController::class, 'myReports']);
    Route::post('/reports', [ReportController::class, 'store']);
    Route::get('/reports/{report}', [ReportController::class, 'show']);
    Route::put('/reports/{report}', [ReportController::class, 'update']);
    Route::delete('/reports/{report}', [ReportController::class, 'destroy']);
});

