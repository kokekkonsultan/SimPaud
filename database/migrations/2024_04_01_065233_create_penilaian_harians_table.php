<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('penilaian_harian')) {
            Schema::create('penilaian_harian', function (Blueprint $table) {
                $table->id();
                $table->date('tanggal');
                $table->integer('id_kelompok_siswa');
                $table->integer('id_indikator');
                $table->char('muncul', 3)->nullable();
                $table->longText('catatan')->nullable();
                $table->string('foto', 100)->nullable();
                $table->integer('role_id')->nullable();
                $table->integer('user_id')->nullable();
                $table->timestamps();

                $table->index('id');
                $table->index('tanggal');
                $table->index('id_kelompok_siswa');
                $table->index('id_indikator');
                $table->index('muncul');
                $table->index('catatan');
                $table->index('foto');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penilaian_harian');
    }
};
