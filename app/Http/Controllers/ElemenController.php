<?php

namespace App\Http\Controllers;

use App\Models\Elemen;
use App\Models\Dimensi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Session;

class ElemenController extends Controller
{
    function __construct()
    {
        $this->middleware('permission:elemen-list|elemen-create|elemen-edit|elemen-delete', ['only' => ['index','show']]);
        $this->middleware('permission:elemen-create', ['only' => ['create','store']]);
        $this->middleware('permission:elemen-edit', ['only' => ['edit','update']]);
        $this->middleware('permission:elemen-delete', ['only' => ['destroy']]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $dimensi = Dimensi::whereNull('deleted_at')->get();

        $elemen = Elemen::query()
        ->leftjoin('dimensi', 'dimensi.id', '=', 'elemen.id_dimensi')
		->select('dimensi.nama as dimensi', 'elemen.*');

        if($request->has('id_dimensi')){
            $elemen = $elemen->where('elemen.id_dimensi','=',$request->id_dimensi);
        }
        if($request->has('search')){
            $elemen = $elemen->where('elemen.nama', 'LIKE', "%" . $request->search . "%");
        }

         $elemen = $elemen->whereNull('elemen.deleted_at')
        ->paginate(10);
        
        // return view('master.elemen.index',compact('elemen'));
        return Inertia::render('Master/Elemen/Index', [
            'dimensi' => $dimensi,
            'elemen' => $elemen,
            'filtering' => request()->query() ?: null
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $dimensi = Dimensi::whereNull('deleted_at')->get();

        // return view('master.elemen.create')
        // ->with('dimensi', $dimensi);
        return Inertia::render('Master/Elemen/Create', 
        [
            'dimensi' => $dimensi
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // $request->validate([
        //     'id_dimensi' => 'required',
        //     'kode' => 'required',
        //     'nama' => 'required|string|max:250',
        // ]);

        $rules = [
            'id_dimensi' => ['required'],
            'kode' => ['required'],
            'nama' => ['required', 'string', 'max:250'],
        ];

        $messages = [
            'id_dimensi.required' => 'Dimensi harus diisi.',
            'kode.required' => 'Kode harus diisi.',
            'nama.required' => 'Nama Elemen harus diisi.',
        ];

        $request->validate($rules, $messages);

        $user_id = Session::get('user_id');
        $role_id = Session::get('role_id');
        // $id_sekolah = Session::get('id_sekolah');

        $dataelemen = array(
            'id_dimensi' => $request->id_dimensi,
            'kode' => $request->kode,
            'nama' => $request->nama,
            // 'id_sekolah' => $id_sekolah,
            'color' => $request->color,
            'user_id' => $user_id,
            'role_id' => $role_id,
            'created_at' => date('Y-m-d H:i:s'),
        );
        $simpan = Elemen::create($dataelemen);

        if ($simpan) {
            return redirect()->route('elemen.index')->with('message', 'Data Elemen berhasil disimpan!');
        } else {
            return redirect()->route('elemen.index')->with('error', 'Data Elemen gagal disimpan!');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Elemen $elemen)
    {
        // return view('master.elemen.show', ['elemen' => $elemen]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $dimensi = Dimensi::whereNull('deleted_at')->get();
        $elemen = Elemen::findOrFail($id);

        // return view('master.elemen.edit');
        return Inertia::render('Master/Elemen/Edit', 
        [
            'elemen' => $elemen,
            'dimensi' => $dimensi
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // $request->validate([
        //     'id_dimensi' => 'required',
        //     'kode' => 'required',
        //     'nama' => 'required|string|max:250',
        // ]);

        $rules = [
            'id_dimensi' => ['required'],
            'kode' => ['required'],
            'nama' => ['required', 'string', 'max:250'],
        ];

        $messages = [
            'id_dimensi.required' => 'Dimensi harus diisi.',
            'kode.required' => 'Kode harus diisi.',
            'nama.required' => 'Nama Elemen harus diisi.',
        ];

        $request->validate($rules, $messages);

        $user_id = Session::get('user_id');
        $role_id = Session::get('role_id');

        $dataelemen = array(
            'id_dimensi' => $request->id_dimensi,
            'kode' => $request->kode,
            'nama' => $request->nama,
            'color' => $request->color,
            // 'user_id' => $user_id,
            // 'role_id' => $role_id,
            'updated_at' => date('Y-m-d H:i:s'),
        );
        // $simpan = $elemen->update($dataelemen);
        $simpan = Elemen::where('id', $id)->update($dataelemen);

        if ($simpan) {
            return redirect()->route('elemen.index')->with('message', 'Data Elemen berhasil disimpan!');
        } else {
            return redirect()->route('elemen.index')->with('error', 'Data Elemen gagal disimpan!');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // $elemen->delete();
        $hapus = Elemen::where('id', $id)->delete();
        // $dataelemen = array(
        //     'deleted_at' => date('Y-m-d H:i:s'),
        // );
        // $hapus = Elemen::where('id', $id)->update($dataelemen);
        if ($hapus) {
            //hapus indikator
            DB::table('indikator')
            ->where('id_elemen','=',$id)
            ->delete();
        }

        // return redirect()->route('elemen.index')->with('message', 'Data Elemen berhasil dihapus!');
        return redirect()->back();
    }
}
