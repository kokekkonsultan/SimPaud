<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SettingRaporSiswa extends Model
{
    use HasFactory;
    protected $table = 'setting_rapor_siswa';

    protected $fillable = [
        'id_semester',
        'id_sekolah',
        'tanggal_rapor',
        'user_id',
        'role_id',
    ];
}
