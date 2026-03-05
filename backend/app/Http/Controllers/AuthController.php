<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    /**
     * Registra um novo usuário.
     *
     * Espera `name`, `email` e `password` no corpo da requisição.
     * Retorna o usuário criado em JSON (status 201) ou mensagens de erro de validação.
     */
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', Password::defaults()],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        // loga o usuário imediatamente após o registro
        Auth::login($user);

        return response()->json(['user' => $user], 201);
    }

    /**
     * Faz login de um usuário existente.
     *
     * Recebe `email` e `password`. Em caso de sucesso cria sessão e retorna o
     * usuário logado. Se falhar retorna 422 com mensagem.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Credenciais inválidas.'
            ], 422);
        }

        // Regenera a sessão para evitar fixation
        $request->session()->regenerate();

        return response()->json(['user' => Auth::user()]);
    }

    /**
     * Faz logout do usuário autenticado.
     *
     * Remove a sessão e retorna mensagem de confirmação.
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Desconectado com sucesso']);
    }

    /**
     * Retorna os dados do usuário autenticado.
     *
     * Útil para restaurar o estado no frontend após recarregar a página.
     */
    public function me(Request $request)
    {
        return response()->json(['user' => Auth::user()]);
    }
}
