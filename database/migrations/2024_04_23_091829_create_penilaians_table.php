<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('penilaian')) {
            Schema::create('penilaian', function (Blueprint $table) {
                $table->id();
                $table->char('kode', 10)->nullable();
                $table->string('keterangan', 255)->nullable();
                $table->string('bullet', 50)->nullable();
                $table->string('color', 7)->nullable();
                $table->integer('role_id')->nullable();
                $table->integer('user_id')->nullable();
                $table->timestamps();

                $table->index('id');
                $table->index('kode');
            });

            $data = [
                ['id' => 1, 'kode'=> 'BM', 'keterangan'=> 'Belum Muncul', 'bullet'=> 'BM-Bullet.png', 'color'=> '#dd4b39', 'created_at' => '2020-12-07 01:50:30'],
                ['id' => 2, 'kode'=> 'SM', 'keterangan'=> 'Sudah Muncul', 'bullet'=> 'SM-Bullet.png', 'color'=> '#f39c12', 'created_at' => '2020-12-07 01:50:30'],
            ];
            DB::table('penilaian')->insert($data);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penilaian');
    }
};
