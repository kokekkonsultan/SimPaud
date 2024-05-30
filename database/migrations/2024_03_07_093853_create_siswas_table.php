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
        if (!Schema::hasTable('siswa')) {
            Schema::create('siswa', function (Blueprint $table) {
                $table->id();
                $table->integer('id_user');
                $table->integer('id_tahun_ajaran');
                $table->date('tanggal_masuk');
                $table->integer('id_sekolah');
                $table->string('nama_lengkap', 50);
                $table->string('nama_panggilan', 20);
                $table->string('no_induk', 10);
                $table->string('nisn', 10)->nullable();
                $table->char('jenis_kelamin', 1);
                $table->integer('id_agama');
                $table->string('tempat_lahir', 50);
                $table->date('tanggal_lahir');
                $table->string('hobi', 255)->nullable();
                $table->integer('anak_ke');
                $table->string('nama_ayah', 50);
                $table->string('pekerjaan_ayah', 50)->nullable();
                $table->string('no_telpon_ayah', 20);
                $table->string('nama_ibu', 50)->nullable();
                $table->string('pekerjaan_ibu', 50)->nullable();
                $table->string('no_telpon_ibu', 20)->nullable();
                $table->string('nama_wali', 50)->nullable();
                $table->string('pekerjaan_wali', 50)->nullable();
                $table->string('no_telpon_wali', 20)->nullable();
                $table->string('alamat', 255);
                $table->string('email_orang_tua', 55);
                $table->integer('id_jenis_keluar')->nullable();
                $table->date('tanggal_keluar')->nullable();
                $table->longText('catatan_keluar')->nullable();
                $table->string('foto', 100)->nullable();
                $table->string('kartu_keluarga', 100);
                $table->string('akta_kelahiran', 100);
                $table->string('no_kartu_keluarga', 50);
                $table->string('nik_orang_tua', 50);
                $table->string('password_default', 255)->nullable();
                $table->integer('role_id')->nullable();
                $table->integer('user_id')->nullable();
                $table->timestamps();
                $table->softDeletes();

                $table->index('id');
                $table->index('id_user');
                $table->index('id_tahun_ajaran');
                $table->index('id_sekolah');
                $table->index('no_induk');
                $table->index('id_agama');
                $table->index('nama_lengkap');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('siswa');
    }
};
