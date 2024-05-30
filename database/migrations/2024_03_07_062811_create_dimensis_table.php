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
        if (!Schema::hasTable('dimensi')) {
            Schema::create('dimensi', function (Blueprint $table) {
                $table->id();
                $table->integer('id_metode');
                $table->char('kode', 10)->nullable();
                $table->string('nama', 255)->nullable();
                $table->string('color', 20)->nullable();
                $table->string('icon', 20)->nullable();
                $table->integer('role_id')->nullable();
                $table->integer('user_id')->nullable();
                $table->timestamps();
                $table->softDeletes();

                $table->index('id');
                $table->index('kode');
            });

            $data = [
                ['id' => 1, 'id_metode'=> 2, 'kode'=> 'I', 'nama'=> 'Nilai Agama dan Budi Pekerti', 'created_at' => '2020-12-07 01:50:30'],
                ['id' => 2, 'id_metode'=> 2, 'kode'=> 'II', 'nama'=> 'Jati Diri', 'created_at' => '2020-12-07 01:50:30'],
                ['id' => 3, 'id_metode'=> 2, 'kode'=> 'III', 'nama'=> 'Dasar-dasar Literasi, Matematika, Sains, Teknologi, Rekayasa dan Seni', 'created_at' => '2020-12-07 01:50:30'],
                ['id' => 4, 'id_metode'=> 3, 'kode'=> 'IV', 'nama'=> 'Beriman, Bertaqwa Kepada Tuhan YME, dan Berakhlak Mulia', 'created_at' => '2020-12-07 01:50:30'],
                ['id' => 5, 'id_metode'=> 3, 'kode'=> 'V', 'nama'=> 'Berkebinekaan Global', 'created_at' => '2020-12-07 01:50:30'],
                ['id' => 6, 'id_metode'=> 3, 'kode'=> 'VI', 'nama'=> 'Bergotong Royong', 'created_at' => '2020-12-07 01:50:30'],
                ['id' => 7, 'id_metode'=> 3, 'kode'=> 'VII', 'nama'=> 'Mandiri', 'created_at' => '2020-12-07 01:50:30'],
                ['id' => 8, 'id_metode'=> 3, 'kode'=> 'VIII', 'nama'=> 'Bernalar Kritis', 'created_at' => '2020-12-07 01:50:30'],
                ['id' => 9, 'id_metode'=> 3, 'kode'=> 'IX', 'nama'=> 'Kritis', 'created_at' => '2020-12-07 01:50:30'],
            ];
            DB::table('dimensi')->insert($data);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dimensi');
    }
};
