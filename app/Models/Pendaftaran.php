<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pendaftaran extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'pendaftaran';

    protected $fillable = [
        'id_tahun_ajaran',
        'id_sekolah',
        'nama',
        'deskripsi',
        'tanggal_mulai',
        'tanggal_selesai',
        'url',
        'status',
        'role_id',
        'user_id',
    ];
}
