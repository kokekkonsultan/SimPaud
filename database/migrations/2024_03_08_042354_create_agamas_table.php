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
        if (!Schema::hasTable('agama')) {
            Schema::create('agama', function (Blueprint $table) {
                $table->id();
                $table->string('nama', 25)->nullable();
                $table->integer('role_id')->nullable();
                $table->integer('user_id')->nullable();
                $table->timestamps();
            });

            $data = [
                ['id' => 1, 'nama'=> 'Islam', 'created_at' => '2020-12-07 01:50:30'],
                ['id' => 2, 'nama'=> 'Kristen', 'created_at' => '2020-12-07 01:50:30'],
                ['id' => 3, 'nama'=> 'Katolik', 'created_at' => '2020-12-07 01:50:30'],
                ['id' => 4, 'nama'=> 'Hindu', 'created_at' => '2020-12-07 01:50:30'],
                ['id' => 5, 'nama'=> 'Budha', 'created_at' => '2020-12-07 01:50:30'],
                ['id' => 6, 'nama'=> 'Kong Hu Chu', 'created_at' => '2020-12-07 01:50:30'],
            ];
            DB::table('agama')->insert($data);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agama');
    }
};
