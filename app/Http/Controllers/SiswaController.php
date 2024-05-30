<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use App\Models\User;
use App\Models\TahunAjaran;
use App\Models\Agama;
use App\Models\JenisKeluar;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Mail;
use App\Mail\EmailVerifikasi;
use Auth;
use Session;

class SiswaController extends Controller
{
    function __construct()
    {
        $this->middleware('permission:siswa-list|siswa-create|siswa-edit|siswa-delete', ['only' => ['index','show']]);
        $this->middleware('permission:siswa-create', ['only' => ['create','store']]);
        $this->middleware('permission:siswa-edit', ['only' => ['edit','update']]);
        $this->middleware('permission:siswa-delete', ['only' => ['destroy']]);
        $this->middleware('permission:siswa-status', ['only' => ['status_siswa']]);
        $this->middleware('permission:siswa-verval', ['only' => ['verifikasi_validasi','verifikasi_siswa']]);
        $this->middleware('permission:siswa-keluar', ['only' => ['siswa_keluar','siswa_keluar_update']]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $tahun_ajaran = TahunAjaran::get();
        $jenis_keluar = JenisKeluar::get();

        // $siswa = Siswa::leftjoin('users', 'users.id', '=', 'siswa.id_user')
        // ->leftjoin('tahun_ajaran', 'tahun_ajaran.id', '=', 'siswa.id_tahun_ajaran')
        // ->leftjoin('agama', 'agama.id', '=', 'siswa.id_agama')
        // ->leftjoin('jenis_keluar', 'jenis_keluar.id', '=', 'siswa.id_jenis_keluar')
		// ->select('tahun_ajaran.nama as tahun_ajaran', 'agama.nama as agama', 'users.status as status', 'siswa.*', DB::raw('DATE_FORMAT(tanggal_lahir, "%d-%m-%Y") as tanggal_lahir'));
        // if($request->user()->id != 2){
        //     $id_sekolah = DB::table('sekolah')->where('id_user', '=', $request->user()->id)->first()->id;
        //     $siswa = $siswa->where('id_sekolah', '=', $id_sekolah);
        // }
        // $siswa = $siswa->orderby('id', 'desc')->paginate(10);

        if ($request->has('id_tahun_ajaran') && strlen($request->id_tahun_ajaran) > 0) {
            $id_tahun_ajaran = $request->id_tahun_ajaran;
        } else {
            $id_tahun_ajaran = Session::get('id_tahun_ajaran');
        }

        $siswa = Siswa::query()
            ->select('siswa.*', DB::raw('DATE_FORMAT(tanggal_lahir, "%d-%m-%Y") as tanggal_lahir'), 
            DB::raw("FLOOR(DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365) AS usia_tahun"), 
            DB::raw("FLOOR((DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365 - FLOOR(DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365))* 12) AS usia_bulan"),
            'mta.nama AS tahun_ajaran', 'agm.nama AS agama','jk.nama AS jenis_keluar', 'users.id AS id_user', 'users.status as status', 'users.verified')
            ->join('agama AS agm', 'agm.id', '=', 'siswa.id_agama')
            ->join('tahun_ajaran AS mta', 'mta.id', '=', 'siswa.id_tahun_ajaran')
            ->join('users', 'users.id', '=', 'siswa.id_user')
            ->leftjoin('jenis_keluar AS jk','jk.id','=','siswa.id_jenis_keluar')
            ->where('siswa.id_sekolah', '=', Session::get('id_sekolah'))
            ->where('users.verified', '=', 1)
            ->whereNotNull('users.verified_at')
            ->whereNull('siswa.deleted_at');

        if ($request->has('id_tahun_ajaran') && strlen($request->id_tahun_ajaran) > 0) {
            $siswa = $siswa->where('siswa.id_tahun_ajaran', '=', $id_tahun_ajaran);
        }

        if ($request->has('id_jenis_keluar')) {
            $siswa = $siswa->where('siswa.id_jenis_keluar', '=', $request->id_jenis_keluar);
        }

        if ($request->has('search') and strlen($request->search) > 0) {
            $siswa = $siswa->where(function ($query) use ($request) {
                $query->where('nama_lengkap', 'LIKE', "%" . $request->search . "%")
                    ->orWhere('nama_panggilan', 'LIKE', "%" . $request->search . "%")
                    ->orWhere('no_induk', 'LIKE', "%" . $request->search . "%");
            });
        }

        $siswa = $siswa->orderby('siswa.id_tahun_ajaran', 'DESC')
            ->orderby('siswa.no_induk', 'ASC')
            ->orderby('siswa.nama_lengkap', 'ASC')
            ->paginate(10);

        // $siswa = Siswa::query();
        // if($request->has('search') && $request->search != ''){
        //     $siswa->where('nama_lengkap', 'LIKE', "'%" . $request->search . "%'")
        //             ->orWhere('nama_panggilan', 'LIKE', "'%" . $request->search . "%'")
        //             ->orWhere('no_induks', 'LIKE', "'%" . $request->search . "%'");
        // }
        // $siswa = $siswa->paginate(10);
        
        // return view('master.siswa.index',compact('siswa'));
        return Inertia::render('Master/Siswa/Index', 
        [
            'siswa' => $siswa,
            'tahun_ajaran' => $tahun_ajaran,
            'jenis_keluar' => $jenis_keluar,
            // 'searching' => $request->only(['search']),
            'filtering' => request()->query() ?: null
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $tahun_ajaran = TahunAjaran::get();
        // $sekolah = Sekolah::get();
        $agama = Agama::get();
        $jenis_keluar = JenisKeluar::get();

        $data_tahun_ajaran = DB::table('tahun_ajaran')->where('periode_aktif', '=', 1)->first();

        // return view('master.siswa.create')
		// ->with('tahun_ajaran', $tahun_ajaran)
		// ->with('sekolah', $sekolah)
        // ->with('agama', $agama)
        // ->with('jenis_keluar', $jenis_keluar); 
        return Inertia::render('Master/Siswa/Create', 
        [
            // 'sekolah' => $sekolah,
            'tahun_ajaran' => $tahun_ajaran,
            'agama' => $agama,
            'jenis_keluar' => $jenis_keluar,
            'data_tahun_ajaran' => $data_tahun_ajaran
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // $request->validate([
        //     'nama_lengkap' => 'required|string|max:250',
        //     'email_orang_tua' => 'required|unique:users,email',
        //     // 'password' => 'required|min:8|required_with:password_confirmation|same:password_confirmation',
        //     // 'password_confirmation' => 'required|min:8',
        //     // 'nisn' => 'required|integer|min:8|max:8',
        //     // 'nisn' => 'required|integer',
        //     // 'foto' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
        //     // 'kartu_keluarga' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
        //     // 'akta_kelahiran' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
        // ]);

        $rules = [
            'email_orang_tua' => ['required', 'unique:users,email'],
            // 'password' => ['required', 'min:8', 'confirmed', 'required_with:password_confirmation', 'same:password_confirmation'],
            // 'password' => ['required', 'min:8', 'confirmed'],
            // 'password_confirmation' => ['required', 'min:8'],
            'nama_lengkap' => ['required', 'string', 'max:250'],
            'nama_panggilan' => ['required', 'string', 'max:250'],
            'id_tahun_ajaran' => ['required'],
            'tanggal_masuk' => ['required'],
            'no_induk' => ['required'],
            'jenis_kelamin' => ['required'],
            'id_agama' => ['required'],
            'tempat_lahir' => ['required'],
            'tanggal_lahir' => ['required'],
            'hobi' => ['required'],
            'anak_ke' => ['required'],
            'nama_ayah' => ['required'],
            'no_telpon_ayah' => ['required'],
            'alamat' => ['required'],
            'no_kartu_keluarga' => ['required'],
            'nik_orang_tua' => ['required'],
            'foto' => ['nullable', 'image', 'max:1024', 'mimes:jpg,jpeg,png,gif'],
            'kartu_keluarga' => ['nullable', 'image', 'max:1024', 'mimes:jpg,jpeg,png,gif'],
            'akta_kelahiran' => ['nullable', 'image', 'max:1024', 'mimes:jpg,jpeg,png,gif'],
        ];

        $messages = [
            'email_orang_tua.required' => 'Email harus diisi.',
            'email_orang_tua.email' => 'Email tidak valid.',
            'email_orang_tua.unique' => 'Email sudah digunakan.',
            // 'password.required' => 'Kata Sandi harus diisi.',
            // 'password.min' => 'Kata Sandi minimal 8 karakter.',
            // 'password.confirmed' => 'Konfirmasi Kata Sandi tidak sama.',
            // 'password_confirmation.required' => 'Konfirmasi Kata Sandi harus diisi.',
            // 'password_confirmation.min' => 'Konfirmasi Kata Sandi minimal 8 karakter.',
            'nama_lengkap.required' => 'Nama Lengkap harus diisi.',
            'nama_panggilan.required' => 'Nama Panggilan harus diisi.',
            'id_tahun_ajaran.required' => 'Tahun Ajaran harus diisi.',
            'tanggal_masuk.required' => 'Tanggal Masuk harus diisi.',
            'no_induk.required' => 'Nomor Induk harus diisi.',
            'jenis_kelamin.required' => 'Jenis Kelamin harus diisi.',
            'id_agama.required' => 'Agama harus diisi.',
            'tempat_lahir.required' => 'Tempat Lahir harus diisi.',
            'tanggal_lahir.required' => 'Tanggal Lahir harus diisi.',
            'hobi.required' => 'Hobi harus diisi.',
            'anak_ke.required' => 'Anak Ke harus diisi.',
            'nama_ayah.required' => 'Nama Ayah harus diisi.',
            'no_telpon_ayah.required' => 'Nomor Telepon Ayah harus diisi.',
            'alamat.required' => 'Alamat harus diisi.',
            'no_kartu_keluarga.required' => 'Nomor Kartu Keluarga harus diisi.',
            'nik_orang_tua.required' => 'NIK Orang Tua harus diisi.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.max' => 'Ukuran file maksimum 1MB.',
            'foto.mimes' => 'File harus format: jpg, jpeg, png, gif.',
            'kartu_keluarga.image' => 'File harus berupa gambar.',
            'kartu_keluarga.max' => 'Ukuran file maksimum 1MB.',
            'kartu_keluarga.mimes' => 'File harus format: jpg, jpeg, png, gif.',
            'akta_kelahiran.image' => 'File harus berupa gambar.',
            'akta_kelahiran.max' => 'Ukuran file maksimum 1MB.',
            'akta_kelahiran.mimes' => 'File harus format: jpg, jpeg, png, gif.',
        ];

        $request->validate($rules, $messages);

        $password_default = $this->generateRandomString();
        $add = User::create([
            'name' => $request->nama_lengkap,
            'email' => $request->email_orang_tua,
            'password' => Hash::make($password_default),
            'status' => 1,
            'confirmed' => 1,
            'confirmed_at' => date('Y-m-d H:i:s'),
            'verified' => 1,
            'verified_at' => date('Y-m-d H:i:s'),
            'verifier' => $request->user()->id,
            'role_id' => 5,
        ]);

        if ($add) {
            $current = User::where('email', '=', $request->email_orang_tua);
            $user = User::find($current->orderby('created_at', 'DESC')->first()->id);
            $user->assignRole("orang.tua");

            if ($request->hasFile('foto')) {
                $image = $request->file('foto');
                $destinationPath = 'images/siswa/';
                // $profileImage = date('YmdHis') . "." . $image->getClientOriginalExtension();
                $profileImage = date('YmdHis') . '-' . $image->getClientOriginalName();
                $image->move($destinationPath, $profileImage);
                $foto = $profileImage;
            }else{
                $foto = '';
            }
    
            if ($request->hasFile('kartu_keluarga')) {
                $image = $request->file('kartu_keluarga');
                $destinationPath = 'images/siswa/';
                // $profileImage = date('YmdHis') . "." . $image->getClientOriginalExtension();
                $profileImage = date('YmdHis') . '-' . $image->getClientOriginalName();
                $image->move($destinationPath, $profileImage);
                $kartu_keluarga = $profileImage;
            }else{
                $kartu_keluarga = '';
            }
    
            if ($request->hasFile('akta_kelahiran')) {
                $image = $request->file('akta_kelahiran');
                $destinationPath = 'images/siswa/';
                // $profileImage = date('YmdHis') . "." . $image->getClientOriginalExtension();
                $profileImage = date('YmdHis') . '-' . $image->getClientOriginalName();
                $image->move($destinationPath, $profileImage);
                $akta_kelahiran = $profileImage;
            }else{
                $akta_kelahiran = '';
            }

            $user_id = Session::get('user_id');
            $role_id = Session::get('role_id');
            $id_sekolah = Session::get('id_sekolah');

            $datasiswa = array(
                'id_tahun_ajaran' => $request->id_tahun_ajaran,
                'tanggal_masuk' => $request->tanggal_masuk,
                'id_sekolah' => $id_sekolah,
                'nama_lengkap' => $request->nama_lengkap,
                'nama_panggilan' => $request->nama_panggilan,
                'no_induk' => $request->no_induk,
                'nisn' => $request->nisn,
                'id_user' => $current->orderby('created_at', 'DESC')->first()->id,
                'jenis_kelamin' => $request->jenis_kelamin,
                'id_agama' => $request->id_agama,
                'tempat_lahir' => $request->tempat_lahir,
                'tanggal_lahir' => $request->tanggal_lahir,
                'hobi' => $request->hobi,
                'anak_ke' => $request->anak_ke,

                'nama_ayah' => $request->nama_ayah,
                'pekerjaan_ayah' => $request->pekerjaan_ayah,
                'no_telpon_ayah' => $request->no_telpon_ayah,
                'nama_ibu' => $request->nama_ibu,
                'pekerjaan_ibu' => $request->pekerjaan_ibu,
                'no_telpon_ibu' => $request->no_telpon_ibu,
                'nama_wali' => $request->nama_wali,
                'pekerjaan_wali' => $request->pekerjaan_wali,
                'no_telpon_wali' => $request->no_telpon_wali,

                'alamat' => $request->alamat,
                'email_orang_tua' => $request->email_orang_tua,
                'id_jenis_keluar' => $request->id_jenis_keluar,
                'tanggal_keluar' => $request->tanggal_keluar,
                'catatan_keluar' => $request->catatan_keluar,
                
                'foto' => $foto,
                'kartu_keluarga' => $kartu_keluarga,
                'akta_kelahiran' => $akta_kelahiran,
                'no_kartu_keluarga' => $request->no_kartu_keluarga,
                'nik_orang_tua' => $request->nik_orang_tua,
                'password_default' => $password_default,

                'user_id' => $user_id,
                'role_id' => $role_id,
                'created_at' => date('Y-m-d H:i:s'),
            );
            $simpan = Siswa::create($datasiswa);
        }

        if ($simpan) {
            return redirect()->route('siswa.index')->with('message', 'Data Siswa berhasil disimpan!');
        } else {
            return redirect()->route('siswa.index')->with('error', 'Data Siswa gagal disimpan!');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Siswa $siswa)
    {
        // return view('master.siswa.show', ['siswa' => $siswa]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Siswa $siswa)
    {
        $tahun_ajaran = TahunAjaran::get();
        // $sekolah = Sekolah::get();
        $agama = Agama::get();
        $jenis_keluar = JenisKeluar::get();

        // if(!$siswa->$password_default){
            // $password_default = $this->generateRandomString();
            // $datasiswa = array(
            //     'password_default' => $password_default,
            //     'updated_at' => date('Y-m-d H:i:s'),
            // );
            // $simpan = $siswa->update($datasiswa);
            // DB::table('users')->where('email', '=', $siswa->email_orang_tua)->update(array('password' => Hash::make($password_default)));
        // }

        // $user = User::find($siswa->id_user);
        // $user->assignRole("orang.tua");

        // return view('master.siswa.edit')
        // ->with('siswa', $siswa)
		// ->with('tahun_ajaran', $tahun_ajaran)
		// ->with('sekolah', $sekolah)
        // ->with('agama', $agama)
        // ->with('jenis_keluar', $jenis_keluar);
        return Inertia::render('Master/Siswa/Edit', 
        [
            'siswa' => $siswa,
            'tahun_ajaran' => $tahun_ajaran,
            'agama' => $agama,
            'jenis_keluar' => $jenis_keluar
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Siswa $siswa)
    {
        $rules = [
            'email_orang_tua' => ['required', 'unique:users,email,'.$siswa->id_user],
            // 'password' => ['required', 'min:8', 'confirmed', 'required_with:password_confirmation', 'same:password_confirmation'],
            // 'password' => ['required', 'min:8', 'confirmed'],
            // 'password_confirmation' => ['required', 'min:8'],
            'nama_lengkap' => ['required', 'string', 'max:250'],
            'nama_panggilan' => ['required', 'string', 'max:250'],
            'id_tahun_ajaran' => ['required'],
            'tanggal_masuk' => ['required'],
            'no_induk' => ['required'],
            'jenis_kelamin' => ['required'],
            'id_agama' => ['required'],
            'tempat_lahir' => ['required'],
            'tanggal_lahir' => ['required'],
            'hobi' => ['required'],
            'anak_ke' => ['required'],
            'nama_ayah' => ['required'],
            'no_telpon_ayah' => ['required'],
            'alamat' => ['required'],
            'no_kartu_keluarga' => ['required'],
            'nik_orang_tua' => ['required'],
            'foto' => ['nullable', 'image', 'max:1024', 'mimes:jpg,jpeg,png,gif'],
            'kartu_keluarga' => ['nullable', 'image', 'max:1024', 'mimes:jpg,jpeg,png,gif'],
            'akta_kelahiran' => ['nullable', 'image', 'max:1024', 'mimes:jpg,jpeg,png,gif'],
        ];

        $messages = [
            'email_orang_tua.required' => 'Email harus diisi.',
            'email_orang_tua.email' => 'Email tidak valid.',
            'email_orang_tua.unique' => 'Email sudah digunakan.',
            // 'password.required' => 'Kata Sandi harus diisi.',
            // 'password.min' => 'Kata Sandi minimal 8 karakter.',
            // 'password.confirmed' => 'Konfirmasi Kata Sandi tidak sama.',
            // 'password_confirmation.required' => 'Konfirmasi Kata Sandi harus diisi.',
            // 'password_confirmation.min' => 'Konfirmasi Kata Sandi minimal 8 karakter.',
            'nama_lengkap.required' => 'Nama Lengkap harus diisi.',
            'nama_panggilan.required' => 'Nama Panggilan harus diisi.',
            'id_tahun_ajaran.required' => 'Tahun Ajaran harus diisi.',
            'tanggal_masuk.required' => 'Tanggal Masuk harus diisi.',
            'no_induk.required' => 'Nomor Induk harus diisi.',
            'jenis_kelamin.required' => 'Jenis Kelamin harus diisi.',
            'id_agama.required' => 'Agama harus diisi.',
            'tempat_lahir.required' => 'Tempat Lahir harus diisi.',
            'tanggal_lahir.required' => 'Tanggal Lahir harus diisi.',
            'hobi.required' => 'Hobi harus diisi.',
            'anak_ke.required' => 'Anak Ke harus diisi.',
            'nama_ayah.required' => 'Nama Ayah harus diisi.',
            'no_telpon_ayah.required' => 'Nomor Telepon Ayah harus diisi.',
            'alamat.required' => 'Alamat harus diisi.',
            'no_kartu_keluarga.required' => 'Nomor Kartu Keluarga harus diisi.',
            'nik_orang_tua.required' => 'NIK Orang Tua harus diisi.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.max' => 'Ukuran file maksimum 1MB.',
            'foto.mimes' => 'File harus format: jpg, jpeg, png, gif.',
            'kartu_keluarga.image' => 'File harus berupa gambar.',
            'kartu_keluarga.max' => 'Ukuran file maksimum 1MB.',
            'kartu_keluarga.mimes' => 'File harus format: jpg, jpeg, png, gif.',
            'akta_kelahiran.image' => 'File harus berupa gambar.',
            'akta_kelahiran.max' => 'Ukuran file maksimum 1MB.',
            'akta_kelahiran.mimes' => 'File harus format: jpg, jpeg, png, gif.',
        ];

        $request->validate($rules, $messages);

        if (($request->hasFile('foto')) || ($request->hasFile('kartu_keluarga')) || ($request->hasFile('akta_kelahiran'))) {
            if ($request->hasFile('foto')) {
                /*if($request->password){
                    $request->validate([
                        'nama_lengkap' => 'required|string|max:250',
                        'email_orang_tua' => 'required|unique:users,email,'.$siswa->id_user,
                        // 'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                        // 'password_confirmation' => 'min:8',
                        'jenis_kelamin' => 'required',
                        'foto' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
                    ]);
                }else{
                    $request->validate([
                        'nama_lengkap' => 'required|string|max:250',
                        'email_orang_tua' => 'required|unique:users,email,'.$siswa->id_user,
                        // 'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                        // 'password_confirmation' => 'min:8',
                        // 'nisn' => 'required|integer|min:8|max:8',
                        // 'nisn' => 'required|integer',
                        'jenis_kelamin' => 'required',
                        'foto' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
                    ]);
                }*/

                if ((file_exists('images/siswa/'.$request->foto_lama)) && ($request->foto_lama)) {
                    unlink('images/siswa/'.$request->foto_lama);
                }
                $image = $request->file('foto');
                $destinationPath = 'images/siswa/';
                // $profileImage = date('YmdHis') . "." . $image->getClientOriginalExtension();
                $profileImage = date('YmdHis') . '-' . $image->getClientOriginalName();
                $image->move($destinationPath, $profileImage);
                $foto = $profileImage;
            }else{
                $foto = $request->foto_lama;
            }

            if ($request->hasFile('kartu_keluarga')) {
                /*if($request->password){
                    $request->validate([
                        'nama_lengkap' => 'required|string|max:250',
                        'email_orang_tua' => 'required|unique:users,email,'.$siswa->id_user,
                        // 'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                        // 'password_confirmation' => 'min:8',
                        'jenis_kelamin' => 'required',
                        'kartu_keluarga' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
                    ]);
                }else{
                    $request->validate([
                        'nama_lengkap' => 'required|string|max:250',
                        'email_orang_tua' => 'required|unique:users,email,'.$siswa->id_user,
                        // 'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                        // 'password_confirmation' => 'min:8',
                        // 'nisn' => 'required|integer|min:8|max:8',
                        // 'nisn' => 'required|integer',
                        'jenis_kelamin' => 'required',
                        'kartu_keluarga' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
                    ]);
                }*/

                if ((file_exists('images/siswa/'.$request->kartu_keluarga_lama)) && ($request->kartu_keluarga_lama)) {
                    unlink('images/siswa/'.$request->kartu_keluarga_lama);
                }
                $image = $request->file('kartu_keluarga');
                $destinationPath = 'images/siswa/';
                // $profileImage = date('YmdHis') . "." . $image->getClientOriginalExtension();
                $profileImage = date('YmdHis') . '-' . $image->getClientOriginalName();
                $image->move($destinationPath, $profileImage);
                $kartu_keluarga = $profileImage;
            }else{
                $kartu_keluarga = $request->kartu_keluarga_lama;
            }

            if ($request->hasFile('akta_kelahiran')) {
                /*if($request->password){
                    $request->validate([
                        'nama_lengkap' => 'required|string|max:250',
                        'email_orang_tua' => 'required|unique:users,email,'.$siswa->id_user,
                        // 'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                        // 'password_confirmation' => 'min:8',
                        'jenis_kelamin' => 'required',
                        'akta_kelahiran' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
                    ]);
                }else{
                    $request->validate([
                        'nama_lengkap' => 'required|string|max:250',
                        'email_orang_tua' => 'required|unique:users,email,'.$siswa->id_user,
                        // 'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                        // 'password_confirmation' => 'min:8',
                        // 'nisn' => 'required|integer|min:8|max:8',
                        // 'nisn' => 'required|integer',
                        'jenis_kelamin' => 'required',
                        'akta_kelahiran' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
                    ]);
                }*/

                if ((file_exists('images/siswa/'.$request->akta_kelahiran_lama)) && ($request->akta_kelahiran_lama)) {
                    unlink('images/siswa/'.$request->akta_kelahiran_lama);
                }
                $image = $request->file('akta_kelahiran');
                $destinationPath = 'images/siswa/';
                // $profileImage = date('YmdHis') . "." . $image->getClientOriginalExtension();
                $profileImage = date('YmdHis') . '-' . $image->getClientOriginalName();
                $image->move($destinationPath, $profileImage);
                $akta_kelahiran = $profileImage;
            }else{
                $akta_kelahiran = $request->akta_kelahiran_lama;
            }
        }else{
            /*if($request->password){
                $request->validate([
                    'nama_lengkap' => 'required|string|max:250',
                    'email_orang_tua' => 'required|unique:users,email,'.$siswa->id_user,
                    // 'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                    // 'password_confirmation' => 'min:8',
                    'jenis_kelamin' => 'required',
                ]);
            }else{
                $request->validate([
                    'nama_lengkap' => 'required|string|max:250',
                    'email_orang_tua' => 'required|unique:users,email,'.$siswa->id_user,
                    // 'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                    // 'password_confirmation' => 'min:8',
                    // 'nisn' => 'required|integer|min:8|max:8',
                    // 'nisn' => 'required|integer',
                    'jenis_kelamin' => 'required',
                ]);
            }*/

            $foto = $request->foto_lama;
            $kartu_keluarga = $request->kartu_keluarga_lama;
            $akta_kelahiran = $request->akta_kelahiran_lama;
        }

        $user_id = Session::get('user_id');
        $role_id = Session::get('role_id');

        $datasiswa = array(
            'id_tahun_ajaran' => $request->id_tahun_ajaran,
            'tanggal_masuk' => $request->tanggal_masuk,
            'nama_lengkap' => $request->nama_lengkap,
            'nama_panggilan' => $request->nama_panggilan,
            'no_induk' => $request->no_induk,
            'nisn' => $request->nisn,
            'jenis_kelamin' => $request->jenis_kelamin,
            'id_agama' => $request->id_agama,
            'tempat_lahir' => $request->tempat_lahir,
            'tanggal_lahir' => $request->tanggal_lahir,
            'hobi' => $request->hobi,
            'anak_ke' => $request->anak_ke,

            'nama_ayah' => $request->nama_ayah,
            'pekerjaan_ayah' => $request->pekerjaan_ayah,
            'no_telpon_ayah' => $request->no_telpon_ayah,
            'nama_ibu' => $request->nama_ibu,
            'pekerjaan_ibu' => $request->pekerjaan_ibu,
            'no_telpon_ibu' => $request->no_telpon_ibu,
            'nama_wali' => $request->nama_wali,
            'pekerjaan_wali' => $request->pekerjaan_wali,
            'no_telpon_wali' => $request->no_telpon_wali,

            'alamat' => $request->alamat,
            // 'email_orang_tua' => $request->email_orang_tua,
            // 'id_jenis_keluar' => $request->id_jenis_keluar,
            // 'tanggal_keluar' => $request->tanggal_keluar,
            // 'catatan_keluar' => $request->catatan_keluar,
            
            'foto' => $foto,
            'kartu_keluarga' => $kartu_keluarga,
            'akta_kelahiran' => $akta_kelahiran,
            'no_kartu_keluarga' => $request->no_kartu_keluarga,
            'nik_orang_tua' => $request->nik_orang_tua,

            // 'user_id' => $user_id,
            // 'role_id' => $role_id,
            'updated_at' => date('Y-m-d H:i:s'),
        );
        $simpan = $siswa->update($datasiswa);

        if($request->password){
            DB::table('users')->where('email', '=', $request->email_orang_tua)
            ->update(array('password' => Hash::make($request->password), 'name' => $request->nama_lengkap));
        }else{
            DB::table('users')->where('email', '=', $request->email_orang_tua)
            ->update(array('name' => $request->nama_lengkap));
        }

        if ($simpan) {
            return redirect()->route('siswa.index')->with('message', 'Data Siswa berhasil disimpan!');
        } else {
            return redirect()->route('siswa.index')->with('error', 'Data Siswa gagal disimpan!');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Siswa $siswa)
    {
        
        $hapus = $siswa->delete();
        // $datasiswa = array(
        //     'deleted_at' => date('Y-m-d H:i:s'),
        // );
        // $hapus = Siswa::where('id', $siswa->id)->update($datasiswa);
        if ($hapus) {
            if ((file_exists('images/siswa/'.$siswa->foto)) && ($siswa->foto)) {
                unlink('images/siswa/'.$siswa->foto);
            }
            if ((file_exists('images/siswa/'.$siswa->kartu_keluarga)) && ($siswa->kartu_keluarga)) {
                unlink('images/siswa/'.$siswa->kartu_keluarga);
            }
            if ((file_exists('images/siswa/'.$siswa->akta_kelahiran)) && ($siswa->akta_kelahiran)) {
                unlink('images/siswa/'.$siswa->akta_kelahiran);
            }

            $datasiswa = array(
                'foto' => NULL,
                'kartu_keluarga' => NULL,
                'akta_kelahiran' => NULL,
            );
            $siswa->update($datasiswa);

            //softdelete data akun siswa
            DB::table('users')->where('id', '=', $siswa->id_user)->update(array('deleted' => 1)); //, 'deleted_at' => date('Y:m:d H:i:s')
            $user = User::find($siswa->id_user);
            $user->delete();
        }

        // return redirect()->route('siswa.index')->with('message', 'Data Siswa berhasil dihapus!');
        return redirect()->back();
    }

    public function siswa_keluar($id)
    {
        $siswa = Siswa::find($id);
        $jenis_keluar = JenisKeluar::get();

        return Inertia::render('Master/Siswa/Siswa_Keluar', 
        [
            'siswa' => $siswa,
            'jenis_keluar' => $jenis_keluar
        ]);
    }

    public function siswa_keluar_update(Request $request, $id)
    {
        // $request->validate([
        //     'id_jenis_keluar' => 'required',
        //     'tanggal_keluar' => 'required',
        //     'catatan_keluar' => 'required|string',
        // ]);

        $rules = [
            'id_jenis_keluar' => ['required'],
            'tanggal_keluar' => ['required'],
            'catatan_keluar' => ['required'],
        ];

        $messages = [
            'id_jenis_keluar.required' => 'Jenis Keluar harus diisi.',
            'tanggal_keluar.required' => 'Tanggal Keluar harus diisi.',
            'catatan_keluar.required' => 'Catatan Keluar harus diisi.',
        ];

        $request->validate($rules, $messages);

        $user_id = Session::get('user_id');
        $role_id = Session::get('role_id');

        $datasiswa = array(
            'id_jenis_keluar' => $request->id_jenis_keluar,
            'tanggal_keluar' => $request->tanggal_keluar,
            'catatan_keluar' => $request->catatan_keluar,
            // 'user_id' => $user_id,
            // 'role_id' => $role_id,
            'updated_at' => date('Y-m-d H:i:s'),
        );
        // $simpan = $siswa->update($datasiswa);
        $simpan = Siswa::where('id', $id)->update($datasiswa);

        if ($simpan) {
            return redirect()->route('siswa.index')->with('message', 'Data Siswa Keluar berhasil disimpan!');
        } else {
            return redirect()->route('siswa.index')->with('error', 'Data Siswa Keluar gagal disimpan!');
        }
    }

    public function verifikasi_siswa($id_user)
    {
        $upd = DB::table('users')
            ->where('id', '=', $id_user)
            ->update(array('status' => 1, 'verified' => 1, 'verified_at' => date('Y-m-d H:i:s'), 'verifier' => Session::get('user_id')));

        $data = DB::table('users')
            ->where('id', '=', $id_user)
            ->first();

        $data_siswa = DB::table('siswa')
            ->where('id_user', '=', $id_user)
            ->first();

        if ($upd) {
            $user = User::find($id_user);
            $user->assignRole("orang.tua");

            $mailData = [
                'title' => 'Selamat, Akun SimPaud Anda telah terverifikasi',
                'body' => 'Akun SimPaud anda telah diverifikasi oleh Admin, kini Anda sudah dapat menggunakan fitur-fitur SimPaud secara penuh, kata sandi Anda adalah "<b>'.$data_siswa->password_default.'</b>", klik tombol di bawah ini untuk login.',
                'footer' => 'Email ini dikirim secara otomatis melalui sistem SimPaud.',
                'base_url' => env('APP_URL')
            ];
            Mail::to($data->email)->send(new EmailVerifikasi($mailData));
        }

        // return redirect()->route('verval-siswa')->with('message', 'Data Siswa berhasil diverifikasi!');
        return redirect()->back();
    }

    public function profil_siswa()
    {
        $agama = Agama::get();

        $siswa = Siswa::join('users','users.id','=','siswa.id_user')->where('users.id', '=', Auth::user()->id)->first();
        return Inertia::render('Master/Siswa/Profil_Siswa', 
        [
            'siswa' => $siswa,
            'agama' => $agama,
        ]);
    }

    public function profil_siswa_update(Request $request)
    {
        $rules = [
            'email_orang_tua' => ['required', 'unique:users,email,'.$siswa->id_user],
            // 'password' => ['required', 'min:8', 'confirmed', 'required_with:password_confirmation', 'same:password_confirmation'],
            // 'password' => ['required', 'min:8', 'confirmed'],
            // 'password_confirmation' => ['required', 'min:8'],
            'nama_lengkap' => ['required', 'string', 'max:250'],
            'nama_panggilan' => ['required', 'string', 'max:250'],
            'id_tahun_ajaran' => ['required'],
            'tanggal_masuk' => ['required'],
            'no_induk' => ['required'],
            'jenis_kelamin' => ['required'],
            'id_agama' => ['required'],
            'tempat_lahir' => ['required'],
            'tanggal_lahir' => ['required'],
            'hobi' => ['required'],
            'anak_ke' => ['required'],
            'nama_ayah' => ['required'],
            'no_telpon_ayah' => ['required'],
            'alamat' => ['required'],
            'no_kartu_keluarga' => ['required'],
            'nik_orang_tua' => ['required'],
            'foto' => ['nullable', 'image', 'max:1024', 'mimes:jpg,jpeg,png,gif'],
            'kartu_keluarga' => ['nullable', 'image', 'max:1024', 'mimes:jpg,jpeg,png,gif'],
            'akta_kelahiran' => ['nullable', 'image', 'max:1024', 'mimes:jpg,jpeg,png,gif'],
        ];

        $messages = [
            'email_orang_tua.required' => 'Email harus diisi.',
            'email_orang_tua.email' => 'Email tidak valid.',
            'email_orang_tua.unique' => 'Email sudah digunakan.',
            // 'password.required' => 'Kata Sandi harus diisi.',
            // 'password.min' => 'Kata Sandi minimal 8 karakter.',
            // 'password.confirmed' => 'Konfirmasi Kata Sandi tidak sama.',
            // 'password_confirmation.required' => 'Konfirmasi Kata Sandi harus diisi.',
            // 'password_confirmation.min' => 'Konfirmasi Kata Sandi minimal 8 karakter.',
            'nama_lengkap.required' => 'Nama Lengkap harus diisi.',
            'nama_panggilan.required' => 'Nama Panggilan harus diisi.',
            'id_tahun_ajaran.required' => 'Tahun Ajaran harus diisi.',
            'tanggal_masuk.required' => 'Tanggal Masuk harus diisi.',
            'no_induk.required' => 'Nomor Induk harus diisi.',
            'jenis_kelamin.required' => 'Jenis Kelamin harus diisi.',
            'id_agama.required' => 'Agama harus diisi.',
            'tempat_lahir.required' => 'Tempat Lahir harus diisi.',
            'tanggal_lahir.required' => 'Tanggal Lahir harus diisi.',
            'hobi.required' => 'Hobi harus diisi.',
            'anak_ke.required' => 'Anak Ke harus diisi.',
            'nama_ayah.required' => 'Nama Ayah harus diisi.',
            'no_telpon_ayah.required' => 'Nomor Telepon Ayah harus diisi.',
            'alamat.required' => 'Alamat harus diisi.',
            'no_kartu_keluarga.required' => 'Nomor Kartu Keluarga harus diisi.',
            'nik_orang_tua.required' => 'NIK Orang Tua harus diisi.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.max' => 'Ukuran file maksimum 1MB.',
            'foto.mimes' => 'File harus format: jpg, jpeg, png, gif.',
            'kartu_keluarga.image' => 'File harus berupa gambar.',
            'kartu_keluarga.max' => 'Ukuran file maksimum 1MB.',
            'kartu_keluarga.mimes' => 'File harus format: jpg, jpeg, png, gif.',
            'akta_kelahiran.image' => 'File harus berupa gambar.',
            'akta_kelahiran.max' => 'Ukuran file maksimum 1MB.',
            'akta_kelahiran.mimes' => 'File harus format: jpg, jpeg, png, gif.',
        ];

        $request->validate($rules, $messages);

        if (($request->hasFile('foto')) || ($request->hasFile('kartu_keluarga')) || ($request->hasFile('akta_kelahiran'))) {
            if ($request->hasFile('foto')) {
                /*if($request->password){
                    $request->validate([
                        'nama_lengkap' => 'required|string|max:250',
                        'email_orang_tua' => 'required|unique:users,email,'.$request->id_user,
                        'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                        'password_confirmation' => 'min:8',
                        'jenis_kelamin' => 'required',
                        'foto' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
                    ]);
                }else{
                    $request->validate([
                        'nama_lengkap' => 'required|string|max:250',
                        'email_orang_tua' => 'required|unique:users,email,'.$request->id_user,
                        // 'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                        // 'password_confirmation' => 'min:8',
                        // 'nisn' => 'required|integer|min:8|max:8',
                        // 'nisn' => 'required|integer',
                        'jenis_kelamin' => 'required',
                        'foto' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
                    ]);
                }*/

                if ((file_exists('images/siswa/'.$request->foto_lama)) && ($request->foto_lama)) {
                    unlink('images/siswa/'.$request->foto_lama);
                }
                $image = $request->file('foto');
                $destinationPath = 'images/siswa/';
                // $profileImage = date('YmdHis') . "." . $image->getClientOriginalExtension();
                $profileImage = date('YmdHis') . '-' . $image->getClientOriginalName();
                $image->move($destinationPath, $profileImage);
                $foto = $profileImage;
            }else{
                $foto = $request->foto_lama;
            }

            if ($request->hasFile('kartu_keluarga')) {
                /*if($request->password){
                    $request->validate([
                        'nama_lengkap' => 'required|string|max:250',
                        'email_orang_tua' => 'required|unique:users,email,'.$request->id_user,
                        'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                        'password_confirmation' => 'min:8',
                        'jenis_kelamin' => 'required',
                        'kartu_keluarga' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
                    ]);
                }else{
                    $request->validate([
                        'nama_lengkap' => 'required|string|max:250',
                        'email_orang_tua' => 'required|unique:users,email,'.$request->id_user,
                        // 'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                        // 'password_confirmation' => 'min:8',
                        // 'nisn' => 'required|integer|min:8|max:8',
                        // 'nisn' => 'required|integer',
                        'jenis_kelamin' => 'required',
                        'kartu_keluarga' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
                    ]);
                }*/

                if ((file_exists('images/siswa/'.$request->kartu_keluarga_lama)) && ($request->kartu_keluarga_lama)) {
                    unlink('images/siswa/'.$request->kartu_keluarga_lama);
                }
                $image = $request->file('kartu_keluarga');
                $destinationPath = 'images/siswa/';
                // $profileImage = date('YmdHis') . "." . $image->getClientOriginalExtension();
                $profileImage = date('YmdHis') . '-' . $image->getClientOriginalName();
                $image->move($destinationPath, $profileImage);
                $kartu_keluarga = $profileImage;
            }else{
                $kartu_keluarga = $request->kartu_keluarga_lama;
            }

            if ($request->hasFile('akta_kelahiran')) {
                /*if($request->password){
                    $request->validate([
                        'nama_lengkap' => 'required|string|max:250',
                        'email_orang_tua' => 'required|unique:users,email,'.$request->id_user,
                        'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                        'password_confirmation' => 'min:8',
                        'jenis_kelamin' => 'required',
                        'akta_kelahiran' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
                    ]);
                }else{
                    $request->validate([
                        'nama_lengkap' => 'required|string|max:250',
                        'email_orang_tua' => 'required|unique:users,email,'.$request->id_user,
                        // 'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                        // 'password_confirmation' => 'min:8',
                        // 'nisn' => 'required|integer|min:8|max:8',
                        // 'nisn' => 'required|integer',
                        'jenis_kelamin' => 'required',
                        'akta_kelahiran' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif',
                    ]);
                }*/

                if ((file_exists('images/siswa/'.$request->akta_kelahiran_lama)) && ($request->akta_kelahiran_lama)) {
                    unlink('images/siswa/'.$request->akta_kelahiran_lama);
                }
                $image = $request->file('akta_kelahiran');
                $destinationPath = 'images/siswa/';
                // $profileImage = date('YmdHis') . "." . $image->getClientOriginalExtension();
                $profileImage = date('YmdHis') . '-' . $image->getClientOriginalName();
                $image->move($destinationPath, $profileImage);
                $akta_kelahiran = $profileImage;
            }else{
                $akta_kelahiran = $request->akta_kelahiran_lama;
            }
        }else{
            /*if($request->password){
                $request->validate([
                    'nama_lengkap' => 'required|string|max:250',
                    'email_orang_tua' => 'required|unique:users,email,'.$request->id_user,
                    'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                    'password_confirmation' => 'min:8',
                    'jenis_kelamin' => 'required',
                ]);
            }else{
                $request->validate([
                    'nama_lengkap' => 'required|string|max:250',
                    'email_orang_tua' => 'required|unique:users,email,'.$request->id_user,
                    // 'password' => 'min:8|required_with:password_confirmation|same:password_confirmation',
                    // 'password_confirmation' => 'min:8',
                    // 'nisn' => 'required|integer|min:8|max:8',
                    // 'nisn' => 'required|integer',
                    'jenis_kelamin' => 'required',
                ]);
            }*/

            $foto = $request->foto_lama;
            $kartu_keluarga = $request->kartu_keluarga_lama;
            $akta_kelahiran = $request->akta_kelahiran_lama;
        }

        $user_id = Session::get('user_id');
        $role_id = Session::get('role_id');

        $datasiswa = array(
            // 'id_tahun_ajaran' => $request->id_tahun_ajaran,
            // 'tanggal_masuk' => $request->tanggal_masuk,
            'nama_lengkap' => $request->nama_lengkap,
            'nama_panggilan' => $request->nama_panggilan,
            // 'no_induk' => $request->no_induk,
            // 'nisn' => $request->nisn,
            'jenis_kelamin' => $request->jenis_kelamin,
            'id_agama' => $request->id_agama,
            'tempat_lahir' => $request->tempat_lahir,
            'tanggal_lahir' => $request->tanggal_lahir,
            'hobi' => $request->hobi,
            'anak_ke' => $request->anak_ke,

            'nama_ayah' => $request->nama_ayah,
            'pekerjaan_ayah' => $request->pekerjaan_ayah,
            'no_telpon_ayah' => $request->no_telpon_ayah,
            'nama_ibu' => $request->nama_ibu,
            'pekerjaan_ibu' => $request->pekerjaan_ibu,
            'no_telpon_ibu' => $request->no_telpon_ibu,
            'nama_wali' => $request->nama_wali,
            'pekerjaan_wali' => $request->pekerjaan_wali,
            'no_telpon_wali' => $request->no_telpon_wali,

            'alamat' => $request->alamat,
            // 'email_orang_tua' => $request->email_orang_tua,
            // 'id_jenis_keluar' => $request->id_jenis_keluar,
            // 'tanggal_keluar' => $request->tanggal_keluar,
            // 'catatan_keluar' => $request->catatan_keluar,
            
            'foto' => $foto,
            'kartu_keluarga' => $kartu_keluarga,
            'akta_kelahiran' => $akta_kelahiran,
            'no_kartu_keluarga' => $request->no_kartu_keluarga,
            'nik_orang_tua' => $request->nik_orang_tua,

            // 'user_id' => $user_id,
            // 'role_id' => $role_id,
            'updated_at' => date('Y-m-d H:i:s'),
        );
        // $simpan = $siswa->update($datasiswa);
        $simpan = Siswa::join('users','users.id','=','siswa.id_user')->where('users.id', '=', Auth::user()->id)->update($datasiswa);

        if($request->password){
            DB::table('users')->where('email', '=', $request->email_orang_tua)
            ->update(array('password' => Hash::make($request->password), 'name' => $request->nama_lengkap));
        }else{
            DB::table('users')->where('email', '=', $request->email_orang_tua)
            ->update(array('name' => $request->nama_lengkap));
        }

        if ($simpan) {
            return redirect()->route('dashboard')->with('message', 'Data Siswa berhasil disimpan!');
        } else {
            return redirect()->route('dashboard')->with('error', 'Data Siswa gagal disimpan!');
        }
    }

    public function status_siswa($id_user, $status)
    {
        $stat = $status == 1 ? 0 : 1;
        $upd = DB::table('users')
            ->where('id', '=', $id_user)
            ->update(array('status' => $stat));

        $stat_message = $stat == 1 ? "diaktifkan" : "dinonaktifkan";

        // return redirect()->route('siswa.index')->with('message', 'Data Siswa berhasil '.$stat_message.'!');
        return redirect()->back();
    }

    public function verifikasi_validasi(Request $request)
    {
        $siswa = Siswa::query()
            ->select('siswa.*', DB::raw('DATE_FORMAT(users.created_at, "%d-%m-%Y %H:%i") as tanggal_registrasi'), DB::raw('DATE_FORMAT(tanggal_lahir, "%d-%m-%Y") as tanggal_lahir'), 
            DB::raw("FLOOR(DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365) AS usia_tahun"), 
            DB::raw("FLOOR((DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365 - FLOOR(DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365))* 12) AS usia_bulan"),
            'mta.nama AS tahun_ajaran', 'agm.nama AS agama','jk.nama AS jenis_keluar', 'users.id AS id_user', 'users.status as status', 'users.verified')
            ->join('agama AS agm', 'agm.id', '=', 'siswa.id_agama')
            ->join('tahun_ajaran AS mta', 'mta.id', '=', 'siswa.id_tahun_ajaran')
            ->join('users', 'users.id', '=', 'siswa.id_user')
            ->leftjoin('jenis_keluar AS jk','jk.id','=','siswa.id_jenis_keluar')
            ->where('siswa.id_sekolah', '=', Session::get('id_sekolah'))
            ->where('users.confirmed', '=', 1)
            ->where('users.verified', '=', 0)
            ->whereNull('users.verified_at')
            ->whereNull('siswa.deleted_at');

        if ($request->has('search') and strlen($request->search) > 0) {
            $siswa = $siswa->where(function ($query) use ($request) {
                $query->where('nama_lengkap', 'LIKE', "%" . $request->search . "%")
                    ->orWhere('nama_panggilan', 'LIKE', "%" . $request->search . "%")
                    ->orWhere('no_induk', 'LIKE', "%" . $request->search . "%");
            });
        }

        $siswa = $siswa->orderby('siswa.id_tahun_ajaran', 'DESC')
            ->orderby('siswa.no_induk', 'ASC')
            ->orderby('siswa.nama_lengkap', 'ASC')
            ->paginate(10);
        
        // return view('master.siswa.verifikasi_validasi',compact('siswa'));
        return Inertia::render('Master/Siswa/Verifikasi_Validasi', 
        [
            'siswa' => $siswa,
            // 'searching' => $request->only(['search']),
            'filtering' => request()->query() ?: null
        ]);
    }

    public function getSiswa($id)
    {
        $siswa = DB::table("siswa")
        ->select('siswa.*', DB::raw('DATE_FORMAT(tanggal_masuk, "%d-%m-%Y") as tanggal_masuk'), DB::raw('DATE_FORMAT(tanggal_lahir, "%d-%m-%Y") as tanggal_lahir'), 
        DB::raw("FLOOR(DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365) AS usia_tahun"), 
        DB::raw("FLOOR((DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365 - FLOOR(DATEDIFF(CURDATE(),siswa.tanggal_lahir)/365))* 12) AS usia_bulan"),
        'mta.nama AS tahun_ajaran', 'agm.nama AS agama', 'users.id AS id_user', 'users.status as status', 'users.verified')
        ->join('agama AS agm', 'agm.id', '=', 'siswa.id_agama')
        ->join('tahun_ajaran AS mta', 'mta.id', '=', 'siswa.id_tahun_ajaran')
        ->join('users', 'users.id', '=', 'siswa.id_user')
        ->where("siswa.id",$id)->first();
        
        return response()->json($siswa);
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

}
