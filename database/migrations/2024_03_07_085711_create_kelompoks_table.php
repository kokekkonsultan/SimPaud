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
        if (!Schema::hasTable('kelompok')) {
            Schema::create('kelompok', function (Blueprint $table) {
                $table->id();
                $table->string('nama', 100);
                $table->integer('id_sekolah');
                $table->integer('id_kelompok_usia');
                $table->integer('id_semester');
                $table->integer('id_guru');
                $table->integer('role_id');
                $table->integer('user_id');
                $table->timestamps();
                $table->softDeletes();

                // $table->index(['id_sekolah', 'id_kelompok_usia', 'id_semester', 'id_guru']);
                $table->index('id');
                $table->index('id_sekolah');
                $table->index('id_kelompok_usia');
                $table->index('id_semester');
                $table->index('id_guru');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kelompok');
    }
};
