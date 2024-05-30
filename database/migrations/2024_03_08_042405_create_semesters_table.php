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
        if (!Schema::hasTable('semester')) {
            Schema::create('semester', function (Blueprint $table) {
                $table->integer('id');
                $table->string('nama', 25);
                $table->integer('id_tahun_ajaran');
                $table->integer('periode_aktif');
                $table->integer('semester');
                $table->date('tanggal_mulai');
                $table->date('tanggal_selesai');
                $table->timestamps();

                $table->index('id');
                $table->index('id_tahun_ajaran');
                $table->index('periode_aktif');
            });

            $data = [
                ['id' => 20231, 'nama' => '2023/2024 Ganjil', 'id_tahun_ajaran' => 2023, 'periode_aktif' => 0, 'semester' => 1, 'tanggal_mulai' => '2023-07-01', 'tanggal_selesai' => '2023-12-30', 'created_at' => '2023-07-01 00:00:34'],
                ['id' => 20232, 'nama' => '2023/2024 Genap', 'id_tahun_ajaran' => 2023, 'periode_aktif' => 1, 'semester' => 2, 'tanggal_mulai' => '2023-12-31', 'tanggal_selesai' => '2024-06-30', 'created_at' => '2023-07-01 00:00:34'],

            ];
            DB::table('semester')->insert($data);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('semester');
    }
};
