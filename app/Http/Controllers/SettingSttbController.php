<?php

namespace App\Http\Controllers;

use App\Models\SettingSttb;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Session;

class SettingSttbController extends Controller
{
    function __construct()
    {
        $this->middleware('permission:setting-sttb-list|setting-sttb-create|setting-sttb-edit|setting-sttb-delete', ['only' => ['index','show']]);
        $this->middleware('permission:setting-sttb-create', ['only' => ['create','store']]);
        $this->middleware('permission:setting-sttb-edit', ['only' => ['edit','update']]);
        $this->middleware('permission:setting-sttb-delete', ['only' => ['destroy']]);
        $this->middleware('permission:setting-sttb-status', ['only' => ['status_template']]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $setting_sttb = DB::table('setting_sttb')
		// ->select('id','template','id_sekolah')
		->where('id_sekolah','=',0)
		->orWhere('id_sekolah','=',Session::get('id_sekolah'))
		->get();

         // return view('erapor.setting_sttb.index',compact('setting_sttb'));
         return Inertia::render('Erapor/Setting_Sttb/Index', [
            'setting_sttb' => $setting_sttb
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // return view('erapor.setting_sttb.create');
        return Inertia::render('Erapor/Setting_Sttb/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // $request->validate([
        //     'template' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
        // ]);

        $rules = [
            'template' => ['required', 'image', 'max:1024', 'mimes:jpg,jpeg,png,gif'],
        ];

        $messages = [
            'template.required' => 'Template harus diisi.',
            'template.image' => 'File harus berupa gambar.',
            'template.max' => 'Ukuran file maksimum 1MB.',
            'template.mimes' => 'File harus format: jpg, jpeg, png, gif.',
        ];

        $request->validate($rules, $messages);

        $user_id = Session::get('user_id');
        $role_id = Session::get('role_id');
        $id_sekolah = Session::get('id_sekolah');

        if ($request->hasFile('template')) {
            $image = $request->file('template');
            $destinationPath = 'images/template/';
            // $profileImage = date('YmdHis') . "." . $image->getClientOriginalExtension();
            $profileImage = date('YmdHis') . '-' . $image->getClientOriginalName();
            $image->move($destinationPath, $profileImage);
            $template = $profileImage;
        }else{
            $template = '';
        }

        $datatemplate = array(
            'id_sekolah' => $id_sekolah,
            'template' => $template,
            'status' => 0,
            'user_id' => $user_id,
            'role_id' => $role_id,
            'created_at' => date('Y-m-d H:i:s'),
        );
        $simpan = SettingSttb::create($datatemplate);

        if ($simpan) {
            return redirect()->route('setting-sttb.index')->with('message', 'Data Template berhasil disimpan!');
        } else {
            return redirect()->route('setting-sttb.index')->with('error', 'Data Template gagal disimpan!');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(SettingSttb $setting_sttb)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SettingSttb $setting_sttb)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SettingSttb $setting_sttb)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SettingSttb $setting_sttb)
    {
        if($setting_sttb->status == 1) {
            $id_template = DB::table('setting_sttb')->where('id_sekolah','=',Session::get('id_sekolah'))->first()->id;
            $upd = DB::table('setting_sttb')
            ->where('id', '=', $id_template)
            ->update(array('status' => 1));
        }

        $hapus = $setting_sttb->delete();
        if ($hapus) {
            if ((file_exists('images/template/'.$setting_sttb->template)) && ($setting_sttb->template)) {
                unlink('images/template/'.$setting_sttb->template);
            }
        }

        // return redirect()->route('setting-sttb.index')->with('message', 'Data Template berhasil dihapus!');
        return redirect()->back();
    }

    public function status_template($id, $status)
    {
        $stat = $status == 1 ? 0 : 1;

        $inactive = DB::table('setting_sttb')
            ->where('status', '=', 1)
            ->where('id_sekolah','=',Session::get('id_sekolah'))
            ->update(array('status' => 0));

        $upd = DB::table('setting_sttb')
            ->where('id', '=', $id)
            ->update(array('status' => $stat));

        $stat_message = $stat == 1 ? "diaktifkan" : "dinonaktifkan";

        // return redirect()->route('setting-sttb.index')->with('message', 'Data Template berhasil '.$stat_message.'!');
        // return response()->json(['message' => 'Data updated successfully']);
        return redirect()->back();
    }
}
