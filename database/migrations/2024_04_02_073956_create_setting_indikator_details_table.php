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
        if (!Schema::hasTable('setting_indikator_detail')) {
            Schema::create('setting_indikator_detail', function (Blueprint $table) {
                $table->id();
                $table->integer('id_setting');
                $table->integer('id_indikator');
                $table->integer('role_id')->nullable();
                $table->integer('user_id')->nullable();
                $table->timestamps();

                $table->index('id');
                $table->index('id_setting');
                $table->index('id_indikator');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('setting_indikator_detail');
    }
};
