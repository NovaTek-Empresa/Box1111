<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::get('/', function () {
    $html = file_get_contents(public_path('index.html'));
    $token = csrf_token();
    return str_replace('{{ csrf_token() }}', $token, $html);
});

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

Route::prefix('api')->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class])->group(function () {

    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

});

Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF cookie simulated']);
});

Route::get('/csrf-token', function () {
    return response()->json(['token' => csrf_token()]);
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