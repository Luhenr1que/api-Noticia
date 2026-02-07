<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@test.com',
            'password' => Hash::make('password'),
        ]);

        $users = [
            [
                'name' => 'João Silva',
                'email' => 'joao@test.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Maria Santos',
                'email' => 'maria@test.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Carlos Oliveira',
                'email' => 'carlos@test.com',
                'password' => Hash::make('password'),
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }

        $this->command->info('👥 ' . User::count() . ' users created.');
    }
}