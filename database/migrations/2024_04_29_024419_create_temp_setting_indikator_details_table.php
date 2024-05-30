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
        if (!Schema::hasTable('temp_setting_indikator_detail')) {
            Schema::create('temp_setting_indikator_detail', function (Blueprint $table) {
                $table->id();
                $table->integer('id_user');
                $table->date('tanggal');
                $table->integer('id_kelompok');
                $table->integer('id_indikator');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('temp_setting_indikator_detail');
    }
};
