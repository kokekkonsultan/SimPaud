<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        \App\Models\User::factory()->create([
            'name' => 'Developer',
            'email' => 'developer@sipaud.id',
        ]);

        \App\Models\User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'super.admin@sipaud.id',
        ]);

        \App\Models\User::factory()->create([
            'name' => 'Admin Sekolah',
            'email' => 'admin.sekolah@sipaud.id',
        ]);

        \App\Models\User::factory()->create([
            'name' => 'guru',
            'email' => 'guru@sipaud.id',
        ]);

        \App\Models\User::factory()->create([
            'name' => 'Orang Tua',
            'email' => 'orang.tua@sipaud.id',
        ]);


        DB::table('roles')->insert([
            'name' => 'developer',
            'guard_name' => 'web'
        ]);
        DB::table('roles')->insert([
            'name' => 'super.admin',
            'guard_name' => 'web'
        ]);
        DB::table('roles')->insert([
            'name' => 'admin.sekolah',
            'guard_name' => 'web'
        ]);
        DB::table('roles')->insert([
            'name' => 'guru',
            'guard_name' => 'web'
        ]);
        DB::table('roles')->insert([
            'name' => 'orang.tua',
            'guard_name' => 'web'
        ]);


        DB::table('permissions')->insert([
            'name' => 'create guru',
            'guard_name' => 'web'
        ]);
        DB::table('permissions')->insert([
            'name' => 'edit guru',
            'guard_name' => 'web'
        ]);
        DB::table('permissions')->insert([
            'name' => 'delete guru',
            'guard_name' => 'web'
        ]);


        // developer
        DB::table('role_has_permissions')->insert([
            'permission_id' => 1,
            'role_id' => 1
        ]);
        // super.admin
        DB::table('role_has_permissions')->insert([
            'permission_id' => 2,
            'role_id' => 2
        ]);
        // admin.sekolah
        DB::table('role_has_permissions')->insert([
            'permission_id' => 1,
            'role_id' => 3
        ]);
        // guru
        DB::table('role_has_permissions')->insert([
            'permission_id' => 2,
            'role_id' => 3
        ]);
        // orang.tua
        DB::table('role_has_permissions')->insert([
            'permission_id' => 3,
            'role_id' => 3
        ]);




        // developer
        DB::table('model_has_roles')->insert([
            'role_id' => 1,
            'model_type' => 'App\Models\User',
            'model_id' => 1
        ]);
        // super.admin
        DB::table('model_has_roles')->insert([
            'role_id' => 2,
            'model_type' => 'App\Models\User',
            'model_id' => 2
        ]);
        // admin.sekolah
        DB::table('model_has_roles')->insert([
            'role_id' => 3,
            'model_type' => 'App\Models\User',
            'model_id' => 3
        ]);
        // guru
        DB::table('model_has_roles')->insert([
            'role_id' => 4,
            'model_type' => 'App\Models\User',
            'model_id' => 4
        ]);
        // orang.tua
        DB::table('model_has_roles')->insert([
            'role_id' => 5,
            'model_type' => 'App\Models\User',
            'model_id' => 5
        ]);
    }
}
