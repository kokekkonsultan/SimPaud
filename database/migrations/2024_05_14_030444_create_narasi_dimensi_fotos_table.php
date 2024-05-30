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
        if (!Schema::hasTable('narasi_dimensi_foto')) {
            Schema::create('narasi_dimensi_foto', function (Blueprint $table) {
                $table->id();
                $table->integer('id_rapor_siswa');
                $table->integer('id_dimensi');
                $table->string('foto', 100)->nullable();
                $table->integer('user_id')->nullable();
                $table->integer('role_id')->nullable();
                $table->timestamps();

                $table->index('id');
                $table->index('id_rapor_siswa');
                $table->index('id_dimensi');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('narasi_dimensi_foto');
    }
};
