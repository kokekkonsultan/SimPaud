<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JasmaniKesehatan extends Model
{
    use HasFactory;
    protected $table = 'jasmani_kesehatan';

    protected $fillable = [
        'id_kelompok_siswa',
        'id_semester',
        'bulan',
        'mata',
        'mulut',
        'gigi',
        'telinga',
        'hidung',
        'lingkar_kepala',
        'berat_badan',
        'tinggi_badan',
        'role_id',
        'user_id',
    ];
}
