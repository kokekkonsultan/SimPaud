<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sekolah extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'sekolah';

    protected $fillable = [
        'id_user',
        'nama',
        'slug',
        'npsn',
        'status_sekolah',
        'alamat',
        'kode_wilayah',
        'no_telpon',
        'fax',
        'email',
        'website',
        'sk_pendirian_sekolah',
        'kode_registrasi',
        'foto',
        'user_id',
        'role_id',
    ];
}
