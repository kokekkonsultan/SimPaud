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
        if (!Schema::hasTable('kepala_sekolah')) {
            Schema::create('kepala_sekolah', function (Blueprint $table) {
                $table->id();
                $table->integer('id_user')->nullable();
                $table->string('nama', 100)->nullable();
                $table->string('email', 60);
                $table->string('tanda_tangan', 100)->nullable();
                $table->integer('id_sekolah')->nullable();
                $table->integer('id_semester')->nullable();
                $table->integer('role_id')->nullable();
                $table->integer('user_id')->nullable();
                $table->timestamps();

                $table->index('id');
                $table->index('id_user');
                $table->index('id_sekolah');
                $table->index('id_semester');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kepala_sekolah');
    }
};
