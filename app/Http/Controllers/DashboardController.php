<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Auth;
use Session;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if(Session::get('role_id') == 5){
            $siswa = DB::table("siswa")->join('users','users.id','=','siswa.id_user')->where('users.id', '=', Auth::user()->id)->first();
            $sekolah = '';
        }else{
            $siswa = '';
            $sekolah = DB::table("sekolah")
            ->leftjoin('users', 'users.id', '=', 'sekolah.id_user')
            ->leftjoin('wilayah AS prov' , 'prov.kode_wilayah', '=' , DB::raw("CONCAT(LEFT(sekolah.kode_wilayah,2),'0000')"))
            ->leftjoin('wilayah AS kotakab' , 'kotakab.kode_wilayah', '=' , DB::raw("CONCAT(LEFT(sekolah.kode_wilayah,4),'00')"))
            ->leftjoin('wilayah AS kec' , 'kec.kode_wilayah', '=' ,'sekolah.kode_wilayah')
            ->leftjoin('kepala_sekolah AS ks', function($join){
                $join->on('ks.id_sekolah', '=', 'sekolah.id');
                $join->on('ks.id_semester', '=', DB::raw(Session::get('id_semester')));
            })
            ->select('users.status as status', 'users.verified as verified', 'ks.nama as kepala_sekolah', 'prov.nama AS provinsi', 'kotakab.nama AS kotakab', 'kec.nama AS kecamatan', 'sekolah.*', 'sekolah.id as id_sekolah')
            ->where("sekolah.id", Session::get('id_sekolah'))
            ->first();
        }

        if(Session::get('role_id') == 3 || Session::get('role_id') == 6){
            $jml_guru = DB::table('guru')
            ->where('id_sekolah','=',Session::get('id_sekolah'))
            ->whereNull('deleted_at')
            ->count();

            $jml_peserta_didik = DB::table('siswa')
            ->join('users', 'users.id', '=', 'siswa.id_user')
            ->where('users.role_id','=',5)
            ->where('users.status','=',1)
            ->where('users.confirmed','=',1)
            ->where('users.verified','=',1)
            ->where('users.deleted','=',0)

            ->where('siswa.id_sekolah','=',Session::get('id_sekolah'))
            ->whereNull('siswa.id_jenis_keluar')
            ->whereNull('siswa.deleted_at')
            ->count();

            $jml_kelompok = DB::table('kelompok')
            ->where('id_sekolah','=',Session::get('id_sekolah'))
            ->where('id_semester','=',Session::get('id_semester'))
            ->whereNull('deleted_at')
            ->count();

            $jml_permintaan = DB::table('users')
                ->join('siswa', 'users.id', '=', 'siswa.id_user')
                ->where('siswa.id_sekolah','=',Session::get('id_sekolah'))
                ->where('users.role_id','=',5)
                ->where('users.status','=',1)
                ->where('users.confirmed','=',1)
                ->where('users.verified','=',0)
                ->where('users.deleted','=',0)
                ->whereNull('users.deleted_at')
                ->count();

            $rekap = array(
                'jml_guru' => $jml_guru,
                'jml_peserta_didik' => $jml_peserta_didik,
                'jml_kelompok' => $jml_kelompok,
                'jml_permintaan' => $jml_permintaan
            );
        }elseif(Session::get('role_id') == 4){
            $jml_guru = 0;

            $jml_kelompok = DB::table('kelompok AS kel')
            ->join('kelompok_guru AS pg', function ($join) {
                $join->on('pg.id_kelompok', '=', 'kel.id');
                $join->on('pg.id_guru', '=', DB::raw(Session::get('id_guru')));
            })
            ->where('kel.id_sekolah','=',Session::get('id_sekolah'))
            ->where('kel.id_semester','=',Session::get('id_semester'))
            ->whereNull('kel.deleted_at')
            ->count();

            $jml_peserta_didik = DB::table('siswa AS sis')
            ->join('kelompok_siswa AS ak', function($join){
                $join->on('ak.id_siswa','=','sis.id');
                $join->on('ak.deleted_at','IS',DB::raw("null"));
            })
            ->join('kelompok AS kel', function($join){
                $join->on('kel.id','=','ak.id_kelompok');
                $join->on('kel.id_sekolah','=',DB::raw(Session::get('id_sekolah')));
                $join->on('kel.id_semester','=',DB::raw(Session::get('id_semester')));
                $join->on('kel.deleted_at','IS',DB::raw("null"));
            })
            ->join('kelompok_guru AS pg', function ($join) {
                $join->on('pg.id_kelompok', '=', 'kel.id');
                $join->on('pg.id_guru', '=', DB::raw(Session::get('id_guru')));
            })
            ->where('sis.id_sekolah','=',Session::get('id_sekolah'))
            ->whereNull('sis.id_jenis_keluar')
            ->whereNull('sis.deleted_at')
            ->count();

            $rekap = array(
                'jml_guru' => $jml_guru,
                'jml_peserta_didik' => $jml_peserta_didik,
                'jml_kelompok' => $jml_kelompok
            );
        }else{
            $jml_sekolah = DB::table('users')
                ->where('role_id','=',3)
                ->where('status','=',1)
                ->where('confirmed','=',1)
                ->where('verified','=',1)
                ->where('deleted','=',0)
                ->whereNull('deleted_at')
                ->count();

            $jml_peserta_didik = DB::table('siswa')
                ->whereNull('deleted_at')
                ->count();

            $jml_guru = DB::table('users')
                ->where('role_id','=',4)
                ->where('status','=',1)
                ->where('confirmed','=',1)
                ->where('verified','=',1)
                ->where('deleted','=',0)
                ->whereNull('deleted_at')
                ->count();

            $jml_permintaan = DB::table('users')
                ->join('sekolah', 'users.id', '=', 'sekolah.id_user')
                ->where('users.role_id','=',3)
                ->where('users.status','=',1)
                ->where('users.confirmed','=',1)
                ->where('users.verified','=',0)
                ->where('users.deleted','=',0)
                ->whereNull('users.deleted_at')
                ->count();

            $rekap = array(
                'jml_guru' => $jml_guru,
                'jml_peserta_didik' => $jml_peserta_didik,
                'jml_sekolah' => $jml_sekolah,
                'jml_permintaan' => $jml_permintaan,
            );
        }

        return Inertia::render('Dashboard', 
        [
            'siswa' => $siswa,
            'sekolah' => $sekolah,
            'rekap' => $rekap,
            'role_id' => Session::get('role_id'),
        ]);
    }

    
}
