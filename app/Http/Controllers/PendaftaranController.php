<?php

namespace App\Http\Controllers;

use App\Models\Pendaftaran;
use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Session;

class PendaftaranController extends Controller
{
    function __construct()
    {
        $this->middleware('permission:pendaftaran-list|pendaftaran-create|pendaftaran-edit|pendaftaran-delete|link-pendaftaran', ['only' => ['index','show','link_pendaftaran']]);
        $this->middleware('permission:pendaftaran-create', ['only' => ['create','store']]);
        $this->middleware('permission:pendaftaran-edit', ['only' => ['edit','update']]);
        $this->middleware('permission:pendaftaran-delete', ['only' => ['destroy']]);
        $this->middleware('permission:pendaftaran-status', ['only' => ['status_pendaftaran']]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $tahun_ajaran = TahunAjaran::get();

        $pendaftaran = Pendaftaran::query();
        $pendaftaran = $pendaftaran->select('pendaftaran.*', DB::raw('DATE_FORMAT(pendaftaran.tanggal_mulai, "%d-%m-%Y") as tanggal_mulai'), DB::raw('DATE_FORMAT(pendaftaran.tanggal_selesai, "%d-%m-%Y") as tanggal_selesai'), 'mta.nama AS tahun_ajaran')
        ->leftjoin('tahun_ajaran AS mta', 'mta.id', '=', 'pendaftaran.id_tahun_ajaran');
        if($request->has('id_tahun_ajaran')){
            $pendaftaran = $pendaftaran->where('id_tahun_ajaran','=',$request->id_tahun_ajaran);
        }
        if($request->has('search')){
            $pendaftaran = $pendaftaran->where('deksripsi', 'LIKE', "%" . $request->search . "%");
        }

        $pendaftaran = $pendaftaran->where('pendaftaran.id_sekolah', '=', Session::get('id_sekolah'))->whereNull('deleted_at')->paginate(10);

        return Inertia::render('Master/Pendaftaran/Index', [
            'tahun_ajaran' => $tahun_ajaran,
            'id_tahun_ajaran' => $request->id_tahun_ajaran,
            'pendaftaran' => $pendaftaran,
            'filtering' => request()->query() ?: null
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $tahun_ajaran = TahunAjaran::get();

        return Inertia::render('Master/Pendaftaran/Create', 
        [
            'tahun_ajaran' => $tahun_ajaran
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // $request->validate([
        //     'nama' => 'required|string|max:250',
        //     // 'id_tahun_ajaran' => 'required',
        //     'tanggal_mulai' => 'required',
        //     'tanggal_selesai' => 'required',
        // ]);

        $rules = [
            'tanggal_mulai' => ['required'],
            'tanggal_selesai' => ['required'],
            'nama' => ['required', 'string', 'max:250'],
        ];

        $messages = [
            'tanggal_mulai.required' => 'Tanggal Mulai harus diisi.',
            'tanggal_selesai.required' => 'Tanggal Selesai harus diisi.',
            'nama.required' => 'Judul harus diisi.',
        ];

        $request->validate($rules, $messages);

        $user_id = Session::get('user_id');
        $role_id = Session::get('role_id');
        $id_sekolah = Session::get('id_sekolah');

        // $cek = DB::table('pendaftaran')
        //     ->where('id_tahun_ajaran','=',$request->id_tahun_ajaran)
        //     ->count();

        // if($cek == 0){
            $datapendaftaran = array(
                // 'id_tahun_ajaran' => $request->id_tahun_ajaran,
                'id_sekolah' => $id_sekolah,
                'nama' => $request->nama,
                'tanggal_mulai' => $request->tanggal_mulai,
                'tanggal_selesai' => $request->tanggal_selesai,
                'deskripsi' => $request->deskripsi['content'],
                'user_id' => $user_id,
                'role_id' => $role_id,
                'created_at' => date('Y-m-d H:i:s'),
            );
            $simpan = Pendaftaran::create($datapendaftaran);
        // }else{
        //     $simpan = '';
        // }

        if ($simpan) {
            return redirect()->route('pendaftaran.index')->with('message', 'Data Pendaftaran berhasil disimpan!');
        } else {
            return redirect()->route('pendaftaran.index')->with('error', 'Data Pendaftaran gagal disimpan!');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Pendaftaran $pendaftaran)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pendaftaran $pendaftaran)
    {
        $tahun_ajaran = TahunAjaran::get();
        return Inertia::render('Master/Pendaftaran/Edit', 
        [
            'pendaftaran' => $pendaftaran,
            'tahun_ajaran' => $tahun_ajaran,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pendaftaran $pendaftaran)
    {
        // $request->validate([
        //     'nama' => 'required|string|max:250',
        //     // 'id_tahun_ajaran' => 'required',
        //     'tanggal_mulai' => 'required',
        //     'tanggal_selesai' => 'required',
        // ]);

        $rules = [
            'tanggal_mulai' => ['required'],
            'tanggal_selesai' => ['required'],
            'nama' => ['required', 'string', 'max:250'],
        ];

        $messages = [
            'tanggal_mulai.required' => 'Tanggal Mulai harus diisi.',
            'tanggal_selesai.required' => 'Tanggal Selesai harus diisi.',
            'nama.required' => 'Judul harus diisi.',
        ];

        $request->validate($rules, $messages);

        $user_id = Session::get('user_id');
        $role_id = Session::get('role_id');

        $datapendaftaran = array(
            // 'id_tahun_ajaran' => $request->id_tahun_ajaran,
            'nama' => $request->nama,
            'tanggal_mulai' => $request->tanggal_mulai,
            'tanggal_selesai' => $request->tanggal_selesai,
            'deskripsi' => $request->deskripsi['content'],
            // 'user_id' => $user_id,
            // 'role_id' => $role_id,
            'updated_at' => date('Y-m-d H:i:s'),
        );
        $simpan = $pendaftaran->update($datapendaftaran);

        if ($simpan) {
            return redirect()->route('pendaftaran.index')->with('message', 'Data Pendaftaran berhasil disimpan!');
        } else {
            return redirect()->route('pendaftaran.index')->with('error', 'Data Pendaftaran gagal disimpan!');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pendaftaran $pendaftaran)
    {
        $hapus = $pendaftaran->delete();

        // return redirect()->route('pendaftaran.index')->with('message', 'Data Pendaftaran berhasil dihapus!');
        return redirect()->back();
    }

    public function link_pendaftaran()
    {
        $sekolah = DB::table('sekolah')->where('id', '=', Session::get('id_sekolah'))->first();

        return Inertia::render('Master/Pendaftaran/Link', 
        [
            'sekolah' => $sekolah,
            'base_url' => env('APP_URL'),
        ]);
    }

    public function status_pendaftaran($id)
    {
        $reset = DB::table('pendaftaran')
            ->where('status', '=', 1)
            ->update(array('status' => 0));

        $upd = DB::table('pendaftaran')
            ->where('id', '=', $id)
            ->update(array('status' => 1));

        // return redirect()->route('pendaftaran.index')->with('message', 'Data Pendaftaran berhasil diaktifkan!');
        return redirect()->back();
    }

    public function scan_barcode($template){
        
        $sekolah = DB::table('sekolah')
        ->select('sekolah.*', 'prov.nama AS provinsi','kotakab.nama AS kotakab','kec.nama AS kecamatan')
        ->leftjoin('wilayah AS prov','prov.kode_wilayah','=',DB::raw("CONCAT(LEFT(sekolah.kode_wilayah,2),'0000')"))
        ->leftjoin('wilayah AS kotakab','kotakab.kode_wilayah','=',DB::raw("CONCAT(LEFT(sekolah.kode_wilayah,4),'00')"))
        ->leftjoin('wilayah AS kec','kec.kode_wilayah','=','sekolah.kode_wilayah')
        ->where('id', '=', Session::get('id_sekolah'))->first();
        return Inertia::render('Master/Pendaftaran/Barcode', 
        [
            'sekolah' => $sekolah,
            'template' => $template,
            'base_url' => env('APP_URL'),
        ]);

    }
}
