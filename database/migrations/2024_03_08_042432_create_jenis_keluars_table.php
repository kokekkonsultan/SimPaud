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
        if (!Schema::hasTable('jenis_keluar')) {
            Schema::create('jenis_keluar', function (Blueprint $table) {
                $table->id();
                $table->string('nama', 255)->nullable();
                $table->integer('user_id')->nullable();
                $table->integer('role_id')->nullable();
                $table->timestamps();

                $table->index('id');
            });

            $data = [
                ['id' => 1, 'nama'=> 'Lulus', 'created_at' => '2020-12-07 01:50:30'],
                ['id' => 2, 'nama'=> 'Pindah', 'created_at' => '2020-12-07 01:50:30'],
                ['id' => 3, 'nama'=> 'Berhenti', 'created_at' => '2020-12-07 01:50:30'],
                ['id' => 4, 'nama'=> 'Meninggal', 'created_at' => '2020-12-07 01:50:30'],
                ['id' => 5, 'nama'=> 'Lain-lain', 'created_at' => '2020-12-07 01:50:30'],
            ];
            DB::table('jenis_keluar')->insert($data);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jenis_keluar');
    }
};
