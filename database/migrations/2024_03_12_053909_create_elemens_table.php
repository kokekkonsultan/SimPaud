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
        if (!Schema::hasTable('elemen')) {
            Schema::create('elemen', function (Blueprint $table) {
                $table->id();
                $table->integer('id_dimensi');
                $table->char('kode', 10);
                $table->longText('nama');
                $table->string('color', 20)->nullable();
                $table->integer('id_sekolah')->nullable();
                $table->integer('role_id')->nullable();
                $table->integer('user_id')->nullable();
                $table->timestamps();
                $table->softDeletes();

                $table->index('id');
                $table->index('kode');
                $table->index('id_sekolah');
                $table->index('id_dimensi');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('elemen');
    }
};
