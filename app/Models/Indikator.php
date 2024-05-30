<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Indikator extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'indikator';

    protected $fillable = [
        'id_elemen',
        'id_kelompok_usia',
        'nama',
        'id_sekolah',
        'role_id',
        'user_id',
    ];

    public function elemen()
    {
        return $this->belongsTo(Elemen::class);
    }
}
