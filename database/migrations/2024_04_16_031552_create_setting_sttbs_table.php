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
        if (!Schema::hasTable('setting_sttb')) {
            Schema::create('setting_sttb', function (Blueprint $table) {
                $table->id();
                $table->string('template', 255);
                $table->integer('id_sekolah');
                $table->integer('status');
                $table->integer('user_id');
                $table->integer('role_id');
                $table->timestamps();

                $table->index('id');
                $table->index('id_sekolah');
            });

            $data = [
                ['template'=> 'erapor-bg01.jpg', 'id_sekolah' => '0', 'status' => 1, 'user_id' => 0, 'role_id' => 0, 'created_at' => date('Y-m-d H:i:s')],
                ['template'=> 'erapor-bg02.jpg', 'id_sekolah' => '0', 'status' => 0, 'user_id' => 0, 'role_id' => 0, 'created_at' => date('Y-m-d H:i:s')],
                ['template'=> 'erapor-bg03.jpg', 'id_sekolah' => '0', 'status' => 0, 'user_id' => 0, 'role_id' => 0, 'created_at' => date('Y-m-d H:i:s')],
                ['template'=> 'erapor-bg04.jpg', 'id_sekolah' => '0', 'status' => 0, 'user_id' => 0, 'role_id' => 0, 'created_at' => date('Y-m-d H:i:s')],
            ];
            // DB::table('setting_sttb')->insert($data);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('setting_sttb');
    }
};
