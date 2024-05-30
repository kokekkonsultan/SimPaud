<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KepalaSekolah extends Model
{
    use HasFactory;
    protected $table = 'kepala_sekolah';

    protected $fillable = [
        'id_user',
        'nama',
        'tanda_tangan',
        'id_sekolah',
        'id_semester',
        'user_id',
        'role_id',
    ];
}
