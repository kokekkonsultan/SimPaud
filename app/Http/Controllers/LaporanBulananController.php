<?php

namespace App\Http\Controllers;

use App\Models\Kelompok;
use App\Models\KelompokUsia;
use App\Models\Semester;
use App\Models\Siswa;
use App\Models\Dimensi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Session;
use PDF;

class LaporanBulananController extends Controller
{
    function __construct()
    {
        $this->middleware('permission:laporan-bulanan-list|laporan-bulanan-create|laporan-bulanan-edit|laporan-bulanan-delete', ['only' => ['index','show']]);
        $this->middleware('permission:laporan-bulanan-create', ['only' => ['create','store']]);
        $this->middleware('permission:laporan-bulanan-edit', ['only' => ['edit','update']]);
        $this->middleware('permission:laporan-bulanan-delete', ['only' => ['destroy']]);
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

        $data_semester = DB::table('semester')->where('id', '=', $id_semester)->first();

        if ($request->has('bulan_awal')) {
            $bulan_awal = $request->bulan_awal;
        } else {
            // if($data_semester->periode_aktif == 1){
            //     // $bulan_awal = date('n');
            //     $bulan_awal = date('n', strtotime('+1 month', strtotime($data_semester->tanggal_mulai)));
            // }else{
                $bulan_awal = date('n', strtotime($data_semester->tanggal_mulai));
                // $bulan_awal = date('n', strtotime('+1 month', strtotime($data_semester->tanggal_mulai)));
            // }
        }

        if ($request->has('bulan_akhir')) {
            $bulan_akhir = $request->bulan_akhir;
        } else {
            // if($data_semester->periode_aktif == 1){
            //     $bulan_akhir = date('n');
            // }else{
                $bulan_akhir = date('n', strtotime($data_semester->tanggal_selesai));
            // }
        }

        $periode = substr($id_semester,4);
        $tahun = $periode == 1 ? substr($id_semester,0,4) : substr($id_semester,0,4)+1;

        $dimensi = Dimensi::whereNull('deleted_at')->get();

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

        $laporan = Siswa::select('ak.id AS id_kelompok_siswa', 'siswa.id AS id_siswa', 'siswa.jenis_kelamin', 'siswa.no_induk', 'siswa.nama_lengkap', 'siswa.nama_panggilan', 'siswa.foto', 'kel.id AS id_kelompok', 'kel.nama AS kelompok', 'kel.id_kelompok_usia', 'ku.nama AS kelompok_usia')
            ->join('kelompok_siswa AS ak', function($join){
                // if (Session::get('role_id') == 5) {
                //     $join->on('ak.id_siswa', '=', DB::raw(Session::get('id_siswa')));
                // } else {
                    $join->on('ak.id_siswa', '=', 'siswa.id');
                // }
                $join->on('ak.deleted_at', 'IS', DB::raw("null"));
            })
            ->join('kelompok AS kel', function ($join) use($id_semester, $request) {
                $join->on('kel.id', '=', 'ak.id_kelompok');
                $join->on('kel.id_semester', '=', DB::raw($id_semester));
                $join->on('kel.id_sekolah', '=', DB::raw(Session::get('id_sekolah')));
                $join->on('kel.deleted_at', 'IS', DB::raw("null"));

                if($request->has('id_kelompok_usia')){
                    $join->on('kel.id_kelompok_usia', '=', DB::raw($request->id_kelompok_usia));
                }
            })
            ->join('kelompok_usia AS ku','ku.id','=','kel.id_kelompok_usia');

        if ($request->has('id_kelompok')) {
            $laporan = $laporan->where('ak.id_kelompok', '=', $request->id_kelompok);
        } else {
            if (Session::get('role_id') == 4) {
                $laporan = $laporan->join('kelompok_guru AS pg', function ($join) {
                    $join->on('pg.id_kelompok', '=', 'kel.id');
                    $join->on('pg.id_guru', '=', DB::raw(Session::get('id_guru')));
                });
            }
        }

        if ($request->has('search') and strlen($request->search) > 0) {
            $laporan = $laporan->where(function ($query) use ($request) {
                $query->where('siswa.nama_lengkap', 'LIKE', "%" . $request->search . "%")
                    ->orWhere('siswa.nama_panggilan', 'LIKE', "%" . $request->search . "%")
                    ->orWhere('siswa.no_induk', 'LIKE', "%" . $request->search . "%");
            });
        }

        if (Session::get('role_id') == 5) {
            $laporan = $laporan->where('siswa.id', '=', DB::raw(Session::get('id_siswa')));
        }

        $laporan = $laporan
        // ->where('siswa.status', '=', 1)
        ->whereNull('siswa.deleted_at')
        ->whereNull('siswa.id_jenis_keluar')
        ->groupby('ak.id','kel.id')
        ->orderby('kel.id_kelompok_usia', 'ASC')
        ->orderby('kel.id', 'ASC')
        ->orderby('ak.id', 'ASC')
        ->paginate(10);

        foreach ($laporan as $row) {
            $row->nilaspek = DB::table('dimensi AS aspek')
            ->select('aspek.nama','nil.nilmax','pen.kode','pen.keterangan')
            ->leftjoin(DB::raw("(SELECT id_dimensi, id_kelompok_siswa, MAX(nilmax) AS nilmax
                FROM view_penilaian_harian AS a
                WHERE id_kelompok_siswa = ".$row->id_kelompok_siswa."
                AND bulan >= '".$bulan_awal."'
                AND bulan <= '".$bulan_akhir."'
                AND tahun = ".$tahun."
                GROUP BY id_dimensi, id_kelompok_siswa) AS nil"),'nil.id_dimensi','=','aspek.id')
            ->leftjoin('penilaian AS pen','pen.id','=','nil.nilmax')
            ->orderby('aspek.id','ASC')
            ->get();

            foreach($row->nilaspek AS $item){
                $item->nilmax = (int)$item->nilmax;
            }
        }

        // return view('laporan.bulanan.index',compact('laporan'));
        return Inertia::render('Laporan/Bulanan/Index', [
            'laporan' => $laporan,
            'semester' => $semester,
            'id_semester' => $id_semester,
            'kelompok' => $kelompok,
            'kelompok_usia' => $kelompok_usia,
            'dimensi' => $dimensi,
            'jenis_semester' => $jenis_semester,
            'bulan_awal' => $bulan_awal,
            'bulan_akhir' => $bulan_akhir,
            'role_id' => Session::get('role_id'),
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
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function lihat_laporan(string $id)
    {

        $data = explode('-', $id);
        $id_kelompok_siswa = $data[0];
        $id_semester = $data[1];
        $bulan_awal = $data[2];
        $bulan_akhir = $data[3];
        $periode = substr($id_semester,4);
        $tahun = $periode == 1 ? substr($id_semester,0,4) : substr($id_semester,0,4)+1;

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
                AND bulan >= '".$bulan_awal."'
                AND bulan <= '".$bulan_akhir."' 
                AND tahun = ".$tahun."
                GROUP BY id_dimensi, id_kelompok_siswa) AS nil"),'nil.id_dimensi','=','ap.id')
        ->leftjoin('penilaian AS pen','pen.id','=','nil.nilmax')
        ->where('nil.nilmax','<>','')
        ->whereNull('ap.deleted_at')
        ->get();

        $foto_sekolah = ($sekolah->foto) ? public_path() .'/images/sekolah/'.$sekolah->foto : public_path() .'/images/tutwuri_logo.png';
        $foto_jenis_kelamin = ($siswa->jenis_kelamin == 'L') ? public_path() .'/images/boy.png' : public_path() .'/images/girl.png';
        $foto_siswa = ($siswa->foto) ? public_path() .'/images/siswa/'.$siswa->foto : $foto_jenis_kelamin;
        $jenis_kelamin = ($siswa->jenis_kelamin == 'L') ? "Laki-laki" : "Perempuan";

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
        
        $tanggal_sekarang = date('Y-m-d H:i');
        $format_tanggal_laporan = 'Bulan '.$nama_bulan[$bulan_awal].' s/d '.$nama_bulan[$bulan_akhir];
        $tanggal_cetak = date('d', strtotime($tanggal_sekarang)).' '.$nama_bulan[str_replace('0', '', date('m', strtotime($tanggal_sekarang)))].' '.date('Y', strtotime($tanggal_sekarang)).' - '.date('H:i', strtotime($tanggal_sekarang));


        $html = '<html>
        <head>
        <style type="text/css">
            .beta td {
                padding: 2px 8px;
                border: 1px solid #ddd;
            }
            footer {
                position: fixed; 
                bottom: -50px; 
                height: 50px; 
            }

            body { background-image: url('.$foto_sekolah.'); opacity: 0.2; height: 100%; background-repeat: no-repeat; background-position: center; }
        </style>
        </head>
        <body>
        <footer>
            <table align="center" width="100%" border="0">
                <tr>
                    <td style="font-size: 16px; ">'.$sekolah->nama.', '.$sekolah->kotakab.', '.$sekolah->kecamatan.'</td>
                </tr>
            </table>
        </footer>

        <!--<table align="center" width="100%" border="0">
            <tr>
                <td width="60%">-->
                
                <table class="beta" cellspacing="0" cellpadding="0" width="70%" align="center">
                    <tbody>
                        <tr>
                            <td rowSpan="3"><img src="'.$foto_siswa.'" alt="" width="100" /></td>
                            <td><span>Nama Panggilan</span><br /><b>'.$siswa->nama_panggilan.'</b></td>
                            <td><span>Nama Lengkap</span><br /><b>'.$siswa->nama_lengkap.'</b></td>
                        </tr>
                        <tr>
                            <td><span>Jenis Kelamin</span><br /><b>'.$jenis_kelamin.'</b></td>
                            <td><span>Usia</span><br /><b>'.$siswa->usia_tahun.' Thn '.$siswa->usia_bulan.' Bln</td>
                        </tr>
                        <tr>
                            <td><span>Kelompok</span><br /><b>'.$siswa->kelompok.'</b></td>
                            <td><span>No. Induk / NISN</span><br /><b>'.$siswa->no_induk .'/ '.$siswa->nisn.'</b></td>
                        </tr>
                    </tbody>
                </table>

                <!--</td>
                <td width="40%" align="right" valign="bottom">Dicetak pada: </td>
            </tr>
        </table>-->
        <table align="center" width="100%">
            <tbody>
                <tr>
                    <td align="center">Dicetak pada: '.$tanggal_cetak.'</td>
                </tr>
                <tr>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td><hr /></td>
                </tr>
                <tr>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td align="center" style="font-size: 22px; font-weight: bold; font-family: Arial; ">Laporan Bulanan</td>
                </tr>
                <tr>
                    <td align="center">'.$format_tanggal_laporan.'</td>
                </tr>
                <tr>
                    <td>&nbsp;</td>
                </tr>';

                
                foreach ($narasi_dimensi as $row) { 

                    //if($row->narasi){
                        $html .= '<tr>
                            <td style="font-size: 22px; font-weight: bold; font-family: Arial; ">'.$row->nama_dimensi;
                            if($row->kode == 'SM'){
                                $html .= ' &nbsp; <span style="background-color: rgb(22 100 52); padding:5px 10px; font-size:16px; font-weight: normal; color:#fff; ">'.$row->keterangan.'</span>';
                            }else{
                                $html .= ' &nbsp; <span style="background-color: rgb(255 215 0); padding:5px 10px; font-size:16px; font-weight: normal; color:#fff; ">'.$row->keterangan.'</span>';
                            }
                            $html .= '</td>
                        </tr>';

                        $bulan_penilaian = DB::table('view_penilaian_harian')
                        ->select('bulan')
                        ->where('id_dimensi','=',$row->id_dimensi)
                        ->where('id_kelompok_siswa','=',$id_kelompok_siswa)
                        ->where('bulan', '>=', $bulan_awal)
                        ->where('bulan', '<=', $bulan_akhir)
                        ->where('tahun', '=', $tahun)
                        ->groupby('bulan')
                        ->orderby('bulan','asc')
                        ->get();

                        foreach($bulan_penilaian as $dt){

                            $html .= '<tr>
                            <td align="center"><b>'.$nama_bulan[$dt->bulan].'</b><td>
                            <tr>';


                        $tanggal_penilaian = DB::table('view_penilaian_harian')
                        ->select('tanggal', 'bulan', 'tahun')
                        ->where('id_dimensi','=',$row->id_dimensi)
                        ->where('id_kelompok_siswa','=',$id_kelompok_siswa)
                        // ->where('bulan', '>=', $bulan_awal)
                        // ->where('bulan', '<=', $bulan_akhir)
                        ->where('bulan', '=', $dt->bulan)
                        ->where('tahun', '=', $tahun)
                        ->groupby('tanggal')
                        ->orderby('tanggal','asc')
                        ->get();

                        foreach($tanggal_penilaian as $data){
                            $hari = date('l', strtotime($data->tanggal));

                        $html .= '<tr>
                            <td>
                            
                            <table class="beta" cellspacing="0" cellpadding="0" width="100%">
                                    <thead>
                                        <tr>
                                            <td colSpan="4" align="center"><b>'.$this->hariIndo($hari).', '.date('d', strtotime($data->tanggal)).' '.$nama_bulan[str_replace('0', '', date('m', strtotime($data->tanggal)))].' '.date('Y', strtotime($data->tanggal)).'</b></td>
                                        </tr>
                                        <tr>
                                            <td rowSpan="2" align="center"><b>Tujuan Pembelajaran</b></td>
                                            <td colSpan="3" align="center"><b>Hasil Pengamatan</b></td>
                                        </tr>
                                        <tr>
                                            <td align="center"><b>Indikator</b></td>
                                            <td align="center"><b>Skala</b></td>
                                            <td align="center"><b>Catatan</b></td>
                                        </tr>
                                    </thead>
                                    <tbody>';
                                        
                                    $penilaian = DB::table('view_penilaian_harian AS pen')
                                        // ->select('ib.id','ib.nama','elemen.nama AS nama_elemen', 'pen.muncul', 'pen.catatan', 'nil.kode', 'nil.keterangan')

                                        // ->leftjoin('indikator AS ib','ib.id','=','pen.id_indikator')
                                        // ->leftjoin('elemen',function($join){
                                        //     $join->on('elemen.id','=','ib.id_elemen');
                                        // })
                                        // ->leftjoin('penilaian AS nil','nil.kode','=','pen.muncul')
                                        // ->where(DB::raw("(DATE_FORMAT(pen.tanggal,'%Y-%c'))"),$data->tahun."-".$data->bulan)
                                        ->where('pen.id_dimensi','=',$row->id_dimensi)
                                        ->where('pen.tanggal','=',$data->tanggal)
                                        ->where('pen.bulan','=',$data->bulan)
                                        ->where('pen.tahun','=',$data->tahun)
                                        ->where('pen.id_kelompok_siswa','=',$id_kelompok_siswa)
    
                                        ->get();

                                        foreach($penilaian as $res){
                                            $html .= '<tr>
                                            <td valign="top" width="30%">'.$res->elemen.'</td>
                                            <td valign="top" width="30%">'.$res->indikator.'</td>
                                            <td valign="top" align="center" width="5%">'.$res->muncul.'</td>
                                            <td valign="top" width="25%">'.nl2br($res->catatan).'</td>
                                        </tr>';
                                        }
                                        $html .= '</tbody>
                                </table>
                            
                            </td>
                        </tr>';
                        $html .= '<tr>
                            <td>&nbsp;</td>
                        </tr>';
                        }
                        }

                        $html .= '<tr>
                            <td>&nbsp;</td>
                        </tr>';
                        //}
                    }
            $html .= '</tbody>
        </table>

        </body></html>';

    $pdf= PDF::loadHTML($html);
    $pdf->setPaper('L', 'portrait');
                   
    return $pdf->stream($siswa->nama_lengkap.' - '.$siswa->no_induk.' ('.str_replace("s/d", "-", $format_tanggal_laporan).').pdf');

    }

    function hariIndo ($hariInggris) {
        switch ($hariInggris) {
          case 'Sunday':
            return 'Minggu';
          case 'Monday':
            return 'Senin';
          case 'Tuesday':
            return 'Selasa';
          case 'Wednesday':
            return 'Rabu';
          case 'Thursday':
            return 'Kamis';
          case 'Friday':
            return 'Jumat';
          case 'Saturday':
            return 'Sabtu';
          default:
            return 'hari tidak valid';
        }
    }

}
