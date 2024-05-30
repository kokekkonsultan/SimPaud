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
        if (!Schema::hasTable('wilayah')) {
            Schema::create('wilayah', function (Blueprint $table) {
                $table->char('kode_wilayah', 10)->nullable();
                $table->string('nama', 255)->nullable();
                $table->integer('id_level_wilayah')->nullable();
                $table->char('parent_kode_wilayah', 8)->nullable();
                $table->dateTime('expired_date')->nullable();

                $table->index('kode_wilayah');
                $table->index('id_level_wilayah');
                $table->index('parent_kode_wilayah');
                $table->index('expired_date');
            });

            $data = [
                ['kode_wilayah' => '050000', 'nama'=> 'Prov. Jawa Timur', 'id_level_wilayah' => 1, 'parent_kode_wilayah' => '000000'],
                ['kode_wilayah' => '050100', 'nama'=> 'Kab. Gresik', 'id_level_wilayah' => 2, 'parent_kode_wilayah' => '050000'],
                ['kode_wilayah' => '050200', 'nama'=> 'Kab. Sidoarjo', 'id_level_wilayah' => 2, 'parent_kode_wilayah' => '050000'],
                ['kode_wilayah' => '050101', 'nama'=> 'Kec. Wringin Anom', 'id_level_wilayah' => 3, 'parent_kode_wilayah' => '050100'],
                ['kode_wilayah' => '050102', 'nama'=> 'Kec. Driyorejo', 'id_level_wilayah' => 3, 'parent_kode_wilayah' => '050100'],
                ['kode_wilayah' => '050103', 'nama'=> 'Kec. Kedamean', 'id_level_wilayah' => 3, 'parent_kode_wilayah' => '050100'],
                ['kode_wilayah' => '050201', 'nama'=> 'Kec. Tarik', 'id_level_wilayah' => 3, 'parent_kode_wilayah' => '050200'],
                ['kode_wilayah' => '050202', 'nama'=> 'Kec. Prambon', 'id_level_wilayah' => 3, 'parent_kode_wilayah' => '050200'],
            ];
            DB::table('wilayah')->insert($data);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wilayah');
    }
};
