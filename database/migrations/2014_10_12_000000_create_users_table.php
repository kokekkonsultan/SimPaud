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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->integer('role_id');
            $table->integer('status')->default(1);
            $table->integer('confirmed')->default(0);
            $table->dateTime('confirmed_at')->nullable();
            $table->integer('verified')->default(0);
            $table->dateTime('verified_at')->nullable();
            $table->integer('verifier')->nullable();
            $table->timestamps();
            $table->integer('deleted')->default(0);
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
