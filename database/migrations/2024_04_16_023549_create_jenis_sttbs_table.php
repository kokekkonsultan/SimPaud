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
        if (!Schema::hasTable('jenis_sttb')) {
            Schema::create('jenis_sttb', function (Blueprint $table) {
                $table->id();
                $table->string('nama', 255)->nullable();
                $table->integer('user_id')->nullable();
                $table->integer('role_id')->nullable();
                $table->timestamps();

                $table->index('id');
            });

            $data = [
                ['id' => 1, 'nama'=> 'Kelompok Bermain (KB)', 'created_at' => '2020-12-07 01:50:30'],
                ['id' => 2, 'nama'=> 'Taman Kanak-kanak (TK)', 'created_at' => '2020-12-07 01:50:30'],
                ['id' => 3, 'nama'=> 'Taman Penitipan Anak (TPA)', 'created_at' => '2020-12-07 01:50:30'],
                ['id' => 4, 'nama'=> 'Satuan PAUD Sejenis (SPS)', 'created_at' => '2020-12-07 01:50:30'],
                ['id' => 5, 'nama'=> 'Raudatul Athfal (RA)', 'created_at' => '2020-12-07 01:50:30'],
                ['id' => 6, 'nama'=> 'Taman Seminari', 'created_at' => '2020-12-07 01:50:30'],
            ];
            DB::table('jenis_sttb')->insert($data);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jenis_sttb');
    }
};
