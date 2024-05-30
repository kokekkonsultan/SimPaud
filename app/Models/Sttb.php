<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sttb extends Model
{
    use HasFactory;
    protected $table = 'sttb';

    protected $fillable = [
        'id_siswa',
        'id_jenis_sttb',
        'nomor_sttb',
        'tanggal_sttb',
        'user_id',
        'role_id',
    ];
}
