<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Elemen extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'elemen';

    protected $fillable = [
        'id_dimensi',
        'kode',
        'nama',
        'color',
        'id_sekolah',
        'role_id',
        'user_id',
    ];

    public function dimensi()
    {
        return $this->belongsTo(Dimensi::class, 'id_elemen');
    }

    public function indikator()
    {
        return $this->hasMany(Indikator::class, 'id_elemen');
    }
}
