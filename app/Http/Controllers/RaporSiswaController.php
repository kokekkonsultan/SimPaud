<?php

namespace App\Http\Controllers;

use App\Models\Kelompok;
use App\Models\KelompokUsia;
use App\Models\Semester;
use App\Models\RaporSiswa;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Session;
use PDF;


class RaporSiswaController extends Controller
{
    function __construct()
    {
        $this->middleware('permission:rapor-siswa-list|rapor-siswa-create|rapor-siswa-edit|rapor-siswa-delete', ['only' => ['index','show']]);
        $this->middleware('permission:rapor-siswa-create', ['only' => ['create','store']]);
        $this->middleware('permission:rapor-siswa-edit', ['only' => ['edit','update']]);
        $this->middleware('permission:rapor-siswa-delete', ['only' => ['destroy']]);
        $this->middleware('permission:rapor-siswa-jasmani-kesehatan', ['only' => ['jasmani_kesehatan']]);
        $this->middleware('permission:rapor-siswa-status', ['only' => ['status_rapor']]);
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

        $rapor_siswa = Siswa::query()
            // ->table('siswa')
            ->select('ak.id AS id_kelompok_siswa', 'siswa.id AS id_siswa', 'siswa.jenis_kelamin', 'siswa.no_induk', 'siswa.nisn', 'siswa.nama_lengkap', 'siswa.nama_panggilan', 'siswa.foto', 'siswa.nama_ayah', 'siswa.nama_ibu', 'kel.id AS id_kelompok', 'kel.nama AS kelompok', 'kel.id_kelompok_usia', 'ku.nama AS kelompok_usia', 'jas.id AS id_rapor_siswa', 'jas.jasmani_kesehatan', 'jas.status', 'jas.dilihat_orang_tua', 'jas.tanggapan_orang_tua', 'jas.tanggal_tanggapan', 'jas.id_semester', 'aks.jumlah_penilaian')
            
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

            ->leftJoin('view_penilaian_harian_nilmax_aspek_kelompok_siswa AS aks','aks.id_kelompok_siswa','=','ak.id')

            ->leftJoin('rapor_siswa AS jas', function ($join) use ($id_semester) {
                $join->on('jas.id_kelompok_siswa', '=', 'ak.id');
                $join->on('jas.id_semester', '=', DB::raw($id_semester));
            });

        if ($request->has('id_kelompok')) {
            $rapor_siswa = $rapor_siswa->where('ak.id_kelompok', '=', $request->id_kelompok);
        } else {
            if (Session::get('role_id') == 4) {
                $rapor_siswa = $rapor_siswa->join('kelompok_guru AS pg', function ($join) {
                    $join->on('pg.id_kelompok', '=', 'kel.id');
                    $join->on('pg.id_guru', '=', DB::raw(Session::get('id_guru')));
                });
            }

        }

        if ($request->has('search') and strlen($request->search) > 0) {
            $rapor_siswa = $rapor_siswa->where(function ($query) use ($request) {
                $query->where('nama_lengkap', 'LIKE', "%" . $request->search . "%")
                    ->orWhere('nama_panggilan', 'LIKE', "%" . $request->search . "%")
                    ->orWhere('no_induk', 'LIKE', "%" . $request->search . "%");
            });
        }

        if (Session::get('role_id') == 5) {
            $rapor_siswa = $rapor_siswa->where('siswa.id', '=', DB::raw(Session::get('id_siswa')));
        }

        $rapor_siswa = $rapor_siswa
        // ->where('siswa.status', '=', 1)
        ->whereNull('siswa.deleted_at')
        ->whereNull('siswa.id_jenis_keluar')
        ->groupby('ak.id','kel.id')
        ->orderby('kel.id_kelompok_usia', 'ASC')
        ->orderby('kel.id', 'ASC')
        ->orderby('ak.id', 'ASC')
        ->paginate(10);

        // foreach ($rapor_siswa as $row) {
        //     $row->jumlah_penilaian = DB::table('view_penilaian_harian_nilmax_aspek_kelompok_siswa')
        //     ->where('id_kelompok_siswa','=',$row->id_kelompok_siswa)
        //     ->get();

        //     foreach($row->jumlah_penilaian AS $item){
        //         $item->jumlah_penilaian = (int)$item->jumlah_penilaian;
        //     }
        // }
        
        // return view('erapor/rapor_siswa.index',compact('siswa'));
        return Inertia::render('Erapor/Rapor_Siswa/Index', 
        [
            'rapor_siswa' => $rapor_siswa,
            'semester' => $semester,
            'kelompok_usia' => $kelompok_usia,
            'kelompok' => $kelompok,
            'id_semester' => $id_semester,
            'jenis_semester' => $jenis_semester,
            'role_id' => Session::get('role_id'),
            // 'searching' => $request->only(['search']),
            'filtering' => request()->query() ?: null
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
    public function show(string $id)
    {
        $data = explode('-', $id);
        $id_kelompok_siswa = $data[0];
        $id_semester = $data[1];

        $siswa = DB::table('siswa AS sis')
        ->select('sis.id AS id_siswa','sis.nama_lengkap','sis.nama_panggilan','sis.jenis_kelamin','sis.no_induk','sis.nisn','sis.foto',DB::raw("FLOOR(DATEDIFF(CURDATE(),sis.tanggal_lahir)/365) AS usia_tahun"), DB::raw("FLOOR((DATEDIFF(CURDATE(),sis.tanggal_lahir)/365 - FLOOR(DATEDIFF(CURDATE(),sis.tanggal_lahir)/365))* 12) AS usia_bulan"),'kel.nama AS kelompok','kel.id AS id_kelompok','mak.id AS id_kelompok_siswa','kel.id_semester')
        ->join('kelompok_siswa AS mak', function($join) use ($id_kelompok_siswa){
            $join->on('mak.id_siswa','=','sis.id');
            $join->on('mak.id','=',DB::raw($id_kelompok_siswa));
            $join->on('mak.deleted_at','IS',DB::raw("NULL"));
        })
        ->join('kelompok AS kel',function($query) use ($id_semester) {
            $query->on('kel.id','=','mak.id_kelompok');
            $query->on('kel.id_sekolah','=',DB::raw(Session::get('id_sekolah')));
            $query->on('kel.id_semester','=',DB::raw($id_semester));
        })
        ->whereNull('sis.deleted_at')
        ->first();

        $data_semester = DB::table('semester')->where('id', '=', $id_semester)->first();

        $narasi_dimensi = DB::table('dimensi AS ap')
        ->select('ap.id AS id_dimensi','ap.nama AS nama_dimensi','nar.narasi','pen.kode','pen.keterangan')
        ->leftjoin('view_narasi_dimensi AS nar', function($join) use ($id_semester, $id_kelompok_siswa){
            $join->on('nar.id_dimensi','=','ap.id');
            $join->on('nar.id_semester','=',DB::raw($id_semester));
            $join->on('nar.id_kelompok_siswa','=',DB::raw($id_kelompok_siswa));
        })
        ->leftjoin(DB::raw("(SELECT id_dimensi, id_kelompok_siswa, MAX(nilmax) AS nilmax
                FROM view_penilaian_harian AS a
                WHERE id_kelompok_siswa = ".$id_kelompok_siswa."
                AND tanggal >= '".$data_semester->tanggal_mulai."'
                AND tanggal <= '".$data_semester->tanggal_selesai."'
                GROUP BY id_dimensi, id_kelompok_siswa) AS nil"),'nil.id_dimensi','=','ap.id')
        ->leftjoin('penilaian AS pen','pen.id','=','nil.nilmax')
        ->where('nil.nilmax','<>','')
        ->whereNull('ap.deleted_at')
        ->get();

        

        // foreach ($narasi_dimensi as $row) { 
        // $row->nilaspek = DB::table('dimensi AS aspek')
        //     ->select('aspek.nama','nil.nilmax','pen.kode','pen.keterangan')
        //     ->leftjoin(DB::raw("(SELECT id_dimensi, id_kelompok_siswa, MAX(nilmax) AS nilmax
        //         FROM view_penilaian_harian AS a
        //         WHERE id_kelompok_siswa = ".$id_kelompok_siswa."
        //         AND tanggal >= '".$data_semester->tanggal_mulai."'
        //         AND tanggal <= '".$data_semester->tanggal_selesai."'
        //         GROUP BY id_dimensi, id_kelompok_siswa) AS nil"),'nil.id_dimensi','=','aspek.id')
        //     ->leftjoin('penilaian AS pen','pen.id','=','nil.nilmax')
        //     // ->where('aspek.id', $row->id_dimensi)
        //     ->whereNull('aspek.deleted_at')
        //     ->orderby('aspek.id','ASC')
        //     ->get();

        //     foreach($row->nilaspek AS $item){
        //         $item->nilmax = (int)$item->nilmax;
        //     }
        // }

        // $narasi = DB::table('rapor_siswa')
        // ->select('id','id_semester','id_kelompok_siswa','narasi_pendahuluan','narasi_penutup','sakit','izin','alpa','status','jasmani_kesehatan','dilihat_orang_tua','tanggapan_orang_tua')
        // ->where('id_semester','=',$id_semester)
        // ->where('id_anggota_kelompok','=',$id_kelompok_siswa)
        // ->first();

        // $narasi_aspek = DB::table('dimensi AS ap')
        // ->select('ap.id AS id_dimensi','nar.narasi')
        // ->leftjoin('view_narasi_rapor AS nar', function($join) use ($id_kelompok_siswa,$id_semester) {
        //     $join->on('nar.id_dimensi','=','ap.id');
        //     $join->on('nar.id_semester','=',DB::raw($id_semester));
        //     $join->on('nar.id_kelompok_siswa','=',DB::raw($id_kelompok_siswa));
        // })
        // ->get();

        // foreach($narasi_aspek AS $row){
        //     $row->id_dimensi = (int)$row->id_dimensi;
        // }

        // if($narasi){
        //     $narasi->id = (int)$narasi->id;
        //     $narasi->id_anggota_kelompok = (int)$narasi->id_anggota_kelompok;
        //     $narasi->id_semester = (int)$narasi->id_semester;
		// 	$narasi->sakit = (int)$narasi->sakit;
		// 	$narasi->izin = (int)$narasi->izin;
		// 	$narasi->alpa = (int)$narasi->alpa;
		// 	$narasi->status = $narasi->status == 1 ? true : false;
        //     $narasi->tampilkan_jasmani_kesehatan = $narasi->tampilkan_jasmani_kesehatan == 1 ? true : false;
        //     $narasi->dilihat_ortu = $narasi->dilihat_ortu == 1 ? true : false;
        //     $narasi->narasi_aspek = $narasi_aspek;
        // }else{
        //     $narasi = array(
        //         'izin' => 0,
        //         'sakit' => 0,
        //         'alpa' => 0,
        //         'status' => false,
        //         'tampilkan_jasmani_kesehatan' => false,
        //         'narasi_aspek' => $narasi_aspek
        //     );
        // }

        return Inertia::render('Erapor/Rapor_Siswa/Create', 
        [
            'id_kelompok_siswa' => $id_kelompok_siswa,
            'id_semester' => $id_semester,
            'siswa' => $siswa,
            'narasi_dimensi' => $narasi_dimensi,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {

        $data = explode('-', $id);
        $id_kelompok_siswa = $data[0];
        $id_semester = $data[1];

        $siswa = DB::table('siswa AS sis')
        ->select('sis.id AS id_siswa','sis.nama_lengkap','sis.nama_panggilan','sis.jenis_kelamin','sis.no_induk','sis.nisn','sis.foto',DB::raw("FLOOR(DATEDIFF(CURDATE(),sis.tanggal_lahir)/365) AS usia_tahun"), DB::raw("FLOOR((DATEDIFF(CURDATE(),sis.tanggal_lahir)/365 - FLOOR(DATEDIFF(CURDATE(),sis.tanggal_lahir)/365))* 12) AS usia_bulan"),'kel.nama AS kelompok','kel.id AS id_kelompok','mak.id AS id_kelompok_siswa','kel.id_semester')
        ->join('kelompok_siswa AS mak', function($join) use ($id_kelompok_siswa){
            $join->on('mak.id_siswa','=','sis.id');
            $join->on('mak.id','=',DB::raw($id_kelompok_siswa));
            $join->on('mak.deleted_at','IS',DB::raw("NULL"));
        })
        ->join('kelompok AS kel',function($query) use ($id_semester) {
            $query->on('kel.id','=','mak.id_kelompok');
            $query->on('kel.id_sekolah','=',DB::raw(Session::get('id_sekolah')));
            $query->on('kel.id_semester','=',DB::raw($id_semester));
        })
        ->whereNull('sis.deleted_at')
        ->first();

        $rapor_siswa = DB::table('rapor_siswa')
        ->select('id','id_semester','id_kelompok_siswa','narasi_pendahuluan','narasi_penutup','sakit','izin','alpa','status','jasmani_kesehatan','dilihat_orang_tua','tanggapan_orang_tua')
        ->where('id_semester','=',$id_semester)
        ->where('id_kelompok_siswa','=',$id_kelompok_siswa)
        ->first();

        $data_semester = DB::table('semester')->where('id', '=', $id_semester)->first();

        $narasi_dimensi = DB::table('dimensi AS ap')
        ->select('ap.id AS id_dimensi','ap.nama AS nama_dimensi','nar.narasi','pen.kode','pen.keterangan')
        ->leftjoin('view_narasi_dimensi AS nar', function($join) use ($id_semester, $id_kelompok_siswa){
            $join->on('nar.id_dimensi','=','ap.id');
            $join->on('nar.id_semester','=',DB::raw($id_semester));
            $join->on('nar.id_kelompok_siswa','=',DB::raw($id_kelompok_siswa));
        })
        ->leftjoin(DB::raw("(SELECT id_dimensi, id_kelompok_siswa, MAX(nilmax) AS nilmax
                FROM view_penilaian_harian AS a
                WHERE id_kelompok_siswa = ".$id_kelompok_siswa."
                AND tanggal >= '".$data_semester->tanggal_mulai."'
                AND tanggal <= '".$data_semester->tanggal_selesai."'
                GROUP BY id_dimensi, id_kelompok_siswa) AS nil"),'nil.id_dimensi','=','ap.id')
        ->leftjoin('penilaian AS pen','pen.id','=','nil.nilmax')
        ->where('nil.nilmax','<>','')
        ->whereNull('ap.deleted_at')
        ->get();

        foreach($narasi_dimensi AS $row){
            $row->data_narasi_dimensi_foto = DB::table('narasi_dimensi_foto')->where('id_rapor_siswa', '=', $rapor_siswa->id)->where('id_dimensi', '=', $row->id_dimensi)->get();
        }

        $data_narasi_pendahuluan_foto = DB::table('narasi_pendahuluan_foto')->where('id_rapor_siswa', '=', $rapor_siswa->id)->get();

        // foreach ($narasi_dimensi as $row) { 
        // $row->nilaspek = DB::table('dimensi AS aspek')
        //     ->select('aspek.nama','nil.nilmax','pen.kode','pen.keterangan')
        //     ->leftjoin(DB::raw("(SELECT id_dimensi, id_kelompok_siswa, MAX(nilmax) AS nilmax
        //         FROM view_penilaian_harian AS a
        //         WHERE id_kelompok_siswa = ".$id_kelompok_siswa."
        //         AND tanggal >= '".$data_semester->tanggal_mulai."'
        //         AND tanggal <= '".$data_semester->tanggal_selesai."'
        //         GROUP BY id_dimensi, id_kelompok_siswa) AS nil"),'nil.id_dimensi','=','aspek.id')
        //     ->leftjoin('penilaian AS pen','pen.id','=','nil.nilmax')
        //     ->where('aspek.id', $row->id_dimensi)
        //     ->whereNull('aspek.deleted_at')
        //     ->orderby('aspek.id','ASC')
        //     ->get();

        //     foreach($row->nilaspek AS $item){
        //         $item->nilmax = (int)$item->nilmax;
        //     }
        // }

        return Inertia::render('Erapor/Rapor_Siswa/Edit', 
        [
            'id_kelompok_siswa' => $id_kelompok_siswa,
            'id_semester' => $id_semester,
            'siswa' => $siswa,
            'rapor_siswa' => $rapor_siswa,
            'narasi_dimensi' => $narasi_dimensi,
            'data_narasi_pendahuluan_foto' => $data_narasi_pendahuluan_foto,
        ]);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $rules = [
            'izin' => ['required'],
            'sakit' => ['required'],
            'alpa' => ['required'],
        ];

        $messages = [
            'izin.required' => 'Izin harus diisi.',
            'sakit.required' => 'Sakit harus diisi.',
            'alpa.required' => 'Alpa harus diisi.',
        ];

        $request->validate($rules, $messages);
        
        $id_dimensi = $request->id_dimensi;
        $narasi_dimensi = $request->narasi_dimensi;
        // echo sizeof($narasi_dimensi);
        // exit; 

        
        // exit;
        // echo sizeof($request->data_narasi_dimensi_foto);

        // for($n=0 ; $n<sizeof($request->data_narasi_dimensi_foto) ; $n++){
        //     if(isset($request->data_narasi_dimensi_foto[$n])){
        //         foreach ($request->data_narasi_dimensi_foto[$n] as $file) {
        //             echo "<br>".$file->getClientOriginalName();
        //         }
        //     }

        // }

        // foreach ($request->data_narasi_dimensi_foto[1] as $file) {
            // echo "<br>".$file->getClientOriginalName();
        // }

        // echo '<pre>'.print_r($request->data_narasi_dimensi_foto).'</pre>';
        // echo "<br>";

        // echo "trial = ".print_r($request->file('foto_pendahuluan'));
        // foreach ($request->file('data_narasi_dimensi_foto') as $file) {
        //     echo "<br>".$file->getClientOriginalName();
        // }

        // $fileArray = $this->reArrayFiles($request->data_narasi_pendahuluan_foto);
        // foreach ($fileArray as $file) {
        //     echo "File Name: " . htmlspecialchars($file['name']) . "<br>";
        //     echo "File Type: " . htmlspecialchars($file['type']) . "<br>";
        //     echo "File Size: " . htmlspecialchars($file['size']) . " bytes<br><br>";
        // }

        // echo print_r($request->data_narasi_pendahuluan_foto);
        
        

        
        // exit;



        // echo ($request->narasi_pendahuluan['content']);
        // exit;
        // $vowels = array('{"content":"', '"}');
        // $narasi_pendahuluan = str_replace($vowels, "", $request->narasi_pendahuluan);
        // $narasi_penutup = str_replace($vowels, "", $request->narasi_penutup);

        $input = array(
            'id_semester' => $request->id_semester,
            'id_kelompok_siswa' => $request->id_kelompok_siswa,
            'narasi_pendahuluan' => $request->narasi_pendahuluan['content'],//
			'narasi_penutup' => $request->narasi_penutup['content'],//
			'sakit' => $request->sakit,
			'izin' => $request->izin,
			'alpa' => $request->alpa,
            'status' => 0,
            'jasmani_kesehatan' => 0,
            'role_id' => Session::get('role_id'),
            'user_id' => Session::get('user_id')
        );

        $narasi_rapor = DB::table('rapor_siswa')
        ->where('id_semester','=',$request->id_semester)
        ->where('id_kelompok_siswa','=',$request->id_kelompok_siswa)
        ->first();

        if($narasi_rapor){
            $update = DB::table('rapor_siswa')
            ->where('id_semester','=',$request->id_semester)
            ->where('id_kelompok_siswa','=',$request->id_kelompok_siswa)
            ->update($input);

            //return redirect()->route('rapor-siswa.index')->with('message', 'Rapor Siswa is updated successfully.');
            // $id_rapor_siswa = $narasi_rapor->id;
        }else{
            $input['created_at'] = date('Y-m-d H:i:s');
            $insert = DB::table('rapor_siswa')
            ->insert($input);

            if($insert){
                $narasi_rapor = DB::table('rapor_siswa')
                ->where('id_semester','=',$request->id_semester)
                ->where('id_kelompok_siswa','=',$request->id_kelompok_siswa)
                ->first();
            }

            // $id_rapor_siswa = DB::table('rapor_siswa')::orderby('created_at', 'DESC')->first()->id;
            //return redirect()->route('rapor-siswa.index')->with('message', 'Rapor Siswa is updated successfully.');
        }

        // $dimensi = DB::table('dimensi AS ap')
        // ->whereNull('ap.deleted_at')
        // ->get();

        $data_semester = DB::table('semester')->where('id', '=', $request->id_semester)->first();

        if ($request->hasFile('foto_pendahuluan')) {
            foreach ($request->file('foto_pendahuluan') as $image) {
                // if ($request->hasFile('foto')) {
                    // $image = $request->file('foto');
                    $destinationPath = 'images/rapor/';
                    // $profileImage = date('YmdHis') . "." . $image->getClientOriginalExtension();
                    $profileImage = date('YmdHis') . '-' . $image->getClientOriginalName();
                    $image->move($destinationPath, $profileImage);
                    $foto = $profileImage;
                // }else{
                //     $foto = '';
                // }
                // echo $foto."<br>";

                $insdata = array(
                    'id_rapor_siswa' => $narasi_rapor->id,
                    'foto' => $foto,
                    'role_id' => Session::get('role_id'),
                    'user_id' => Session::get('user_id'),
                    'created_at' => date('Y-m-d H:i:s')
                );
                $ins = DB::table('narasi_pendahuluan_foto')->insert($insdata);
            }
        }

        for($n=0 ; $n<sizeof($request->data_narasi_dimensi_foto) ; $n++){
            if(isset($request->data_narasi_dimensi_foto[$n])){
                foreach ($request->data_narasi_dimensi_foto[$n] as $image) {

                    // if ($request->hasFile('foto')) {
                        // $image = $request->file('foto');
                        $destinationPath = 'images/rapor/';
                        // $profileImage = date('YmdHis') . "." . $image->getClientOriginalExtension();
                        $profileImage = date('YmdHis') . '-' . $image->getClientOriginalName();
                        $image->move($destinationPath, $profileImage);
                        $foto = $profileImage;
                    // }else{
                    //     $foto = '';
                    // }
                    // echo $foto.'<br>';

                    $insdata = array(
                        'id_rapor_siswa' => $narasi_rapor->id,
                        'id_dimensi' => $n,
                        'foto' => $foto,
                        'role_id' => Session::get('role_id'),
                        'user_id' => Session::get('user_id'),
                        'created_at' => date('Y-m-d H:i:s')
                    );
                    $ins = DB::table('narasi_dimensi_foto')->insert($insdata);
                }
            }
        }

        $dimensi = DB::table('dimensi AS ap')
        ->select('ap.id')
        ->leftjoin('view_narasi_dimensi AS nar', function($join) use ($request){
            $join->on('nar.id_dimensi','=','ap.id');
            $join->on('nar.id_semester','=',DB::raw($request->id_semester));
            $join->on('nar.id_kelompok_siswa','=',DB::raw($request->id_kelompok_siswa));
        })
        ->leftjoin(DB::raw("(SELECT id_dimensi, id_kelompok_siswa, MAX(nilmax) AS nilmax
                FROM view_penilaian_harian AS a
                WHERE id_kelompok_siswa = ".$request->id_kelompok_siswa."
                AND tanggal >= '".$data_semester->tanggal_mulai."'
                AND tanggal <= '".$data_semester->tanggal_selesai."'
                GROUP BY id_dimensi, id_kelompok_siswa) AS nil"),'nil.id_dimensi','=','ap.id')
        ->leftjoin('penilaian AS pen','pen.id','=','nil.nilmax')
        ->where('nil.nilmax','<>','')
        ->whereNull('ap.deleted_at')
        ->get();

        // for($n=0 ; $n<sizeof($narasi_dimensi) ; $n++){
            // echo ($n+1).', ';
            // echo $narasi_rapor->id;
            // exit;
        // echo print_r($request->data_narasi_dimensi);
        // exit;

        if((isset($request->data_narasi_dimensi)) || ($request->data_narasi_dimensi != '')){
            foreach ($request->data_narasi_dimensi as $item) {
                // echo $item;
                if(isset($item)){
                    $data = explode('=====', $item);
                    // $id_dimensi = $data[0];
                    if((isset($data[0])) && (isset($data[1]))){
                        $narasi_dimensi = $data[1];
                        $id_dimensi = $data[0];

                        $check = DB::table('narasi_dimensi')
                        ->where('id_rapor_siswa','=',$narasi_rapor->id)
                        ->where('id_dimensi','=',$id_dimensi)
                        ->first();

                        if(!$check){
                            $insdata = array(
                                'id_rapor_siswa' => $narasi_rapor->id,
                                'id_dimensi' => $id_dimensi,
                                'narasi' => $narasi_dimensi,
                                'role_id' => Session::get('role_id'),
                                'user_id' => Session::get('user_id'),
                                'created_at' => date('Y-m-d H:i:s')
                            );
                            $ins = DB::table('narasi_dimensi')
                            ->insert($insdata);
                        }else{
                            $upddata = array(
                                'narasi' => $narasi_dimensi,
                                'updated_at' => date('Y-m-d H:i:s')
                            );

                            $upd = DB::table('narasi_dimensi')
                            ->where('id_rapor_siswa','=',$narasi_rapor->id)
                            ->where('id_dimensi','=',$id_dimensi)
                            ->update($upddata);
                        }
                    }
                }
            }
        }
        // exit;


        /*$n=-1;
        foreach ($dimensi as $row) {
            $n++;   
            // echo $narasi_dimensi[$n].', ';
            $check = DB::table('narasi_dimensi')
            ->where('id_rapor_siswa','=',$narasi_rapor->id)
            ->where('id_dimensi','=',$row->id)
            ->first();
            // echo $n.', ';

            if(!$check){
                $insdata = array(
                    'id_rapor_siswa' => $narasi_rapor->id,
                    'id_dimensi' => $row->id,
                    'narasi' => $narasi_dimensi[$n],
                    'role_id' => Session::get('role_id'),
                    'user_id' => Session::get('user_id'),
                    'created_at' => date('Y-m-d H:i:s')
                );
                $ins = DB::table('narasi_dimensi')
                ->insert($insdata);
            }else{
                $upddata = array(
                    'narasi' => $narasi_dimensi[$n],
                    // 'role_id' => Session::get('role_id'),
                    // 'user_id' => Session::get('user_id'),
                    'updated_at' => date('Y-m-d H:i:s')
                );

                $upd = DB::table('narasi_dimensi')
                ->where('id_rapor_siswa','=',$narasi_rapor->id)
                ->where('id_dimensi','=',$row->id)
                ->update($upddata);
            }
        }*/












        

        // $id_rapor_siswa = $narasi_rapor->id;
        // $id_dimensi = $request->id_dimensi;
        // $narasi_dimensi = $request->narasi_dimensi;
        // for($n=0 ; $n<sizeof($narasi_dimensi) ; $n++){
        //     // echo $narasi_dimensi[$n].', ';
        //     exit;

        //     $check = DB::table('narasi_dimensi')
        //     ->where('id_rapor_siswa','=',$narasi_rapor->id)
        //     ->where('id_dimensi','=',$id_dimensi[$n])
        //     ->first();

        //     if(!$check){
        //         $insdata = array(
        //             'id_rapor_siswa' => $id_rapor_siswa,
        //             'id_dimensi' => $id_dimensi[$n],
        //             'narasi' => $narasi_dimensi[$n],
        //             'role_id' => Session::get('role_id'),
        //             'user_id' => Session::get('user_id'),
        //             'created_at' => date('Y-m-d H:i:s')
        //         );
        //         $ins = DB::table('narasi_dimensi')
        //         ->insert($insdata);
        //     }else{
        //         $upddata = array(
        //             'narasi' => $narasi_dimensi[$n],
        //             // 'role_id' => Session::get('role_id'),
        //             // 'user_id' => Session::get('user_id'),
        //             'updated_at' => date('Y-m-d H:i:s')
        //         );

        //         $upd = DB::table('narasi_dimensi')
        //         ->where('id_rapor_siswa','=',$narasi_rapor->id)
        //         ->where('id_dimensi','=',$id_dimensi[n])
        //         ->update($upddata);
        //     }
        // }
        // exit;

        return redirect()->route('rapor-siswa.index')->with('message', 'Data Rapor Siswa berhasil disimpan!');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function jasmani_kesehatan($id, $jasmani_kesehatan)
    {
        $stat = $jasmani_kesehatan == 1 ? 0 : 1;

        $upd = DB::table('rapor_siswa')
            ->where('id', '=', $id)
            ->update(array('jasmani_kesehatan' => $stat));
        
        $stat_message = $stat == 1 ? "diaktifkan" : "dinonaktifkan";

        // return redirect()->route('rapor-siswa.index')->with('message', 'Data Jasmani dan Kesehatan berhasil '.$stat_message.'!');
        return redirect()->back();
    }

    public function status_rapor($id, $status)
    {
        $stat = $status == 1 ? 0 : 1;

        $upd = DB::table('rapor_siswa')
            ->where('id', '=', $id)
            ->update(array('status' => $stat));

        $stat_message = $stat == 1 ? "diaktifkan" : "dinonaktifkan";

        // return redirect()->route('rapor-siswa.index')->with('message', 'Unduh Rapor berhasil '.$stat_message.'!');
        return redirect()->back();
    }

    public function lihat_rapor(string $id)
    {
        $data = explode('-', $id);
        $id_kelompok_siswa = $data[0];
        $id_semester = $data[1];

        if (Session::get('role_id') == 5) {
            $upd = DB::table('rapor_siswa')
            ->where('id_kelompok_siswa', '=', $id_kelompok_siswa)
            ->where('id_semester', '=', $id_semester)
            ->update(array('dilihat_orang_tua' => 1));
        }

        $siswa = DB::table('siswa AS sis')
        ->select('sis.id AS id_siswa','sis.nama_lengkap','sis.nama_ayah','sis.nama_ibu','sis.nama_wali','sis.nama_panggilan','sis.jenis_kelamin','sis.no_induk','sis.nisn','sis.foto', DB::raw('DATE_FORMAT(sis.tanggal_masuk, "%d-%m-%Y") as tanggal_masuk'), 'sis.tempat_lahir', DB::raw('DATE_FORMAT(sis.tanggal_lahir, "%d-%m-%Y") as tanggal_lahir'),'kel.nama AS kelompok','kel.id AS id_kelompok','mak.id AS id_kelompok_siswa','kel.id_semester','wk.nama AS wali_kelas','wk.tanda_tangan', DB::raw('DATE_FORMAT(tr.tanggal_rapor, "%d-%m-%Y") as tanggal_rapor'))
        ->join('kelompok_siswa AS mak', function($join) use ($id_kelompok_siswa){
            $join->on('mak.id_siswa','=','sis.id');
            $join->on('mak.id','=',DB::raw($id_kelompok_siswa));
            $join->on('mak.deleted_at','IS',DB::raw("NULL"));
        })
        ->join('kelompok AS kel',function($query) use ($id_semester) {
            $query->on('kel.id','=','mak.id_kelompok');
            $query->on('kel.id_sekolah','=',DB::raw(Session::get('id_sekolah')));
            $query->on('kel.id_semester','=',DB::raw($id_semester));
        })
        ->join('semester AS sem','sem.id','=','kel.id_semester')
        ->leftjoin('setting_rapor_siswa AS tr',function($join){
            $join->on('tr.id_sekolah','=','kel.id_sekolah');
            $join->on('tr.id_semester','=','sem.id');
        })
        ->leftjoin('guru AS wk','wk.id','=','kel.id_guru')
        ->whereNull('sis.deleted_at')
        ->first();

        $sekolah = DB::table('sekolah AS skh')
        ->select('skh.*','kota.nama AS kotakab','kec.nama AS kecamatan')
        ->leftjoin('wilayah AS kota','kota.kode_wilayah','=',DB::raw("CONCAT(LEFT(skh.kode_wilayah,4),'00')"))
        ->leftjoin('wilayah AS kec','kec.kode_wilayah','=','skh.kode_wilayah')
        ->where('skh.id','=',Session::get('id_sekolah'))
        ->first();

        $data_semester = DB::table('semester')->where('id', '=', $id_semester)->first();
        $nama_semester = $data_semester->nama;

        // $nilai = DB::table('view_penilaian_harian AS nil')
        // ->select('nil.*','b.narasi','b.id_penilaian','ap.icon')
        // ->join('dimensi AS ap','ap.id','=','nil.id_dimensi')
        // ->leftjoin('view_narasi_dimensi AS b',function($join) use($id_semester, $id_kelompok_siswa){
        //     $join->on('b.id_dimensi','=','nil.id_dimensi');
        //     $join->on('b.id_semester','=',DB::raw($id_semester));
        //     $join->on('b.id_kelompok_siswa','=',DB::raw($id_kelompok_siswa));
        // })
        // ->where('nil.id_kelompok_siswa','=',$id_kelompok_siswa)
        // ->where('nil.tanggal', '>=', $data_semester->tanggal_mulai)
        // ->where('nil.tanggal', '<=', $data_semester->tanggal_selesai)
        // ->orderby('nil.id_dimensi','ASC')
        // ->get();



        $rapor_siswa = DB::table('rapor_siswa')
        ->select('id','id_semester','id_kelompok_siswa','narasi_pendahuluan','narasi_penutup','sakit','izin','alpa','status','jasmani_kesehatan','dilihat_orang_tua','tanggapan_orang_tua')
        ->where('id_semester','=',$id_semester)
        ->where('id_kelompok_siswa','=',$id_kelompok_siswa)
        ->first();

        $jasmani_kesehatan = DB::table('jasmani_kesehatan')
        ->select('*')
        ->where('id_semester','=',$id_semester)
        ->where('id_kelompok_siswa','=',$id_kelompok_siswa)
        ->orderby('bulan','ASC')
        ->get();

        $narasi_dimensi = DB::table('dimensi AS ap')
        ->select('ap.id AS id_dimensi','ap.nama AS nama_dimensi','nar.narasi','pen.kode','pen.keterangan')
        ->leftjoin('view_narasi_dimensi AS nar', function($join) use ($id_semester, $id_kelompok_siswa){
            $join->on('nar.id_dimensi','=','ap.id');
            $join->on('nar.id_semester','=',DB::raw($id_semester));
            $join->on('nar.id_kelompok_siswa','=',DB::raw($id_kelompok_siswa));
        })
        ->leftjoin(DB::raw("(SELECT id_dimensi, id_kelompok_siswa, MAX(nilmax) AS nilmax
                FROM view_penilaian_harian AS a
                WHERE id_kelompok_siswa = ".$id_kelompok_siswa."
                AND tanggal >= '".$data_semester->tanggal_mulai."'
                AND tanggal <= '".$data_semester->tanggal_selesai."'
                GROUP BY id_dimensi, id_kelompok_siswa) AS nil"),'nil.id_dimensi','=','ap.id')
        ->leftjoin('penilaian AS pen','pen.id','=','nil.nilmax')
        ->where('nil.nilmax','<>','')
        ->whereNull('ap.deleted_at')
        ->get();

        $kepala_sekolah = DB::table('kepala_sekolah')
        ->where('id_sekolah','=',$sekolah->id)
        ->where('id_semester','=',$id_semester)
        ->first();

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

        $foto_sekolah = ($sekolah->foto) ? public_path() .'/images/sekolah/'.$sekolah->foto : public_path() .'/images/tutwuri_logo.png';
        $kepala_sekolah_tanda_tangan = ($kepala_sekolah->tanda_tangan) ? public_path() .'/images/sekolah/'.$kepala_sekolah->tanda_tangan : '';
        $wali_kelas_tanda_tangan = ($siswa->tanda_tangan) ? public_path() .'/images/guru/'.$siswa->tanda_tangan : '';
        $foto_jenis_kelamin = ($siswa->jenis_kelamin == 'L') ? public_path() .'/images/boy.png' : public_path() .'/images/girl.png';
        $foto_siswa = ($siswa->foto) ? public_path() .'/images/siswa/'.$siswa->foto : $foto_jenis_kelamin;
        $no_telpon = ($sekolah->no_telpon) ? 'Telpon: '.$sekolah->no_telpon.' - ' : "";
        $jenis_kelamin = ($siswa->jenis_kelamin == 'L') ? "Laki-laki" : "Perempuan";
        $nama_ayah = ($siswa->nama_ayah) ? $siswa->nama_ayah : "-";
        $nama_ibu = ($siswa->nama_ibu) ? $siswa->nama_ibu : "-";
        $nama_wali = ($siswa->nama_wali) ? $siswa->nama_wali : "-";
        $tanggal_rapor = date('d', strtotime($siswa->tanggal_rapor)).' '.$nama_bulan[str_replace('0', '', date('m', strtotime($siswa->tanggal_rapor)))].' '.date('Y', strtotime($siswa->tanggal_rapor));

        $html = '<html>
        <head>
        <style type="text/css">
            .beta td {
                padding: 2px 8px;
                border: 1px solid #ddd;
            }

            .image {
                display: table;
                clear: both;
                text-align: center;
                /*margin: 0.9em auto;*/
                min-width: 50px;
            }

            .image-style-side-right {
                float: right;
                margin-left: var(1.5em);
                max-width: 50%;
            }

            .image-style-side {
                float: right;
                margin-left: var(1.5em);
                max-width: 50%;
            }
        </style>
        </head>
        <body>
        <table align="center">
            <tbody>
                <tr>
                    <td align="center">
                    <table align="center" border="0" width="100%">
                        <tr>
                            <td align="center"><img src="'.$foto_sekolah.'" width="150" /></td>
                            <td align="center"><div style="font-size: 22px; font-weight: bold; font-family: Arial; ">'.$sekolah->nama.'</div>
                            
                                <div align="center" style="padding-top: 5px; ">'.$sekolah->alamat.', '.$sekolah->kecamatan.' '.$sekolah->kotakab.'</div>
                                <div align="center" style="padding-top: 5px; ">'.$no_telpon.' Email: '.$sekolah->email.'</div>';

                                if($sekolah->npsn){
                                    $html .= '<div align="center" style="padding-top: 5px; ">NPSN: '.$sekolah->npsn.'</div>';
                                }

                            $html .= '</td>
                        </tr>
                    </table>
                    </td>
                </tr>
                <!--<tr>
                    <td align="center"><img src="'.$foto_sekolah.'" width="150" /></td>
                </tr>
                <tr>
                    <td align="center" style="font-size: 22px; font-weight: bold; font-family: Arial; ">'.$sekolah->nama.'</td>
                </tr>
                <tr>
                    <td align="center">'.$sekolah->alamat.'<br>'.$sekolah->kecamatan.', '.$sekolah->kotakab.'</td>
                </tr>
                <tr>
                    <td align="center">'.$no_telpon.' Email: '.$sekolah->email.'</td>
                </tr>-->';
                if($sekolah->npsn){
                    $html .= '<!--<tr>
                    <td align="center">NPSN: '.$sekolah->npsn.'</td>
                </tr>-->';
                }
                $html .= '<tr>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td><hr /></td>
                </tr>
                <tr>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td align="center" style="font-size: 30px; font-weight: bold; font-family: Arial; ">Catatan Perkembangan Anak</td>
                </tr>
                <tr>
                    <td align="center">Semester '.$data_semester->semester.' - '.$nama_semester.'</td>
                </tr>

                <tr>
                    <td>&nbsp;</td>
                </tr>
                
                <tr>
                    <td align="center">
                        
                    <table align="center" class="beta" cellspacing="0" cellpadding="0">
                        <tbody>
                            <tr>
                                <td rowSpan="3"><img src="'.$foto_siswa.'" alt="" width="100" /></td>
                                <td><span>Nama Ananda</span><br /><b>'.$siswa->nama_lengkap.'</b></td>
                                <td><span>Jenis Kelamin</span><br /><b>'.$jenis_kelamin.'</b></td>
                                <td><span>Tempat / Tanggal Lahir</span><br /><b>'.$siswa->tempat_lahir.' / '.$siswa->tanggal_lahir.'</b></td>
                            </tr>
                            <tr>
                                <td><span>Tanggal Masuk</span><br /><b>'.$siswa->tanggal_masuk.'</b></td>
                                <td><span>Kelompok</span><br /><b>'.$siswa->kelompok.'</b></td>
                                <td><span>No. Induk / NISN</span><br /><b>'.$siswa->no_induk .'/ '.$siswa->nisn.'</b></td>
                            </tr>
                            <tr>
                                <td><span>Nama Ayah</span><br /><b>'.$nama_ayah.'</b></td>
                                <td><span>Nama Ibu</span><br /><b>'.$nama_ibu.'</b></td>
                                <td><span>Nama Wali</span><br /><b>'.$nama_wali.'</b></td>
                            </tr>
                        </tbody>
                    </table>

                    </td>
                </tr>
                
                <tr>
                    <td>&nbsp;</td>
                </tr>';

                if(($rapor_siswa->jasmani_kesehatan == 1) && ($jasmani_kesehatan)){
                $html .= '<tr>
                    <td style="font-size: 22px; font-weight: bold; font-family: Arial; ">Jasmani Kesehatan</td>
                </tr>
                <tr>
                    <td>
                        <table align="center" class="beta" cellspacing="0" cellpadding="0" width="100%">
                            <thead>
                                <tr>
                                    <td align="center"><b>Bulan</b></td>
                                    <td align="center"><b>Mata</b></td>
                                    <td align="center"><b>Mulut</b></td>
                                    <td align="center"><b>Gigi</b></td>
                                    <td align="center"><b>Telinga</b></td>
                                    <td align="center"><b>Hidung</b></td>
                                    <td align="center"><b>Lingkar Kepala</b></td>
                                    <td align="center"><b>Berat Badan</b></td>
                                    <td align="center"><b>Tinggi Badan</b></td>
                                </tr>
                            </thead>
                            <tbody>';
                            foreach ($jasmani_kesehatan as $row) {
                            $html .= '<tr>
                                    <td>'.$nama_bulan[$row->bulan].'</td>
                                    <td align="center">'.$row->mata.'</td>
                                    <td align="center">'.$row->mulut.'</td>
                                    <td align="center">'.$row->gigi.'</td>
                                    <td align="center">'.$row->telinga.'</td>
                                    <td align="center">'.$row->hidung.'</td>
                                    <td align="center">'.$row->lingkar_kepala.' Cm</td>
                                    <td align="center">'.$row->berat_badan.' Kg</td>
                                    <td align="center">'.$row->tinggi_badan.' Cm</td>
                                </tr>';
                            }

                                $html .= '</tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>&nbsp;</td>
                </tr>';
                }

                $data_narasi_pendahuluan_foto = DB::table('narasi_pendahuluan_foto')->where('id_rapor_siswa', '=', $rapor_siswa->id)->get();
                
                $html .= '<tr>
                    <td style="font-size: 22px; font-weight: bold; font-family: Arial; ">Pendahuluan</td>
                </tr>
                <tr>
                    <td>'.str_replace('../../images/media/', 'images/media/', $rapor_siswa->narasi_pendahuluan).'</td>
                </tr>';
                $html .= '<tr>
                <td>';

                
                
                $html .= '</td>
            </tr><table>';

                $columns = 4;  
                $counter = 0;  

                $html .= '<tr>';
                foreach ($data_narasi_pendahuluan_foto as $item) {
                    $html .= '<td style="padding:10px; "><img src="images/rapor/'.$item->foto.'" alt="" width="150" /></td>';
                    $counter++;
                    if ($counter % $columns == 0 && $counter < count($data)) {
                        $html .= '</tr><tr>';
                    }
                }

                // Close the last row if necessary
                if ($counter % $columns != 0) {
                    $remaining = $columns - ($counter % $columns);
                    for ($i = 0; $i < $remaining; $i++) {
                        $html .= '<td></td>';
                    }
                    $html .= '</tr>';
                }


                $html .= '</table><tr>
                    <td>&nbsp;</td>
                </tr>';

                
                foreach ($narasi_dimensi as $row) { 
                    // $row->nilaspek = DB::table('dimensi AS aspek')
                    // ->select('aspek.nama','nil.nilmax','pen.kode','pen.keterangan')
                    // ->leftjoin(DB::raw("(SELECT id_dimensi, id_kelompok_siswa, MAX(nilmax) AS nilmax
                    //     FROM view_penilaian_harian AS a
                    //     WHERE id_kelompok_siswa = ".$id_kelompok_siswa."
                    //     AND tanggal >= '".$data_semester->tanggal_mulai."'
                    //     AND tanggal <= '".$data_semester->tanggal_selesai."'
                    //     GROUP BY id_dimensi, id_kelompok_siswa) AS nil"),'nil.id_dimensi','=','aspek.id')
                    // ->leftjoin('penilaian AS pen','pen.id','=','nil.nilmax')
                    // ->where('aspek.id', $row->id_dimensi)
                    // ->whereNull('aspek.deleted_at')
                    // ->orderby('aspek.id','ASC')
                    // ->get();

                    if($row->narasi){

                        $data_narasi_dimensi_foto = DB::table('narasi_dimensi_foto')->where('id_rapor_siswa', '=', $rapor_siswa->id)->where('id_dimensi', '=', $row->id_dimensi)->get();
                $html .= '
                <tr>
                    <td>
                    
                    <table>
                        <tr>
                            <td style="font-size: 22px; font-weight: bold; font-family: Arial; ">'.$row->nama_dimensi;
                            
                            // foreach($row->nilaspek AS $item){
                                // $item->nilmax = (int)$item->nilmax;
                            if($row->kode == 'SM'){
                                $html .= ' &nbsp; <span style="background-color: rgb(0 128 0); padding:5px 10px; font-size:16px; font-weight: normal; color:#fff; ">'.$row->keterangan.'</span>';
                            }else{
                                $html .= ' &nbsp; <span style="background-color: rgb(255 215 0); padding:5px 10px; font-size:16px; font-weight: normal; color:#fff; ">'.$row->keterangan.'</span>';
                            }
                            // }
                            
                            $html .= '</td>
                        </tr>
                        <tr>
                            <td>'.str_replace('../../images/media/', 'images/media/', nl2br($row->narasi)).'</td>
                        </tr>';

                        $html .= '<tr>
                            <td><table>';

                                $columns = 4;  
                                $counter = 0;  

                                $html .= '<tr>';
                                foreach ($data_narasi_dimensi_foto as $item) {
                                    $html .= '<td style="padding:10px; "><img src="images/rapor/'.$item->foto.'" alt="" width="150" /></td>';
                                    $counter++;
                                    if ($counter % $columns == 0 && $counter < count($data)) {
                                        $html .= '</tr><tr>';
                                    }
                                }

                                // Close the last row if necessary
                                if ($counter % $columns != 0) {
                                    $remaining = $columns - ($counter % $columns);
                                    for ($i = 0; $i < $remaining; $i++) {
                                        $html .= '<td></td>';
                                    }
                                    $html .= '</tr>';
                                }
                            
                            $html .= '</table></td>
                        </tr>';
                        

                        $html .= ' </table>
                    
                    </td>
                </tr>
                <tr>
                    <td>&nbsp;</td>
                </tr>';
                }
            }
                
                
                $html .= '<tr>
                    <td style="font-size: 22px; font-weight: bold; font-family: Arial; ">Penutup</td>
                </tr>
                <tr>
                    <td>'.str_replace('../../images/media/', 'images/media/', $rapor_siswa->narasi_penutup).'</td>
                </tr>

                <tr>
                    <td>&nbsp;</td>
                </tr>
                
                <tr>
                    <td>
                        
                    <table align="center" class="beta" cellspacing="0" cellpadding="0" width="85%">
                        <tbody>
                            <tr>
                                <td>Absensi</td>
                                <td><span>Izin</span><br /><b>'.$rapor_siswa->izin.'</b></td>
                                <td><span>Sakit</span><br /><b>'.$rapor_siswa->sakit.'</b></td>
                                <td><span>Alpa</span><br /><b>'.$rapor_siswa->alpa.'</b></td>
                            </tr>
                        </tbody>
                    </table>

                    </td>
                </tr>
                <tr>
                    <td>&nbsp;</td>
                </tr>
                
                <tr>
                    <td>
                        
                    <table align="center" border="0" width="85%">
                        <tbody>
                            <tr>
                                <td></td>
                                <td align="center">'.$sekolah->kotakab.', '.$tanggal_rapor.'</td>
                            </tr>
                            <tr>
                                <td align="center">Kepala Sekolah</td>
                                <td align="center">Wali Kelas</td>
                            </tr>
                            <tr>
                                <td align="center"><img src="'.$kepala_sekolah_tanda_tangan.'" width="100" /></td>
                                <td align="center"><img src="'.$wali_kelas_tanda_tangan.'" width="100" /></td>
                            </tr>
                            <tr>
                                <td align="center"><b>'.$kepala_sekolah->nama.'</b></td>
                                <td align="center"><b>'.$siswa->wali_kelas.'</b></td>
                            </tr>
                        </tbody>
                    </table>

                    </td>
                </tr>
                
            </tbody>
        </table>
        </body></html>';

    $pdf= PDF::loadHTML($html);
    $pdf->setPaper('L', 'portrait');
                   
    return $pdf->stream($siswa->nama_lengkap.' (Semester '.$data_semester->semester.' - '.$nama_semester.').pdf');
    // echo $html;
    // return $pdf->download($siswa->nama_lengkap.'.pdf');

        // return Inertia::render('Erapor/Rapor_Siswa/View', 
        // [
        //     'id_kelompok_siswa' => $id_kelompok_siswa,
        //     'id_semester' => $id_semester,
        //     'siswa' => $siswa,
        //     'sekolah' => $sekolah,
        //     'kepala_sekolah' => $kepala_sekolah,
        //     'nama_semester' => $nama_semester,
        //     'rapor_siswa' => $rapor_siswa,
        //     'narasi_dimensi' => $narasi_dimensi,
        // ]);



    }

    public function hapus_narasi_pendahuluan_foto($id_rapor_siswa, $id)
    {
        $data = DB::table('narasi_pendahuluan_foto')->where('id', $id)->first();
        if(isset($data)){
            if ((file_exists('images/rapor/'.$data->foto)) && ($data->foto)) {
                unlink('images/rapor/'.$data->foto);
            }
        }
        $hapus = DB::table('narasi_pendahuluan_foto')->where('id', $id)->delete();
        // return redirect()->route("rapor-siswa.edit", $id_rapor_siswa);
        return redirect()->back();
    }

    public function hapus_narasi_dimensi_foto($id_rapor_siswa, $id)
    {
        $data = DB::table('narasi_dimensi_foto')->where('id', $id)->first();
        if(isset($data)){
            if ((file_exists('images/rapor/'.$data->foto)) && ($data->foto)) {
                unlink('images/rapor/'.$data->foto);
            }
        }
        $hapus = DB::table('narasi_dimensi_foto')->where('id', $id)->delete();

        return redirect()->back();
    }

    function reArrayFiles($file_post) {
        $file_ary = array();
        $file_count = count($file_post['name']);
        $file_keys = array_keys($file_post);
    
        for ($i = 0; $i < $file_count; $i++) {
            foreach ($file_keys as $key) {
                $file_ary[$i][$key] = $file_post[$key][$i];
            }
        }
    
        return $file_ary;
    }
}
