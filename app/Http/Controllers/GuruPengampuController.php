<?php

namespace App\Http\Controllers;

use App\Models\Guru;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Session;

class GuruPengampuController extends Controller
{
    function __construct()
    {
        $this->middleware('permission:guru-pengampu-list|guru-pengampu-create|guru-pengampu-edit|guru-pengampu-delete', ['only' => ['index','show']]);
        $this->middleware('permission:guru-pengampu-create', ['only' => ['create','store']]);
        $this->middleware('permission:guru-pengampu-edit', ['only' => ['edit','update']]);
        $this->middleware('permission:guru-pengampu-delete', ['only' => ['destroy']]);
        $this->middleware('permission:guru-pengampu-kelompok', ['only' => ['kelompok_guru']]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $semester = Semester::get();

        // if($request->user()->id == 2){
        //     $guru = Guru::select('guru.*', DB::raw('DATE_FORMAT(tanggal_lahir, "%d-%m-%Y") as tanggal_lahir'))->paginate(10);
        // }else{
        //     $id_sekolah = DB::table('sekolah')->where('id_user', '=', $request->user()->id)->first()->id;
        //     $guru = Guru::leftjoin('kelompok_guru', function ($join) {
        //         $join->on('kelompok_guru.id_guru', '=', 'guru.id');
        //     })
        //     ->select('guru.*', DB::raw('DATE_FORMAT(tanggal_lahir, "%d-%m-%Y") as tanggal_lahir'), DB::raw("COUNT(kelompok.id) as kelompok"))->where('id_sekolah', '=', $id_sekolah)->paginate(10);
        // }

        // $guru = Guru::select('guru.*',DB::raw("COUNT(kelompok_guru.id) as kelompok"))
        // ->leftjoin('kelompok_guru', function ($join) {
        //     $join->on('kelompok_guru.id_guru', '=', 'guru.id');
        // });
        // if($request->user()->id != 2){
        //     $id_sekolah = DB::table('sekolah')->where('id_user', '=', $request->user()->id)->first()->id;
        //     $guru = $guru->where('guru.id_sekolah', '=', $id_sekolah);
        // }
        // $guru = $guru->groupby('guru.id')->paginate(10);

        if (($request->id_semester && strlen($request->id_semester)) > 0) {
            $id_semester = $request->id_semester;
        } else {
            $id_semester = Session::get('id_semester');
        }

        $guru = Guru::query()
            ->select('guru.*', DB::raw("COUNT(pg.id_kelompok) AS kelompok"))
            /*->leftjoin('kelompok_guru AS pg', function ($join) use ($id_semester) { // view table plot_kelompok_guru
                $join->on('pg.id_guru', '=', 'guru.id');
                // $join->on('pg.id_semester', '=', $id_semester);
            })
            ->leftjoin('kelompok AS k', function ($join) use ($id_semester) {
                $join->on('pg.id_kelompok', '=', 'k.id');
                // $join->on('k.id_semester', '=', $id_semester);
            })*/
            ->leftjoin('view_kelompok_guru AS pg', function ($join) use ($id_semester) {
                $join->on('pg.id_guru', '=', 'guru.id');
                $join->on('pg.id_semester', '=', DB::raw($id_semester));
            })
            // ->where('k.id_semester', '=', $id_semester)
            ->where('guru.id_sekolah', '=', Session::get('id_sekolah'))
            ->whereNull('guru.deleted_at')
            ->groupby('guru.id')
            ->paginate(10);

        // return view('master.guru_pengampu.index',compact('guru'));
        return Inertia::render('Master/Guru_Pengampu/Index', [
            'guru' => $guru,
            'semester' => $semester,
            'id_semester' => $id_semester,
            'filtering' => request()->query() ?: null
        ]);
    }

    public function kelompok_guru(Request $request, $id)
    {
        // $guru = Guru::find($id);
        $data = explode('-', $id);
        $id = $data[0];
        $id_semester = $data[1];

        $guru = Guru::leftjoin('sekolah', 'sekolah.id', '=', 'guru.id_sekolah')
        ->select('guru.*')
        ->findOrFail($id);

        
        $kelompok_sudah = DB::table('kelompok_guru AS pg')
            ->select('kel.id', 'kel.nama', DB::raw('COUNT(ak.id_siswa) AS jml_siswa'), 'ku.nama AS kelompok_usia', 'pengampu.jml_guru')
            ->leftjoin('kelompok AS kel', function ($q) use ($guru, $id_semester) {
                $q->on('kel.id', '=', 'pg.id_kelompok');
                $q->on('kel.deleted_at', 'IS', DB::raw('NULL'));
                $q->on('kel.id_semester', '=', DB::raw($id_semester));
                $q->on('kel.id_sekolah', '=', DB::raw(Session::get('id_sekolah')));
            })
            ->leftjoin('kelompok_siswa AS ak', function ($q) {
                $q->on('ak.id_kelompok', '=', 'kel.id');
                $q->on('ak.deleted_at', 'IS', DB::raw('NULL'));
            })
            ->join('kelompok_usia AS ku', 'ku.id', '=', 'kel.id_kelompok_usia')
            ->join(DB::raw("(SELECT id_kelompok, COUNT(id_guru) AS jml_guru FROM kelompok_guru GROUP BY id_kelompok) AS pengampu"), function ($join) {
                $join->on('pengampu.id_kelompok', '=', 'pg.id_kelompok');
            })
            ->where('kel.id_sekolah', '=', $guru->id_sekolah)
            ->where('pg.id_guru', '=', $id)
            ->orderby('kel.id_kelompok_usia', 'ASC')
            ->orderby('kel.nama', 'ASC')
            ->groupby('kel.id')
            ->get();

        $kelompok_belum = DB::table('kelompok AS mk')
            ->select('mk.id', 'mk.nama', 'ku.nama AS kelompok_usia', DB::raw('COUNT(ak.id_siswa) AS jml_siswa'), DB::raw("CASE WHEN pengampu.jml_guru != '' THEN pengampu.jml_guru ELSE 0 END AS jml_guru"))
            ->leftjoin('kelompok_siswa AS ak', function ($q) {
                $q->on('ak.id_kelompok', '=', 'mk.id');
                $q->on('ak.deleted_at', 'IS', DB::raw('NULL'));
            })
            ->join('kelompok_usia AS ku', 'ku.id', '=', 'mk.id_kelompok_usia')
            ->leftjoin(DB::raw("(SELECT id_kelompok, COUNT(id_guru) AS jml_guru FROM kelompok_guru GROUP BY id_kelompok) AS pengampu"), function ($join) {
                $join->on('pengampu.id_kelompok', '=', 'mk.id');
            })
            ->where('mk.id_sekolah', '=', $guru->id_sekolah)
            ->where('mk.id_semester', '=', $id_semester)
            ->whereNotIn('mk.id', function ($q) use ($id) {
                $q->select('pg.id_kelompok AS id')
                    ->from('kelompok_guru AS pg')
                    ->where('pg.id_guru', '=', $id);
            })
            ->whereNull('mk.deleted_at')
            ->orderby('mk.id_kelompok_usia', 'ASC')
            ->orderby('mk.nama', 'ASC')
            ->groupby('mk.id')
            ->get();

        return Inertia::render('Master/Guru_Pengampu/Kelompok', 
        [
            'guru' => $guru,
            'kelompok_sudah' => $kelompok_sudah,
            'kelompok_belum' => $kelompok_belum
        ]);
    }

    public function kelompok_guru_keluar($id, $id_kelompok){
        DB::table('kelompok_guru')
        ->where('id_guru', '=', $id)
        ->where('id_kelompok', '=', $id_kelompok)
        ->delete();
        // return redirect()->route('kelompok-guru', $id)->with('message', 'siswa is deleted successfully.');
        return redirect()->back()->with('message', 'Data Siswa berhasil dikeluarkan!');
    }

    public function kelompok_guru_masuk($id, $id_kelompok){
        $cek = DB::table('kelompok_guru')
            ->where('id_guru', '=', $id)
            ->where('id_kelompok', '=', $id_kelompok)
            ->first();
        if ($cek) {
            DB::table('kelompok_guru')
                ->where('id_guru', '=', $id)
                ->where('id_kelompok', '=', $id_kelompok)
                ->update(array(
                    'id_guru' => $id,
                ));
        } else {
            DB::table('kelompok_guru')
                ->insert(array(
                    'id_guru' => $id,
                    'id_kelompok' => $id_kelompok,
                    'created_at' => date('Y-m-d H:i:s'),
                ));
        }
        // return redirect()->route('kelompok-guru', $id)->with('message', 'siswa is add successfully.');
        return redirect()->back()->with('message', 'Data Siswa berhasil dimasukkan!');
    }
}
