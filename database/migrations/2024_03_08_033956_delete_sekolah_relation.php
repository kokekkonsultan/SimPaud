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
        DB::unprepared('DROP TRIGGER IF EXISTS `delete_sekolah_relation`');
        DB::unprepared('CREATE TRIGGER delete_sekolah_relation AFTER DELETE ON `sekolah` FOR EACH ROW
        BEGIN
            DELETE FROM guru WHERE guru.id_sekolah = old.id;
            DELETE FROM siswa WHERE siswa.id_sekolah = old.id;
            DELETE FROM kelompok WHERE kelompok.id_sekolah = old.id;
            DELETE FROM indikator WHERE indikator.id_sekolah = old.id;
        END');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP TRIGGER `delete_sekolah_relation`');
    }
};
