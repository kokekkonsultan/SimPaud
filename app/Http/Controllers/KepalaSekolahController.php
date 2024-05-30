<?php

namespace App\Http\Controllers;

use App\Models\Semester;
use App\Models\KepalaSekolah;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Auth;
use Session;

class KepalaSekolahController extends Controller
{
    function __construct()
    {
        $this->middleware('permission:kepala-sekolah-list|kepala-sekolah-create|kepala-sekolah-edit|kepala-sekolah-delete', ['only' => ['index','show']]);
        $this->middleware('permission:kepala-sekolah-create', ['only' => ['create','store']]);
        $this->middleware('permission:kepala-sekolah-edit', ['only' => ['edit','update']]);
        $this->middleware('permission:kepala-sekolah-delete', ['only' => ['destroy']]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $data = $this->kepalasekolah
        // ->select('ks.id','ks.nama','ks.ttd','ks.id_sekolah','mst_semester.id_semester','mst_semester.nama AS semester','ta.nama AS tahun_ajaran','mst_semester.periode_aktif')
        // ->join('mst_tahun_ajaran AS ta','ta.id_tahun_ajaran','=','mst_semester.id_tahun_ajaran')
        // ->leftjoin('mst_kepala_sekolah AS ks', function($join){
        //     $join->on('ks.id_semester','=','mst_semester.id_semester');
        //     $join->on('ks.id_sekolah','=',\DB::raw(\Session::get('id_sekolah')));
        // })
        // ->where('mst_semester.tanggal_selesai','>',date('Y-m-d', strtotime($sekolah->created_at)))
        // ->where('mst_semester.id_semester','<=',\Session::get('id_semester'))
        // ->orderby('mst_semester.id_semester','DESC')
        // ->get();

        $sekolah = DB::table('sekolah')
        ->where('id','=', Session::get('id_sekolah'))
        ->first();

        $kepala_sekolah = Semester::select('ks.id','ks.nama','ks.tanda_tangan','ks.id_sekolah', DB::raw('SUBSTRING_INDEX(semester.nama, " ", -1) as semester'),  'semester.nama AS semester_nama','ta.nama AS tahun_ajaran','semester.periode_aktif')
        ->join('tahun_ajaran AS ta','ta.id','=','semester.id_tahun_ajaran')
        ->leftjoin('kepala_sekolah AS ks', function($join){
            $join->on('ks.id_semester','=','semester.id');
            $join->on('ks.id_sekolah','=',DB::raw(Session::get('id_sekolah')));
        })
        ->where('semester.tanggal_selesai','>',date('Y-m-d', strtotime($sekolah->created_at)))
        ->where('semester.id','<=',Session::get('id_semester'))
        ->orderby('semester.id','DESC')
        ->paginate(10);

        // return view('master.kepala_sekolah.index',compact('kepala_sekolah'));
        return Inertia::render('Master/Kepala_Sekolah/Index', [
            'kepala_sekolah' => $kepala_sekolah
        ]);
    }


    /**
     * Display the specified resource.
     */
    public function show(KepalaSekolah $kepala_sekolah)
    {
        // return view('master.kepala_sekolah.show', ['kepala_sekolah' => $kepala_sekolah]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $kepala_sekolah = Semester::select('ks.id','ks.id_user','ks.nama','ks.email','ks.tanda_tangan','ks.id_sekolah', DB::raw('SUBSTRING_INDEX(semester.nama, " ", -1) as semester'), 'semester.nama AS semester_nama','ta.nama AS tahun_ajaran','semester.periode_aktif')
        ->join('tahun_ajaran AS ta','ta.id','=','semester.id_tahun_ajaran')
        ->leftjoin('kepala_sekolah AS ks', function($join){
            $join->on('ks.id_semester','=','semester.id');
            $join->on('ks.id_sekolah','=',DB::raw(Session::get('id_sekolah')));
        })
        // ->leftjoin('users', function ($join) {
        //     $join->on('users.id', '=', 'ks.id_user');
        // })
        ->where('ks.id','=',$id)
        ->first();

        // $user = User::find($kepala_sekolah->id_user);
        // $user->assignRole("kepala.sekolah");

        // return view('master.kepala_sekolah.edit',compact('sekolah'));
        return Inertia::render('Master/Kepala_Sekolah/Edit', 
        [
            'kepala_sekolah' => $kepala_sekolah
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $rules = [
            'email' => ['required', 'unique:users,email,'.$request->id_user],
            // 'password' => ['nullable', 'min:8', 'confirmed', 'required_with:password_confirmation', 'same:password_confirmation'],
            'password' => ['nullable', 'min:8', 'confirmed'],
            'password_confirmation' => ['nullable', 'min:8'],
            'nama' => ['required', 'string', 'max:250'],
            'tanda_tangan' => ['nullable', 'image', 'max:1024', 'mimes:jpg,jpeg,png,gif'],
        ];

        $messages = [
            'email.required' => 'Email harus diisi.',
            'email.email' => 'Email tidak valid.',
            'email.unique' => 'Email sudah digunakan.',
            'password.min' => 'Kata Sandi minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi Kata Sandi tidak sama.',
            'password_confirmation.min' => 'Konfirmasi Kata Sandi minimal 8 karakter.',
            'nama.required' => 'Nama Kepala Sekolah harus diisi.',
            'tanda_tangan.image' => 'File harus berupa gambar.',
            'tanda_tangan.max' => 'Ukuran file maksimum 1MB.',
            'tanda_tangan.mimes' => 'File harus format: jpg, jpeg, png, gif.',
        ];

        $request->validate($rules, $messages);

        if ($request->hasFile('tanda_tangan')) {
            /*if($request->password){
                $request->validate([
                    'nama' => 'required|string|max:250',
                    'email' => 'required|unique:users,email,'.$request->id_user,
                    'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                    'password_confirmation' => 'min:8',
                ]);
            }else{
                $request->validate([
                    'nama' => 'required|string|max:250',
                    'email' => 'required|unique:users,email,'.$request->id_user,
                    'tanda_tangan' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
                ]);
            }*/

            if ((file_exists('images/sekolah/'.$request->tanda_tangan_lama)) && ($request->tanda_tangan_lama)) {
                unlink('images/sekolah/'.$request->tanda_tangan_lama);
            }
            $image = $request->file('tanda_tangan');
            $destinationPath = 'images/sekolah/';
            // $profileImage = date('YmdHis') . "." . $image->getClientOriginalExtension();
            $profileImage = date('YmdHis') . '-' . $image->getClientOriginalName();
            $image->move($destinationPath, $profileImage);
            $tanda_tangan = $profileImage;
        }else{
            /*if($request->password){
                $request->validate([
                    'nama' => 'required|string|max:250',
                    'email' => 'required|unique:users,email,'.$request->id_user,
                    'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                    'password_confirmation' => 'min:8',
                ]);
            }else{
                $request->validate([
                    'nama' => 'required|string|max:250',
                    'email' => 'required|unique:users,email,'.$request->id_user,
                ]);
            }*/
            $tanda_tangan = $request->tanda_tangan_lama;
        }

        $datasekolah = array(
            'nama' => $request->nama,
            'email' => $request->email,
            'tanda_tangan' => $tanda_tangan,
            'updated_at' => date('Y-m-d H:i:s'),
        );
        // $simpan = $kepala_sekolah->update($datasekolah);
        $simpan = KepalaSekolah::where('id', $id)->update($datasekolah);

        // $id_user = DB::table('kepala_sekolah')->where('id', '=', $id)->first()->id_user;
        if($request->id_user){
            if($request->password){
                DB::table('users')->where('id', '=', $request->id_user)
                ->update(array('password' => Hash::make($request->password), 'name' => $request->nama, 'email' => $request->email));
            }else{
                DB::table('users')->where('id', '=', $request->id_user)
                ->update(array('name' => $request->nama, 'email' => $request->email));
            }
        }else{
            $add_kepala_sekolah = User::create([
                'name' => $request->nama,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'status' => 1,
                'confirmed' => 1,
                'confirmed_at' => date('Y-m-d H:i:s'),
                'verified' => 1,
                'verified_at' => date('Y-m-d H:i:s'),
                'verifier' => $request->user()->id,
                'role_id' => 6,
            ]);

            $current_kepala_sekolah = User::where('email', '=', $request->email);
            $user = User::find($current_kepala_sekolah->orderby('created_at', 'DESC')->first()->id);
            $user->assignRole("kepala.sekolah");

            $datasekolah = array(
                'id_user' => $current_kepala_sekolah->orderby('created_at', 'DESC')->first()->id,
            );
            $simpan = KepalaSekolah::where('id', $id)->update($datasekolah);
        }

        // DB::table('users')->where('email', '=', $request->email)
        //     ->update(array('name' => $request->nama));

        if ($simpan) {
            return redirect()->route('kepala-sekolah.index')->with('message', 'Data Kepala Sekolah berhasil disimpan!');
        } else {
            return redirect()->route('kepala-sekolah.index')->with('error', 'Data Kepala Sekolah gagal disimpan!');
        }
    }

    public function profil_kepala_sekolah()
    {
        $kepala_sekolah = KepalaSekolah::select('kepala_sekolah.*', 'users.email')
        ->join('users', function ($join) {
            $join->on('users.id', '=', 'kepala_sekolah.id_user');
            // $join->on('users.confirmed', '=', DB::raw('1'));
            // $join->on('users.confirmed_at', 'IS NOT', DB::raw('null'));
            // $join->on('users.verified', '=', DB::raw('1'));
            // $join->on('users.verified_at', 'IS NOT', DB::raw('null'));
            // $join->on('users.deleted', '=', DB::raw('0'));
            // $join->on('users.deleted_at', 'IS', DB::raw('null'));
        })
        ->where('users.id', '=', Auth::user()->id)->first();

        return Inertia::render('Master/Kepala_Sekolah/Profil_Kepala_Sekolah', 
        [
            'kepala_sekolah' => $kepala_sekolah,
            // 'provinsi' => $provinsi
        ]);
    }

    public function profil_kepala_sekolah_update(Request $request)
    {
        // echo $request->nama.'-'.$request->password;
        // exit;

        if ($request->hasFile('foto')) {
            if($request->password){
                $request->validate([
                    'nama' => 'required|string|max:250',
                    'email' => 'required|unique:users,email,'.$request->id_user,
                    'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                    'password_confirmation' => 'min:8',
                    'foto' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
                ]);
            }else{
                $request->validate([
                    'nama' => 'required|string|max:250',
                    'email' => 'required|unique:users,email,'.$request->id_user,
                    // 'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                    // 'password_confirmation' => 'min:8',
                    // 'npsn' => 'required|integer|min:8|max:8',
                    // 'npsn' => 'required|integer',
                    'foto' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
                ]);
            }

            if ((file_exists('images/sekolah/'.$request->foto_lama)) && ($request->foto_lama)) {
                unlink('images/sekolah/'.$request->foto_lama);
            }
            $image = $request->file('foto');
            $destinationPath = 'images/sekolah/';
            // $profileImage = date('YmdHis') . "." . $image->getClientOriginalExtension();
            $profileImage = date('YmdHis') . '-' . $image->getClientOriginalName();
            $image->move($destinationPath, $profileImage);
            $foto = $profileImage;
        }else{
            if($request->password){
                $request->validate([
                    'nama' => 'required|string|max:250',
                    'email' => 'required|unique:users,email,'.$request->id_user,
                    'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                    'password_confirmation' => 'min:8',
                ]);
            }else{
                $request->validate([
                    'nama' => 'required|string|max:250',
                    'email' => 'required|unique:users,email,'.$request->id_user,
                    // 'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                    // 'password_confirmation' => 'min:8',
                    // 'npsn' => 'required|integer|min:8|max:8',
                    // 'npsn' => 'required|integer',
                    // 'foto' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
                ]);
            }
            $foto = $request->foto_lama;
        }

        $datasekolah = array(
            'nama' => $request->nama,
            // 'tanda_tangan' => $tanda_tangan,
            // 'foto' => $foto,
            'updated_at' => date('Y-m-d H:i:s'),
        );
        // $simpan = $kepala_sekolah->update($datasekolah);
        $simpan = KepalaSekolah::where('id_user', $request->id_user)->update($datasekolah);

        if($request->password){
            DB::table('users')->where('id', '=', $request->id_user)
            ->update(array('password' => Hash::make($request->password), 'name' => $request->nama, 'email' => $request->email));
        }else{
            DB::table('users')->where('id', '=', $request->id_user)
            ->update(array('name' => $request->nama, 'email' => $request->email));
        }

        if ($simpan) {
            return redirect()->route('dashboard')->with('message', 'Data Kepala Sekolah berhasil disimpan!');
        } else {
            return redirect()->route('dashboard')->with('error', 'Data Kepala Sekolah gagal disimpan!');
        }
    }

}
