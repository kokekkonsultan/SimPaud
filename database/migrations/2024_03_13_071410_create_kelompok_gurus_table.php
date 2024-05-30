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
        if (!Schema::hasTable('kelompok_guru')) {
            Schema::create('kelompok_guru', function (Blueprint $table) {
                $table->id();
                $table->integer('id_guru');
                $table->integer('id_kelompok');
                $table->integer('user_id')->nullable();
                $table->integer('role_id')->nullable();
                $table->timestamps();
                $table->softDeletes();

                $table->index('id');
                $table->index('id_guru');
                $table->index('id_kelompok');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kelompok_guru');
    }
};
