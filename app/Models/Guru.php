<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Guru extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'guru';

    protected $fillable = [
        'id_user',
        'nama',
        'nip',
        'jenis_kelamin',
        'tempat_lahir',
        'tanggal_lahir',
        'alamat',
        'no_telpon',
        'email',
        'id_sekolah',
        'password_default',
        'tanda_tangan',
        'foto',
        'user_id',
        'role_id',
    ];
}
