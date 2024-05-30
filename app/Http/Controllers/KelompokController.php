<?php

namespace App\Http\Controllers;

use App\Models\Kelompok;
use App\Models\Sekolah;
use App\Models\KelompokUsia;
use App\Models\Semester;
use App\Models\Guru;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Session;

class KelompokController extends Controller
{
    function __construct()
    {
        $this->middleware('permission:kelompok-list|kelompok-create|kelompok-edit|kelompok-delete', ['only' => ['index','show']]);
        $this->middleware('permission:kelompok-create', ['only' => ['create','store']]);
        $this->middleware('permission:kelompok-edit', ['only' => ['edit','update']]);
        $this->middleware('permission:kelompok-delete', ['only' => ['destroy']]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $semester = Semester::get();
        $kelompok_usia = KelompokUsia::get();

        // $kelompok = Kelompok::leftjoin('kelompok_usia', 'kelompok_usia.id', '=', 'kelompok.id_kelompok_usia')
        // ->leftjoin('guru', 'guru.id', '=', 'kelompok.id_guru')
        // ->leftjoin('kelompok_siswa', function ($join) {
        //     $join->on('kelompok_siswa.id_kelompok', '=', 'kelompok.id');
        // })
        // ->leftjoin('siswa', function($join){
        //     $join->on('siswa.id', '=', 'kelompok_siswa.id_siswa');
        // })
		// ->select('kelompok_usia.nama as kelompok_usia', 'guru.nama as wali_kelas', 'kelompok.nama', 'kelompok.id', DB::raw("COUNT(siswa.id) as anggota"));//, DB::raw('SUM(kelompok_siswa.id_siswa) as anggota')
        // if($request->user()->id != 2){
        //     $id_sekolah = DB::table('sekolah')->where('id_user', '=', $request->user()->id)->first()->id;
        //     $kelompok = $kelompok->where('kelompok.id_sekolah', '=', $id_sekolah);
        // }
        // $kelompok = $kelompok->groupby('kelompok.id')->orderby('id', 'desc')->paginate(10);

        if (($request->id_semester && strlen($request->id_semester)) > 0) {
            $id_semester = $request->id_semester;
        } else {
            $id_semester = Session::get('id_semester');
        }

        if (Session::get('id_sekolah') > 0) {
            $id_sekolah = Session::get('id_sekolah');
        } else {
            $id_sekolah = 0;
        }

        $kelompok = Kelompok::query()
            ->select('kelompok.*', 'semester.nama AS semester', DB::raw("COUNT(siswa.id) AS siswa"), 'ku.nama AS kelompok_usia', 'jku.jml_kelompok_usia_sama','guru.nama AS wali_kelas')
            ->join('semester', 'semester.id', '=', 'kelompok.id_semester')
            ->join('kelompok_usia AS ku', 'ku.id', '=', 'kelompok.id_kelompok_usia')
            ->leftjoin('kelompok_siswa', function ($join) {
                $join->on('kelompok_siswa.id_kelompok', '=', 'kelompok.id');
                $join->on('kelompok_siswa.deleted_at', 'IS', DB::raw("NULL"));
            })
            ->join(DB::raw("(SELECT mk.id_kelompok_usia, COUNT(*) AS jml_kelompok_usia_sama FROM kelompok AS mk WHERE mk.id_sekolah = " . $id_sekolah . " AND mk.id_semester = " . $id_semester . " GROUP BY mk.id_kelompok_usia) AS jku"), 'jku.id_kelompok_usia', '=', 'kelompok.id_kelompok_usia') //AND mk.deleted_at IS NULL
            ->leftjoin('siswa', function($join){
                $join->on('siswa.id', '=', 'kelompok_siswa.id_siswa');
                $join->on('siswa.deleted_at', 'IS', DB::raw("null"));
            })
            ->leftjoin('guru AS guru', function($join) use($id_sekolah) {
                $join->on('guru.id','=','kelompok.id_guru');
                $join->on('guru.id_sekolah','=',DB::raw($id_sekolah));
                $join->on('guru.deleted_at','IS',DB::raw("null"));
            });

        if (Session::get('role_id') == 4) {
            $guru = DB::table('guru')->where('id_user', '=', Session::get('user_id'))->first();
            $kelompok = $kelompok->join('kelompok_guru AS pg', function ($join) use ($guru, $id_sekolah) {
                $join->on('pg.id_kelompok', '=', 'kelompok.id');
                $join->on('pg.id_guru', '=', DB::raw($guru->id));
            });
        }

        if ($request->id_kelompok_usia){
            $kelompok = $kelompok->where('ku.id','=', $request->id_kelompok_usia);
        }

        $kelompok = $kelompok
            ->where('kelompok.id_semester', '=', $id_semester)
            ->where('kelompok.id_sekolah', '=', $id_sekolah)
            ->whereNull('kelompok.deleted_at')
            ->groupby('kelompok.id')
            ->orderby('ku.id','ASC')
            ->orderby('kelompok.id','ASC')
            ->paginate(10);
        
        return Inertia::render('Master/Kelompok/Index', [
            'kelompok' => $kelompok,
            'semester' => $semester,
            'kelompok_usia' => $kelompok_usia,
            'id_semester' => $id_semester,
            'role_id' => Session::get('role_id'),
            'filtering' => request()->query() ?: null
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        // $sekolah = Sekolah::get();
        $kelompok_usia = KelompokUsia::get();
        $semester = Semester::get();

        $data_semester = DB::table('semester')->where('periode_aktif', '=', 1)->first();

        if (Session::get('id_sekolah') > 0) {
            $id_sekolah = Session::get('id_sekolah');
        } else {
            $id_sekolah = 0;
        }

        // if($request->user()->id == 2){
        //     $guru = Guru::get();
        // }else{
            // $id_sekolah = DB::table('sekolah')->where('id_user', '=', $request->user()->id)->first()->id;
            $guru = Guru::whereNull('deleted_at')->where('id_sekolah', '=', $id_sekolah)->get();
        // }

        // $guru = Guru::get();

        // return view('master.kelompok.create')
        // ->with('sekolah', $sekolah)
		// ->with('kelompok_usia', $kelompok_usia)
		// ->with('semester', $semester)
        // ->with('guru', $guru);
        return Inertia::render('Master/Kelompok/Create', 
        [
            // 'sekolah' => $sekolah,
            'kelompok_usia' => $kelompok_usia,
            'semester' => $semester,
            'data_semester' => $data_semester,
            'guru' => $guru
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // $request->validate([
        //     'nama' => 'required|string|max:250',
        //     // 'id_sekolah' => 'required',
        //     'id_kelompok_usia' => 'required',
        //     'id_semester' => 'required',
        //     'id_guru' => 'required',
        // ]);

        $rules = [
            'id_kelompok_usia' => ['required'],
            'id_semester' => ['required'],
            'id_guru' => ['required'],
            'nama' => ['required', 'string', 'max:250'],
        ];

        $messages = [
            'id_kelompok_usia.required' => 'Kelompok Usia harus diisi.',
            'id_semester.required' => 'Semester harus diisi.',
            'id_guru.required' => 'Wali Kelas harus diisi.',
            'nama.required' => 'Nama Kelompok harus diisi.',
        ];

        $request->validate($rules, $messages);

        $user_id = Session::get('user_id');
        $role_id = Session::get('role_id');
        $id_sekolah = Session::get('id_sekolah');

        $datakelompok = array(
            'nama' => $request->nama,
            'id_sekolah' => $id_sekolah,
            'id_kelompok_usia' => $request->id_kelompok_usia,
            'id_semester' => $request->id_semester,
            'id_guru' => $request->id_guru,
            'user_id' => $user_id,
            'role_id' => $role_id,
            'created_at' => date('Y-m-d H:i:s'),
        );
        $simpan = Kelompok::create($datakelompok);

        if ($simpan) {
            return redirect()->route('kelompok.index')->with('message', 'Data Kelompok dan Siswa berhasil disimpan!');
        } else {
            return redirect()->route('kelompok.index')->with('error', 'Data Kelompok dan Siswa gagal disimpan!');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Kelompok $kelompok)
    {
        // return view('master.kelompok.show', ['kelompok' => $kelompok]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Kelompok $kelompok)
    {
        if (Session::get('id_sekolah') > 0) {
            $id_sekolah = Session::get('id_sekolah');
        } else {
            $id_sekolah = 0;
        }
        
        // $sekolah = Sekolah::get();
        $kelompok_usia = KelompokUsia::get();
        $semester = Semester::get();
        $guru = Guru::whereNull('deleted_at')->where('id_sekolah', '=', $id_sekolah)->get();
        // $guru = Guru::get();

        // return view('master.kelompok.edit')
        // ->with('kelompok', $kelompok)
        // ->with('sekolah', $sekolah)
		// ->with('kelompok_usia', $kelompok_usia)
		// ->with('semester', $semester)
        // ->with('guru', $guru);
        return Inertia::render('Master/Kelompok/Edit', 
        [
            'kelompok' => $kelompok,
            // 'sekolah' => $sekolah,
            'kelompok_usia' => $kelompok_usia,
            'semester' => $semester,
            'guru' => $guru
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Kelompok $kelompok)
    {
        // $request->validate([
        //     'nama' => 'required|string|max:250',
        //     // 'id_sekolah' => 'required',
        //     'id_kelompok_usia' => 'required',
        //     'id_semester' => 'required',
        //     'id_guru' => 'required',
        // ]);

        $rules = [
            'id_kelompok_usia' => ['required'],
            'id_semester' => ['required'],
            'id_guru' => ['required'],
            'nama' => ['required', 'string', 'max:250'],
        ];

        $messages = [
            'id_kelompok_usia.required' => 'Kelompok Usia harus diisi.',
            'id_semester.required' => 'Semester harus diisi.',
            'id_guru.required' => 'Wali Kelas harus diisi.',
            'nama.required' => 'Nama Kelompok harus diisi.',
        ];

        $request->validate($rules, $messages);

        $user_id = Session::get('user_id');
        $role_id = Session::get('role_id');

        $datakelompok = array(
            'nama' => $request->nama,
            // 'id_sekolah' => $request->id_sekolah,
            'id_kelompok_usia' => $request->id_kelompok_usia,
            'id_semester' => $request->id_semester,
            'id_guru' => $request->id_guru,
            // 'user_id' => $user_id,
            // 'role_id' => $role_id,
            'updated_at' => date('Y-m-d H:i:s'),
        );
        $simpan = $kelompok->update($datakelompok);

        if ($simpan) {
            return redirect()->route('kelompok.index')->with('message', 'Data Kelompok dan Siswa berhasil disimpan!');
        } else {
            return redirect()->route('kelompok.index')->with('error', 'Data Kelompok dan Siswa gagal disimpan!');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kelompok $kelompok)
    {
        $hapus = $kelompok->delete();
        // $datakelompok = array(
        //     'deleted_at' => date('Y-m-d H:i:s'),
        // );
        // $hapus = Kelompok::where('id', $kelompok->id)->update($datakelompok);
        if ($hapus) {
            //hapus kelompok siswa dan guru
            DB::table('kelompok_siswa')->where('id_kelompok', '=', $kelompok->id)->delete();
            DB::table('kelompok_guru')->where('id_kelompok','=',$kelompok->id)->delete();
        }

        // return redirect()->route('kelompok.index')->with('message', 'Data Kelompok dan Siswa berhasil dihapus!');
        return redirect()->back();
    }

    public function kelompok_siswa(Request $request, $id)
    {
        $data = explode('-', $id);
        $id = $data[0];
        $id_semester = $data[1];

        $kelompok = Kelompok::leftjoin('kelompok_usia', 'kelompok_usia.id', '=', 'kelompok.id_kelompok_usia')
        ->leftjoin('guru', 'guru.id', '=', 'kelompok.id_guru')
        ->select('kelompok_usia.nama as kelompok_usia', 'guru.nama as wali_kelas', 'kelompok.*')
        ->find($id);

        $kelompok_usia = $kelompok->kelompok_usia;
        $batas = explode(' - ', $kelompok_usia);
        $batas_bawah = $batas[0];
        if($kelompok->id_kelompok_usia == 6){
            $batas_atas = 8;
        }else{
            $batas_atas = substr($batas[1], 0, 1);
        }

        // $siswa_sudah = Siswa::leftjoin('users', 'users.id', '=', 'siswa.id_user')
        // ->join('kelompok_siswa', 'kelompok_siswa.id_siswa', '=', 'siswa.id')
        // ->join('kelompok', 'kelompok_siswa.id_kelompok', '=', 'kelompok.id')
		// ->select('users.status as status', 'siswa.*');
        // if($request->user()->id != 2){
        //     $id_sekolah = DB::table('sekolah')->where('id_user', '=', $request->user()->id)->first()->id;
        //     $siswa_sudah = $siswa_sudah->where('siswa.id_sekolah', '=', $id_sekolah);
        // }
        // $siswa_sudah = $siswa_sudah->where('kelompok.id', '=', $id);
        // $siswa_sudah = $siswa_sudah->orderby('siswa.id', 'desc')->get();

        // $siswa_sudah = DB::table('kelompok_siswa')
        // ->join('siswa', 'kelompok_siswa.id_siswa', '=', 'siswa.id')
        // ->join('kelompok', 'kelompok_siswa.id_kelompok', '=', 'kelompok.id')
		// ->select('siswa.*', DB::raw("FLOOR(DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365) AS usia_tahun"), DB::raw("FLOOR((DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365 - FLOOR(DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365))* 12) AS usia_bulan"), DB::raw("CEILING((((DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365 - FLOOR(DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365))* 12)
        // - FLOOR((DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365 - FLOOR(DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365))* 12))* 30) AS usia_hari"));
        // if($request->user()->id != 2){
        //     $id_sekolah = DB::table('sekolah')->where('id_user', '=', $request->user()->id)->first()->id;
        //     $siswa_sudah = $siswa_sudah->where('siswa.id_sekolah', '=', $id_sekolah);
        // }
        // $siswa_sudah = $siswa_sudah->where('kelompok.id', '=', $id);
        // $siswa_sudah = $siswa_sudah->orderby('siswa.id', 'desc')->get();

        $siswa_sudah = DB::table('kelompok_siswa AS ak')
        ->select('sis.*', DB::raw("FLOOR(DATEDIFF(CURDATE(),sis.tanggal_lahir)/365) AS usia_tahun"), DB::raw("FLOOR((DATEDIFF(CURDATE(),sis.tanggal_lahir)/365 - FLOOR(DATEDIFF(CURDATE(),sis.tanggal_lahir)/365))* 12) AS usia_bulan"), DB::raw("CEILING((((DATEDIFF(CURDATE(),sis.tanggal_lahir)/365 - FLOOR(DATEDIFF(CURDATE(),sis.tanggal_lahir)/365))* 12)
        - FLOOR((DATEDIFF(CURDATE(),sis.tanggal_lahir)/365 - FLOOR(DATEDIFF(CURDATE(),sis.tanggal_lahir)/365))* 12))* 30) AS usia_hari"))
        ->join('siswa AS sis', function ($q) {
            $q->on('sis.id', '=', 'ak.id_siswa');
            $q->on('sis.id_sekolah', '=', DB::raw(Session::get('id_sekolah')));
            $q->on('sis.deleted_at', 'IS', DB::raw("null"));
        })
        ->where('ak.id_kelompok', '=', $id)
        ->whereNull('ak.deleted_at')
        ->get();

        $siswa_belum = DB::table('siswa')
        ->select('siswa.*', DB::raw("FLOOR(DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365) AS usia_tahun"), DB::raw("FLOOR((DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365 - FLOOR(DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365))* 12) AS usia_bulan"), DB::raw("CEILING((((DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365 - FLOOR(DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365))* 12)
        - FLOOR((DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365 - FLOOR(DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365))* 12))* 30) AS usia_hari"))
        ->whereNotIn('id', function ($query) use ($id_semester) {
            $query->select('ak.id_siswa')->from('kelompok_siswa AS ak')
                ->join('kelompok AS kel', function ($join) use ($id_semester) {
                    $join->on('kel.id', '=', 'ak.id_kelompok');
                    $join->on('kel.id_semester', '=', DB::raw($id_semester));
                })->whereNull('ak.deleted_at');//
        })
        ->where('id_sekolah', '=', $kelompok->id_sekolah)
        ->where(DB::raw("FLOOR(DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365)"), '>=', $batas_bawah)
        ->where(DB::raw("FLOOR(DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365)"), '<', $batas_atas)
        ->whereNull('siswa.deleted_at')
        ->whereNull('siswa.id_jenis_keluar')
        ->get();

        return Inertia::render('Master/Kelompok/Siswa', 
        [
            'kelompok' => $kelompok,
            'siswa_sudah' => $siswa_sudah,
            'siswa_belum' => $siswa_belum,
            'id_semester' => $id_semester,
            'role_id' => Session::get('role_id'),
        ]);
    }

    public function kelompok_siswa_keluar($id, $id_siswa){
        // DB::table('kelompok_siswa')
        // ->where('id_kelompok', '=', $id)
        // ->where('id_siswa', '=', $id_siswa)
        // ->delete();
        DB::table('kelompok_siswa')
            ->where('id_kelompok', '=', $id)
            ->where('id_siswa', '=', $id_siswa)
            ->update(array(
                'deleted_at' => date('Y-m-d H:i:s'),
            ));
        // return redirect()->route('kelompok-siswa', $id)->with('message', 'siswa is deleted successfully.');
        return redirect()->back()->with('message', 'Data Siswa berhasil dikeluarkan!');
    }

    public function kelompok_siswa_masuk($id, $id_siswa, $id_semester){
        // $cek = DB::table('kelompok_siswa')
        //     ->where('id_kelompok', '=', $id)
        //     ->where('id_siswa', '=', $id_siswa)
        //     ->first();

        $cek = DB::table('kelompok_siswa AS ak')
            ->join('kelompok AS kel', function ($join) use ($id_semester) {
                $join->on('kel.id', '=', 'ak.id_kelompok');
                $join->on('kel.id_semester', '=', DB::raw($id_semester));
            })
            ->where('ak.id_siswa', '=', $id_siswa)
            ->whereNotNull('ak.deleted_at')
            ->first();

        if ($cek) {
            DB::table('kelompok_siswa')
                ->where('id_siswa', '=', $id_siswa)
                ->where('id_kelompok', '=', $cek->id_kelompok)
                ->whereNotNull('deleted_at')
                ->update(array(
                    'id_kelompok' => $id,
                    'deleted_at' => null,
                ));
        } else {
            DB::table('kelompok_siswa')
                ->insert(array(
                    'id_siswa' => $id_siswa,
                    'id_kelompok' => $id,
                    'user_id' => Session::get('user_id'),
                    'role_id' => Session::get('role_id'),
                    'created_at' => date('Y-m-d H:i:s'),
                ));
        }

        // if ($cek) {
        //     DB::table('kelompok_siswa')
        //         ->where('id_kelompok', '=', $id)
        //         ->where('id_siswa', '=', $id_siswa)
        //         ->update(array(
        //             'id_kelompok' => $id,
        //         ));
        // } else {
        //     DB::table('kelompok_siswa')
        //         ->insert(array(
        //             'id_kelompok' => $id,
        //             'id_siswa' => $id_siswa,
        //             'created_at' => date('Y-m-d H:i:s'),
        //         ));
        // }
        // return redirect()->route('kelompok-siswa', $id)->with('message', 'siswa is add successfully.');
        return redirect()->back()->with('message', 'Data Siswa berhasil dimasukkan!');
    }
}
