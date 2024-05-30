<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SettingSttb extends Model
{
    use HasFactory;
    protected $table = 'setting_sttb';

    protected $fillable = [
        'template',
        'id_sekolah',
        'status',
        'user_id',
        'role_id',
    ];
}
