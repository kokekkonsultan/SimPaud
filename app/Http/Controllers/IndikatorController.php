<?php

namespace App\Http\Controllers;

use App\Models\Indikator;
use App\Models\Elemen;
use App\Models\Dimensi;
use App\Models\KelompokUsia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Session;

class IndikatorController extends Controller
{
    function __construct()
    {
        $this->middleware('permission:indikator-list|indikator-create|indikator-edit|indikator-delete', ['only' => ['index','show']]);
        $this->middleware('permission:indikator-create', ['only' => ['create','store']]);
        $this->middleware('permission:indikator-edit', ['only' => ['edit','update']]);
        $this->middleware('permission:indikator-delete', ['only' => ['destroy']]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $kelompok_usia = KelompokUsia::get();

        // $indikator = Elemen::leftjoin('dimensi', 'dimensi.id', '=', 'elemen.id_dimensi')
		// ->select('dimensi.nama as dimensi', 'elemen.*')
        // ->orderby('id', 'desc')
        // ->paginate(10);

        if (($request->id_kelompok_usia && strlen($request->id_kelompok_usia)) > 0) {
            $id_kelompok_usia = $request->id_kelompok_usia;
        } else {
            $id_kelompok_usia = 1;
        }

        $indikator = Dimensi::get();
        foreach($indikator AS $row){
            $row->subdimensi = Elemen::select('elemen.*', DB::raw("COUNT(id_elemen) AS jumlah"))
            // ->leftjoin('indikator','elemen.id','=','indikator.id_elemen')
            ->leftJoin('indikator', function($join) {
                $join->on('elemen.id', '=', 'indikator.id_elemen')
                ->where('indikator.id_sekolah','=',Session::get('id_sekolah'));
            })

            ->where('id_dimensi','=',$row->id)
            // ->where(function($query){
            //     $query->where('id_sekolah','=',Session::get('id_sekolah'))
            //     ->orWhere('id_sekolah','=',0);
            // })
            // ->where('indikator.id_sekolah','=',Session::get('id_sekolah'))
            ->whereNull('elemen.deleted_at')
            ->groupby('id')
            ->orderby('elemen.kode','ASC')
            ->get();

            foreach($row->subdimensi AS $data){
                $data->indikator = Indikator::where('id_elemen','=',$data->id)
                ->where('id_kelompok_usia','=',$id_kelompok_usia)
                ->where(function($query){
                    $query->where('id_sekolah','=',Session::get('id_sekolah'))
                    ->orWhere('id_sekolah','=',0);
                })
                ->whereNull('deleted_at')
                ->get();
            }
        }
        
        $datax = Dimensi::with(['elemen', 'indikator'])->get();
        // $indikator = Indikator::query();
        // if($request->has('id_elemen')){
        //     $indikator = $indikator->where('id_elemen','LIKE',$request->id_elemen);
        // }
        // if($request->has('id_kelompok_usia')){
        //     $indikator = $indikator->where('id_kelompok_usia','LIKE',$request->id_kelompok_usia);
        // }
        // $indikator = $indikator->where('id_sekolah','=',Session::get('id_sekolah'))
        // ->whereNull('deleted_at')
        // ->paginate(10);

        

        // return view('master.indikator.index',compact('indikator'));
        return Inertia::render('Master/Indikator/Index', [
            // 'indikators' => $datax,
            'indikator' => $indikator,
            'kelompok_usia' => $kelompok_usia,
            'id_kelompok_usia' => $id_kelompok_usia,
            'filtering' => request()->query() ?: null
        ]);
    }

    public function index2(Request $request)
    {
        $kelompok_usia = KelompokUsia::get();

        $indikator = Dimensi::whereNull('deleted_at')->get();
        foreach($indikator AS $row){
            $row->subdimensi = Elemen::where('id_dimensi','=',$row->id)
            ->where(function($query){
                $query->where('id_sekolah','=',Session::get('id_sekolah'))
                ->orWhere('id_sekolah','=',0);
            })
            ->whereNull('deleted_at')
            ->orderby('kode','ASC')
            ->get();

            foreach($row->subdimensi AS $data){
                $data->indikator = Indikator::where('id_elemen','=',$data->id)
                ->where('id_kelompok_usia','=',$id_kelompok_usia)
                ->where(function($query){
                    $query->where('id_sekolah','=',Session::get('id_sekolah'))
                    ->orWhere('id_sekolah','=',0);
                })
                ->whereNull('deleted_at')
                ->get();
            }
        }

        // return view('master.indikator.index',compact('indikator'));
        return Inertia::render('Master/Indikator/Index2', [
            'indikator' => $indikator,
            'kelompok_usia' => $kelompok_usia,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $dimensi = Dimensi::get();
        $elemen = Elemen::get();
        $kelompok_usia = KelompokUsia::get();

        // return view('master.indikator.create')
        // ->with('dimensi', $dimensi);
        return Inertia::render('Master/Indikator/Create', 
        [
            'dimensi' => $dimensi,
            'elemen' => $elemen,
            'kelompok_usia' => $kelompok_usia
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            // 'id_elemen' => 'required',
            // 'nama' => 'required|string|max:250',
        ]);

        $user_id = Session::get('user_id');
        $role_id = Session::get('role_id');
        $id_sekolah = Session::get('id_sekolah');

        // echo sizeof($request->nama2);
        // echo print_r($request->nama2);
        // echo implode(',', $request->nama2[1]);

        // for($i = 0; $i < sizeof($request->nama2); $i++){
        //     // echo implode(',', $request->nama2[$i]).'<br>';

        // }
        // foreach($request->nama2 as $item) {
        //     // echo $item.'<br>';
        // }

        // foreach ($request->nama2 as $key => $value) {
        //     // echo $value["nama"][$key], "\n";
        // }

        // foreach ($request->nama2 as $item) {
        //     echo "Name: " . $item['name'] . ", Email: " . $item['email'] . "<br>";
        // }

        // foreach($request->nama2 as $key => $n) {
        // // echo "The name is " . $n . " thank you";
        // }
        // exit;

        $kelompok_usia = KelompokUsia::get();
        foreach ($kelompok_usia as $row) {
            $dataindikator = array(
                'id_elemen' => $request->id_elemen,
                'nama' => $request->nama.$row->id,
                'id_sekolah' => $id_sekolah,
                'id_kelompok_usia' => $row->id,
                'user_id' => $user_id,
                'role_id' => $role_id,
                'created_at' => date('Y-m-d H:i:s'),
            );
// echo $request->nama;
            //$simpan = Indikator::create($dataindikator);
        }
        // exit;

        if ($simpan) {
            return redirect()->route('indikator.index')->with('message', 'Data Indikator berhasil disimpan!');
        } else {
            return redirect()->route('indikator.index')->with('error', 'Data Indikator gagal disimpan!');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Indikator $indikator)
    {
        // return view('master.indikator.show', ['indikator' => $indikator]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id) // Indikator $indikator
    {
        $indikator = Elemen::select('elemen.*', 'dimensi.nama as nama_dimensi')
        ->join('dimensi','dimensi.id','=','elemen.id_dimensi')
        ->findOrFail($id);
        $dimensi = Dimensi::get();
        $elemen = Elemen::get();
        $kelompok_usia = KelompokUsia::get();

        // foreach ($kelompok_usia as $row) {
        //     $row->indikator = DB::table('indikator')
        //         ->select('id', 'nama','id_sekolah')
        //         ->where('id_elemen', '=', $id)
        //         ->where('id_kelompok_usia', '=', $row->id)
        //         ->where(function($query){
        //             $query->where('id_sekolah','=',Session::get('id_sekolah'))
        //             ->orWhere('id_sekolah','=',0);
        //         })
        //         ->whereNull('deleted_at')
        //         ->get();
        // }

        $indicators = DB::table('indikator')
                ->select('indikator.id', 'indikator.id_kelompok_usia', 'indikator.nama', 'indikator.id_sekolah', 'kelompok_usia.nama AS kelompok_usia')
                ->leftjoin('kelompok_usia', 'kelompok_usia.id', '=', 'indikator.id_kelompok_usia')
                ->where('id_elemen', '=', $id)
                ->where(function($query){
                    $query->where('id_sekolah','=',Session::get('id_sekolah'))
                    ->orWhere('id_sekolah','=',0);
                })
                ->whereNull('deleted_at')
                ->orderby('id_kelompok_usia', 'ASC')
                ->get();

        // return view('master.indikator.edit')
        // ->with('indikator', $indikator)
        // ->with('dimensi', $dimensi)
        // ->with('elemen', $elemen);
        return Inertia::render('Master/Indikator/Edit', 
        [
            'indikator' => $indikator,
            'dimensi' => $dimensi,
            'elemen' => $elemen,
            'kelompok_usia' => $kelompok_usia,
            'indicators' => $indicators,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request) // , Indikator $indikator
    {

        // foreach ($request->data_indikator as $item) {
        //     echo "Name: " . $item['id_kelompok_usia'] . ", Email: " . $item['nama_indikator'] . "<br>";
        // }
        // exit;

        $request->validate([
            // 'id_elemen' => 'required',
            // 'nama' => 'required|string|max:250',
        ]);

        $user_id = Session::get('user_id');
        $role_id = Session::get('role_id');

        /*$dataindikator = array(
            'id_elemen' => $request->id_elemen,
            'nama' => $request->nama,
            'id_kelompok_usia' => $request->id_kelompok_usia,
            // 'user_id' => $user_id,
            // 'role_id' => $role_id,
            'updated_at' => date('Y-m-d H:i:s'),
        );
        // $simpan = $indikator->update($dataindikator);
        $simpan = Indikator::where('id', $id)->update($dataindikator);*/


        // $id_kelompok_usia = $request->id_kelompok_usia;
        // $nama_indikator = $request->nama_indikator;
        // $nama_indikator_old = $request->nama_indikator_old;

        // echo count((array) $nama_indikator);
        // echo 'total = '.sizeof($nama_indikator_old);
        // exit;

        // for($n=0 ; $n<sizeof($narasi_dimensi) ; $n++){
        //     // echo ($n+1).', ';
        //     // exit;

        // }
        // echo print_r($request->edit_data_indikator);
        // exit;
        if(isset($request->edit_data_indikator)){
            foreach ($request->edit_data_indikator as $item) {
                if($item){
                    $data = explode('=====', $item);
                    // $id_kelompok_usia_old = $data[0];
                    $id_indikator_old = $data[0];
                    if(isset($data[1])){
                        $nama_indikator_old = $data[1];
                        DB::table('indikator')
                        ->where('id','=',$id_indikator_old)
                        ->update(array('nama' => $nama_indikator_old, 'updated_at' => date('Y-m-d H:i:s')));
                    }
                }
            }
        }
        // exit;
        

        foreach ($request->data_indikator as $item) {
            $id_kelompok_usia = $item['id_kelompok_usia'];
            $nama_indikator = $item['nama_indikator'];

            if($id_kelompok_usia){
                // echo "Name: " . $id_kelompok_usia . ", Email: " . $nama_indikator . "<br>";

                // $check = DB::table('indikator')
                // ->where('id_elemen','=',$request->id_elemen)
                // ->where('id_kelompok_usia','=',$id_kelompok_usia)
                // ->where('id_sekolah','=',Session::get('id_sekolah'))
                // ->first();

                // if(!$check){
                    $simpan = DB::table('indikator')
                    ->insert(array(
                        'id_elemen' => $request->id_elemen,
                        'id_kelompok_usia' => $id_kelompok_usia,
                        'id_sekolah' => Session::get('id_sekolah'),
                        'nama' => $nama_indikator,
                        'role_id' => $role_id,
                        'user_id' => $user_id,
                        'created_at' => date('Y-m-d H:i:s')
                    ));
                // }else{
                //     DB::table('indikator')
                //     ->where('id_elemen','=',$request->id_elemen)
                //     ->where('id_kelompok_usia','=',$id_kelompok_usia)
                //     ->where('id_sekolah','=',Session::get('id_sekolah'))
                //     ->update(array('nama' => $nama_indikator));
                // }
            }else{
                $simpan = false;
            }
        }
        // exit;

        // if ($simpan) {
            return redirect()->route('indikator.index')->with('message', 'Data Indikator berhasil disimpan!');
        // } else {
        //     return redirect()->route('indikator.index')->with('error', 'Data Indikator gagal disimpan!');
        // }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $hapus = Indikator::where('id_elemen', $id)->where('id_sekolah','=',Session::get('id_sekolah'))->delete();

        // return redirect()->route('indikator.index')->with('message', 'Data Indikator berhasil dihapus!');
        return redirect()->back();
    }

    public function hapus_indikator($id)
    {
        $hapus = Indikator::where('id', $id)->delete();

        // return redirect()->back()->with('message', 'Data Indikator berhasil dihapus!');
        return redirect()->back();
    }

    public function getDimensiList()
    {
        $dimensi = DB::table("dimensi")->select("id", "nama")->whereNull('deleted_at')->get();
        return response()->json($dimensi);
    }
    
    public function getElemenList($id_dimensi)
    {
        $elemen = DB::table("elemen")->select("id", "nama")->where("id_dimensi", $id_dimensi)->whereNull('deleted_at')->get();
        return response()->json($elemen);
    }

}
