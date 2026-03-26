<?php

use Illuminate\Support\Facades\Route;

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