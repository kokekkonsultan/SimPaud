<?php

namespace App\Http\Controllers;

use App\Models\Sekolah;
use App\Models\User;
use App\Models\Guru;
use App\Models\KepalaSekolah;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Mail;
use App\Mail\EmailVerifikasi;
use Session;

class SekolahController extends Controller
{
    function __construct()
    {
        $this->middleware('permission:sekolah-list|sekolah-create|sekolah-edit|sekolah-delete', ['only' => ['index','show']]);
        $this->middleware('permission:sekolah-create', ['only' => ['create','store']]);
        $this->middleware('permission:sekolah-edit', ['only' => ['edit','update']]);
        $this->middleware('permission:sekolah-delete', ['only' => ['destroy']]);
        $this->middleware('permission:sekolah-status', ['only' => ['status_sekolah']]);
        $this->middleware('permission:sekolah-verval', ['only' => ['verifikasi_validasi','verifikasi_sekolah']]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // $provinsi = DB::table("wilayah")
        //             ->select("nama","kode_wilayah")
        //             ->where("parent_kode_wilayah","000000")
        //             ->get();

        // $sekolah = Sekolah::leftjoin('users', 'users.id', '=', 'sekolah.id_user')
        // ->leftjoin('wilayah AS prov' , 'prov.kode_wilayah', '=' , DB::raw("CONCAT(LEFT(sekolah.kode_wilayah,2),'0000')"))
        // ->leftjoin('wilayah AS kotakab' , 'kotakab.kode_wilayah', '=' , DB::raw("CONCAT(LEFT(sekolah.kode_wilayah,4),'00')"))
        // ->leftjoin('wilayah AS kec' , 'kec.kode_wilayah', '=' ,'sekolah.kode_wilayah')
		// ->select('users.status as status', 'prov.nama AS provinsi', 'kotakab.nama AS kotakab', 'kec.nama AS kecamatan', 'sekolah.*')
        // ->paginate(10);

        $id_semester = DB::table('semester')
            ->where('periode_aktif', '=', 1)
            ->first()->id;

        $sekolah = Sekolah::query()
            ->select('sekolah.*', 'users.status', 'users.verified', 'users.id AS id_user', 'prov.nama AS provinsi','kotakab.nama AS kotakab','kec.nama AS kecamatan')
            ->join('users', function ($join) {
                $join->on('users.id', '=', 'sekolah.id_user');
                $join->on('users.confirmed', '=', DB::raw('1'));
                $join->on('users.confirmed_at', 'IS NOT', DB::raw('null'));
                $join->on('users.verified', '=', DB::raw('1'));
                $join->on('users.verified_at', 'IS NOT', DB::raw('null'));
                $join->on('users.deleted', '=', DB::raw('0'));
                $join->on('users.deleted_at', 'IS', DB::raw('null'));
            })
            ->leftjoin('kepala_sekolah AS mks', function ($join) use ($id_semester) {
                $join->on('mks.id_sekolah', '=', 'sekolah.id');
                $join->on('mks.id_semester', '=', DB::raw($id_semester));
            })
            ->leftjoin('wilayah AS prov','prov.kode_wilayah','=',DB::raw("CONCAT(LEFT(sekolah.kode_wilayah,2),'0000')"))
            ->leftjoin('wilayah AS kotakab','kotakab.kode_wilayah','=',DB::raw("CONCAT(LEFT(sekolah.kode_wilayah,4),'00')"))
            ->leftjoin('wilayah AS kec','kec.kode_wilayah','=','sekolah.kode_wilayah');

            // ->leftjoin('last_login_sekolah AS log','log.id_sekolah','=','sekolah.id');

        if ($request->has('search') and strlen($request->search) > 0) {
            $sekolah = $sekolah->where(function ($q) use ($request) {
                $q->where('sekolah.nama', 'LIKE', "%" . $request->search . "%")
                    ->orWhere('sekolah.npsn', 'LIKE', "%" . $request->search . "%")
                    ->orWhere('sekolah.no_telpon', 'LIKE', "%" . $request->search . "%")
                    ->orWhere('sekolah.email', 'LIKE', "%" . $request->search . "%");
            });
        }

        if($request->has('kode_provinsi')){
            $sekolah = $sekolah->where('sekolah.kode_wilayah','LIKE',"".substr($request->kode_provinsi, 0, 2)."%");
        }

        if($request->has('kode_kota')){
            $sekolah = $sekolah->where('sekolah.kode_wilayah','LIKE',"".substr($request->kode_kota, 0, 4)."%");
        }

        if($request->has('kode_wilayah')){
            $sekolah = $sekolah->where('sekolah.kode_wilayah','LIKE',$request->kode_wilayah);
        }

        $sekolah = $sekolah
        // ->orderby('log.last_login', 'DESC')
        // ->orderby('verified_at', 'DESC')
        ->paginate(10);

        foreach ($sekolah as $row) {
            // $row->link_pendaftaran = env('APP_URL').'/registrasi/siswa/'.base64_encode($row->id);
        }
        
        // return view('master.sekolah.index',compact('sekolah'));
        return Inertia::render('Master/Sekolah/Index', [
            'sekolah' => $sekolah,
            'id_provinsi' => substr($request->kode_wilayah,0,2).'0000',
            'id_kota' => substr($request->kode_wilayah,0,4).'00',
            'id_kode_wilayah' => $request->kode_wilayah,
            // 'searching' => $request->only(['search']),
            'filtering' => request()->query() ?: null
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // $provinsi = DB::table("wilayah")
        //             ->select("nama","kode_wilayah")
        //             ->where("parent_kode_wilayah","000000")
        //             ->get();
        // return view('master.sekolah.create');
        return Inertia::render('Master/Sekolah/Create', 
        [
            // 'provinsi' => $provinsi
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        // $request->validate([
        //     'nama' => 'required|string|max:250',
        //     'email' => 'required|unique:users,email',
        //     'password' => 'required|min:8|required_with:password_confirmation|same:password_confirmation',
        //     'password_confirmation' => 'required|min:8',
        //     // 'npsn' => 'required|integer|min:8|max:8',
        //     // 'npsn' => 'required|integer',
        //     // 'foto' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
        // ]);

        $rules = [
            'email' => ['required', 'unique:users,email'],
            // 'password' => ['required', 'min:8', 'confirmed', 'required_with:password_confirmation', 'same:password_confirmation'],
            'password' => ['required', 'min:8', 'confirmed'],
            'password_confirmation' => ['required', 'min:8'],
            'nama' => ['required', 'string', 'max:250'],
            'status_sekolah' => ['required'],
            // 'provinsi' => ['required'],
            // 'kota' => ['required'],
            'kode_wilayah' => ['required'],
            'alamat' => ['required'],
            'no_telpon' => ['required'],
            'sk_pendirian_sekolah' => ['required'],
            'foto' => ['nullable', 'image', 'max:1024', 'mimes:jpg,jpeg,png,gif'],
        ];

        $messages = [
            'email.required' => 'Email harus diisi.',
            'email.email' => 'Email tidak valid.',
            'email.unique' => 'Email sudah digunakan.',
            'password.required' => 'Kata Sandi harus diisi.',
            'password.min' => 'Kata Sandi minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi Kata Sandi tidak sama.',
            'password_confirmation.required' => 'Konfirmasi Kata Sandi harus diisi.',
            'password_confirmation.min' => 'Konfirmasi Kata Sandi minimal 8 karakter.',
            'nama.required' => 'Nama Sekolah harus diisi.',
            'status_sekolah.required' => 'Status Sekolah harus diisi.',
            // 'provinsi.required' => 'Provinsi harus diisi.',
            // 'kota.required' => 'Kota harus diisi.',
            'kode_wilayah.required' => 'Kecamatan harus diisi.',
            'alamat.required' => 'Alamat harus diisi.',
            'no_telpon.required' => 'Nomor Telepon harus diisi.',
            'sk_pendirian_sekolah.required' => 'SK Pendirian Sekolah harus diisi.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.max' => 'Ukuran file maksimum 1MB.',
            'foto.mimes' => 'File harus format: jpg, jpeg, png, gif.',
        ];

        $request->validate($rules, $messages);

        $add = User::create([
            'name' => $request->nama,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'status' => 1,
            'confirmed' => 1,
            'confirmed_at' => date('Y-m-d H:i:s'),
            'verified' => 1,
            'verified_at' => date('Y-m-d H:i:s'),
            'verifier' => $request->user()->id,
            'role_id' => 3,
        ]);

        if ($add) {
            $current = User::where('email', '=', $request->email);
            $user = User::find($current->orderby('created_at', 'DESC')->first()->id);
            $user->assignRole("admin.sekolah");

            // $kode_registrasi = 0;
            if ($request->hasFile('foto')) {
                $image = $request->file('foto');
                $destinationPath = 'images/sekolah/';
                // $profileImage = date('YmdHis') . "." . $image->getClientOriginalExtension();
                $profileImage = date('YmdHis') . '-' . $image->getClientOriginalName();
                $image->move($destinationPath, $profileImage);
                $foto = $profileImage;
            }else{
                $foto = '';
            }
            $kode_registrasi = ($request->kode_registrasi) ? $request->kode_registrasi : rand(1000000000, mt_getrandmax());
            
            $datasekolah = array(
                'slug' => ($request->npsn) ? $request->npsn : $kode_registrasi,
                'id_user' => $current->orderby('created_at', 'DESC')->first()->id,
                'nama' => $request->nama,
                'status_sekolah' => $request->status_sekolah,
                'npsn' => $request->npsn,
                'alamat' => $request->alamat,
                'kode_wilayah' => $request->kode_wilayah,
                'no_telpon' => $request->no_telpon,
                'fax' => $request->fax,
                'email' => $request->email,
                'website' => $request->website,
                'sk_pendirian_sekolah' => $request->sk_pendirian_sekolah,
                'kode_registrasi' => $kode_registrasi,
                'foto' => $foto,
                'created_at' => date('Y-m-d H:i:s'),
            );
            $simpan = Sekolah::create($datasekolah);

            $add_kepala_sekolah = User::create([
                'name' => $request->kepala_sekolah,
                'email' => $kode_registrasi.'@email.com',
                'password' => Hash::make($request->password),
                'status' => 1,
                'confirmed' => 1,
                'confirmed_at' => date('Y-m-d H:i:s'),
                'verified' => 1,
                'verified_at' => date('Y-m-d H:i:s'),
                'verifier' => $request->user()->id,
                'role_id' => 6,
            ]);
            $current_kepala_sekolah = User::where('email', '=', $kode_registrasi.'@email.com');

            DB::table('kepala_sekolah')
            ->where('id_sekolah', '=', Sekolah::orderby('created_at', 'DESC')->first()->id)
            ->where('id_semester', '=', Session::get('id_semester'))
            ->insert(array(
                'id_user' => $current_kepala_sekolah->orderby('created_at', 'DESC')->first()->id,
                'nama' => $request->kepala_sekolah, 
                'id_sekolah' => Sekolah::orderby('created_at', 'DESC')->first()->id, 
                'id_semester' => Session::get('id_semester'),
                'role_id' => Session::get('role_id'),
                'user_id' => Session::get('user_id'),
                'created_at' => date('Y-m-d H:i:s'),
            ));
        }

        if ($simpan) {
            return redirect()->route('sekolah.index')->with('message', 'Data Sekolah berhasil disimpan!');
        } else {
            return redirect()->route('sekolah.index')->with('error', 'Data Sekolah gagal disimpan!');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Sekolah $sekolah)
    {
        // return view('master.sekolah.show', ['sekolah' => $sekolah]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        

        $sekolah = Sekolah::select('sekolah.*', 'users.id AS id_user', 'ks.nama as kepala_sekolah', DB::raw("CASE WHEN kode_wilayah != '' THEN CONCAT(LEFT(kode_wilayah,2),'0000') ELSE null END AS provinsi"), DB::raw("CASE WHEN kode_wilayah != '' THEN CONCAT(LEFT(kode_wilayah,4),'00') ELSE null END AS kotakab"), DB::raw("CASE WHEN kode_wilayah != '' THEN kode_wilayah ELSE null END AS kode_wilayah"))
        ->join('users', function ($join) {
            $join->on('users.id', '=', 'sekolah.id_user');
        })
        ->leftjoin('kepala_sekolah AS ks', function($join){
            $join->on('ks.id_sekolah', '=', 'sekolah.id');
            $join->on('ks.id_semester', '=', DB::raw(Session::get('id_semester')));
        })
        ->findOrFail($id);
        // $provinsi = DB::table("wilayah")
        //             ->select("nama","kode_wilayah")
        //             ->where("parent_kode_wilayah","000000")
        //             ->get();

        // echo $sekolah->id_user;
        // exit;
        // $user = User::find($sekolah->id_user);
        // $user->assignRole("admin.sekolah");

        // return view('master.sekolah.edit',compact('sekolah'));
        return Inertia::render('Master/Sekolah/Edit', 
        [
            'sekolah' => $sekolah,
            // 'provinsi' => $provinsi
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
            'status_sekolah' => ['required'],
            // 'provinsi' => ['required'],
            // 'kota' => ['required'],
            'kode_wilayah' => ['required'],
            'alamat' => ['required'],
            'no_telpon' => ['required'],
            'sk_pendirian_sekolah' => ['required'],
            'foto' => ['nullable', 'image', 'max:1024', 'mimes:jpg,jpeg,png,gif'],
        ];

        $messages = [
            'email.required' => 'Email harus diisi.',
            'email.email' => 'Email tidak valid.',
            'email.unique' => 'Email sudah digunakan.',
            'password.min' => 'Kata Sandi minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi Kata Sandi tidak sama.',
            'password_confirmation.min' => 'Konfirmasi Kata Sandi minimal 8 karakter.',
            'nama.required' => 'Nama Sekolah harus diisi.',
            'status_sekolah.required' => 'Status Sekolah harus diisi.',
            // 'provinsi.required' => 'Provinsi harus diisi.',
            // 'kota.required' => 'Kota harus diisi.',
            'kode_wilayah.required' => 'Kecamatan harus diisi.',
            'alamat.required' => 'Alamat harus diisi.',
            'no_telpon.required' => 'Nomor Telepon harus diisi.',
            'sk_pendirian_sekolah.required' => 'SK Pendirian Sekolah harus diisi.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.max' => 'Ukuran file maksimum 1MB.',
            'foto.mimes' => 'File harus format: jpg, jpeg, png, gif.',
        ];

        $request->validate($rules, $messages);

        if ($request->hasFile('foto')) {
            /*if($request->password){
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
            }*/

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
                    // 'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                    // 'password_confirmation' => 'min:8',
                    // 'npsn' => 'required|integer|min:8|max:8',
                    // 'npsn' => 'required|integer',
                    // 'foto' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
                ]);
            }*/
            $foto = $request->foto_lama;
        }
        $kode_registrasi = ($request->kode_registrasi) ? $request->kode_registrasi : rand(1000000000, mt_getrandmax());

        $datasekolah = array(
            'slug' => ($request->npsn) ? $request->npsn : $kode_registrasi,
            'nama' => $request->nama,
            'status_sekolah' => $request->status_sekolah,
            'npsn' => $request->npsn,
            'alamat' => $request->alamat,
            'kode_wilayah' => $request->kode_wilayah,
            'no_telpon' => $request->no_telpon,
            'fax' => $request->fax,
            // 'email' => $request->email,
            'website' => $request->website,
            'sk_pendirian_sekolah' => $request->sk_pendirian_sekolah,
            'kode_registrasi' => $kode_registrasi,
            'foto' => $foto,
            'updated_at' => date('Y-m-d H:i:s'),
        );
        // $simpan = $sekolah->update($datasekolah);
        $simpan = Sekolah::where('id', $id)->update($datasekolah);

        if($request->password){
            DB::table('users')->where('email', '=', $request->email)
            ->update(array('password' => Hash::make($request->password), 'name' => $request->nama));
        }else{
            DB::table('users')->where('email', '=', $request->email)
            ->update(array('name' => $request->nama));
        }

        $cek = DB::table('kepala_sekolah')
            ->where('id_sekolah', '=', $id)
            ->where('id_semester', '=', Session::get('id_semester'))
            ->first();
        if ($cek) {
            DB::table('kepala_sekolah')
                ->where('id_sekolah', '=', $id)
                ->where('id_semester', '=', Session::get('id_semester'))
                ->update(array('nama' => $request->kepala_sekolah));

            DB::table('users')->where('id', '=', $cek->id_user)
            ->update(array('name' => $request->kepala_sekolah));
        } else {
            $add_kepala_sekolah = User::create([
                'name' => $request->kepala_sekolah,
                'email' => $kode_registrasi.'@email.com',
                'password' => Hash::make($request->password),
                'status' => 1,
                'confirmed' => 1,
                'confirmed_at' => date('Y-m-d H:i:s'),
                'verified' => 1,
                'verified_at' => date('Y-m-d H:i:s'),
                'verifier' => $request->user()->id,
                'role_id' => 6,
            ]);
            $current_kepala_sekolah = User::where('email', '=', $kode_registrasi.'@email.com');
            
            DB::table('kepala_sekolah')
                ->where('id_sekolah', '=', $id)
                ->where('id_semester', '=', Session::get('id_semester'))
                ->insert(array(
                    'id_user' => $current_kepala_sekolah->orderby('created_at', 'DESC')->first()->id,
                    'nama' => $request->kepala_sekolah, 
                    'id_sekolah' => $id, 
                    'id_semester' => Session::get('id_semester'),
                    'role_id' => Session::get('role_id'),
                    'user_id' => Session::get('user_id'),
                    'created_at' => date('Y-m-d H:i:s'),
                ));

            $user = User::find($current_kepala_sekolah->orderby('created_at', 'DESC')->first()->id);
            $user->assignRole("kepala.sekolah");
        }

        if ($simpan) {
            return redirect()->route('sekolah.index')->with('message', 'Data Sekolah berhasil disimpan!');
        } else {
            return redirect()->route('sekolah.index')->with('error', 'Data Sekolah gagal disimpan!');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sekolah $sekolah)
    {
        
        $hapus = $sekolah->delete();
        // $datasekolah = array(
        //     'deleted_at' => date('Y-m-d H:i:s'),
        // );
        // $hapus = Sekolah::where('id', $sekolah->id)->update($datasekolah);
        if ($hapus) {
            if ((file_exists('images/sekolah/'.$sekolah->foto)) && ($sekolah->foto)) {
                unlink('images/sekolah/'.$sekolah->foto);
            }
            $datasekolah = array(
                'foto' => NULL,
            );
            $sekolah->update($datasekolah);

            //softdelete data akun sekolah
            DB::table('users')->where('id', '=', $sekolah->id_user)->update(array('deleted' => 1)); //, 'deleted_at' => date('Y:m:d H:i:s')
            $user = User::find($sekolah->id_user);
            $user->delete();

            $dataguru = DB::table('guru')->where('id_sekolah', '=', $sekolah->id)->get();
            foreach ($dataguru as $row) {
                // DB::table('guru')->where('id', '=', $row->id)->update(array('deleted_at' => date('Y:m:d H:i:s')));
                $guru = Guru::find($row->id);
                $guru->delete();

                DB::table('users')->where('id', '=', $row->id_user)->update(array('deleted' => 1)); //, 'deleted_at' => date('Y:m:d H:i:s')
                $user = User::find($row->id_user);
                $user->delete();
            }

            $datakepala = DB::table('kepala_sekolah')->where('id_sekolah', '=', $sekolah->id)->get();
            foreach ($datakepala as $row) {
                $kepala = KepalaSekolah::find($row->id);
                $kepala->delete();

                DB::table('users')->where('id', '=', $row->id_user)->update(array('deleted' => 1)); //, 'deleted_at' => date('Y:m:d H:i:s')
                $user = User::find($row->id_user);
                $user->delete();
            }

        }

        // return redirect()->route('sekolah.index')->with('message', 'Data Sekolah berhasil dihapus!');
        return redirect()->back();
    }

    public function profil_sekolah()
    {
        $sekolah = Sekolah::select('sekolah.*', 'ks.nama as kepala_sekolah', DB::raw("CASE WHEN kode_wilayah != '' THEN CONCAT(LEFT(kode_wilayah,2),'0000') ELSE null END AS provinsi"), DB::raw("CASE WHEN kode_wilayah != '' THEN CONCAT(LEFT(kode_wilayah,4),'00') ELSE null END AS kotakab"), DB::raw("CASE WHEN kode_wilayah != '' THEN kode_wilayah ELSE null END AS kode_wilayah"))
        ->leftjoin('kepala_sekolah AS ks', function($join){
            $join->on('ks.id_sekolah', '=', 'sekolah.id');
            $join->on('ks.id_semester', '=', DB::raw(Session::get('id_semester')));
        })
        ->find(Session::get('id_sekolah'));
        // $provinsi = DB::table("wilayah")
        //             ->select("nama","kode_wilayah")
        //             ->where("parent_kode_wilayah","000000")
        //             ->get();
        return Inertia::render('Master/Sekolah/Profil_Sekolah', 
        [
            'sekolah' => $sekolah,
            // 'provinsi' => $provinsi
        ]);
    }

    public function profil_sekolah_update(Request $request)
    {
        $rules = [
            'email' => ['required', 'unique:users,email,'.$request->id_user],
            // 'password' => ['required', 'min:8', 'confirmed', 'required_with:password_confirmation', 'same:password_confirmation'],
            'password' => ['nullable', 'min:8', 'confirmed'],
            'password_confirmation' => ['nullable', 'min:8'],
            'nama' => ['required', 'string', 'max:250'],
            'status_sekolah' => ['required'],
            // 'provinsi' => ['required'],
            // 'kota' => ['required'],
            'kode_wilayah' => ['required'],
            'alamat' => ['required'],
            'no_telpon' => ['required'],
            'sk_pendirian_sekolah' => ['required'],
            'foto' => ['nullable', 'image', 'max:1024', 'mimes:jpg,jpeg,png,gif'],
        ];

        $messages = [
            'email.required' => 'Email harus diisi.',
            'email.email' => 'Email tidak valid.',
            'email.unique' => 'Email sudah digunakan.',
            'password.min' => 'Kata Sandi minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi Kata Sandi tidak sama.',
            'password_confirmation.min' => 'Konfirmasi Kata Sandi minimal 8 karakter.',
            'nama.required' => 'Nama Sekolah harus diisi.',
            'status_sekolah.required' => 'Status Sekolah harus diisi.',
            // 'provinsi.required' => 'Provinsi harus diisi.',
            // 'kota.required' => 'Kota harus diisi.',
            'kode_wilayah.required' => 'Kecamatan harus diisi.',
            'alamat.required' => 'Alamat harus diisi.',
            'no_telpon.required' => 'Nomor Telepon harus diisi.',
            'sk_pendirian_sekolah.required' => 'SK Pendirian Sekolah harus diisi.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.max' => 'Ukuran file maksimum 1MB.',
            'foto.mimes' => 'File harus format: jpg, jpeg, png, gif.',
        ];

        $request->validate($rules, $messages);

        if ($request->hasFile('foto')) {
            /*if($request->password){
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
            }*/

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
                    // 'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                    // 'password_confirmation' => 'min:8',
                    // 'npsn' => 'required|integer|min:8|max:8',
                    // 'npsn' => 'required|integer',
                    // 'foto' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
                ]);
            }*/
            $foto = $request->foto_lama;
        }
        $kode_registrasi = ($request->kode_registrasi) ? $request->kode_registrasi : rand(1000000000, mt_getrandmax());

        $datasekolah = array(
            'slug' => ($request->npsn) ? $request->npsn : $kode_registrasi,
            'nama' => $request->nama,
            'status_sekolah' => $request->status_sekolah,
            'npsn' => $request->npsn,
            'alamat' => $request->alamat,
            'kode_wilayah' => $request->kode_wilayah,
            'no_telpon' => $request->no_telpon,
            'fax' => $request->fax,
            // 'email' => $request->email,
            'website' => $request->website,
            'sk_pendirian_sekolah' => $request->sk_pendirian_sekolah,
            'kode_registrasi' => $kode_registrasi,
            'foto' => $foto,
            'updated_at' => date('Y-m-d H:i:s'),
        );
        // $simpan = $sekolah->update($datasekolah);
        $simpan = Sekolah::where('id', Session::get('id_sekolah'))->update($datasekolah);

        if($request->password){
            DB::table('users')->where('email', '=', $request->email)
            ->update(array('password' => Hash::make($request->password), 'name' => $request->nama));
        }else{
            DB::table('users')->where('email', '=', $request->email)
            ->update(array('name' => $request->nama));
        }

        $cek = DB::table('kepala_sekolah')
            ->where('id_sekolah', '=', Session::get('id_sekolah'))
            ->where('id_semester', '=', Session::get('id_semester'))
            ->first();
        if ($cek) {
            DB::table('kepala_sekolah')
                ->where('id_sekolah', '=', Session::get('id_sekolah'))
                ->where('id_semester', '=', Session::get('id_semester'))
                ->update(array('nama' => $request->kepala_sekolah));

            DB::table('users')->where('id', '=', $cek->id_user)
            ->update(array('name' => $request->kepala_sekolah));
        } else {
            $add_kepala_sekolah = User::create([
                'name' => $request->kepala_sekolah,
                'email' => $kode_registrasi.'@email.com',
                'password' => Hash::make($request->password),
                'status' => 1,
                'confirmed' => 1,
                'confirmed_at' => date('Y-m-d H:i:s'),
                'verified' => 1,
                'verified_at' => date('Y-m-d H:i:s'),
                'verifier' => $request->user()->id,
                'role_id' => 6,
            ]);
            $current_kepala_sekolah = User::where('email', '=', $kode_registrasi.'@email.com');
            
            DB::table('kepala_sekolah')
                ->where('id_sekolah', '=', Session::get('id_sekolah'))
                ->where('id_semester', '=', Session::get('id_semester'))
                ->insert(array(
                    'id_user' => $current_kepala_sekolah->orderby('created_at', 'DESC')->first()->id,
                    'nama' => $request->kepala_sekolah, 
                    'id_sekolah' => Session::get('id_sekolah'), 
                    'id_semester' => Session::get('id_semester'),
                    'role_id' => Session::get('role_id'),
                    'user_id' => Session::get('user_id'),
                    'created_at' => date('Y-m-d H:i:s'),
                ));
        }

        if ($simpan) {
            return redirect()->route('dashboard')->with('message', 'Data Sekolah berhasil disimpan!');
        } else {
            return redirect()->route('dashboard')->with('error', 'Data Sekolah gagal disimpan!');
        }
    }

    public function verifikasi_sekolah($id_user)
    {
        $upd = DB::table('users')
            ->where('id', '=', $id_user)
            ->update(array('status' => 1, 'verified' => 1, 'verified_at' => date('Y-m-d H:i:s'), 'verifier' => Session::get('user_id')));

        // kepala sekolah
        $id_sekolah = DB::table('sekolah')->where('id_user', '=', $id_user)->first()->id;
        $kepala = DB::table('kepala_sekolah')->where('id_sekolah', '=', $id_sekolah)->first();
        if($kepala){
            $upd_kepala = DB::table('users')
            ->where('id', '=', $kepala->id_user)
            ->update(array('status' => 1, 'verified' => 1, 'verified_at' => date('Y-m-d H:i:s'), 'confirmed' => 1, 'confirmed_at' => date('Y-m-d H:i:s'), 'verifier' => Session::get('user_id')));
        }

        $data = DB::table('users')
            ->where('id', '=', $id_user)
            ->first();

        if ($upd) {
            $user = User::find($id_user);
            $user->assignRole("admin.sekolah");

            $mailData = [
                'title' => 'Selamat, Akun SimPaud Anda Terverifikasi',
                'body' => 'Akun SimPaud anda telah diverifikasi oleh Admin, kini Anda sudah dapat menggunakan fitur-fitur SimPaud secara penuh, klik tombol di bawah ini untuk login.',
                'footer' => 'Email ini dikirim secara otomatis melalui sistem SimPaud.',
                'base_url' => env('APP_URL')
            ];
            Mail::to($data->email)->send(new EmailVerifikasi($mailData));

            $datatemplate = [
                ['template'=> 'erapor-bg01.jpg', 'id_sekolah' => $id_sekolah, 'status' => 1, 'user_id' => 0, 'role_id' => 0, 'created_at' => date('Y-m-d H:i:s')],
                ['template'=> 'erapor-bg02.jpg', 'id_sekolah' => $id_sekolah, 'status' => 0, 'user_id' => 0, 'role_id' => 0, 'created_at' => date('Y-m-d H:i:s')],
                ['template'=> 'erapor-bg03.jpg', 'id_sekolah' => $id_sekolah, 'status' => 0, 'user_id' => 0, 'role_id' => 0, 'created_at' => date('Y-m-d H:i:s')],
                ['template'=> 'erapor-bg04.jpg', 'id_sekolah' => $id_sekolah, 'status' => 0, 'user_id' => 0, 'role_id' => 0, 'created_at' => date('Y-m-d H:i:s')],
            ];
            DB::table('setting_sttb')->insert($datatemplate);
        }

        // return redirect()->route('verval-sekolah')->with('message', 'Data Sekolah berhasil diverifikasi!');
        return redirect()->back();
    }

    public function status_sekolah($id_user, $status)
    {
        $stat = $status == 1 ? 0 : 1;
        $upd = DB::table('users')
            ->where('id', '=', $id_user)
            ->update(array('status' => $stat));

        $stat_message = $stat == 1 ? "diaktifkan" : "dinonaktifkan";

        // return redirect()->route('sekolah.index')->with('message', 'Data Sekolah berhasil '.$stat_message.'!');
        return redirect()->back();
    }

    public function verifikasi_validasi(Request $request)
    {
        $id_semester = DB::table('semester')
            ->where('periode_aktif', '=', 1)
            ->first()->id;

        $sekolah = Sekolah::query()
            ->select('sekolah.*', DB::raw('DATE_FORMAT(users.created_at, "%d-%m-%Y %H:%i") as tanggal_registrasi'), 'users.status', 'users.verified', 'users.id AS id_user', 'prov.nama AS provinsi','kotakab.nama AS kotakab','kec.nama AS kecamatan')
            ->join('users', function ($join) {
                $join->on('users.id', '=', 'sekolah.id_user');
                $join->on('users.confirmed', '=', DB::raw('1'));
                $join->on('users.confirmed_at', 'IS NOT', DB::raw('null'));
                $join->on('users.verified', '=', DB::raw('0'));
                $join->on('users.verified_at', 'IS', DB::raw('null'));
                $join->on('users.deleted', '=', DB::raw('0'));
                $join->on('users.deleted_at', 'IS', DB::raw('null'));
            })
            ->leftjoin('kepala_sekolah AS mks', function ($join) use ($id_semester) {
                $join->on('mks.id_sekolah', '=', 'sekolah.id');
                $join->on('mks.id_semester', '=', DB::raw($id_semester));
            })
            ->leftjoin('wilayah AS prov','prov.kode_wilayah','=',DB::raw("CONCAT(LEFT(sekolah.kode_wilayah,2),'0000')"))
            ->leftjoin('wilayah AS kotakab','kotakab.kode_wilayah','=',DB::raw("CONCAT(LEFT(sekolah.kode_wilayah,4),'00')"))
            ->leftjoin('wilayah AS kec','kec.kode_wilayah','=','sekolah.kode_wilayah');

            // ->leftjoin('last_login_sekolah AS log','log.id_sekolah','=','sekolah.id');

        if ($request->has('search') and strlen($request->search) > 0) {
            $sekolah = $sekolah->where(function ($q) use ($request) {
                $q->where('sekolah.nama', 'LIKE', "%" . $request->search . "%")
                    ->orWhere('sekolah.npsn', 'LIKE', "%" . $request->search . "%")
                    ->orWhere('sekolah.no_telpon', 'LIKE', "%" . $request->search . "%")
                    ->orWhere('sekolah.email', 'LIKE', "%" . $request->search . "%");
            });
        }

        if($request->has('kode_provinsi')){
            $sekolah = $sekolah->where('sekolah.kode_wilayah','LIKE',"".substr($request->kode_provinsi, 0, 2)."%");
        }

        if($request->has('kode_kota')){
            $sekolah = $sekolah->where('sekolah.kode_wilayah','LIKE',"".substr($request->kode_kota, 0, 4)."%");
        }

        if($request->has('kode_wilayah')){
            $sekolah = $sekolah->where('sekolah.kode_wilayah','LIKE',$request->kode_wilayah);
        }

        $sekolah = $sekolah
        // ->orderby('log.last_login', 'DESC')
        // ->orderby('verified_at', 'DESC')
        ->paginate(10);

        foreach ($sekolah as $row) {
            // $row->link_pendaftaran = env('APP_URL').'/registrasi/siswa/'.base64_encode($row->id);
        }
        
        // return view('master.sekolah.verifikasi_validasi',compact('sekolah'));
        return Inertia::render('Master/Sekolah/Verifikasi_Validasi', [
            'sekolah' => $sekolah,
            'id_provinsi' => substr($request->kode_wilayah,0,2).'0000',
            'id_kota' => substr($request->kode_wilayah,0,4).'00',
            'id_kode_wilayah' => $request->kode_wilayah,
            // 'searching' => $request->only(['search']),
            'filtering' => request()->query() ?: null
        ]);
    }

    public function getSekolah($id)
    {
        $sekolah = DB::table("sekolah")
        ->select('sekolah.*', 'users.status', 'users.verified', 'users.id AS id_user', 'prov.nama AS provinsi','kotakab.nama AS kotakab','kec.nama AS kecamatan')
        ->join('users', function ($join) {
            $join->on('users.id', '=', 'sekolah.id_user');
        })
        ->leftjoin('wilayah AS prov','prov.kode_wilayah','=',DB::raw("CONCAT(LEFT(sekolah.kode_wilayah,2),'0000')"))
        ->leftjoin('wilayah AS kotakab','kotakab.kode_wilayah','=',DB::raw("CONCAT(LEFT(sekolah.kode_wilayah,4),'00')"))
        ->leftjoin('wilayah AS kec','kec.kode_wilayah','=','sekolah.kode_wilayah')
        ->where("sekolah.id",$id)->first();
        
        return response()->json($sekolah);
    }
    
}
