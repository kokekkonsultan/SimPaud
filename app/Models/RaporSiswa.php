<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RaporSiswa extends Model
{
    use HasFactory;
    protected $table = 'rapor_siswa';

    protected $fillable = [
        'id_semester',
        'id_kelompok_siswa',
        'jasmani_kesehatan',
        'narasi_pendahuluan',
        'narasi_penutup',
        'izin',
        'sakit',
        'alpa',
        'status',
        'dilihat_orang_tua',
        'tanggapan_orang_tua',
        'tanggal_tanggapan',
        'user_id',
        'role_id',
    ];
}
