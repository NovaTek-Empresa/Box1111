<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/teste', function () {
    return response()->json([
        'status' => 'ok',
        'mensagem' => 'API funcionando'
    ]);
});

use App\Models\User;
use App\Http\Controllers\AuthController;

Route::get('/criar-user', function () {
    $user = User::create([
        'name' => 'Matheus',
        'email' => 'teste@email.com',
        'password' => bcrypt('123456')
    ]);

    return $user;
});

// rotas de autenticação JSON (frontend consumirá via fetch)
Route::prefix('api')
    // o grupo "web" aplica CSRF por padrão, então removemos o middleware
    // para evitar retornos HTML (419) quando o frontend não envia token.
    ->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class)
    ->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login',    [AuthController::class, 'login']);
        Route::post('logout',   [AuthController::class, 'logout'])->middleware('auth');
        Route::get('user',      [AuthController::class, 'me'])->middleware('auth');
});