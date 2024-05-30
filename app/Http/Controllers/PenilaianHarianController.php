<?php

namespace App\Http\Controllers;

use App\Models\PenilaianHarian;
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

class PenilaianHarianController extends Controller
{
    function __construct()
    {
        $this->middleware('permission:penilaian-harian-list|penilaian-harian-create|penilaian-harian-edit|penilaian-harian-delete', ['only' => ['index','show']]);
        $this->middleware('permission:penilaian-harian-create', ['only' => ['create','store']]);
        $this->middleware('permission:penilaian-harian-edit', ['only' => ['edit','update']]);
        $this->middleware('permission:penilaian-harian-delete', ['only' => ['destroy']]);
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

        if($request->has('tanggal_penilaian')){
            $tanggal_penilaian = date('Y-m-d', strtotime($request->tanggal_penilaian));
        } else {
            $tanggal_penilaian = date('Y-m-d');
        }

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

        $hari = date('l', strtotime($tanggal_penilaian));

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

        $penilaian = Siswa::select('ak.id AS id_kelompok_siswa', 'siswa.id AS id_siswa', 'siswa.jenis_kelamin', 'siswa.no_induk', 'siswa.nisn', 'siswa.nama_lengkap', 'siswa.nama_panggilan', 'siswa.foto', 'kel.id AS id_kelompok', 'kel.nama AS kelompok', 'kel.id_kelompok_usia', 'ku.nama AS kelompok_usia', 'setting.id AS id_setting')
            ->join('kelompok_siswa AS ak', function($join){
                $join->on('ak.id_siswa', '=', 'siswa.id');
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
            ->join('kelompok_usia AS ku','ku.id','=','kel.id_kelompok_usia')
            ->leftjoin('setting_indikator AS setting', function($join) use ($tanggal_penilaian){
                $join->on('setting.id_kelompok','=','kel.id');
                $join->on('setting.tanggal','=', DB::raw("'".$tanggal_penilaian."'"));
            });
        if ($request->has('id_kelompok')) {
            $penilaian = $penilaian->where('ak.id_kelompok', '=', $request->id_kelompok);
        } else {
            if (Session::get('role_id') == 4) {
                $penilaian = $penilaian->join('kelompok_guru AS pg', function ($join) {
                    $join->on('pg.id_kelompok', '=', 'kel.id');
                    $join->on('pg.id_guru', '=', DB::raw(Session::get('id_guru')));
                });
            }
        }

        if ($request->has('search') and strlen($request->search) > 0) {
            $penilaian = $penilaian->where(function ($query) use ($request) {
                $query->where('siswa.nama_lengkap', 'LIKE', "%" . $request->search . "%")
                    ->orWhere('siswa.nama_panggilan', 'LIKE', "%" . $request->search . "%")
                    ->orWhere('siswa.no_induk', 'LIKE', "%" . $request->search . "%");
            });
        }

        $penilaian = $penilaian
        // ->where('siswa.status', '=', 1)
        ->whereNull('siswa.deleted_at')
        ->whereNull('siswa.id_jenis_keluar')
        ->groupby('ak.id','kel.id')
        ->orderby('kel.id_kelompok_usia', 'ASC')
        ->orderby('kel.id', 'ASC')
        ->orderby('ak.id', 'ASC')
        ->paginate(10);

        foreach ($penilaian as $row) {
            $row->nilaspek = DB::table('dimensi AS aspek')
            ->select('aspek.nama','nil.nilmax','pen.kode','pen.keterangan')
            ->leftjoin(DB::raw("(SELECT id_dimensi, id_kelompok_siswa, MAX(nilmax) AS nilmax
                FROM view_penilaian_harian AS a
                WHERE id_kelompok_siswa = ".$row->id_kelompok_siswa."
                AND tanggal = '".date('Y-m-d', strtotime($tanggal_penilaian))."'
                GROUP BY id_dimensi, id_kelompok_siswa) AS nil"),'nil.id_dimensi','=','aspek.id')
            ->leftjoin('penilaian AS pen','pen.id','=','nil.nilmax')
            ->whereNull('aspek.deleted_at')
            ->orderby('aspek.id','ASC')
            ->get();

            foreach($row->nilaspek AS $item){
                $item->nilmax = (int)$item->nilmax;
            }
        }

        // return view('penilaian_harian.index',compact('penilaian'));
        return Inertia::render('Penilaian_Harian/Index', [
            'penilaian' => $penilaian,
            'semester' => $semester,
            'id_semester' => $id_semester,
            'kelompok' => $kelompok,
            'kelompok_usia' => $kelompok_usia,
            'dimensi' => $dimensi,
            'filtering' => request()->query() ?: null,
            'tanggal_penilaian' => $tanggal_penilaian,
            'format_tanggal_penilaian' => $this->hariIndo($hari).', '.date('d', strtotime($tanggal_penilaian)).' '.$nama_bulan[str_replace('0', '', date('m', strtotime($tanggal_penilaian)))].' '.date('Y', strtotime($tanggal_penilaian)),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $data = explode('-', $id);
        $id_kelompok_siswa = $data[0];
        $tahun = $data[1];
        $bulan = $data[2];
        $tanggal = $data[3];
        $id_semester = $data[4];
        $tanggal_penilaian = $tahun.'-'.$bulan.'-'.$tanggal;

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

        $hari = date('l', strtotime($tanggal_penilaian));
        
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

        if($siswa){
            $id_kelompok = $siswa->id_kelompok;

            $kelompok = DB::table('kelompok AS kel')
            ->select('kel.id','kel.nama','ku.nama AS kelompok_usia','kel.id_kelompok_usia')
            ->join('kelompok_usia AS ku','ku.id','=','kel.id_kelompok_usia')
            ->where('kel.id','=',$id_kelompok)
            ->where('id_sekolah','=',Session::get('id_sekolah'))
            ->first();






            // $aspekPenilaian = DB::table('dimensi')->get();
            $jml_indikator = 0;
            // foreach($aspekPenilaian AS $aspek){
            //     $aspek->kompetensi = DB::table('elemen')
            //     ->select('id','kode','nama')
            //     ->where('id_dimensi','=',$aspek->id)
            //     ->where(function($q){
            //         $q->where('id_sekolah','=',Session::get('id_sekolah'))
            //         ->orWhere('id_sekolah','=',0);
            //     })
            //     ->whereNull('deleted_at')
            //     ->orderby('id_dimensi','ASC')
            //     ->orderby('kode','ASC')
            //     ->get();

            //     foreach($aspek->kompetensi AS $kd){
            //         $kd->indikator = DB::table('indikator AS ib')
            //         ->select('ib.id','ib.nama',DB::raw("CASE WHEN sik.id_indikator IS NOT NULL THEN true ELSE false END AS checked"),'pen.muncul','pen.catatan','pen.foto')
            //         ->join('setting_indikator_kelompok AS sik', function($join) use ($tanggal_penilaian, $id_kelompok){
            //             $join->on('sik.id_indikator','=','ib.id');
            //             $join->on('sik.tanggal','=',DB::raw("'".$tanggal_penilaian."'"));
            //             $join->on('sik.id_kelompok','=',DB::raw($id_kelompok));
            //         })
            //         ->leftjoin('penilaian_harian AS pen',function($join) use ($tanggal_penilaian, $id_kelompok_siswa){
            //             $join->on('pen.id_indikator','=','ib.id');
            //             $join->on('pen.tanggal','=',DB::raw("'".$tanggal_penilaian."'"));
            //             $join->on('pen.id_kelompok_siswa','=',DB::raw($id_kelompok_siswa));
            //         })
            //         ->where('ib.id_elemen','=',$kd->id)
            //         ->where('ib.id_kelompok_usia','=',$kelompok->id_kelompok_usia)
            //         ->where(function($q){
            //             $q->where('ib.id_sekolah','=',Session::get('id_sekolah'))
            //             ->orWhere('ib.id_sekolah','=',0);
            //         })
            //         ->whereNull('ib.deleted_at')
            //         ->get();

            //         $jml_indikator += COUNT($kd->indikator);
            
            //     }
            // }


            
            // ok
            /*$penilaian = DB::table('dimensi')
            ->select('id','kode','nama')
            ->whereNull('deleted_at')
            ->get();
            
            foreach($penilaian AS $row){
                $row->subdimensi = DB::table('elemen')
                ->select('id','kode','nama')
                ->where('id_dimensi','=',$row->id)
                // ->where(function($query){
                //     $query->where('id_sekolah','=',Session::get('id_sekolah'))
                //     ->orWhere('id_sekolah','=',0);
                // })
                ->whereNull('deleted_at')
                ->get();

                foreach($row->subdimensi AS $data){
                    $data->indikator = DB::table('indikator AS ib')
                    ->select('ib.id','ib.nama',DB::raw("CASE WHEN sik.id_indikator IS NOT NULL THEN true ELSE false END AS ceked"))
                    ->leftjoin('setting_indikator_kelompok AS sik', function($join) use ($tanggal_penilaian, $id_kelompok){
                        $join->on('sik.id_indikator','=','ib.id');
                        $join->on('sik.tanggal','=',DB::raw("'".$tanggal_penilaian."'"));
                        $join->on('sik.id_kelompok','=',DB::raw($id_kelompok));
                    })
                    ->leftjoin('penilaian_harian AS pen',function($join) use ($tanggal_penilaian, $id_kelompok_siswa){
                        $join->on('pen.id_indikator','=','ib.id');
                        $join->on('pen.tanggal','=',DB::raw("'".$tanggal_penilaian."'"));
                        $join->on('pen.id_kelompok_siswa','=',DB::raw($id_kelompok_siswa));
                    })
                    ->where('ib.id_elemen','=',$data->id)
                    ->where('ib.id_kelompok_usia','=',$kelompok->id_kelompok_usia)
                    ->where(function($query){
                        $query->where('ib.id_sekolah','=',Session::get('id_sekolah'))
                        ->orWhere('ib.id_sekolah','=',0);
                    })
                    ->whereNull('ib.deleted_at')
                    ->get();

                    $jml_indikator += COUNT($data->indikator);
                }
            }*/

            $penilaian = DB::table('indikator AS ib')
                    ->select('ib.id','ib.nama','elemen.nama AS nama_elemen',DB::raw("CASE WHEN sik.id_indikator IS NOT NULL THEN true ELSE false END AS ceked"), 'pen.muncul', 'pen.catatan')
                    ->leftjoin('setting_indikator_kelompok AS sik', function($join) use ($tanggal_penilaian, $id_kelompok){
                        $join->on('sik.id_indikator','=','ib.id');
                        $join->on('sik.tanggal','=',DB::raw("'".$tanggal_penilaian."'"));
                        $join->on('sik.id_kelompok','=',DB::raw($id_kelompok));
                    })
                    ->leftjoin('penilaian_harian AS pen',function($join) use ($tanggal_penilaian, $id_kelompok_siswa){
                        $join->on('pen.id_indikator','=','ib.id');
                        $join->on('pen.tanggal','=',DB::raw("'".$tanggal_penilaian."'"));
                        $join->on('pen.id_kelompok_siswa','=',DB::raw($id_kelompok_siswa));
                    })
                    ->leftjoin('elemen',function($join){
                        $join->on('elemen.id','=','ib.id_elemen');
                    })
                    // ->where('ib.id_elemen','=',$data->id)
                    ->where('ib.id_kelompok_usia','=',$kelompok->id_kelompok_usia)
                    ->where(function($query){
                        $query->where('ib.id_sekolah','=',Session::get('id_sekolah'))
                        ->orWhere('ib.id_sekolah','=',0);
                    })
                    ->where(DB::raw("CASE WHEN sik.id_indikator IS NOT NULL THEN true ELSE false END"),'=',1)
                    ->whereNull('ib.deleted_at')
                    ->get();

                /*$penilaian = DB::table('elemen')
                ->select('id','kode','nama')
                // ->where('id_dimensi','=',$row->id)
                // ->where(function($query){
                //     $query->where('id_sekolah','=',Session::get('id_sekolah'))
                //     ->orWhere('id_sekolah','=',0);
                // })
                ->whereNull('deleted_at')
                ->get();

                foreach($penilaian AS $data){
                    $data->indikator = DB::table('indikator AS ib')
                    ->select('ib.id','ib.nama',DB::raw("CASE WHEN sik.id_indikator IS NOT NULL THEN true ELSE false END AS ceked"))
                    ->leftjoin('setting_indikator_kelompok AS sik', function($join) use ($tanggal_penilaian, $id_kelompok){
                        $join->on('sik.id_indikator','=','ib.id');
                        $join->on('sik.tanggal','=',DB::raw("'".$tanggal_penilaian."'"));
                        $join->on('sik.id_kelompok','=',DB::raw($id_kelompok));
                    })
                    ->leftjoin('penilaian_harian AS pen',function($join) use ($tanggal_penilaian, $id_kelompok_siswa){
                        $join->on('pen.id_indikator','=','ib.id');
                        $join->on('pen.tanggal','=',DB::raw("'".$tanggal_penilaian."'"));
                        $join->on('pen.id_kelompok_siswa','=',DB::raw($id_kelompok_siswa));
                    })
                    ->where('ib.id_elemen','=',$data->id)
                    ->where('ib.id_kelompok_usia','=',$kelompok->id_kelompok_usia)
                    ->where(function($query){
                        $query->where('ib.id_sekolah','=',Session::get('id_sekolah'))
                        ->orWhere('ib.id_sekolah','=',0);
                    })
                    ->whereNull('ib.deleted_at')
                    ->get();

                    $jml_indikator += COUNT($data->indikator);
                }*/

            /*$penilaian = DB::table('elemen')
                ->select('id','kode','nama',DB::raw("CASE WHEN sik.id_indikator IS NOT NULL THEN true ELSE false END AS ceked"))
                ->leftjoin('setting_indikator_detail AS sik', function($join){
                    $join->on('sik.id_elemen','=','elemen.id');
                })
                ->leftjoin('setting_indikator_kelompok AS si', function($join) use ($tanggal_penilaian, $id_kelompok){
                    $join->on('si.id','=','sik.id_indikator');
                    $join->on('si.tanggal','=',DB::raw("'".$tanggal_penilaian."'"));
                    $join->on('si.id_kelompok','=',DB::raw($id_kelompok));
                    $join->on('si.id_sekolah','=',Session::get('id_sekolah'));
                })
                ->whereNull('elemen.deleted_at')
                ->get();

                foreach($penilaian AS $data){
                    $data->indikator = DB::table('indikator AS ib')
                    ->select('ib.id','ib.nama')
                    ->leftjoin('setting_indikator_kelompok AS sik', function($join) use ($tanggal_penilaian, $id_kelompok){
                        $join->on('sik.id_indikator','=','ib.id');
                        $join->on('sik.tanggal','=',DB::raw("'".$tanggal_penilaian."'"));
                        $join->on('sik.id_kelompok','=',DB::raw($id_kelompok));
                    })
                    ->leftjoin('penilaian_harian AS pen',function($join) use ($tanggal_penilaian, $id_kelompok_siswa){
                        $join->on('pen.id_indikator','=','ib.id');
                        $join->on('pen.tanggal','=',DB::raw("'".$tanggal_penilaian."'"));
                        $join->on('pen.id_kelompok_siswa','=',DB::raw($id_kelompok_siswa));
                    })
                    ->where('ib.id_elemen','=',$data->id)
                    ->where('ib.id_kelompok_usia','=',$kelompok->id_kelompok_usia)
                    ->where(function($query){
                        $query->where('ib.id_sekolah','=',Session::get('id_sekolah'))
                        ->orWhere('ib.id_sekolah','=',0);
                    })
                    ->whereNull('ib.deleted_at')
                    ->get();

                    $jml_indikator += COUNT($data->indikator);
                }*/


            // $penilaian = DB::table('indikator AS ib')
            //     ->select('ib.id','ib.nama',DB::raw("CASE WHEN sik.id_indikator IS NOT NULL THEN true ELSE false END AS checked"),'pen.muncul','pen.catatan','pen.foto')
            //     ->join('setting_indikator_kelompok AS sik', function($join) use ($tanggal_penilaian, $id_kelompok){
            //         $join->on('sik.id_indikator','=','ib.id');
            //         $join->on('sik.tanggal','=',DB::raw("'".$tanggal_penilaian."'"));
            //         $join->on('sik.id_kelompok','=',DB::raw($id_kelompok));
            //     })
            //     ->leftjoin('penilaian_harian AS pen',function($join) use ($tanggal_penilaian, $id_kelompok_siswa){
            //         $join->on('pen.id_indikator','=','ib.id');
            //         $join->on('pen.tanggal','=',DB::raw("'".$tanggal_penilaian."'"));
            //         $join->on('pen.id_kelompok_siswa','=',DB::raw($id_kelompok_siswa));
            //     })
            //     // ->where('ib.id_elemen','=',$kd->id)
            //     ->where('ib.id_kelompok_usia','=',$kelompok->id_kelompok_usia)
            //     ->where(function($q){
            //         $q->where('ib.id_sekolah','=',Session::get('id_sekolah'))
            //         ->orWhere('ib.id_sekolah','=',0);
            //     })
            //     ->whereNull('ib.deleted_at')
            //     ->get();
                    

            // $urut = DB::table('kelompok_siswa_urut AS aku')
            // ->select('aku.id_kelompok_siswa')
            // ->join('kelompok AS kel', function($join) use ($id_kelompok_usia) {
            //     $join->on('kel.id','=','aku.id_kelompok');

            //     if($request->has('id_kelompok_usia')){
            //         $join->on('kel.id_kelompok_usia','=',DB::raw($id_kelompok_usia));
            //     }
            // });

            // if (Session::get('role_id') == 4) {
            //     $urut = $urut->join('kelompok_guru AS pg', function ($join) {
            //         $join->on('pg.id_kelompok', '=', 'aku.id_kelompok');
            //         $join->on('pg.id_guru', '=', DB::raw(Session::get('id_guru')));
            //     });
            // }

            // $urut = $urut->where('aku.id_semester','=',$siswa->id_semester)
            // ->where('aku.id_sekolah','=',Session::get('id_sekolah'));

            // if($request->has('kelompok')){
            //     $urut = $urut->where('aku.id_kelompok','=',$request->kelompok);
            // }
            
            // $urut = $urut->orderby('aku.id_kelompok_usia', 'ASC')
            // ->orderby('aku.id_kelompok', 'ASC')
            // ->orderby('aku.id_kelompok_siswa', 'ASC')
            // ->get();

            // $urutan = array();
            
            // $n=0;
            // foreach($urut AS $row){
            //     $urutan[$n] = (int)$row->id_kelompok_siswa;
            //     $n++;
            // }
        }

        // return view('penilaian_harian.edit');
        return Inertia::render('Penilaian_Harian/Edit', 
        [
            'id_kelompok_siswa' => $id_kelompok_siswa,
            'id_semester' => $id_semester,
            'id_kelompok' => $id_kelompok,
            'siswa' => $siswa,
            'tanggal_penilaian' => $tanggal_penilaian,
            'penilaian' => $penilaian,
            'jml_indikator' => $jml_indikator,
            // 'urutan' => $urutan,
            'format_tanggal_penilaian' => $this->hariIndo($hari).', '.$tanggal.' '.$nama_bulan[str_replace('0', '', $bulan)].' '.$tahun,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $tanggal_penilaian = $request->tanggal_penilaian;
        $id_kelompok_siswa = $request->id_kelompok_siswa;
        $id_kelompok = $request->id_kelompok;
        $id_indikator = $request->id_indikator;
        $muncul = $request->muncul;
        $catatan = $request->catatan;

        // echo print_r($request->data_penilaian)."<br>";
        // echo print_r($request->data_penilaian2)."<br>"."<br>";
       

        $data_penilaian = count($request->data_penilaian);
        $data_penilaian2 = count($request->data_penilaian2);
        // echo ($data_penilaian);
        // echo ($data_penilaian2);
        // exit;

        $checks = DB::table('penilaian_harian')
                    ->where('tanggal','=',$tanggal_penilaian)
                    ->where('id_kelompok_siswa','=',$id_kelompok_siswa)
                    ->count();

        // if(($data_penilaian > 0) && ($data_penilaian2 > 0)){
        if($checks==0){
            $a = $request->data_penilaian;
            $b = $request->data_penilaian2;
            // print_r($c);
            // $c=array_merge($request->data_penilaian,$request->data_penilaian2);
            for ($i=0; $i < count($a); $i++) {
                $c[$i] = $a[$i].',,,,,'.$b[$i]; // gabungkan masing" isi array dg (,)
                $c[$i] = explode(',,,,,',$c[$i]); // explode/jadikan array berdasarkan pemisah (,)
            }

            // print_r($c);

            foreach ($c as $item) {
                if($item){
            // for ($i=0; $i < count($c); $i++) {
                    // echo $item[0]."=>".$item[1].'<br>';
                    $data = explode('=====', $item[0]);
                    $data2 = explode('=====', $item[1]);
                    $muncul = $data[1];
                    $id_indikator = $data[0];
                    $catatan = $data2[1];
                    $id_indikator2 = $data2[0];

                    // echo "A = ".$muncul.",".$id_indikator." => ".$catatan.'<br>';
                    $check = DB::table('penilaian_harian')
                    ->where('tanggal','=',$tanggal_penilaian)
                    ->where('id_kelompok_siswa','=',$id_kelompok_siswa)
                    ->where('id_indikator','=',$id_indikator)
                    ->first();

                    if(!$check){
                        $insdata = array(
                            'tanggal' => $tanggal_penilaian,
                            'id_kelompok_siswa' => $id_kelompok_siswa,
                            'id_indikator' => $id_indikator,
                            'muncul' => $muncul,
                            'catatan' => $catatan,
                            // 'role_id' => Session::get('role_id'),
                            // 'user_id' => Session::get('user_id'),
                            'created_at' => date('Y-m-d H:i:s')
                        );

                        $ins = DB::table('penilaian_harian')
                        ->insert($insdata);
                    }else{
                        $upddata = array(
                            'muncul' => $muncul,
                            'catatan' => $catatan,
                            // 'role_id' => Session::get('role_id'),
                            // 'user_id' => Session::get('user_id'),
                            'updated_at' => date('Y-m-d H:i:s')
                        );

                        $upd = DB::table('penilaian_harian')
                        ->where('tanggal','=',$tanggal_penilaian)
                        ->where('id_kelompok_siswa','=',$id_kelompok_siswa)
                        ->where('id_indikator','=',$id_indikator)
                        ->update($upddata);
                    }
                }
            }
        }else{
            if(($data_penilaian > 0)){
                foreach ($request->data_penilaian as $key => $item) {
                    if($item){
                        $data = explode('=====', $item);
                        $muncul = $data[1];
                        $id_indikator = $data[0];
                        // echo "B = ".$id_indikator." => ".$muncul.'<br>';
                        
                        $upddata = array(
                            'muncul' => $muncul,
                            'updated_at' => date('Y-m-d H:i:s')
                        );

                        $upd = DB::table('penilaian_harian')
                        ->where('tanggal','=',$tanggal_penilaian)
                        ->where('id_kelompok_siswa','=',$id_kelompok_siswa)
                        ->where('id_indikator','=',$id_indikator)
                        ->update($upddata);
                    }
                }
            }
            
            if(($data_penilaian2 > 0)){
                foreach ($request->data_penilaian2 as $key => $item) {
                    if($item){
                        $data = explode('=====', $item);
                        $catatan = $data[1];
                        $id_indikator = $data[0];
                        // echo "C = ".$id_indikator." => ".$catatan.'<br>';

                        $upddata = array(
                            'catatan' => $catatan,
                            'updated_at' => date('Y-m-d H:i:s')
                        );

                        $upd = DB::table('penilaian_harian')
                        ->where('tanggal','=',$tanggal_penilaian)
                        ->where('id_kelompok_siswa','=',$id_kelompok_siswa)
                        ->where('id_indikator','=',$id_indikator)
                        ->update($upddata);
                    }
                }
            }
        }
        // exit;

        $kelompok = DB::table('kelompok AS kel')
            ->select('kel.id','kel.nama','ku.nama AS kelompok_usia','kel.id_kelompok_usia')
            ->join('kelompok_usia AS ku','ku.id','=','kel.id_kelompok_usia')
            ->where('kel.id','=',$id_kelompok)
            ->where('id_sekolah','=',Session::get('id_sekolah'))
            ->first();
        
        $penilaian = DB::table('indikator AS ib')
                    ->select('ib.id','ib.nama')
                    ->leftjoin('setting_indikator_kelompok AS sik', function($join) use ($tanggal_penilaian, $id_kelompok){
                        $join->on('sik.id_indikator','=','ib.id');
                        $join->on('sik.tanggal','=',DB::raw("'".$tanggal_penilaian."'"));
                        $join->on('sik.id_kelompok','=',DB::raw($id_kelompok));
                    })
                    // ->where('ib.id_elemen','=',$data->id)
                    ->where('ib.id_kelompok_usia','=',$kelompok->id_kelompok_usia)
                    ->where(function($query){
                        $query->where('ib.id_sekolah','=',Session::get('id_sekolah'))
                        ->orWhere('ib.id_sekolah','=',0);
                    })
                    ->where(DB::raw("CASE WHEN sik.id_indikator IS NOT NULL THEN true ELSE false END"),'=',1)
                    ->whereNull('ib.deleted_at')
                    ->get();

        // $n=-1;
        // foreach ($penilaian as $row) {
        //     $n++;   
        //     echo $row->id.',';
        // }
        // exit;

        // echo ($tanggal_penilaian);
        // exit;

        // for($n=0 ; $n<sizeof($muncul) ; $n++){
        $n=-1;
        foreach ($penilaian as $row) {
            $n++; 
            // echo $catatan[$n].', ';

            /*$check = DB::table('penilaian_harian')
            ->where('tanggal','=',$tanggal_penilaian)
            ->where('id_kelompok_siswa','=',$id_kelompok_siswa)
            ->where('id_indikator','=',$row->id)
            ->first();

            if(!$check){
                $insdata = array(
                    'tanggal' => $tanggal_penilaian,
                    'id_kelompok_siswa' => $id_kelompok_siswa,
                    'id_indikator' => $row->id,
                    'muncul' => $muncul[$n],
                    'catatan' => $catatan[$n],
                    // 'role_id' => Session::get('role_id'),
                    // 'user_id' => Session::get('user_id'),
                    'created_at' => date('Y-m-d H:i:s')
                );

                $ins = DB::table('penilaian_harian')
                ->insert($insdata);
            }else{
                $upddata = array(
                    'muncul' => $muncul[$n],
                    'catatan' => $catatan[$n],
                    // 'role_id' => Session::get('role_id'),
                    // 'user_id' => Session::get('user_id'),
                    'updated_at' => date('Y-m-d H:i:s')
                );

                $upd = DB::table('penilaian_harian')
                ->where('tanggal','=',$tanggal_penilaian)
                ->where('id_kelompok_siswa','=',$id_kelompok_siswa)
                ->where('id_indikator','=',$row->id)
                ->update($upddata);
            }*/

            /*$check = DB::table('penilaian_harian')
            ->where('tanggal','=',$tanggal_penilaian)
            ->where('id_kelompok_siswa','=',$request->id_kelompok_siswa)
            ->where('id_indikator','=',$id_indikator[$n])
            ->first();

            if(!$check){
                $insdata = array(
                    'tanggal' => $tanggal_penilaian,
                    'id_kelompok_siswa' => $request->id_kelompok_siswa,
                    'id_indikator' => $id_indikator[$n],
                    'muncul' => $muncul[$n],
                    'catatan' => $catatan[$n],
                    // 'role_id' => Session::get('role_id'),
                    // 'user_id' => Session::get('user_id'),
                    'created_at' => date('Y-m-d H:i:s')
                );

                $ins = DB::table('penilaian_harian')
                ->insert($insdata);
            }else{
                $upddata = array(
                    'muncul' => $muncul[$n],
                    'catatan' => $catatan[$n],
                    // 'role_id' => Session::get('role_id'),
                    // 'user_id' => Session::get('user_id'),
                    'updated_at' => date('Y-m-d H:i:s')
                );

                $upd = DB::table('penilaian_harian')
                ->where('tanggal','=',$tanggal_penilaian)
                ->where('id_kelompok_siswa','=',$request->id_kelompok_siswa)
                ->where('id_indikator','=',$id_indikator[$n])
                ->update($upddata);
                
            }*/
        }
        // exit;

        return redirect()->route('penilaian-harian.index')->with('message', 'Data Penilaian Harian berhasil disimpan!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function penilaian_harian_update(Request $request, $id)
    {
        
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
