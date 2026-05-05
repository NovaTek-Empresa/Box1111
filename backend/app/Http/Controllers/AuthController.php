<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Carrega o usuário com relacionamentos necessários pelo frontend.
     */
    private function userWithRelations(User $user): User
    {
        return $user->load('hostProfile');
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
            'phone'    => ['nullable', 'string', 'max:30'],
        ]);

        $apiToken = bin2hex(random_bytes(40));

        $user = User::create([
            'name'      => $data['name'],
            'email'     => $data['email'],
            'phone'     => $data['phone'] ?? null,
            'password'  => Hash::make($data['password']),
            'api_token' => $apiToken,
        ]);

        return response()->json([
            'user'  => $this->userWithRelations($user),
            'token' => $apiToken,
        ], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Credenciais inválidas.'], 401);
        }

        $token          = bin2hex(random_bytes(40));
        $user->api_token = $token;
        $user->save();

        return response()->json([
            'user'  => $this->userWithRelations($user),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $user = $this->userFromToken($request);

        if ($user) {
            $user->api_token = null;
            $user->save();
        }

        return response()->json(['message' => 'Desconectado com sucesso']);
    }

    public function me(Request $request)
    {
        $user = $this->userFromToken($request);

        if (!$user) {
            return response()->json(['message' => 'Não autenticado'], 401);
        }

        return response()->json(['user' => $this->userWithRelations($user)]);
    }

    /**
     * GET /api/user  – usado pelo middleware e pelo frontend para obter o usuário atual.
     */
    public function current(Request $request)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'Não autenticado'], 401);
        }

        return response()->json(['user' => $this->userWithRelations($user)]);
    }

    public function update(Request $request)
    {
        $user = $this->userFromToken($request);

        if (!$user) {
            return response()->json(['message' => 'Não autenticado'], 401);
        }

        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'phone'    => ['nullable', 'string', 'max:30'],
            'password' => ['nullable', 'string', 'min:6', 'confirmed'],
        ]);

        $user->name  = $data['name'];
        $user->email = $data['email'];
        $user->phone = $data['phone'] ?? $user->phone;

        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        $user->save();

        return response()->json(['user' => $this->userWithRelations($user)]);
    }

    private function userFromToken(Request $request): ?User
    {
        $header = $request->bearerToken();

        if (!$header) {
            return null;
        }

        return User::where('api_token', $header)->first();
    }
}
