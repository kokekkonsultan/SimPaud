<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('kelompok_usia')) {
            Schema::create('kelompok_usia', function (Blueprint $table) {
                $table->id();
                $table->string('nama', 30)->nullable();
                $table->integer('batas_atas')->nullable();
                $table->integer('batas_bawah')->nullable();
                $table->integer('user_id')->nullable();
                $table->integer('role_id')->nullable();
                $table->timestamps();

                $table->index('id');
            });

            $data = [
                ['id' => 1, 'nama'=> '0 - 1 Tahun', 'batas_atas' => 0, 'batas_bawah' => 1, 'created_at' => '2020-12-07 01:50:30'],
                ['id' => 2, 'nama'=> '1 - 2 Tahun', 'batas_atas' => 1, 'batas_bawah' => 2, 'created_at' => '2020-12-07 01:50:30'],
                ['id' => 3, 'nama'=> '2 - 3 Tahun', 'batas_atas' => 2, 'batas_bawah' => 3, 'created_at' => '2020-12-07 01:50:30'],
                ['id' => 4, 'nama'=> '3 - 4 Tahun', 'batas_atas' => 3, 'batas_bawah' => 4, 'created_at' => '2020-12-07 01:50:30'],
                ['id' => 5, 'nama'=> '4 - 5 Tahun', 'batas_atas' => 4, 'batas_bawah' => 5, 'created_at' => '2020-12-07 01:50:30'],
                ['id' => 6, 'nama'=> '>= 5 Tahun', 'batas_atas' => 5, 'batas_bawah' => 6, 'created_at' => '2020-12-07 01:50:30'],
            ];
            DB::table('kelompok_usia')->insert($data);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kelompok_usia');
    }
};
