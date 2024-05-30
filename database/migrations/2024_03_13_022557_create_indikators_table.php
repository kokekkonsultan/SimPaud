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
        if (!Schema::hasTable('indikator')) {
            Schema::create('indikator', function (Blueprint $table) {
                $table->id();
                $table->integer('id_elemen');
                $table->integer('id_kelompok_usia');
                $table->longText('nama');
                $table->integer('id_sekolah');
                $table->integer('role_id')->nullable();
                $table->integer('user_id')->nullable();
                $table->timestamps();
                $table->softDeletes();

                $table->index('id');
                $table->index('id_elemen');
                $table->index('id_sekolah');
                $table->index('id_kelompok_usia');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('indikator');
    }
};
