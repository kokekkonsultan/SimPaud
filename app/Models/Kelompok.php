<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Kelompok extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'kelompok';

    protected $fillable = [
        'nama',
        'id_sekolah',
        'id_kelompok_usia',
        'id_semester',
        'id_guru',
        'role_id',
        'user_id',
    ];
}
