<?php

namespace App\Http\Controllers;

use App\Models\Guru;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Auth;
use Session;

class GuruController extends Controller
{
    function __construct()
    {
        $this->middleware('permission:guru-list|guru-create|guru-edit|guru-delete', ['only' => ['index','show']]);
        $this->middleware('permission:guru-create', ['only' => ['create','store']]);
        $this->middleware('permission:guru-edit', ['only' => ['edit','update']]);
        $this->middleware('permission:guru-delete', ['only' => ['destroy']]);
        $this->middleware('permission:guru-status', ['only' => ['status_guru']]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // if($request->user()->id == 2){
        //     $guru = Guru::select('guru.*', DB::raw('DATE_FORMAT(tanggal_lahir, "%d-%m-%Y") as tanggal_lahir'))->paginate(10);
        // }else{
        //     $id_sekolah = DB::table('sekolah')->where('id_user', '=', $request->user()->id)->first()->id;
        //     $guru = Guru::select('guru.*', DB::raw('DATE_FORMAT(tanggal_lahir, "%d-%m-%Y") as tanggal_lahir'))->where('id_sekolah', '=', $id_sekolah)->paginate(10);
        // }
        
        $guru = Guru::query()
        ->select('guru.*', 'users.status', 'users.id AS id_user', DB::raw('DATE_FORMAT(tanggal_lahir, "%d-%m-%Y") as tanggal_lahir'))
        ->join('users','users.id','=','guru.id_user');
        if ($request->has('search') and strlen($request->search) > 0) {
            $guru = $guru->where(function ($query) use ($request) {
                $query->Where('guru.nama', 'LIKE', "%" . $request->search . "%")
                    ->orWhere('guru.no_telpon', 'LIKE', "%" . $request->search . "%")
                    ->orWhere('guru.email', 'LIKE', "%" . $request->search . "%");
            });
        }
        // if(Session::get('role_id') == 3){
            $guru = $guru->where('id_sekolah', '=', Session::get('id_sekolah'));
        // }
        $guru = $guru->whereNull('guru.deleted_at')->paginate(10);

        // return view('master.guru.index',compact('guru'));
        return Inertia::render('Master/Guru/Index', [
            'guru' => $guru,
            // 'searching' => $request->only(['search'])
            'filtering' => request()->query() ?: null
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // return view('master.guru.create');
        return Inertia::render('Master/Guru/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // $request->validate([
        //     'nama' => 'required|string|max:250',
        //     'email' => 'required|unique:users,email',
        //     // 'password' => 'required|min:8|required_with:password_confirmation|same:password_confirmation',
        //     // 'password_confirmation' => 'required|min:8',
        //     // 'nip' => 'required|integer|min:8|max:8',
        //     // 'nip' => 'required|integer',
        //     'jenis_kelamin' => 'required',
        //     // 'foto' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
        //     // 'tanda_tangan' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
        // ]);

        $rules = [
            'jenis_kelamin' => ['required'],
            'email' => ['required', 'unique:users,email'],
            'nama' => ['required', 'string', 'max:250'],
            'foto' => ['nullable', 'image', 'max:1024', 'mimes:jpg,jpeg,png,gif'],
            'tanda_tangan' => ['nullable', 'image', 'max:1024', 'mimes:jpg,jpeg,png,gif'],
        ];

        $messages = [
            'jenis_kelamin.required' => 'Jenis Kelamin harus diisi.',
            'email.required' => 'Email harus diisi.',
            'email.email' => 'Email tidak valid.',
            'email.unique' => 'Email sudah digunakan.',
            'nama.required' => 'Nama Guru harus diisi.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.max' => 'Ukuran file maksimum 1MB.',
            'foto.mimes' => 'File harus format: jpg, jpeg, png, gif.',
            'tanda_tangan.image' => 'File harus berupa gambar.',
            'tanda_tangan.max' => 'Ukuran file maksimum 1MB.',
            'tanda_tangan.mimes' => 'File harus format: jpg, jpeg, png, gif.',
        ];

        $request->validate($rules, $messages);

        // $password_default = rand(100000,999999);
        $password_default = $this->generateRandomString();
        $add = User::create([
            'name' => $request->nama,
            'email' => $request->email,
            'password' => Hash::make($password_default),
            'status' => 1,
            'confirmed' => 1,
            'confirmed_at' => date('Y-m-d H:i:s'),
            'verified' => 1,
            'verified_at' => date('Y-m-d H:i:s'),
            'role_id' => 4,
        ]);

        if ($add) {
            $current = User::where('email', '=', $request->email);
            $user = User::find($current->orderby('created_at', 'DESC')->first()->id);
            $user->assignRole("guru");

            $user_id = Session::get('user_id');
            $role_id = Session::get('role_id');
            $id_sekolah = Session::get('id_sekolah');

            if ($request->hasFile('foto')) {
                $image = $request->file('foto');
                $destinationPath = 'images/guru/';
                // $profileImage = date('YmdHis') . "." . $image->getClientOriginalExtension();
                $profileImage = date('YmdHis') . '-' . $image->getClientOriginalName();
                $image->move($destinationPath, $profileImage);
                $foto = $profileImage;
            }else{
                $foto = '';
            }

            if ($request->hasFile('tanda_tangan')) {
                $image = $request->file('tanda_tangan');
                $destinationPath = 'images/guru/';
                // $profileImage = date('YmdHis') . "." . $image->getClientOriginalExtension();
                $profileImage = date('YmdHis') . '-' . $image->getClientOriginalName();
                $image->move($destinationPath, $profileImage);
                $tanda_tangan = $profileImage;
            }else{
                $tanda_tangan = '';
            }

            $dataguru = array(
                'id_user' => $current->orderby('created_at', 'DESC')->first()->id,
                'nama' => $request->nama,
                'nip' => $request->nip,
                'jenis_kelamin' => $request->jenis_kelamin,
                'tempat_lahir' => $request->tempat_lahir,
                'tanggal_lahir' => $request->tanggal_lahir,
                'alamat' => $request->alamat,
                'no_telpon' => $request->no_telpon,
                'email' => $request->email,
                'id_sekolah' => $id_sekolah,
                'foto' => $foto,
                'password_default' => $password_default,
                'tanda_tangan' => $tanda_tangan,
                'user_id' => $user_id,
                'role_id' => $role_id,
                'created_at' => date('Y-m-d H:i:s'),
            );
            $simpan = Guru::create($dataguru);
        }

        if ($simpan) {
            return redirect()->route('guru.index')->with('message', 'Data Guru berhasil disimpan!');
        } else {
            return redirect()->route('guru.index')->with('error', 'Data Guru gagal disimpan!');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Guru $guru)
    {
        // return view('master.guru.show', ['guru' => $guru]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Guru $guru)
    {
        // $user = User::find($guru->id_user);
        // $user->assignRole("guru");

        // return view('master.guru.edit',compact('guru'));
        return Inertia::render('Master/Guru/Edit', ['guru' => $guru]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {

        // echo $request->hasFile('foto');
        // exit;
        $rules = [
            'jenis_kelamin' => ['required'],
            'email' => ['required', 'unique:users,email,'.$request->id_user],
            'nama' => ['required', 'string', 'max:250'],
            'foto' => ['nullable', 'image', 'max:1024', 'mimes:jpg,jpeg,png,gif'],
            'tanda_tangan' => ['nullable', 'image', 'max:1024', 'mimes:jpg,jpeg,png,gif'],
        ];

        $messages = [
            'jenis_kelamin.required' => 'Jenis Kelamin harus diisi.',
            'email.required' => 'Email harus diisi.',
            'email.email' => 'Email tidak valid.',
            'email.unique' => 'Email sudah digunakan.',
            'nama.required' => 'Nama Guru harus diisi.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.max' => 'Ukuran file maksimum 1MB.',
            'foto.mimes' => 'File harus format: jpg, jpeg, png, gif.',
            'tanda_tangan.image' => 'File harus berupa gambar.',
            'tanda_tangan.max' => 'Ukuran file maksimum 1MB.',
            'tanda_tangan.mimes' => 'File harus format: jpg, jpeg, png, gif.',
        ];

        $request->validate($rules, $messages);

        $user_id = Session::get('user_id');
        $role_id = Session::get('role_id');

        if (($request->hasFile('foto')) || ($request->hasFile('tanda_tangan'))) {
            if ($request->hasFile('foto')) {
                /*if($request->password){
                    $request->validate([
                        'nama' => 'required|string|max:250',
                        'email' => 'required|unique:users,email,'.$request->id_user,
                        // 'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                        // 'password_confirmation' => 'min:8',
                        'jenis_kelamin' => 'required',
                        'foto' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
                    ]);
                }else{
                    $request->validate([
                        'nama' => 'required|string|max:250',
                        'email' => 'required|unique:users,email,'.$request->id_user,
                        // 'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                        // 'password_confirmation' => 'min:8',
                        // 'nip' => 'required|integer|min:8|max:8',
                        // 'nip' => 'required|integer',
                        'jenis_kelamin' => 'required',
                        'foto' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
                    ]);
                }*/

                if ((file_exists('images/guru/'.$request->foto_lama)) && ($request->foto_lama)) {
                    unlink('images/guru/'.$request->foto_lama);
                }
                $image = $request->file('foto');
                $destinationPath = 'images/guru/';
                // $profileImage = date('YmdHis') . "." . $image->getClientOriginalExtension();
                $profileImage = date('YmdHis') . '-' . $image->getClientOriginalName();
                $image->move($destinationPath, $profileImage);
                $foto = $profileImage;
            }else{
                $foto = $request->foto_lama;
            }
            
            if ($request->hasFile('tanda_tangan')) {
                /*if($request->password){
                    $request->validate([
                        'nama' => 'required|string|max:250',
                        'email' => 'required|unique:users,email,'.$request->id_user,
                        // 'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                        // 'password_confirmation' => 'min:8',
                        'jenis_kelamin' => 'required',
                        'tanda_tangan' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
                    ]);
                }else{
                    $request->validate([
                        'nama' => 'required|string|max:250',
                        'email' => 'required|unique:users,email,'.$request->id_user,
                        // 'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                        // 'password_confirmation' => 'min:8',
                        // 'nip' => 'required|integer|min:8|max:8',
                        // 'nip' => 'required|integer',
                        'jenis_kelamin' => 'required',
                        'tanda_tangan' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
                    ]);
                }*/
                
                if ((file_exists('images/guru/'.$request->tanda_tangan_lama)) && ($request->tanda_tangan_lama)) {
                    unlink('images/guru/'.$request->tanda_tangan_lama);
                }
                $image = $request->file('tanda_tangan');
                $destinationPath = 'images/guru/';
                // $profileImage = date('YmdHis') . "." . $image->getClientOriginalExtension();
                $profileImage = date('YmdHis') . '-' . $image->getClientOriginalName();
                $image->move($destinationPath, $profileImage);
                $tanda_tangan = $profileImage;
            }else{
                $tanda_tangan = $request->tanda_tangan_lama;
            }
        }else{
            /*if($request->password){
                $request->validate([
                    'nama' => 'required|string|max:250',
                    'email' => 'required|unique:users,email,'.$request->id_user,
                    // 'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                    // 'password_confirmation' => 'min:8',
                    'jenis_kelamin' => 'required',
                ]);
            }else{
                $request->validate([
                    'nama' => 'required|string|max:250',
                    'email' => 'required|unique:users,email,'.$request->id_user,
                    // 'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                    // 'password_confirmation' => 'min:8',
                    // 'nip' => 'required|integer|min:8|max:8',
                    // 'nip' => 'required|integer',
                    'jenis_kelamin' => 'required',
                ]);
            }*/
            $foto = $request->foto_lama;
            $tanda_tangan = $request->tanda_tangan_lama;
        }

        $dataguru = array(
            'nama' => $request->nama,
            'nip' => $request->nip,
            'jenis_kelamin' => $request->jenis_kelamin,
            'tempat_lahir' => $request->tempat_lahir,
            'tanggal_lahir' => $request->tanggal_lahir,
            'alamat' => $request->alamat,
            'no_telpon' => $request->no_telpon,
            // 'email' => $request->email,
            'foto' => $foto,
            'tanda_tangan' => $tanda_tangan,
            // 'user_id' => $user_id,
            // 'role_id' => $role_id,
            'updated_at' => date('Y-m-d H:i:s'),
        );
        // $simpan = $guru->update($dataguru);
        $simpan = Guru::where('id', $id)->update($dataguru);

        if($request->password){
            DB::table('users')->where('email', '=', $request->email)
            ->update(array('password' => Hash::make($request->password), 'name' => $request->nama));
        }else{
            DB::table('users')->where('email', '=', $request->email)
            ->update(array('name' => $request->nama));
        }

        if ($simpan) {
            return redirect()->route('guru.index')->with('message', 'Data Guru berhasil disimpan!');
        } else {
            return redirect()->route('guru.index')->with('error', 'Data Guru gagal disimpan!');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Guru $guru)
    {
        $hapus = $guru->delete();

        // $dataguru = array(
        //     'deleted_at' => date('Y-m-d H:i:s'),
        // );
        // $hapus = Guru::where('id', $guru->id)->update($dataguru);
        if ($hapus) {
            if ((file_exists('images/guru/'.$guru->foto)) && ($guru->foto)) {
                unlink('images/guru/'.$guru->foto);
            }
            if ((file_exists('images/guru/'.$guru->tanda_tangan)) && ($guru->tanda_tangan)) {
                unlink('images/guru/'.$guru->tanda_tangan);
            }
            $dataguru = array(
                'foto' => NULL,
                'tanda_tangan' => NULL,
            );
            $guru->update($dataguru);

            //softdelete data akun guru
            DB::table('users')->where('id', '=', $guru->id_user)->update(array('deleted' => 1));
            $user = User::find($guru->id_user);
            $user->delete();

            //kosongkan kelompok yang diampu
            DB::table('kelompok')
            ->where('id_sekolah','=',Session::get('id_sekolah'))
            ->where('id_guru','=',$guru->id)
            ->update(array(
                'id_guru' => null
            ));

            //hapus kelompok guru
            DB::table('kelompok_guru')
            ->where('id_guru','=',$guru->id)
            ->delete();
        }

        // return redirect()->route('guru.index')->with('message', 'Data Guru berhasil dihapus!');
        return redirect()->back();
    }

    public function profil_guru()
    {
        $guru = Guru::join('users','users.id','=','guru.id_user')->where('users.id', '=', Auth::user()->id)->first();
        return Inertia::render('Master/Guru/Profil_Guru', 
        [
            'guru' => $guru,
        ]);
    }

    public function profil_guru_update(Request $request)
    {
        $rules = [
            'jenis_kelamin' => ['required'],
            'email' => ['required', 'unique:users,email,'.$request->id_user],
            'nama' => ['required', 'string', 'max:250'],
            'password' => ['nullable', 'min:8', 'confirmed'],
            'password_confirmation' => ['nullable', 'min:8'],
            'foto' => ['nullable', 'image', 'max:1024', 'mimes:jpg,jpeg,png,gif'],
            'tanda_tangan' => ['nullable', 'image', 'max:1024', 'mimes:jpg,jpeg,png,gif'],
        ];

        $messages = [
            'jenis_kelamin.required' => 'Jenis Kelamin harus diisi.',
            'email.required' => 'Email harus diisi.',
            'email.email' => 'Email tidak valid.',
            'email.unique' => 'Email sudah digunakan.',
            'nama.required' => 'Nama Guru harus diisi.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.max' => 'Ukuran file maksimum 1MB.',
            'foto.mimes' => 'File harus format: jpg, jpeg, png, gif.',
            'tanda_tangan.image' => 'File harus berupa gambar.',
            'tanda_tangan.max' => 'Ukuran file maksimum 1MB.',
            'tanda_tangan.mimes' => 'File harus format: jpg, jpeg, png, gif.',
            'password.min' => 'Kata Sandi minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi Kata Sandi tidak sama.',
            'password_confirmation.min' => 'Konfirmasi Kata Sandi minimal 8 karakter.',
        ];

        $request->validate($rules, $messages);

        if (($request->hasFile('foto')) || ($request->hasFile('tanda_tangan'))) {
            if ($request->hasFile('foto')) {
                /*if($request->password){
                    $request->validate([
                        'nama' => 'required|string|max:250',
                        'email' => 'required|unique:users,email,'.$request->id_user,
                        'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                        'password_confirmation' => 'min:8',
                        'jenis_kelamin' => 'required',
                        'foto' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
                    ]);
                }else{
                    $request->validate([
                        'nama' => 'required|string|max:250',
                        'email' => 'required|unique:users,email,'.$request->id_user,
                        // 'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                        // 'password_confirmation' => 'min:8',
                        // 'nip' => 'required|integer|min:8|max:8',
                        // 'nip' => 'required|integer',
                        'jenis_kelamin' => 'required',
                        'foto' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
                    ]);
                }*/

                if ((file_exists('images/guru/'.$request->foto_lama)) && ($request->foto_lama)) {
                    unlink('images/guru/'.$request->foto_lama);
                }
                $image = $request->file('foto');
                $destinationPath = 'images/guru/';
                // $profileImage = date('YmdHis') . "." . $image->getClientOriginalExtension();
                $profileImage = date('YmdHis') . '-' . $image->getClientOriginalName();
                $image->move($destinationPath, $profileImage);
                $foto = $profileImage;
            }else{
                $foto = $request->foto_lama;
            }
            
            if ($request->hasFile('tanda_tangan')) {
                /*if($request->password){
                    $request->validate([
                        'nama' => 'required|string|max:250',
                        'email' => 'required|unique:users,email,'.$request->id_user,
                        'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                        'password_confirmation' => 'min:8',
                        'jenis_kelamin' => 'required',
                        'tanda_tangan' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
                    ]);
                }else{
                    $request->validate([
                        'nama' => 'required|string|max:250',
                        'email' => 'required|unique:users,email,'.$request->id_user,
                        // 'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                        // 'password_confirmation' => 'min:8',
                        // 'nip' => 'required|integer|min:8|max:8',
                        // 'nip' => 'required|integer',
                        'jenis_kelamin' => 'required',
                        'tanda_tangan' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
                    ]);
                }*/
                
                if ((file_exists('images/guru/'.$request->tanda_tangan_lama)) && ($request->tanda_tangan_lama)) {
                    unlink('images/guru/'.$request->tanda_tangan_lama);
                }
                $image = $request->file('tanda_tangan');
                $destinationPath = 'images/guru/';
                // $profileImage = date('YmdHis') . "." . $image->getClientOriginalExtension();
                $profileImage = date('YmdHis') . '-' . $image->getClientOriginalName();
                $image->move($destinationPath, $profileImage);
                $tanda_tangan = $profileImage;
            }else{
                $tanda_tangan = $request->tanda_tangan_lama;
            }
        }else{
            /*if($request->password){
                $request->validate([
                    'nama' => 'required|string|max:250',
                    'email' => 'required|unique:users,email,'.$request->id_user,
                    'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                    'password_confirmation' => 'min:8',
                    'jenis_kelamin' => 'required',
                ]);
            }else{
                $request->validate([
                    'nama' => 'required|string|max:250',
                    'email' => 'required|unique:users,email,'.$request->id_user,
                    // 'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                    // 'password_confirmation' => 'min:8',
                    // 'nip' => 'required|integer|min:8|max:8',
                    // 'nip' => 'required|integer',
                    'jenis_kelamin' => 'required',
                ]);
            }*/
            $foto = $request->foto_lama;
            $tanda_tangan = $request->tanda_tangan_lama;
        }

        $dataguru = array(
            'nama' => $request->nama,
            'nip' => $request->nip,
            'jenis_kelamin' => $request->jenis_kelamin,
            'tempat_lahir' => $request->tempat_lahir,
            'tanggal_lahir' => $request->tanggal_lahir,
            'alamat' => $request->alamat,
            'no_telpon' => $request->no_telpon,
            // 'email' => $request->email,
            'foto' => $foto,
            'tanda_tangan' => $tanda_tangan,
            // 'user_id' => $user_id,
            // 'role_id' => $role_id,
            'updated_at' => date('Y-m-d H:i:s'),
        );
        // $simpan = $guru->update($dataguru);
        $simpan = Guru::join('users','users.id','=','guru.id_user')->where('users.id', '=', Auth::user()->id)->update($dataguru);

        if($request->password){
            DB::table('users')->where('email', '=', $request->email)
            ->update(array('password' => Hash::make($request->password), 'name' => $request->nama));
        }else{
            DB::table('users')->where('email', '=', $request->email)
            ->update(array('name' => $request->nama));
        }

        if ($simpan) {
            return redirect()->route('dashboard')->with('message', 'Data Guru berhasil disimpan!');
        } else {
            return redirect()->route('dashboard')->with('error', 'Data Guru gagal disimpan!');
        }
    }

    function generateRandomString($length = 6) {
        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[random_int(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    public function status_guru($id_user, $status)
    {
        $stat = $status == 1 ? 0 : 1;
        $upd = DB::table('users')
            ->where('id', '=', $id_user)
            ->update(array('status' => $stat));

        $stat_message = $stat == 1 ? "diaktifkan" : "dinonaktifkan";

        // return redirect()->route('guru.index')->with('message', 'Data Guru berhasil '.$stat_message.'!');
        return redirect()->back();
    }
}
