<?php

namespace App\Http\Controllers;

use App\Models\Dimensi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Session;

class DimensiController extends Controller
{
    function __construct()
    {
        $this->middleware('permission:dimensi-list|dimensi-create|dimensi-edit|dimensi-delete', ['only' => ['index','show']]);
        $this->middleware('permission:dimensi-create', ['only' => ['create','store']]);
        $this->middleware('permission:dimensi-edit', ['only' => ['edit','update']]);
        $this->middleware('permission:dimensi-delete', ['only' => ['destroy']]);
    }
    
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $dimensi = Dimensi::query();

        if($request->has('id_metode')){
            $dimensi = $dimensi->where('dimensi.id_metode','=',$request->id_metode);
        }
        if($request->has('search')){
            $dimensi = $dimensi->where('dimensi.nama', 'LIKE', "%" . $request->search . "%");
        }

        $dimensi = $dimensi->whereNull('deleted_at')->paginate(10);
        
        // return view('master.dimensi.index',compact('dimensi'));
        return Inertia::render('Master/Dimensi/Index', [
            'dimensi' => $dimensi,
            'filtering' => request()->query() ?: null
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // return view('master.dimensi.create');
        return Inertia::render('Master/Dimensi/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // $request->validate([
        //     'id_metode' => 'required',
        //     'kode' => 'required',
        //     'nama' => 'required|string|max:250',
        // ]);

        $rules = [
            'id_metode' => ['required'],
            'kode' => ['required'],
            'nama' => ['required', 'string', 'max:250'],
        ];

        $messages = [
            'id_metode.required' => 'Metode harus diisi.',
            'kode.required' => 'Kode harus diisi.',
            'nama.required' => 'Nama Dimensi harus diisi.',
        ];

        $request->validate($rules, $messages);

        $user_id = Session::get('user_id');
        $role_id = Session::get('role_id');

        $datadimensi = array(
            'id_metode' => $request->id_metode,
            'kode' => $request->kode,
            'nama' => $request->nama,
            'color' => $request->color,
            'icon' => $request->icon,
            'user_id' => $user_id,
            'role_id' => $role_id,
            'created_at' => date('Y-m-d H:i:s'),
        );
        
        $simpan = Dimensi::create($datadimensi);
        if ($simpan) {
            return redirect()->route('dimensi.index')->with('message', 'Data Dimensi berhasil disimpan!');
        } else {
            return redirect()->route('dimensi.index')->with('error', 'Data Dimensi gagal disimpan!');
        }
        
    }

    /**
     * Display the specified resource.
     */
    public function show(Dimensi $dimensi)
    {
        // return view('master.dimensi.show', ['dimensi' => $dimensi]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Dimensi $dimensi)
    {
        // return view('master.dimensi.edit',compact('dimensi'));
        return Inertia::render('Master/Dimensi/Edit', ['dimensi' => $dimensi]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Dimensi $dimensi)
    {
        // $request->validate([
        //     'id_metode' => 'required',
        //     'kode' => 'required',
        //     'nama' => 'required|string|max:250',
        // ]);

        $rules = [
            'id_metode' => ['required'],
            'kode' => ['required'],
            'nama' => ['required', 'string', 'max:250'],
        ];

        $messages = [
            'id_metode.required' => 'Metode harus diisi.',
            'kode.required' => 'Kode harus diisi.',
            'nama.required' => 'Nama Dimensi harus diisi.',
        ];

        $request->validate($rules, $messages);

        $user_id = Session::get('user_id');
        $role_id = Session::get('role_id');

        $datadimensi = array(
            'id_metode' => $request->id_metode,
            'kode' => $request->kode,
            'nama' => $request->nama,
            'color' => $request->color,
            'icon' => $request->icon,
            'user_id' => $user_id,
            'role_id' => $role_id,
            'updated_at' => date('Y-m-d H:i:s'),
        );

        $simpan = $dimensi->update($datadimensi);
        if ($simpan) {
            return redirect()->route('dimensi.index')->with('message', 'Data Dimensi berhasil disimpan!');
        } else {
            return redirect()->route('dimensi.index')->with('error', 'Data Dimensi gagal disimpan!');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Dimensi $dimensi)
    {
        $dimensi->delete();

        // $datadimensi = array(
        //     'deleted_at' => date('Y-m-d H:i:s'),
        // );
        // $hapus = Dimensi::where('id', $dimensi->id)->update($datadimensi);

        // return redirect()->route('dimensi.index')->with('message', 'Data Dimensi berhasil dihapus!');
        return redirect()->back(); 
    }
}
