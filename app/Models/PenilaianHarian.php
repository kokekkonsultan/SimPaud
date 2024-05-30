<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PenilaianHarian extends Model
{
    use HasFactory;
    protected $table = 'penilaian_harian';

    protected $fillable = [
        'tanggal',
        'id_kelompok_siswa',
        'id_indikator',
        'muncul',
        'catatan',
        'foto',
        'user_id',
        'role_id',
    ];
}
