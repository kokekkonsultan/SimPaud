<?php

namespace App\Http\Controllers;

use App\Models\Semester;
use App\Models\SettingRaporSiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Session;

class SettingRaporSiswaController extends Controller
{
    function __construct()
    {
        $this->middleware('permission:setting-rapor-siswa-list|setting-rapor-siswa-create|setting-rapor-siswa-edit|setting-rapor-siswa-delete', ['only' => ['index','show']]);
        $this->middleware('permission:setting-rapor-siswa-create', ['only' => ['create','store']]);
        $this->middleware('permission:setting-rapor-siswa-edit', ['only' => ['edit','update']]);
        $this->middleware('permission:setting-rapor-siswa-delete', ['only' => ['destroy']]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sekolah = DB::table('sekolah')
		->select('created_at')
		->where('id','=',Session::get('id_sekolah'))
		->first();

		$setting_rapor_siswa = DB::table('semester AS smt')
		->select('smt.id','smt.nama AS semester','smt.id_tahun_ajaran',DB::raw('DATE_FORMAT(set.tanggal_rapor, "%d-%m-%Y") as tanggal_rapor'),'ta.nama AS tahun_ajaran','smt.periode_aktif','smt.tanggal_mulai','smt.tanggal_selesai')
		->leftjoin('tahun_ajaran AS ta','ta.id','=','smt.id_tahun_ajaran')
		->leftjoin('setting_rapor_siswa AS set', function($join){
			$join->on('set.id_semester','=','smt.id');
			$join->on('set.id_sekolah','=',DB::raw(Session::get('id_sekolah')));
		})
		->where('smt.tanggal_selesai','>=',date('Y-m-d', strtotime($sekolah->created_at)))
		->where('smt.id','<=',Session::get('id_semester'))
		->orderby('smt.id','DESC')
		->paginate(10);

        // return view('erapor.setting_rapor_siswa.index',compact('setting_rapor_siswa'));
        return Inertia::render('Erapor/Setting_Rapor_Siswa/Index', [
            'setting_rapor_siswa' => $setting_rapor_siswa
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(SettingRaporSiswa $setting_rapor_siswa)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $setting_rapor_siswa = Semester::select('set.id','set.tanggal_rapor','set.id_sekolah', DB::raw('SUBSTRING_INDEX(semester.nama, " ", -1) as semester'), 'semester.nama AS semester_nama','ta.nama AS tahun_ajaran','semester.periode_aktif')
        ->join('tahun_ajaran AS ta','ta.id','=','semester.id_tahun_ajaran')
        ->leftjoin('setting_rapor_siswa AS set', function($join){
            $join->on('set.id_semester','=','semester.id');
            $join->on('set.id_sekolah','=',DB::raw(Session::get('id_sekolah')));
        })
        ->where('semester.id','=',$id)
        ->first();

        // return view('erapor.setting_rapor_siswa.edit',compact('setting_rapor_siswa'));
        return Inertia::render('Erapor/Setting_Rapor_Siswa/Edit', 
        [
            'setting_rapor_siswa' => $setting_rapor_siswa,
            'id_semester' => $id
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $setting = DB::table('setting_rapor_siswa')
		->where('id_sekolah','=',Session::get('id_sekolah'))
		->where('id_semester','=',$request->id_semester);

		if($setting->first()){
			$simpan = $setting->update(array('tanggal_rapor' => date('Y-m-d', strtotime($request->tanggal_rapor))));
		}else{
			$simpan = DB::table('setting_rapor_siswa')
			->insert(array(
				'id_sekolah' => Session::get('id_sekolah'),
				'id_semester' => $request->id_semester,
				'tanggal_rapor' => date('Y-m-d', strtotime($request->tanggal_rapor))
			));
		}

        if ($simpan) {
            return redirect()->route('setting-rapor-siswa.index')->with('message', 'Setting Data Rapor Siswa berhasil disimpan!');
        } else {
            return redirect()->route('setting-rapor-siswa.index')->with('error', 'Setting Data Rapor Siswa gagal disimpan!');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SettingRaporSiswa $setting_rapor_siswa)
    {
        //
    }
}
