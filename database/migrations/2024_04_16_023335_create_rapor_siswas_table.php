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
        if (!Schema::hasTable('rapor_siswa')) {
            Schema::create('rapor_siswa', function (Blueprint $table) {
                $table->id();
                $table->integer('id_semester');
                $table->integer('id_kelompok_siswa');
                $table->integer('jasmani_kesehatan');
                $table->longText('narasi_pendahuluan')->nullable();
                $table->longText('narasi_penutup')->nullable();
                $table->integer('izin');
                $table->integer('sakit');
                $table->integer('alpa');
                $table->integer('status');
                $table->integer('dilihat_orang_tua');
                $table->longText('tanggapan_orang_tua')->nullable();
                $table->date('tanggal_tanggapan')->nullable();
                $table->integer('user_id')->nullable();
                $table->integer('role_id')->nullable();
                $table->timestamps();

                $table->index('id');
                $table->index('id_semester');
                $table->index('id_kelompok_siswa');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rapor_siswa');
    }
};
