<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use App\Models\User;
use App\Models\TahunAjaran;
use App\Models\JenisSttb;
use App\Models\Sttb;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Session;
use PDF;

class SttbController extends Controller
{
    function __construct()
    {
        $this->middleware('permission:sttb-list|sttb-create|sttb-edit|sttb-delete', ['only' => ['index']]);
        $this->middleware('permission:sttb-create', ['only' => ['create','store','show']]);
        $this->middleware('permission:sttb-edit', ['only' => ['edit','update']]);
        $this->middleware('permission:sttb-delete', ['only' => ['destroy']]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $tahun_ajaran = TahunAjaran::get();
        $jenis_sttb = JenisSttb::get();

        if ($request->has('id_tahun_ajaran') && strlen($request->id_tahun_ajaran) > 0) {
            $id_tahun_ajaran = $request->id_tahun_ajaran;
        } else {
            $id_tahun_ajaran = Session::get('id_tahun_ajaran');
        }

        $sttb = Siswa::query()
            ->select('siswa.*', DB::raw('DATE_FORMAT(tanggal_lahir, "%d-%m-%Y") as tanggal_lahir_siswa'), DB::raw('DATE_FORMAT(tanggal_masuk, "%d-%m-%Y") as tanggal_masuk_siswa'), 
            DB::raw("FLOOR(DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365) AS usia_tahun"), 
            DB::raw("FLOOR((DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365 - FLOOR(DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365))* 12) AS usia_bulan"),
            'mta.nama AS tahun_ajaran')
            // ->join('agama AS agm', 'agm.id', '=', 'siswa.id_agama')
            ->join('tahun_ajaran AS mta', 'mta.id', '=', 'siswa.id_tahun_ajaran')
            ->join('users', 'users.id', '=', 'siswa.id_user')

            ->join('kelompok_siswa AS ak', function($join) {
                $join->on('ak.id_siswa', '=', 'siswa.id');
                $join->on('ak.deleted_at', 'IS', DB::raw("null"));
            })
            
            ->leftjoin('sttb AS st','st.id_siswa','=','siswa.id')
            ->leftjoin('jenis_sttb AS js','js.id','=','st.id_jenis_sttb')
            ->where('siswa.id_sekolah', '=', Session::get('id_sekolah'))
            ->where('users.verified', '=', 1)
            ->whereNotNull('users.verified_at')
            ->whereNull('siswa.deleted_at');

        if ($request->has('id_tahun_ajaran') && strlen($request->id_tahun_ajaran) > 0) {
            $sttb = $sttb->where('siswa.id_tahun_ajaran', '=', $id_tahun_ajaran);
        }

        if ($request->has('id_jenis_sttb')) {
            $sttb = $sttb->where('st.id_jenis_sttb', '=', $request->id_jenis_sttb);
        }

        if ($request->has('search') and strlen($request->search) > 0) {
            $sttb = $sttb->where(function ($query) use ($request) {
                $query->where('nama_lengkap', 'LIKE', "%" . $request->search . "%")
                    ->orWhere('nama_panggilan', 'LIKE', "%" . $request->search . "%")
                    ->orWhere('no_induk', 'LIKE', "%" . $request->search . "%");
            });
        }

        $sttb = $sttb
            ->groupby('siswa.id')//'ak.id'
            ->orderby('siswa.id_tahun_ajaran', 'DESC')
            ->orderby('siswa.no_induk', 'ASC')
            ->orderby('siswa.nama_lengkap', 'ASC')
            ->paginate(10);

        foreach($sttb AS $row){
            $row->substtb = Sttb::select('sttb.id', 'sttb.nomor_sttb', 'jenis_sttb.nama')
            ->join('siswa','siswa.id','=','sttb.id_siswa')
            ->leftjoin('jenis_sttb','jenis_sttb.id','=','sttb.id_jenis_sttb')
            ->where('id_siswa','=',$row->id)
            ->get();
        }
        
        // return view('erapor.sttb.index',compact('sttb'));
        return Inertia::render('Erapor/Sttb/Index', 
        [
            'sttb' => $sttb,
            'tahun_ajaran' => $tahun_ajaran,
            'jenis_sttb' => $jenis_sttb,
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
        // $request->validate([
        //     'id_jenis_sttb' => 'required',
        //     'nomor_sttb' => 'required',
        //     'tanggal_sttb' => 'required',
        // ]);

        $rules = [
            'id_jenis_sttb' => ['required'],
            'nomor_sttb' => ['required'],
            'tanggal_sttb' => ['required'],
        ];

        $messages = [
            'id_jenis_sttb.required' => 'Jenis STTB harus diisi.',
            'nomor_sttb.required' => 'Nomor STTB harus diisi.',
            'tanggal_sttb.required' => 'Tanggal STTB harus diisi.',
        ];

        $request->validate($rules, $messages);

        $cek = DB::table('sttb')
        ->where('id_siswa', '=', $request->id_siswa)
        ->where('id_jenis_sttb', '=', $request->id_jenis_sttb)
        ->count();

        if($cek == 0){
            $user_id = Session::get('user_id');
            $role_id = Session::get('role_id');

            $datasttb = array(
                'id_jenis_sttb' => $request->id_jenis_sttb,
                'id_siswa' => $request->id_siswa,
                'nomor_sttb' => $request->nomor_sttb,
                'tanggal_sttb' => $request->tanggal_sttb,
                'user_id' => $user_id,
                'role_id' => $role_id,
                'created_at' => date('Y-m-d H:i:s'),
            );
            
            $simpan = Sttb::create($datasttb);
            if ($simpan) {
                return redirect()->route('sttb.index')->with('message', 'Data STTB berhasil disimpan!');
            } else {
                return redirect()->route('sttb.index')->with('error', 'Data STTB gagal disimpan!');
            }
        }else{
            return redirect()->route('sttb', $request->id_siswa)->with('error', 'Data STTB gagal disimpan!');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $jenis_sttb = JenisSttb::get();

        $siswa = DB::table('siswa')
            ->select('ak.id AS id_kelompok_siswa', 'siswa.id AS id_siswa', 'siswa.no_induk', 'siswa.nisn', 'siswa.nama_lengkap', 'siswa.nama_panggilan', 'siswa.jenis_kelamin', 'siswa.foto', DB::raw("FLOOR(DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365) AS usia_tahun"), DB::raw("FLOOR((DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365 - FLOOR(DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365))* 12) AS usia_bulan"), 'kel.nama AS kelompok')
            ->join('kelompok_siswa AS ak', function($join) {
                $join->on('ak.id_siswa', '=', 'siswa.id');
                $join->on('ak.deleted_at', 'IS', DB::raw("null"));
            })
            ->join('kelompok AS kel', function ($join) {
                $join->on('kel.id', '=', 'ak.id_kelompok');
                $join->on('kel.id_sekolah', '=', DB::raw(Session::get('id_sekolah')));
                $join->on('kel.deleted_at', 'IS', DB::raw("null"));
            })
            ->where('siswa.id', '=', $id)
            ->whereNull('siswa.deleted_at')
            ->first();

        // return view('erapor.sttb.create')
        // ->with('jenis_sttb', $jenis_sttb);
        return Inertia::render('Erapor/Sttb/Create', 
        [
            'siswa' => $siswa,
            'id_siswa' => $id,
            'jenis_sttb' => $jenis_sttb
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sttb $sttb)
    {
        $jenis_sttb = JenisSttb::get();

        $siswa = DB::table('siswa')
            ->select('ak.id AS id_kelompok_siswa', 'siswa.id AS id_siswa', 'siswa.no_induk', 'siswa.nisn', 'siswa.nama_lengkap', 'siswa.nama_panggilan', 'siswa.jenis_kelamin', 'siswa.foto', DB::raw("FLOOR(DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365) AS usia_tahun"), DB::raw("FLOOR((DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365 - FLOOR(DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365))* 12) AS usia_bulan"), 'kel.nama AS kelompok')
            ->join('kelompok_siswa AS ak', function($join) {
                $join->on('ak.id_siswa', '=', 'siswa.id');
                $join->on('ak.deleted_at', 'IS', DB::raw("null"));
            })
            ->join('kelompok AS kel', function ($join) {
                $join->on('kel.id', '=', 'ak.id_kelompok');
                $join->on('kel.id_sekolah', '=', DB::raw(Session::get('id_sekolah')));
                $join->on('kel.deleted_at', 'IS', DB::raw("null"));
            })
            ->where('siswa.id', '=', $sttb->id_siswa)
            ->whereNull('siswa.deleted_at')
            ->first();

        // return view('erapor.sttb.edit')
        // ->with('jenis_sttb', $jenis_sttb);
        return Inertia::render('Erapor/Sttb/Edit', 
        [
            'sttb' => $sttb,
            'siswa' => $siswa,
            'jenis_sttb' => $jenis_sttb
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Sttb $sttb)
    {
        // $request->validate([
        //     'id_jenis_sttb' => 'required',
        //     'nomor_sttb' => 'required',
        //     'tanggal_sttb' => 'required',
        // ]);

        $rules = [
            'id_jenis_sttb' => ['required'],
            'nomor_sttb' => ['required'],
            'tanggal_sttb' => ['required'],
        ];

        $messages = [
            'id_jenis_sttb.required' => 'Jenis STTB harus diisi.',
            'nomor_sttb.required' => 'Nomor STTB harus diisi.',
            'tanggal_sttb.required' => 'Tanggal STTB harus diisi.',
        ];

        $request->validate($rules, $messages);

        if($sttb->id_jenis_sttb == $request->id_jenis_sttb){
            $cek = 0;
        }else{
            $cek = DB::table('sttb')
            ->where('id_siswa', '=', $sttb->id_siswa)
            ->where('id_jenis_sttb', '=', $request->id_jenis_sttb)
            ->count();
        }

        if($cek == 0){
            $user_id = Session::get('user_id');
            $role_id = Session::get('role_id');

            $datasttb = array(
                'id_jenis_sttb' => $request->id_jenis_sttb,
                'nomor_sttb' => $request->nomor_sttb,
                'tanggal_sttb' => $request->tanggal_sttb,
                // 'user_id' => $user_id,
                // 'role_id' => $role_id,
                'updated_at' => date('Y-m-d H:i:s'),
            );

            $simpan = $sttb->update($datasttb);
            if ($simpan) {
                return redirect()->route('sttb.index')->with('message', 'Data STTB berhasil disimpan!');
            } else {
                return redirect()->route('sttb.index')->with('error', 'Data STTB gagal disimpan!');
            }
        }else{
            return redirect()->back()->with('error', 'Data STTB gagal disimpan!');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sttb $sttb)
    {
        $sttb->delete();

        return redirect()->route('sttb.index')->with('message', 'Data STTB berhasil dihapus!');
    }

    public function lihat_sttb2($id){
        $sttb = DB::table('sttb AS sb')
        ->select('sb.nomor_sttb', 'sb.id_jenis_sttb', 'js.nama AS jenis_sttb', 'sb.id_siswa', DB::raw('DATE_FORMAT(sb.tanggal_sttb, "%d-%m-%Y") as tanggal_sttb'), 'sis.nama_lengkap', 'sis.nama_panggilan', 'sis.foto', 'sis.jenis_kelamin', 'sis.no_induk', 'sis.nisn', 'sis.tempat_lahir', DB::raw('DATE_FORMAT(sis.tanggal_lahir, "%d-%m-%Y") as tanggal_lahir'),'sis.nama_ayah', 'sis.nama_ibu', 'sis.nama_wali', 'ta.nama AS tahun_ajaran', 'sm.nama AS id_semester', 'ks.nama AS kepala_sekolah', 'ks.tanda_tangan')
        ->join('jenis_sttb AS js','js.id','=','sb.id_jenis_sttb')
        ->join('siswa AS sis', function($join){
            $join->on('sis.id','=','sb.id_siswa');
            $join->on('sis.id_sekolah','=',DB::raw(Session::get('id_sekolah')));
            $join->on('sis.deleted_at','IS',DB::raw("null"));
        })
        ->join('tahun_ajaran AS ta', function($join){
            $join->on('ta.tanggal_mulai','<=','sb.tanggal_sttb');
            $join->on('ta.tanggal_selesai','>=','sb.tanggal_sttb');
        })
        ->join('semester AS sm', function($join){
            $join->on('sm.tanggal_mulai','<=','sb.tanggal_sttb');
            $join->on('sm.tanggal_selesai','>=','sb.tanggal_sttb');
        })
        ->leftjoin('kepala_sekolah AS ks', function($join){
            $join->on('ks.id_semester','=','sm.id');
            $join->on('ks.id_sekolah','=',DB::raw(Session::get('id_sekolah')));
        })
        ->where('sb.id','=',$id)
        ->first();

        $sekolah = DB::table('sekolah AS skh')
        ->select('skh.*','kota.nama AS kotakab')
        ->leftjoin('wilayah AS kota','kota.kode_wilayah','=',DB::raw("CONCAT(LEFT(skh.kode_wilayah,4),'00')"))
        ->where('skh.id','=',Session::get('id_sekolah'))
        ->first();

        $template = DB::table('setting_sttb')
        ->select('id_sekolah','template')
        ->where('id_sekolah','=',Session::get('id_sekolah'))
        ->where('status','=',1)
        ->first();

        // return view('erapor.sttb.view')
        // ->with('sttb', $sttb);
        return Inertia::render('Erapor/Sttb/View', 
        [
            'sttb' => $sttb,
            'sekolah' => $sekolah,
            'template' => $template
        ]);
    }

    public function lihat_sttb($id){
        $sttb = DB::table('sttb AS sb')
        ->select('sb.nomor_sttb', 'sb.id_jenis_sttb', 'js.nama AS jenis_sttb', 'sb.id_siswa', DB::raw('DATE_FORMAT(sb.tanggal_sttb, "%d-%m-%Y") as tanggal_sttb'), 'sis.nama_lengkap', 'sis.nama_panggilan', 'sis.foto', 'sis.jenis_kelamin', 'sis.no_induk', 'sis.nisn', 'sis.tempat_lahir', DB::raw('DATE_FORMAT(sis.tanggal_lahir, "%d-%m-%Y") as tanggal_lahir'), 'sis.nama_ayah', 'sis.nama_ibu', 'sis.nama_wali', 'ta.nama AS tahun_ajaran', 'sm.nama AS id_semester', 'ks.nama AS kepala_sekolah', 'ks.tanda_tangan')
        ->join('jenis_sttb AS js','js.id','=','sb.id_jenis_sttb')
        ->join('siswa AS sis', function($join){
            $join->on('sis.id','=','sb.id_siswa');
            $join->on('sis.id_sekolah','=',DB::raw(Session::get('id_sekolah')));
            $join->on('sis.deleted_at','IS',DB::raw("null"));
        })
        ->join('tahun_ajaran AS ta', function($join){
            $join->on('ta.tanggal_mulai','<=','sb.tanggal_sttb');
            $join->on('ta.tanggal_selesai','>=','sb.tanggal_sttb');
        })
        ->join('semester AS sm', function($join){
            $join->on('sm.tanggal_mulai','<=','sb.tanggal_sttb');
            $join->on('sm.tanggal_selesai','>=','sb.tanggal_sttb');
        })
        ->leftjoin('kepala_sekolah AS ks', function($join){
            $join->on('ks.id_semester','=','sm.id');
            $join->on('ks.id_sekolah','=',DB::raw(Session::get('id_sekolah')));
        })
        ->where('sb.id','=',$id)
        ->first();

        $sekolah = DB::table('sekolah AS skh')
        ->select('skh.*','kota.nama AS kotakab','kec.nama AS kecamatan')
        ->leftjoin('wilayah AS kota','kota.kode_wilayah','=',DB::raw("CONCAT(LEFT(skh.kode_wilayah,4),'00')"))
        ->leftjoin('wilayah AS kec','kec.kode_wilayah','=','skh.kode_wilayah')
        ->where('skh.id','=',Session::get('id_sekolah'))
        ->first();

        $template = DB::table('setting_sttb')
        ->select('id_sekolah','template')
        ->where('id_sekolah','=',Session::get('id_sekolah'))
        ->where('status','=',1)
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

        $background = ($template->template) ? public_path() .'/images/template/'.$template->template : '';
        $foto_sekolah = ($sekolah->foto) ? public_path() .'/images/sekolah/'.$sekolah->foto : public_path() .'/images/tutwuri_logo.png';
        $tanda_tangan = ($sttb->tanda_tangan) ? public_path() .'/images/sekolah/'.$sttb->tanda_tangan : '';
        $foto_jenis_kelamin = ($sttb->jenis_kelamin == 'L') ? public_path() .'/images/boy.png' : public_path() .'/images/girl.png';
        $foto_siswa = ($sttb->foto) ? public_path() .'/images/siswa/'.$sttb->foto : $foto_jenis_kelamin;
        $orang_tua = ($sttb->nama_ayah) ? $sttb->nama_ayah : $sttb->nama_ibu;
        $tanggal_sttb = date('d', strtotime($sttb->tanggal_sttb)).' '.$nama_bulan[str_replace('0', '', date('m', strtotime($sttb->tanggal_sttb)))].' '.date('Y', strtotime($sttb->tanggal_sttb));

        $html = '<html>
        <head>
            <style type="text/css">
                html { margin: 0px; }
                body { background-image: url('.$background.'); background-size: cover; height: 100%; background-repeat: no-repeat; background-position: center; }
            </style>
        </head>
        <body>
        <table align="center">
        <tbody>
            <tr>
                <td>&nbsp;</td>
            </tr>
            <tr>
                <td>&nbsp;</td>
            </tr>
            <tr>
                <td align="center"><img src="'.$foto_sekolah.'" width="150" /></td>
            </tr>
            <tr>
                <td align="center" style="font-size: 22px; font-weight: bold; font-family: Arial; ">'.$sekolah->nama.'</td>
            </tr>
            <tr>
                <td align="center">'.$sekolah->alamat.'<br> '.$sekolah->kecamatan.', '.$sekolah->kotakab.'</td>
            </tr>
            <tr>
                <td>&nbsp;</td>
            </tr>
            <tr>
                <td align="center" style="font-size: 32px; font-weight: bold; ">Surat Tanda Tamat Belajar</td>
            </tr>
            <tr>
                <td align="center">Nomor: '.$sttb->nomor_sttb.'</td>
            </tr>
            <tr>
                <td>&nbsp;</td>
            </tr>
            <tr>
                <td align="center">Yang bertanda tangan di bawah ini, Kepala Sekolah <b>'.$sekolah->nama.'</b> menerangkan bahwa:</td>
            </tr>
            <tr>
                <td>&nbsp;</td>
            </tr>
            <tr>
                <td align="center" style="font-size: 22px; font-weight: bold; "><i>'.$sttb->nama_lengkap.'</i></td>
            </tr>
            <tr>
                <td>&nbsp;</td>
            </tr>
            <tr>
                <td>
                  
                    <table align="center">
                        <tbody>
                            <tr>
                                <td>Nomor Induk</td>
                                <td>:</td>
                                <td>'.$sttb->no_induk.'</td>
                            </tr>';
                            if($sttb->nisn){
                            $html .= '<tr>
                                <td>NISN</td>
                                <td>:</td>
                                <td>'.$sttb->nisn.'</td>
                            </tr>';
                            }
                            $html .= '<tr>
                                <td>Tempat / Tanggal Lahir</td>
                                <td>:</td>
                                <td>'.$sttb->tempat_lahir.' / '.$sttb->tanggal_lahir.'</td>
                            </tr>';

                            if(($sttb->nama_ayah) || ($sttb->nama_ibu)){
                            $html .= '<tr>
                                <td>Nama Orang Tua</td>
                                <td>:</td>
                                <td>'.$orang_tua.'</td>
                            </tr>';
                            }

                            if($sttb->nama_wali){
                            $html .= '<tr>
                                <td>Nama Wali</td>
                                <td>:</td>
                                <td>'.$sttb->nama_wali.'</td>
                            </tr>';
                            }
                            $html .= '</tbody>
                    </table>

                </td>
            </tr>
            <tr>
                <td>&nbsp;</td>
            </tr>
            <tr>
                <td align="center">
                Telah selesai mengikuti Program Pendidikan Anak Usia Dini (PAUD)<br /><b>'.$sttb->jenis_sttb.'</b> di <b>'.$sekolah->nama.'</b><br />Tahun Ajaran '.$sttb->tahun_ajaran.'
                </td>
            </tr>
            <tr>
                <td>&nbsp;</td>
            </tr>
            <tr>
                <td>

                    <table align="center">
                        <tbody>
                            <tr>
                                <td><img src="'.$foto_siswa.'" width="100" /></td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>

                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>'.$sekolah->kotakab.', '.$tanggal_sttb.'<br />Kepala Sekolah</td>
                                            </tr>
                                            <tr>
                                                <td><img src="'.$tanda_tangan.'" width="100" /></td>
                                            </tr>
                                            <tr>
                                                <td><b>'.$sttb->kepala_sekolah.'</b></td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </td>
                            </tr>
                        </tbody>
                    </table>

                </td>
            </tr>
        </tbody>
    </table></body></html>';

    $pdf= PDF::loadHTML($html);
    $pdf->setPaper('L', 'portrait');
                   
    return $pdf->stream($sttb->nama_lengkap.'.pdf');
    // return $pdf->download($sttb->nama_lengkap.'.pdf');
        
    }
}
