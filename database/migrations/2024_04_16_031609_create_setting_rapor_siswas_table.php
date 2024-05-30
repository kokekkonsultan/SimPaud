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
        if (!Schema::hasTable('setting_rapor_siswa')) {
            Schema::create('setting_rapor_siswa', function (Blueprint $table) {
                $table->id();
                $table->integer('id_semester');
                $table->integer('id_sekolah');
                $table->date('tanggal_rapor');
                $table->integer('user_id');
                $table->integer('role_id');
                $table->timestamps();

                $table->index('id');
                $table->index('id_semester');
                $table->index('id_sekolah');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('setting_rapor_siswa');
    }
};
