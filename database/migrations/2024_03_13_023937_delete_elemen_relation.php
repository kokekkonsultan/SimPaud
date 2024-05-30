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
        DB::unprepared('DROP TRIGGER IF EXISTS `delete_elemen_relation`');
        DB::unprepared('CREATE TRIGGER delete_elemen_relation AFTER DELETE ON `elemen` FOR EACH ROW
        BEGIN
            DELETE FROM indikator WHERE indikator.id_elemen = old.id;
        END');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP TRIGGER `delete_elemen_relation`');
    }
};
