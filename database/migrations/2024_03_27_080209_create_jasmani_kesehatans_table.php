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
        if (!Schema::hasTable('jasmani_kesehatan')) {
            Schema::create('jasmani_kesehatan', function (Blueprint $table) {
                $table->id();
                $table->integer('id_kelompok_siswa')->nullable();
                $table->integer('id_semester')->nullable();
                $table->integer('bulan')->nullable();
                $table->char('mata', 6)->nullable();
                $table->char('mulut', 6)->nullable();
                $table->char('gigi', 6)->nullable();
                $table->char('telinga', 6)->nullable();
                $table->char('hidung', 6)->nullable();
                $table->integer('lingkar_kepala')->nullable();
                $table->integer('berat_badan')->nullable();
                $table->integer('tinggi_badan')->nullable();
                $table->integer('role_id')->nullable();
                $table->integer('user_id')->nullable();
                $table->timestamps();

                $table->index('id');
                $table->index('id_kelompok_siswa');
                $table->index('id_semester');
                $table->index('bulan');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jasmani_kesehatan');
    }
};
