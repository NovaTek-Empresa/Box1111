<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Teste da API
|--------------------------------------------------------------------------
*/

Route::get('/api/teste', function () {
    return response()->json([
        'status' => 'ok',
        'mensagem' => 'API funcionando'
    ]);
});

/*
|--------------------------------------------------------------------------
| Autenticação
|--------------------------------------------------------------------------
*/

Route::prefix('api')->group(function () {

    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth')->group(function () {
        Route::get('/user', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

});

/*
|--------------------------------------------------------------------------
| Resposta padrão quando não autenticado
|--------------------------------------------------------------------------
*/

Route::get('/login', function () {
    return response()->json([
        'message' => 'Unauthenticated'
    ], 401);
})->name('login');