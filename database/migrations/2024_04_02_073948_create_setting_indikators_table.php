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
        if (!Schema::hasTable('setting_indikator')) {
            Schema::create('setting_indikator', function (Blueprint $table) {
                $table->id();
                $table->date('tanggal');
                $table->integer('id_kelompok');
                $table->integer('role_id')->nullable();
                $table->integer('user_id')->nullable();
                $table->timestamps();

                $table->index('id');
                $table->index('tanggal');
                $table->index('id_kelompok');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('setting_indikator');
    }
};
