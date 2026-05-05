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

/*
|--------------------------------------------------------------------------
| Rotas para páginas estáticas
|--------------------------------------------------------------------------
*/

Route::get('/admin/{path?}', function ($path = 'index.html') {
    $fullPath = public_path("admin/{$path}");
    if (!file_exists($fullPath)) {
        $fullPath = public_path("admin/index.html");
    }
    if (file_exists($fullPath)) {
        return response()->file($fullPath);
    }
    abort(404);
})->where('path', '.*');

Route::get('/vendor/{path?}', function ($path = 'index.html') {
    $fullPath = public_path("vendor/{$path}");
    if (!file_exists($fullPath)) {
        $fullPath = public_path("vendor/index.html");
    }
    if (file_exists($fullPath)) {
        return response()->file($fullPath);
    }
    abort(404);
})->where('path', '.*');

Route::get('/cohost/{path?}', function ($path = 'index.html') {
    $fullPath = public_path("cohost/{$path}");
    if (!file_exists($fullPath)) {
        $fullPath = public_path("cohost/index.html");
    }
    if (file_exists($fullPath)) {
        return response()->file($fullPath);
    }
    abort(404);
})->where('path', '.*');