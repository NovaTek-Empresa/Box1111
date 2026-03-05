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

Route::get('/criar-user', function () {
    $user = User::create([
        'name' => 'Matheus',
        'email' => 'teste@email.com',
        'password' => bcrypt('123456')
    ]);

    return $user;
});