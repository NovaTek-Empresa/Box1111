<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\HostProfile;
use Illuminate\Support\Facades\Hash;

class TestUsersSeeder extends Seeder
{
    public function run(): void
    {
        // Criar usuário Master (Administrador)
        $masterUser = User::create([
            'name' => 'Admin Master',
            'email' => 'admin@box11.com',
            'role' => 'master',
            'phone' => '11999999999',
            'password' => Hash::make('master123'),
            'api_token' => 'master_token_' . bin2hex(random_bytes(20)),
        ]);

        // Criar perfil de host para o master (opcional)
        HostProfile::create([
            'user_id' => $masterUser->id,
            'creci' => 'SP-12345',
            'bio' => 'Administrador master do sistema Box11',
            'status' => 'approved'
        ]);

        // Criar usuário Anfitrião
        $hostUser = User::create([
            'name' => 'Carlos Silva',
            'email' => 'host@box11.com',
            'role' => 'host',
            'phone' => '11888888888',
            'password' => Hash::make('host123'),
            'api_token' => 'host_token_' . bin2hex(random_bytes(20)),
        ]);

        // Criar perfil de host completo
        HostProfile::create([
            'user_id' => $hostUser->id,
            'creci' => 'SP-67890',
            'bio' => 'Anfitrião experiente com mais de 5 anos no mercado imobiliário',
            'document_url' => 'documents/host_' . $hostUser->id . '.pdf',
            'selfie_url' => 'selfies/host_' . $hostUser->id . '.jpg',
            'status' => 'approved'
        ]);

        // Criar usuário Co-anfitrião
        $cohostUser = User::create([
            'name' => 'Ana Santos',
            'email' => 'cohost@box11.com',
            'role' => 'cohost',
            'phone' => '11777777777',
            'password' => Hash::make('cohost123'),
            'api_token' => 'cohost_token_' . bin2hex(random_bytes(20)),
        ]);

        // Criar perfil de co-anfitrião
        HostProfile::create([
            'user_id' => $cohostUser->id,
            'creci' => 'SP-11111',
            'bio' => 'Co-anfitrião especializado em atendimento ao cliente',
            'document_url' => 'documents/cohost_' . $cohostUser->id . '.pdf',
            'selfie_url' => 'selfies/cohost_' . $cohostUser->id . '.jpg',
            'status' => 'approved'
        ]);

        // Criar usuário Comum
        $normalUser = User::create([
            'name' => 'João Oliveira',
            'email' => 'user@box11.com',
            'role' => 'user',
            'phone' => '11666666666',
            'password' => Hash::make('user123'),
            'api_token' => 'user_token_' . bin2hex(random_bytes(20)),
        ]);

        $this->command->info('Usuários de teste criados com sucesso!');
        $this->command->info('Credenciais:');
        $this->command->info('Master: admin@box11.com / master123');
        $this->command->info('Anfitrião: host@box11.com / host123');
        $this->command->info('Co-anfitrião: cohost@box11.com / cohost123');
        $this->command->info('Usuário: user@box11.com / user123');
    }
}
