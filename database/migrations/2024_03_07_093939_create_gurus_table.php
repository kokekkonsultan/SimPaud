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
        if (!Schema::hasTable('guru')) {
            Schema::create('guru', function (Blueprint $table) {
                $table->id();
                $table->integer('id_user');
                $table->string('nama', 100);
                $table->string('nip', 20)->nullable();
                $table->char('jenis_kelamin', 1);
                $table->string('tempat_lahir', 50)->nullable();
                $table->date('tanggal_lahir')->nullable();
                $table->string('alamat', 100)->nullable();
                $table->string('no_telpon', 20)->nullable();
                $table->string('email', 60);
                $table->integer('id_sekolah');
                $table->string('foto', 100)->nullable();
                $table->string('password_default', 255)->nullable();
                $table->string('tanda_tangan', 100)->nullable();
                $table->integer('user_id');
                $table->integer('role_id');
                $table->timestamps();
                $table->softDeletes();

                $table->index('id');
                $table->index('id_user');
                $table->index('id_sekolah');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guru');
    }
};
