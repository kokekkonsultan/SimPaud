<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Dimensi extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'dimensi';

    protected $fillable = [
        'id_metode',
        'kode',
        'nama',
        'color',
        'icon',
        'role_id',
        'user_id',
    ];

    public function elemen()
    {
        return $this->hasMany(Elemen::class, 'id_dimensi');
    }

    public function indikator()
    {
        return $this->hasManyThrough(Indikator::class, Elemen::class, 'id_dimensi', 'id_elemen');
    }
}
