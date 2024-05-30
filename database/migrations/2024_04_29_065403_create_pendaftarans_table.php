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
        if (!Schema::hasTable('pendaftaran')) {
            Schema::create('pendaftaran', function (Blueprint $table) {
                $table->id();
                $table->integer('id_tahun_ajaran');
                $table->integer('id_sekolah');
                $table->string('nama', 255);
                $table->date('tanggal_mulai');
                $table->date('tanggal_selesai');
                $table->longText('deskripsi')->nullable();
                $table->string('url', 255)->nullable();
                $table->integer('status')->nullable();
                $table->integer('user_id');
                $table->integer('role_id');
                $table->timestamps();
                $table->softDeletes();

                $table->index('id');
                $table->index('id_tahun_ajaran');
                $table->index('id_sekolah');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pendaftaran');
    }
};
