<?php

namespace App\Http\Controllers;

use App\Models\Indikator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Session;
use Auth;

class IndikatorPenilaianHarianController extends Controller
{
    function __construct()
    {
        $this->middleware('permission:indikator-penilaian-harian-list|indikator-penilaian-harian-create|indikator-penilaian-harian-edit|indikator-penilaian-harian-delete', ['only' => ['index','show']]);
        $this->middleware('permission:indikator-penilaian-harian-create', ['only' => ['create','store']]);
        $this->middleware('permission:indikator-penilaian-harian-edit', ['only' => ['edit','update']]);
        $this->middleware('permission:indikator-penilaian-harian-delete', ['only' => ['destroy']]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
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

        $indikator = DB::table('kelompok AS mk')
        ->select('mk.id','mk.nama AS kelompok','mku.nama AS usia','setting.tanggal','setting.id AS id_setting',DB::raw("COUNT(detail.id) AS jml"))
        ->join('kelompok_usia AS mku','mku.id','=','mk.id_kelompok_usia')
        ->join('semester AS ms', function($join){
            $join->on('ms.id','=','mk.id_semester');
            $join->on('ms.periode_aktif','=',DB::raw('1'));
        })
        ->leftjoin('setting_indikator AS setting', function($join) use ($tanggal_penilaian) {
            $join->on('setting.id_kelompok','=','mk.id');
            $join->on('setting.tanggal','=',DB::raw('"' . $tanggal_penilaian . '"'));
        })
        ->leftjoin('setting_indikator_detail AS detail', 'detail.id_setting','=','setting.id');

        if(Session::get('role_id') == 4){
            $indikator = $indikator->join('kelompok_guru AS pg',function($join){
                $join->on('pg.id_kelompok','=','mk.id');
                $join->on('pg.id_guru','=',DB::raw(Session::get('id_guru')));
            });
        }

        $indikator = $indikator->where('mk.id_sekolah','=',Session::get('id_sekolah'))
        ->whereNull('mk.deleted_at')
        ->groupby('mk.id','setting.id')
        ->paginate(10);

        // return view('indikator_penilaian_harian.index',compact('siswa'));
        return Inertia::render('Indikator_Penilaian_Harian/Index', 
        [
            'indikator' => $indikator,
            'tanggal_penilaian' => $tanggal_penilaian,
            'format_tanggal_penilaian' => $this->hariIndo($hari).', '.date('d', strtotime($tanggal_penilaian)).' '.$nama_bulan[str_replace('0', '', date('m', strtotime($tanggal_penilaian)))].' '.date('Y', strtotime($tanggal_penilaian)),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // return view('indikator_penilaian_harian.create');
        return Inertia::render('Indikator_Penilaian_Harian/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // $id_kelompok = $request->id_kelompok;
		// $tanggal_penilaian = $request->tanggal_penilaian;
		// $selected = $request->selected;

        return redirect()->route('indikator-penilaian-harian.index')->with('message', 'Data Indikator Penilaian berhasil disimpan!');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // $data = explode('-', $id);
        // $id_kelompok = $data[0];
        // $tahun = $data[1];
        // $bulan = $data[2];
        // $tanggal = $data[3];
        // $tanggal_penilaian = $tahun.'-'.$bulan.'-'.$tanggal;

        // $kelompok = DB::table('kelompok')->select('kelompok.*', 'kelompok_usia.nama AS kelompok_usia')
        // ->join('kelompok_usia','kelompok_usia.id','=','kelompok.id_kelompok_usia')
        // ->where('kelompok.id', '=', $id_kelompok)
        // ->first();

        // // return view('indikator_penilaian_harian.edit');
        // return Inertia::render('Indikator_Penilaian_Harian/Edit', 
        // [
        //     'kelompok' => $kelompok,
        //     'id_kelompok' => $id_kelompok,
        //     'tanggal_penilaian' => $tanggal_penilaian,
        // ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $data = explode('-', $id);
        $id_kelompok = $data[0];
        $tahun = $data[1];
        $bulan = $data[2];
        $tanggal = $data[3];
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
        
        $kelompok = DB::table('kelompok')->select('kelompok.*', 'kelompok_usia.nama AS kelompok_usia')
        ->join('kelompok_usia','kelompok_usia.id','=','kelompok.id_kelompok_usia')
        ->where('kelompok.id', '=', $id_kelompok)
        ->first();

        // $indikator = Indikator::where('id_kelompok_usia', '=', $kelompok->id_kelompok_usia)
        // ->whereNull('deleted_at')
        // ->get();

        // echo $kelompok->id_kelompok_usia;
        // exit;

        $indikator = DB::table('dimensi')
        ->select('id','kode','nama')
        ->whereNull('deleted_at')
        ->get();
        foreach($indikator AS $row){
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
                ->where('ib.id_elemen','=',$data->id)
                ->where('ib.id_kelompok_usia','=',$kelompok->id_kelompok_usia)
                ->where(function($query){
                    $query->where('ib.id_sekolah','=',Session::get('id_sekolah'))
                    ->orWhere('ib.id_sekolah','=',0);
                })
                ->whereNull('ib.deleted_at')
                ->get();

                // foreach($data->indikator AS $item){
                //     $item->checked = $item->checked == '1' ? true : false;
                // }
            }
        }

        $cek = DB::table('setting_indikator')
		->where('tanggal','=',$tanggal_penilaian)
		->where('id_kelompok','=',$id_kelompok)
		->count();

        if($cek > 0){
            $setting = DB::table('setting_indikator')
            ->where('tanggal','=',$tanggal_penilaian)
            ->where('id_kelompok','=',$id_kelompok)
            ->first();

			$id_setting = $setting->id;
        }else{
            $id_setting = 0;
        }

        // return view('indikator_penilaian_harian.edit');
        return Inertia::render('Indikator_Penilaian_Harian/Edit', 
        [
            'kelompok' => $kelompok,
            'indikator' => $indikator,
            'id_kelompok' => $id_kelompok,
            'tanggal_penilaian' => $tanggal_penilaian,
            'id_setting' => $id_setting,
            'format_tanggal_penilaian' => $this->hariIndo($hari).', '.$tanggal.' '.$nama_bulan[str_replace('0', '', $bulan)].' '.$tahun,
        ]);

        // $setting_indikator = DB::table('setting_indikator')->where('id','=',$id)->first();

        // // return view('indikator_penilaian_harian.edit');
        // return Inertia::render('Indikator_Penilaian_Harian/Edit', 
        // [
        //     'setting_indikator' => $setting_indikator
        // ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update2(Request $request)
    {
        $id_kelompok = $request->id_kelompok;
		$tanggal_penilaian = $request->tanggal_penilaian;
		$indicator = $request->indicator;

		$setting = DB::table('setting_indikator')
		->where('tanggal','=',$tanggal_penilaian)
		->where('id_kelompok','=',$id_kelompok)
		->first();

        $user_id = Session::get('user_id');
        $role_id = Session::get('role_id');

		if(!$setting){
			$insSetting = DB::table('setting_indikator')
			->insert(array(
				'tanggal' => $tanggal_penilaian,
				'id_kelompok' => $id_kelompok,
				'role_id' => $role_id,
				'user_id' => $user_id,
				'created_at' => date('Y-m-d H:i:s')
			));

			$setting = DB::table('setting_indikator')
			->where('tanggal','=',date('Y-m-d', strtotime($tanggal_penilaian)))
			->where('id_kelompok','=',$id_kelompok)
			->first();
		}

        $indikatorIds = array();

        for($i = 0; $i < sizeof($indicator); $i++){
            $check = DB::table('setting_indikator_detail')
                ->where('id_setting','=',$setting->id)
                ->where('id_indikator','=',$indicator[$i])
                ->first();

                if(!$check){
                    $insIndikator = DB::table('setting_indikator_detail')
                    ->insert(array(
                        'id_setting' => $setting->id,
                        'id_indikator' => $indicator[$i],
                        'role_id' => $role_id,
                        'user_id' => $user_id,
                        'created_at' => date('Y-m-d H:i:s')
                    ));
                }
                array_push($indikatorIds, $indicator[$i]);
        }

		$delSisa = DB::table('setting_indikator_detail')
			->where('id_setting','=',$setting->id)
			->whereNotIn('id_indikator',$indikatorIds)
			->delete();
		
		$check = DB::table('setting_indikator_detail')
		->where('id_setting','=',$setting->id)
		->count();

		if($check == 0){
			$del = DB::table('setting_indikator')
			->where('id','=',$setting->id)
			->delete();
		}

		// $checkIndikator = DB::table('setting_indikator_detail')
		// ->where('id_setting','=',$setting->id)
		// ->count();

        return redirect()->route('indikator-penilaian-harian.index')->with('message', 'Data Indikator Penilaian berhasil disimpan!');
    }

    public function update(Request $request)
    {
        $id_kelompok = $request->id_kelompok;
		$tanggal_penilaian = $request->tanggal_penilaian;

		$setting = DB::table('setting_indikator')
		->where('tanggal','=',$tanggal_penilaian)
		->where('id_kelompok','=',$id_kelompok)
		->first();

        $user_id = Session::get('user_id');
        $role_id = Session::get('role_id');

		if(!$setting){
            $insSetting = DB::table('setting_indikator')
			->insert(array(
				'tanggal' => $tanggal_penilaian,
				'id_kelompok' => $id_kelompok,
				'role_id' => $role_id,
				'user_id' => $user_id,
				'created_at' => date('Y-m-d H:i:s')
			));

			$setting = DB::table('setting_indikator')
			->where('tanggal','=',date('Y-m-d', strtotime($tanggal_penilaian)))
			->where('id_kelompok','=',$id_kelompok)
			->first();

			$temp_indikator = DB::table('temp_setting_indikator_detail')
            ->where('id_user', '=', Auth::user()->id)
            ->where('tanggal','=',$tanggal_penilaian)
		    ->where('id_kelompok','=',$id_kelompok)
            ->get();
            foreach ($temp_indikator as $row) {
                $insIndikator = DB::table('setting_indikator_detail')
                ->insert(array(
                    'id_setting' => $setting->id,
                    'id_indikator' => $row->id_indikator,
                    'role_id' => $role_id,
                    'user_id' => $user_id,
                    'created_at' => date('Y-m-d H:i:s')
                ));
            }

            $delSisa = DB::table('temp_setting_indikator_detail')
            ->where('id_user', '=', Auth::user()->id)
			->where('tanggal','=',$tanggal_penilaian)
			->where('id_kelompok',$id_kelompok)
			->delete();
		}

        
		

        // return redirect()->route('indikator-penilaian-harian.index')->with('message', 'indikator penilaian harian is updated successfully.');
        return redirect()->route('penilaian-harian.index')->with('message', 'Data Indikator Penilaian berhasil disimpan!');
    
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id_kelompok, $tanggal_penilaian)
    {
        // $data = explode('-', $id);
        $setting = DB::table('setting_indikator')
        // ->where('id','=',$id)->delete();
		->where('id_kelompok','=',$id_kelompok)
		->where('tanggal','=',$tanggal_penilaian);

		$del = DB::table('setting_indikator_detail')
		->where('id_setting','=',$setting->first()->id)
        // ->where('id_setting','=',$id)
		->delete();

        $del = $del ? $setting->delete() : false;

        // if ($del) {
        //     $setting->delete();
        // }
        // return redirect()->route('indikator-penilaian-harian.index')->with('message', 'Data Indikator Penilaian berhasil dihapus!');
        return redirect()->back();
    }

    public function pilih_indikator($id_kelompok, $tanggal_penilaian, $id_indikator, $status, $id_setting)
    {
        // echo $id_kelompok.','.$tanggal_penilaian.','.$id_indikator.','.$status.','.$id_setting;
        // exit;
        if($id_setting == 0){
            $cek = DB::table('temp_setting_indikator_detail')
            ->where('id_user', '=', Auth::user()->id)
            ->where('tanggal','=',$tanggal_penilaian)
            ->where('id_kelompok','=',$id_kelompok)
            ->where('id_indikator','=',$id_indikator)
            ->count();

            if($cek == 0){
                // $setting = DB::table('setting_indikator')
                // ->where('tanggal','=',$tanggal_penilaian)
                // ->where('id_kelompok','=',$id_kelompok)
                // ->first();

                // $user_id = $request->user()->id;
                // $role_id = 1;

                // $insIndikator = DB::table('setting_indikator_detail')
                // ->insert(array(
                //     'id_setting' => $setting->id,
                //     'id_indikator' => $id_indikator,
                //     'role_id' => $role_id,
                //     'user_id' => $user_id,
                //     'created_at' => date('Y-m-d H:i:s')
                // ));
                $insIndikator = DB::table('temp_setting_indikator_detail')
                ->insert(array(
                    'id_user' => Auth::user()->id,
                    'tanggal' => $tanggal_penilaian,
                    'id_indikator' => $id_indikator,
                    'id_kelompok' => $id_kelompok,
                    'created_at' => date('Y-m-d H:i:s')
                ));
            }else{
                // $setting = DB::table('setting_indikator')
                // ->where('id_kelompok','=',$id_kelompok)
                // ->where('tanggal','=',$tanggal_penilaian);
        
                // $del = DB::table('setting_indikator_detail')
                // ->where('id_setting','=',$setting->first()->id)
                // ->delete();
                $del = DB::table('temp_setting_indikator_detail')
                ->where('id_user', '=', Auth::user()->id)
                ->where('tanggal','=',$tanggal_penilaian)
                ->where('id_kelompok','=',$id_kelompok)
                ->where('id_indikator','=',$id_indikator)
                ->delete();
            }
        }else{
            $cek = DB::table('setting_indikator_detail')
            ->where('id_setting','=',$id_setting)
            ->where('id_indikator','=',$id_indikator)
            ->count();

            if($cek == 0){
                $user_id = Session::get('user_id');
                $role_id = Session::get('role_id');

                $insIndikator = DB::table('setting_indikator_detail')
                ->insert(array(
                    'id_setting' => $id_setting,
                    'id_indikator' => $id_indikator,
                    'role_id' => $role_id,
                    'user_id' => $user_id,
                    'created_at' => date('Y-m-d H:i:s')
                ));
            }else{
                $del = DB::table('setting_indikator_detail')
                ->where('id_setting','=',$id_setting)
                ->where('id_indikator','=',$id_indikator)
                ->delete();
            }
        }

        return redirect()->back();
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
