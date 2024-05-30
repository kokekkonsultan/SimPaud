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
        if (!Schema::hasTable('tahun_ajaran')) {
            Schema::create('tahun_ajaran', function (Blueprint $table) {
                $table->id();
                $table->string('nama', 10);
                $table->integer('periode_aktif');
                $table->date('tanggal_mulai');
                $table->date('tanggal_selesai');
                $table->timestamps();

                $table->index('id');
                $table->index('periode_aktif');
            });

            $data = [
                ['id' => 2023, 'nama' => '2023/2024', 'periode_aktif' => 1, 'tanggal_mulai' => '2023-07-01', 'tanggal_selesai' => '2024-06-30', 'created_at' => '2023-07-01 00:00:34'],
            ];
            DB::table('tahun_ajaran')->insert($data);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tahun_ajaran');
    }
};
