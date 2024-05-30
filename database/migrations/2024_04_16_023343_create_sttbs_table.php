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
        if (!Schema::hasTable('sttb')) {
            Schema::create('sttb', function (Blueprint $table) {
                $table->id();
                $table->integer('id_siswa');
                $table->integer('id_jenis_sttb');
                $table->string('nomor_sttb', 100);
                $table->date('tanggal_sttb');
                $table->integer('user_id');
                $table->integer('role_id');
                $table->timestamps();

                $table->index('id');
                $table->index('id_siswa');
                $table->index('id_jenis_sttb');
                $table->index('tanggal_sttb');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sttb');
    }
};
