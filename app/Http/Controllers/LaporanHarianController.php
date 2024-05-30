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

class LaporanHarianController extends Controller
{
    function __construct()
    {
        $this->middleware('permission:laporan-harian-list|laporan-harian-create|laporan-harian-edit|laporan-harian-delete', ['only' => ['index','show']]);
        $this->middleware('permission:laporan-harian-create', ['only' => ['create','store']]);
        $this->middleware('permission:laporan-harian-edit', ['only' => ['edit','update']]);
        $this->middleware('permission:laporan-harian-delete', ['only' => ['destroy']]);
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

        if ($request->has('tanggal_awal')) {
            $tanggal_awal = $request->tanggal_awal;
        } else {
            if($data_semester->periode_aktif == 1){
                $tanggal_awal = date('Y-m-d', strtotime('-7 days', strtotime(date('Y-m-d'))));
            }else{
                $tanggal_awal = date('Y-m-d', strtotime('-7 days', strtotime($data_semester->tanggal_selesai)));
            }
        }

        if ($request->has('tanggal_akhir')) {
            $tanggal_akhir = $request->tanggal_akhir;
        } else {
            if($data_semester->periode_aktif == 1){
                $tanggal_akhir = date('Y-m-d');
            }else{
                $tanggal_akhir = $data_semester->tanggal_selesai;
            }
        }

        $dimensi = Dimensi::whereNull('deleted_at')->get();

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
                AND tanggal >= '".date('Y-m-d', strtotime($tanggal_awal))."'
                AND tanggal <= '".date('Y-m-d', strtotime($tanggal_akhir))."'
                GROUP BY id_dimensi, id_kelompok_siswa) AS nil"),'nil.id_dimensi','=','aspek.id')
            ->leftjoin('penilaian AS pen','pen.id','=','nil.nilmax')
            ->whereNull('aspek.deleted_at')
            ->orderby('aspek.id','ASC')
            ->get();

            foreach($row->nilaspek AS $item){
                $item->nilmax = (int)$item->nilmax;
            }
        }


        /*select `nil`.`id` AS `id_penilaian`,`nil`.`id_kelompok_siswa` AS `id_kelompok_siswa`,`nil`.`tanggal` AS `tanggal`,week(`nil`.`tanggal`,3) AS `minggu_ke`,month(`nil`.`tanggal`) AS `bulan`,year(`nil`.`tanggal`) AS `tahun`,
        
        `nil`.`checklist` AS `checklist`,
        `cl`.`id` AS `nil_checklist`,
        `nil`.`hasil_karya` AS `hasil_karya`,
        `hk`.`id` AS `nil_hasil_karya`,
        `nil`.`anekdot` AS `anekdot`,
        `an`.`id` AS `nil_anekdot`,

        `nil`.`muncul` AS `muncul`,
        `mc`.`id` AS `nil_muncul`,
        
        greatest(
        case when `cl`.`id` is not null then `cl`.`id` else 0 end,
        case when `hk`.`id` is not null then `hk`.`id` else 0 end,
        case when `an`.`id` is not null then `an`.`id` else 0 end,
        case when `mc`.`id` is not null then `mc`.`id` else 0 end) AS `nilmax`,
        
        `pen`.`kode` AS `kode_max`,`pen`.`keterangan` AS `keterangan`,`pen`.`bullet` AS `bullet`,`pen`.`color` AS `color`,`nil`.`catatan` AS `catatan`,`nil`.`foto` AS `foto`,`ind`.`id` AS `id_indikator`,`ind`.`indikator` AS `indikator`,`kd`.`id` AS `id_kd`,`kd`.`kode` AS `kode`,`kd`.`nama` AS `kompetensi_dasar`,`aspek`.`id` AS `id_aspek`,
        
        `aspek`.`aspek` AS `aspek`,
        `aspek`.`metode` AS `metode` 
        
        from ((((((((`penilaian_harian` `nil` 
        left join `penilaian` `cl` on(`cl`.`kode` = `nil`.`checklist`)) 
        left join `penilaian` `hk` on(`hk`.`kode` = `nil`.`hasil_karya`)) 
        left join `penilaian` `an` on(`an`.`kode` = `nil`.`anekdot`))  
        left join `penilaian` `mc` on(`mc`.`kode` = `nil`.`muncul`)) 
        left join `penilaian` `pen` on(`pen`.`id` = greatest(
            case when `cl`.`id` is not null then `cl`.`id` else 0 end,
            case when `hk`.`id` is not null then `hk`.`id` else 0 end,
            case when `an`.`id` is not null then `an`.`id` else 0 end,
            case when `mc`.`id` is not null then `mc`.`id` else 0 end
            ))) join `indikator` `ind` on(`ind`.`id` = `nil`.`id_indikator` and `ind`.`deleted_at` is null)) join `elemen` `kd` on(`kd`.`id` = `ind`.`id_elemen`)) join `dimensi` `aspek` on(`aspek`.`id` = `kd`.`id_dimensi`)) */

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

        $hari_awal = date('l', strtotime($tanggal_awal));
        $hari_akhir = date('l', strtotime($tanggal_akhir));

        // return view('laporan.harian.index',compact('laporan'));
        return Inertia::render('Laporan/Harian/Index', [
            'laporan' => $laporan,
            'semester' => $semester,
            'id_semester' => $id_semester,
            'kelompok' => $kelompok,
            'kelompok_usia' => $kelompok_usia,
            'dimensi' => $dimensi,
            'tanggal_awal' => $tanggal_awal,
            'tanggal_akhir' => $tanggal_akhir,
            'laporan_tanggal_awal' => date('Ymd', strtotime($tanggal_awal)),
            'laporan_tanggal_akhir' => date('Ymd', strtotime($tanggal_akhir)),
            'role_id' => Session::get('role_id'),
            'format_tanggal_laporan' => $this->hariIndo($hari_awal).', '.date('d', strtotime($tanggal_awal)).' '.$nama_bulan[str_replace('0', '', date('m', strtotime($tanggal_awal)))].' '.date('Y', strtotime($tanggal_awal)).' s/d '.$this->hariIndo($hari_akhir).', '.date('d', strtotime($tanggal_akhir)).' '.$nama_bulan[str_replace('0', '', date('m', strtotime($tanggal_akhir)))].' '.date('Y', strtotime($tanggal_akhir)),
            'filtering' => request()->query() ?: null
        ]);
    }

    public function lihat_laporan(string $id)
    {

        $data = explode('-', $id);
        $id_kelompok_siswa = $data[0];
        $id_semester = $data[1];
        $tanggal_awal = substr($data[2],0,4).'-'.substr($data[2],4,2).'-'.substr($data[2],6,2);
        $tanggal_akhir = substr($data[3],0,4).'-'.substr($data[3],4,2).'-'.substr($data[3],6,2);

        // echo $tgl_awal.' | '.$tgl_akhir;
        // exit;

        $siswa = DB::table('siswa AS sis')
        // ->select('sis.id AS id_siswa','sis.nama_lengkap','sis.nama_ayah','sis.nama_ibu','sis.nama_wali','sis.nama_panggilan','sis.jenis_kelamin','sis.no_induk','sis.nisn','sis.foto', DB::raw('DATE_FORMAT(sis.tanggal_masuk, "%d-%m-%Y") as tanggal_masuk'), 'sis.tempat_lahir', DB::raw('DATE_FORMAT(sis.tanggal_lahir, "%d-%m-%Y") as tanggal_lahir'),'kel.nama AS kelompok','kel.id AS id_kelompok','mak.id AS id_kelompok_siswa','kel.id_semester','wk.nama AS wali_kelas','wk.tanda_tangan', DB::raw('DATE_FORMAT(tr.tanggal_rapor, "%d-%m-%Y") as tanggal_rapor'))
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

        // $data_semester = DB::table('semester')->where('id', '=', $id_semester)->first();
        // $nama_semester = $data_semester->nama;

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
                AND tanggal >= '".$tanggal_awal."'
                AND tanggal <= '".$tanggal_akhir."'
                GROUP BY id_dimensi, id_kelompok_siswa) AS nil"),'nil.id_dimensi','=','ap.id')
        ->leftjoin('penilaian AS pen','pen.id','=','nil.nilmax')
        ->where('nil.nilmax','<>','')
        ->whereNull('ap.deleted_at')
        ->get();

        

        /*$aspek = array();

        foreach($nilai as $row)
        {
            $nil = array($this->nilIdent($row->muncul));
            $row->nilmax = max($nil);

            $aspek[$row->id_dimensi]['penilaian'][str_replace('-','',$row->tanggal)]['nilmax'][] = array('value' => $row->nilmax, 'tanggal' => $row->tanggal, 'bulan' => $this->bulan($row->bulan), 'kode_max' => $row->kode_max, 'keterangan' => $row->keterangan, 'bullet' => '', 'color' => $row->color);

            $aspek[$row->id_dimensi]['penilaian'][str_replace('-','',$row->tanggal)]['tanggal'] = $this->tanggal($row->tanggal);

            $aspek[$row->id_dimensi]['penilaian'][str_replace('-','',$row->tanggal)]['catatan'][$row->id_elemen]['kode'] = $row->kode;

            $aspek[$row->id_dimensi]['penilaian'][str_replace('-','',$row->tanggal)]['catatan'][$row->id_elemen]['elemen'] = $row->elemen;

            $aspek[$row->id_dimensi]['penilaian'][str_replace('-','',$row->tanggal)]['catatan'][$row->id_elemen]['item'][] = $row;

            $aspek[$row->id_dimensi]['id_dimensi'] = $row->id_dimensi;

            $aspek[$row->id_dimensi]['dimensi'] = $row->dimensi;

            $aspek[$row->id_dimensi]['nilmax'][] = array('nilai' => $row->nilmax, 'kode_max' => $row->kode_max, 'keterangan' => $row->keterangan);

        }

        $aspek = json_decode(json_encode($aspek), FALSE);

        // echo print_r($aspek);
        // exit;

        $n=1;
        foreach($aspek AS $row){
            $row->nilmax = max($row->nilmax);

            // $row->grafik = array();
            foreach($row->penilaian AS $penilaian){
                $penilaian->nilmax = max($penilaian->nilmax);
                // array_push($row->grafik, $penilaian->nilmax);

                $catatan_filtered = array();

                foreach($penilaian->catatan AS $catatan){

                    $item_filtered = array();

                    foreach($catatan->item AS $item){
                        if($item->nilmax == $penilaian->nilmax->value){
                            array_push($item_filtered, $item);
                        }
                    }

                    if(sizeof($item_filtered) >  0){
                        $catatan->item = $item_filtered;
                        array_push($catatan_filtered, $catatan);
                    }
                }

                $penilaian->catatan = $catatan_filtered;
            }

            // usort($row->grafik, function( $a, $b ) {
            //     return strtotime($a->tanggal) - strtotime($b->tanggal);
            // });

            $n++;
        }*/

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
        $hari_awal = date('l', strtotime($tanggal_awal));
        $hari_akhir = date('l', strtotime($tanggal_akhir));
        $format_tanggal_laporan = $this->hariIndo($hari_awal).', '.date('d', strtotime($tanggal_awal)).' '.$nama_bulan[str_replace('0', '', date('m', strtotime($tanggal_awal)))].' '.date('Y', strtotime($tanggal_awal)).' s/d '.$this->hariIndo($hari_akhir).', '.date('d', strtotime($tanggal_akhir)).' '.$nama_bulan[str_replace('0', '', date('m', strtotime($tanggal_akhir)))].' '.date('Y', strtotime($tanggal_akhir));
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
                    <td align="center" style="font-size: 22px; font-weight: bold; font-family: Arial; ">Laporan Harian</td>
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
                                $html .= ' &nbsp; <span style="background-color: rgb(0 128 0); padding:5px 10px; font-size:16px; font-weight: normal; color:#fff; ">'.$row->keterangan.'</span>';
                            }else{
                                $html .= ' &nbsp; <span style="background-color: rgb(255 215 0); padding:5px 10px; font-size:16px; font-weight: normal; color:#fff; ">'.$row->keterangan.'</span>';
                            }
                            $html .= '</td>
                        </tr>';

                        $tanggal_penilaian = DB::table('view_penilaian_harian')
                        ->select('tanggal')
                        ->where('id_dimensi','=',$row->id_dimensi)
                        ->where('id_kelompok_siswa','=',$id_kelompok_siswa)
                        ->where('tanggal', '>=', $tanggal_awal)
                        ->where('tanggal', '<=', $tanggal_akhir)
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
                                            <td colSpan="4" align="center" style="border-top: none; border-left: none; border-right: none; "><b>'.$this->hariIndo($hari).', '.date('d', strtotime($data->tanggal)).' '.$nama_bulan[str_replace('0', '', date('m', strtotime($data->tanggal)))].' '.date('Y', strtotime($data->tanggal)).'</b></td>
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
                                        
                                        // ->leftjoin('setting_indikator_kelompok AS sik', function($join) use ($tanggal_penilaian, $id_kelompok){
                                        //     $join->on('sik.id_indikator','=','ib.id');
                                        //     $join->on('sik.tanggal','=',DB::raw("'".$tanggal_penilaian."'"));
                                        //     $join->on('sik.id_kelompok','=',DB::raw($id_kelompok));
                                        // })
                                        // ->leftjoin('indikator AS ib',function($join) use ($data, $id_kelompok_siswa){
                                        //     $join->on('pen.id_indikator','=','ib.id');
                                        //     $join->on('pen.tanggal','=',DB::raw("'".$data->tanggal."'"));
                                        //     $join->on('pen.id_kelompok_siswa','=',DB::raw($id_kelompok_siswa));
                                        // })

                                        // ->leftjoin('indikator AS ib','ib.id','=','pen.id_indikator')
                                        // ->leftjoin('elemen',function($join){
                                        //     $join->on('elemen.id','=','ib.id_elemen');
                                        // })
                                        // ->leftjoin('penilaian AS nil','nil.kode','=','pen.muncul')
                                        ->where('pen.id_dimensi','=',$row->id_dimensi)
                                        ->where('pen.tanggal','=',$data->tanggal)
                                        ->where('pen.id_kelompok_siswa','=',$id_kelompok_siswa)
                                        // ->where(function($query){
                                        //     $query->where('ib.id_sekolah','=',Session::get('id_sekolah'))
                                        //     ->orWhere('ib.id_sekolah','=',0);
                                        // })
                                        // ->where(DB::raw("CASE WHEN sik.id_indikator IS NOT NULL THEN true ELSE false END"),'=',1)
                                        // ->whereNull('ib.deleted_at')
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
    // $pdf->set_option("isPhpEnabled", true);

    // if (isset($pdf)) {
    //     $x = 250;
    //     $y = 10;
    //     $text = "Page {PAGE_NUM} of {PAGE_COUNT}";
    //     $font = null;
    //     $size = 14;
    //     $color = array(255,0,0);
    //     $word_space = 0.0;  //  default
    //     $char_space = 0.0;  //  default
    //     $angle = 0.0;   //  default
    //     $pdf->page_text($x, $y, $text, $font, $size, $color, $word_space, $char_space, $angle);
    // }
                   
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

    function nilIdent($nil){
        if($nil == 'BB'){
            return 1;
        }else
        if($nil == 'MB'){
            return 2;
        }else
        if($nil == 'BSH'){
            return 3;
        }else
        if($nil == 'BSB'){
            return 4;
        }else
        if($nil == 'BM'){
            return 5;
        }else
        if($nil == 'SM'){
            return 6;
        }else{
            return 0;
        }
    }

    function bulan($bulan_ke){
        $bulan = array ('Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember');

        return $bulan[$bulan_ke-1];
    }

    function tanggal($date = 1){
        date_default_timezone_set('Asia/Jakarta'); // your reference timezone here
        $date = date('Y-m-d', strtotime($date)); // ubah sesuai format penanggalan standart

        $dow = date('w', strtotime($date));

        $bulan = array ('01'=>'Januari', // array bulan konversi
                '02'=>'Februari',
                '03'=>'Maret',
                '04'=>'April',
                '05'=>'Mei',
                '06'=>'Juni',
                '07'=>'Juli',
                '08'=>'Agustus',
                '09'=>'September',
                '10'=>'Oktober',
                '11'=>'November',
                '12'=>'Desember'
        );

        $hari = array('Minggu','Senin','Selasa','Rabu','Kamis',"Jum'at",'Sabtu');

        $date = explode ('-',$date); // ubah string menjadi array dengan paramere '-'

        return $hari[$dow]. ', '. @$date[2] . ' ' . @$bulan[$date[1]] . ' ' . @$date[0]; // hasil yang di kembalikan}
    }
    
}
