<?php

namespace App\Http\Controllers;

use App\Models\Kelompok;
use App\Models\KelompokUsia;
use App\Models\Semester;
use App\Models\JasmaniKesehatan;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Session;

class JasmaniKesehatanController extends Controller
{
    function __construct()
    {
        $this->middleware('permission:jasmani-kesehatan-list|jasmani-kesehatan-create|jasmani-kesehatan-edit|jasmani-kesehatan-delete', ['only' => ['index','show']]);
        $this->middleware('permission:jasmani-kesehatan-create', ['only' => ['create','store']]);
        $this->middleware('permission:jasmani-kesehatan-edit', ['only' => ['edit','update']]);
        $this->middleware('permission:jasmani-kesehatan-delete', ['only' => ['destroy']]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if (($request->id_semester && strlen($request->id_semester)) > 0) {
            $id_semester = $request->id_semester;
        } else {
            $id_semester = Session::get('id_semester');
        }

        if (($request->bulan && strlen($request->bulan)) > 0) {
            $bulan = $request->bulan;
        } else {
            $bulannow = date("n");
            if($bulannow > 6){
                $bulan = $bulannow-6;
            }else{
                $bulan = $bulannow;
            }
        }

        $jenis_semester = DB::table('semester')->where('id', '=', $id_semester)->first()->semester;
    
        $semester = Semester::get();
        $kelompok = Kelompok::select('kelompok.*', 'ku.nama AS kelompok_usia')
            ->join('kelompok_usia AS ku','ku.id','=','kelompok.id_kelompok_usia')
            ->where('kelompok.id_semester', '=', $id_semester)
            ->where('kelompok.id_sekolah', '=', Session::get('id_sekolah'));
        if($request->has('id_kelompok_usia')){
            $kelompok = $kelompok->where('kelompok.id_kelompok_usia', '=', DB::raw($request->id_kelompok_usia));
        }
        $kelompok = $kelompok->whereNull('kelompok.deleted_at')
            ->orderby('kelompok.id','ASC')
            ->get();
        $kelompok_usia = KelompokUsia::get();

        $jasmani_kesehatan = Siswa::query()
            // ->table('siswa')
            ->select('ak.id AS id_kelompok_siswa', 'siswa.id AS id_siswa', 'siswa.jenis_kelamin', 'siswa.no_induk', 'siswa.nisn', 'siswa.nama_lengkap', 'siswa.nama_panggilan', 'siswa.foto', 'kel.nama AS kelompok', 'jas.id AS id_jasmani', 'jas.mata', 'jas.mulut', 'jas.gigi', 'jas.telinga', 'jas.hidung', 'jas.lingkar_kepala', 'jas.berat_badan', 'jas.tinggi_badan', 'kel.id AS id_kelompok', 'kel.id_kelompok_usia', 'ku.nama AS kelompok_usia')
            ->join('kelompok_siswa AS ak', function($join){
                $join->on('ak.id_siswa', '=', 'siswa.id');
                $join->on('ak.deleted_at', 'IS', DB::raw("null"));
            })
            ->join('kelompok AS kel', function ($join) use ($request, $id_semester) {
                $join->on('kel.id', '=', 'ak.id_kelompok');
                $join->on('kel.id_semester', '=', DB::raw($id_semester));
                $join->on('kel.id_sekolah', '=', DB::raw(Session::get('id_sekolah')));
                $join->on('kel.deleted_at', 'IS', DB::raw("null"));

                if($request->has('id_kelompok_usia')){
                    $join->on('kel.id_kelompok_usia', '=', DB::raw($request->id_kelompok_usia));
                }
            })
            ->join('kelompok_usia AS ku','ku.id','=','kel.id_kelompok_usia')
            ->leftJoin('jasmani_kesehatan AS jas', function ($join) use ($request, $id_semester, $bulan) {
                $join->on('jas.id_kelompok_siswa', '=', 'ak.id');
                $join->on('jas.bulan', '=', DB::raw($bulan));
                $join->on('jas.id_semester', '=', DB::raw($id_semester));
            });

        if ($request->has('id_kelompok')) {
            $jasmani_kesehatan = $jasmani_kesehatan->where('ak.id_kelompok', '=', $request->id_kelompok);
        } else {
            if (Session::get('role_id') == 4) {
                $jasmani_kesehatan = $jasmani_kesehatan->join('kelompok_guru AS pg', function ($join) {
                    $join->on('pg.id_kelompok', '=', 'kel.id');
                    $join->on('pg.id_guru', '=', DB::raw(Session::get('id_guru')));
                });
            }

        }

        if ($request->has('search') and strlen($request->search) > 0) {
            $jasmani_kesehatan = $jasmani_kesehatan->where(function ($query) use ($request) {
                $query->where('nama_lengkap', 'LIKE', "%" . $request->search . "%")
                    ->orWhere('nama_panggilan', 'LIKE', "%" . $request->search . "%")
                    ->orWhere('no_induk', 'LIKE', "%" . $request->search . "%");
            });
        }

        if (Session::get('role_id') == 5) {
            $jasmani_kesehatan = $jasmani_kesehatan->where('siswa.id', '=', DB::raw(Session::get('id_siswa')));
        }

        $jasmani_kesehatan = $jasmani_kesehatan
        // ->where('siswa.status', '=', 1)
        ->whereNull('siswa.deleted_at')
        ->whereNull('siswa.id_jenis_keluar')
        ->orderby('kel.id_kelompok_usia', 'ASC')
        ->orderby('kel.id', 'ASC')
        ->orderby('ak.id', 'ASC')
        ->paginate(10);
        
        // return view('jasmani_kesehatan.index',compact('siswa'));
        return Inertia::render('Jasmani_Kesehatan/Index', 
        [
            'jasmani_kesehatan' => $jasmani_kesehatan,
            'semester' => $semester,
            'kelompok_usia' => $kelompok_usia,
            'kelompok' => $kelompok,
            'bulan_ke' => $bulan,
            'id_semester' => $id_semester,
            'jenis_semester' => $jenis_semester,
            'role_id' => Session::get('role_id'),
            // 'searching' => $request->only(['search']),
            'filtering' => request()->query() ?: null
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function show($id)
    {
        $data = explode('-', $id);
        $id_kelompok_siswa = $data[0];
        $bulan = $data[1];
        $id_semester = $data[2];
        // $bulan = date("n");

        $semester = DB::table('semester')->where('id', '=', $id_semester)->first();
        $nama_bulan = array (
            1 => 'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember'
        );

        if($semester->semester == 1){
            $bulanke = $bulan+6;
        }else{
            $bulanke = $bulan;
        }

        $jasmani_kesehatan = DB::table('siswa')
            ->select('ak.id AS id_kelompok_siswa', 'siswa.id AS id_siswa', 'siswa.no_induk', 'siswa.nisn', 'siswa.nama_lengkap', 'siswa.nama_panggilan', 'siswa.jenis_kelamin', 'siswa.foto', DB::raw("FLOOR(DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365) AS usia_tahun"), DB::raw("FLOOR((DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365 - FLOOR(DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365))* 12) AS usia_bulan"), 'kel.nama AS kelompok', 'ku.id AS id_kelompok_usia', 'ku.nama AS kelompok_usia', 'jas.id AS id_jasmani', 'jas.mata', 'jas.mulut', 'jas.gigi', 'jas.telinga', 'jas.hidung', 'jas.lingkar_kepala', 'jas.berat_badan', 'jas.tinggi_badan', 'smt.nama AS semester','smt.id as id_semester','smt.tanggal_mulai')
            ->join('kelompok_siswa AS ak', function($join) use ($id_kelompok_siswa) {
                $join->on('ak.id_siswa', '=', 'siswa.id');
                $join->on('ak.deleted_at', 'IS', DB::raw("null"));
                $join->on('ak.id', '=', DB::raw($id_kelompok_siswa));
            })
            ->join('kelompok AS kel', function ($join) use ($id_semester) {
                $join->on('kel.id', '=', 'ak.id_kelompok');
                $join->on('kel.id_semester', '=', DB::raw($id_semester));
                $join->on('kel.id_sekolah', '=', DB::raw(Session::get('id_sekolah')));
                $join->on('kel.deleted_at', 'IS', DB::raw("null"));
            })
            ->join('semester AS smt','smt.id','=','kel.id_semester')
            ->join('kelompok_usia AS ku','ku.id','=','kel.id_kelompok_usia')
            ->leftJoin('jasmani_kesehatan AS jas', function ($join) use($bulan, $id_semester) {
                $join->on('jas.id_kelompok_siswa', '=', 'ak.id');
                $join->on('jas.bulan', '=', DB::raw($bulan));
                $join->on('jas.id_semester', '=', DB::raw($id_semester));
            })
            ->whereNull('siswa.deleted_at')
            ->first();

        // return view('jasmani_kesehatan.edit')
        // ->with('jasmani_kesehatan', $jasmani_kesehatan);
        return Inertia::render('Jasmani_Kesehatan/Edit', 
        [
            'jasmani_kesehatan' => $jasmani_kesehatan,
            'id_kelompok_siswa' => $id_kelompok_siswa,
            'id_semester' => $id_semester,
            'bulan_ke' => $bulan,
            'nama_bulan' => $nama_bulan[(int)$bulanke],
            'nama_semester' => $semester->nama,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function jasmani_kesehatan_update(Request $request, $id)
    {
        $data = explode('-', $id);
        $id_kelompok_siswa = $data[0];
        $bulan = $data[1];
        $id_semester = $data[2];

        // $request->validate([
        //     'mata' => 'required',
        //     'mulut' => 'required',
        //     'gigi' => 'required',
        //     'telinga' => 'required',
        //     'hidung' => 'required',
        //     'lingkar_kepala' => 'required',
        //     'berat_badan' => 'required',
        //     'tinggi_badan' => 'required',
        // ]);

        $rules = [
            'mata' => ['required'],
            'mulut' => ['required'],
            'gigi' => ['required'],
            'telinga' => ['required'],
            'hidung' => ['required'],
            'lingkar_kepala' => ['required'],
            'berat_badan' => ['required'],
            'tinggi_badan' => ['required'],
        ];

        $messages = [
            'mata.required' => 'Mata harus diisi.',
            'mulut.required' => 'Mulut harus diisi.',
            'gigi.required' => 'Gigi harus diisi.',
            'telinga.required' => 'Telinga harus diisi.',
            'hidung.required' => 'Hidung harus diisi.',
            'lingkar_kepala.required' => 'Lingkar Kepala harus diisi.',
            'berat_badan.required' => 'Berat Badan harus diisi.',
            'tinggi_badan.required' => 'Tinggi Badan harus diisi.',
        ];

        $request->validate($rules, $messages);

        $user_id = Session::get('user_id');
        $role_id = Session::get('role_id');

        $datajasmanikesehatan = array(
            'id_kelompok_siswa' => $id_kelompok_siswa,
            'id_semester' => $id_semester,
            'bulan' => $bulan,
            'mata' => $request->mata,
            'mulut' => $request->mulut,
            'gigi' => $request->gigi,
            'telinga' => $request->telinga,
            'hidung' => $request->hidung,
            'lingkar_kepala' => $request->lingkar_kepala,
            'berat_badan' => $request->berat_badan,
            'tinggi_badan' => $request->tinggi_badan,
            'user_id' => $user_id,
            'role_id' => $role_id,
        );

        $cek = DB::table('jasmani_kesehatan')
            ->where('id_kelompok_siswa', '=', $id_kelompok_siswa)
            ->where('id_semester', '=', $id_semester)
            ->where('bulan', '=', $bulan)
            ->count();

        if ($cek) { //update
            $datajasmanikesehatan['updated_at'] = date('Y-m-d H:i:s');
            $simpan = DB::table('jasmani_kesehatan')
                ->where('id_kelompok_siswa', '=', $id_kelompok_siswa)
                ->where('id_semester', '=', $id_semester)
                ->where('bulan', '=', $bulan)
                ->update($datajasmanikesehatan);
        } else { //insert
            $datajasmanikesehatan['created_at'] = date('Y-m-d H:i:s');
            $simpan = DB::table('jasmani_kesehatan')->insert($datajasmanikesehatan);
        }

        if ($simpan) {
            return redirect()->route('jasmani-kesehatan.index')->with('message', 'Data Jasmani dan Kesehatan berhasil disimpan!');
        } else {
            return redirect()->route('jasmani-kesehatan.index')->with('error', 'Data Jasmani dan Kesehatan gagal disimpan!');
        }
    }
}
