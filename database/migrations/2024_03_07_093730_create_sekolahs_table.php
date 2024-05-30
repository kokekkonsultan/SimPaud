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
        if (!Schema::hasTable('sekolah')) {
            Schema::create('sekolah', function (Blueprint $table) {
                $table->id();
                $table->integer('id_user')->nullable();
                $table->string('nama', 100);
                $table->string('slug', 255)->nullable();
                $table->char('npsn', 8)->nullable();
                $table->integer('status_sekolah')->nullable();
                $table->string('alamat', 255)->nullable();
                $table->char('kode_wilayah', 8)->nullable();
                $table->string('no_telpon', 20)->nullable();
                $table->string('fax', 20)->nullable();
                $table->string('email', 60)->nullable();
                $table->string('website', 80)->nullable();
                $table->string('sk_pendirian_sekolah', 80)->nullable();
                $table->bigInteger('kode_registrasi')->nullable();
                $table->string('foto', 100)->nullable();
                $table->integer('user_id')->nullable();
                $table->integer('role_id')->nullable();
                $table->timestamps();
                $table->softDeletes();

                $table->index('id');
                $table->index('id_user');
                $table->index('npsn');
                $table->index('status_sekolah');
                $table->index('kode_wilayah');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sekolah');
    }
};
