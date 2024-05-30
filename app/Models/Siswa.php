<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Siswa extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'siswa';

    protected $fillable = [
        'id_user',
        'id_tahun_ajaran',
        'tanggal_masuk',
        'id_sekolah',
        'nama_lengkap',
        'nama_panggilan',
        'no_induk',
        'nisn',
        'jenis_kelamin',
        'id_agama',
        'tempat_lahir',
        'tanggal_lahir',
        'hobi',
        'anak_ke',
        'nama_ayah',
        'pekerjaan_ayah',
        'no_telpon_ayah',
        'nama_ibu',
        'pekerjaan_ibu',
        'no_telpon_ibu',
        'nama_wali',
        'pekerjaan_wali',
        'no_telpon_wali',
        'alamat',
        'email_orang_tua',
        'id_jenis_keluar',
        'tanggal_keluar',
        'catatan_keluar',
        'foto',
        'kartu_keluarga',
        'akta_kelahiran',
        'no_kartu_keluarga',
        'nik_orang_tua',
        'password_default',
        'role_id',
        'user_id',
    ];
}
