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
        DB::unprepared('DROP TRIGGER IF EXISTS `delete_kelompok_relation`');
        DB::unprepared('CREATE TRIGGER delete_kelompok_relation AFTER DELETE ON `kelompok` FOR EACH ROW
        BEGIN
            DELETE FROM kelompok_guru WHERE kelompok_guru.id_kelompok = old.id;
            DELETE FROM kelompok_siswa WHERE kelompok_siswa.id_kelompok = old.id;
        END');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP TRIGGER `delete_kelompok_relation`');
    }
};
