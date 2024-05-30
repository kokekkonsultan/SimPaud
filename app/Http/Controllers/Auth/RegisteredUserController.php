<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Sekolah;
use App\Models\Siswa;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules;
use Mail;
use App\Mail\EmailKonfirmasi;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        if($request->id_sekolah){
            // $request->validate([
            //     'name' => 'required|string|max:255',
            //     'jenis_kelamin' => 'required',
            //     'agama' => 'required',
            //     'tempat_lahir' => 'required',
            //     'tanggal_lahir' => 'required',
            //     'nama_ayah' => 'required',
            //     'no_telpon_ayah' => 'required',
            //     'alamat' => 'required',
            //     'no_kartu_keluarga' => 'required',
            //     'nik_orang_tua' => 'required',
            //     'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            //     // 'password' => ['required', 'confirmed', Rules\Password::defaults()],
            // ]);

            $rules = [
                'name' => ['required', 'string', 'max:250'],
                'jenis_kelamin' => ['required'],
                'agama' => ['required'],
                'tempat_lahir' => ['required'],
                'tanggal_lahir' => ['required'],
                'nama_ayah' => ['required'],
                'no_telpon_ayah' => ['required'],
                'alamat' => ['required'],
                'no_kartu_keluarga' => ['required'],
                'nik_orang_tua' => ['required'],
                'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            ];
    
            // Custom validation messages
            $messages = [
                'name.required' => 'Nama Lengkap harus diisi.',
                'jenis_kelamin.required' => 'Jenis Kelamin harus diisi.',
                'agama.required' => 'Agama harus diisi.',
                'tempat_lahir.required' => 'Tempat Lahir harus diisi.',
                'tanggal_lahir.required' => 'Tanggal Lahir harus diisi.',
                'nama_ayah.required' => 'Nama Ayah harus diisi.',
                'no_telpon_ayah.required' => 'Nomor Telepon Ayah harus diisi.',
                'alamat.required' => 'Alamat harus diisi.',
                'no_kartu_keluarga.required' => 'Nomor Kartu Keluarga harus diisi.',
                'nik_orang_tua.required' => 'NIK Orang Tua harus diisi.',
                'email.required' => 'Email harus diisi.',
                'email.email' => 'Email tidak valid.',
                'email.unique' => 'Email sudah digunakan.',
            ];
    
            $request->validate($rules, $messages);

            $role_id = 5;
            $password = $this->generateRandomString();
        }else{
            // $request->validate([
            //     'name' => 'required|string|max:255',
            //     // 'status_sekolah' => 'required',
            //     // 'provinsi' => 'required',
            //     // 'kabupaten_kota' => 'required',
            //     'kecamatan' => 'required',
            //     'alamat' => 'required',
            //     'no_telpon' => 'required',
            //     'sk_pendirian_sekolah' => 'required',
            //     'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            //     'password' => ['required', 'confirmed', Rules\Password::defaults()],
            // ]);

            $rules = [
                'name' => ['required', 'string', 'max:255'],
                'status_sekolah' => ['required'],
                // 'provinsi' => ['required'],
                // 'kabupaten_kota' => ['required'],
                'kecamatan' => ['required'],
                'alamat' => ['required'],
                'no_telpon' => ['required'],
                'sk_pendirian_sekolah' => ['required'],
                'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
                'password' => ['required', 'min:8', 'confirmed', Rules\Password::defaults()],
                'password_confirmation' => ['required', 'min:8'],
            ];
    
            // Custom validation messages
            $messages = [
                'name.required' => 'Nama Sekolah harus diisi.',
                'status_sekolah.required' => 'Status Sekolah harus diisi.',
                // 'provinsi.required' => 'Provinsi harus diisi.',
                // 'kabupaten_kota.required' => 'Kabupaten/Kota harus diisi.',
                'kecamatan.required' => 'Kecamatan harus diisi.',
                'alamat.required' => 'Alamat harus diisi.',
                'no_telpon.required' => 'Nomor Telepon harus diisi.',
                'sk_pendirian_sekolah.required' => 'SK Pendirian Sekolah harus diisi.',
                'email.required' => 'Email harus diisi.',
                'email.email' => 'Email tidak valid.',
                'email.unique' => 'Email sudah digunakan.',
                'password.required' => 'Kata Sandi harus diisi.',
                'password.min' => 'Kata Sandi minimal 8 karakter.',
                'password.confirmed' => 'Konfirmasi Kata Sandi tidak sama.',
                'password_confirmation.required' => 'Konfirmasi Kata Sandi harus diisi.',
                'password_confirmation.min' => 'Konfirmasi Kata Sandi minimal 8 karakter.',
            ];
    
            $request->validate($rules, $messages);

            $role_id = 3;
            $password = $request->password;
        }
        $kode_registrasi = rand(1000000000, mt_getrandmax());

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($password),
            'status' => 1,
            'confirmed' => 0,
            'verified' => 0,
            'role_id' => $role_id,
            'deleted' => 0,
        ]);

        event(new Registered($user));

        if ($user) {
            $current = User::where('email', '=', $request->email);

            if($request->id_sekolah){
                $id_tahun_ajaran = DB::table('tahun_ajaran')
                ->where('periode_aktif', '=', 1)
                ->first()->id;

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

                //siswa
                $datasiswa = array(
                    'id_tahun_ajaran' => $id_tahun_ajaran,
                    'tanggal_masuk' => date('Y-m-d'),
                    'id_sekolah' => ($request->id_sekolah),//base64_decode
                    'nama_lengkap' => $request->name,
                    // 'nama_panggilan' => $request->nama_panggilan,
                    // 'no_induk' => $request->no_induk,
                    // 'nisn' => $request->nisn,
                    'id_user' => $current->orderby('created_at', 'DESC')->first()->id,
                    'jenis_kelamin' => $request->jenis_kelamin,
                    'id_agama' => $request->agama,
                    'tempat_lahir' => $request->tempat_lahir,
                    'tanggal_lahir' => $request->tanggal_lahir,
                    // 'hobi' => $request->hobi,
                    // 'anak_ke' => $request->anak_ke,

                    'nama_ayah' => $request->nama_ayah,
                    // 'pekerjaan_ayah' => $request->pekerjaan_ayah,
                    'no_telpon_ayah' => $request->no_telpon_ayah,
                    // 'nama_ibu' => $request->nama_ibu,
                    // 'pekerjaan_ibu' => $request->pekerjaan_ibu,
                    // 'no_telpon_ibu' => $request->no_telpon_ibu,
                    // 'nama_wali' => $request->nama_wali,
                    // 'pekerjaan_wali' => $request->pekerjaan_wali,
                    // 'no_telpon_wali' => $request->no_telpon_wali,

                    'alamat' => $request->alamat,
                    'email_orang_tua' => $request->email,
                    // 'id_jenis_keluar' => $request->id_jenis_keluar,
                    // 'tanggal_keluar' => $request->tanggal_keluar,
                    // 'catatan_keluar' => $request->catatan_keluar,
                    
                    // 'foto' => $foto,
                    'kartu_keluarga' => $kartu_keluarga,
                    'akta_kelahiran' => $akta_kelahiran,
                    'no_kartu_keluarga' => $request->no_kartu_keluarga,
                    'nik_orang_tua' => $request->nik_orang_tua,
                    'password_default' => $password,

                    // 'user_id' => $user_id,
                    // 'role_id' => $role_id,
                    'created_at' => date('Y-m-d H:i:s'),
                );
                Siswa::create($datasiswa);
            }else{
                //sekolah
                $datasekolah = array(
                    'slug' => ($request->npsn) ? $request->npsn : $kode_registrasi,
                    'id_user' => $current->orderby('created_at', 'DESC')->first()->id,
                    'nama' => $request->name,
                    'status_sekolah' => $request->status_sekolah,
                    'npsn' => $request->npsn,
                    'alamat' => $request->alamat,
                    'kode_wilayah' => $request->kecamatan,
                    'no_telpon' => $request->no_telpon,
                    // 'fax' => $request->fax,
                    'email' => $request->email,
                    // 'website' => $request->website,
                    'sk_pendirian_sekolah' => $request->sk_pendirian_sekolah,
                    'kode_registrasi' => $kode_registrasi,
                    'created_at' => date('Y-m-d H:i:s'),
                );
                Sekolah::create($datasekolah);

                $user_kepala_sekolah = User::create([
                    'name' => 'Kepala Sekolah '.$request->name,
                    'email' => $kode_registrasi.'@email.com',
                    'password' => Hash::make($request->password),
                    'status' => 1,
                    'confirmed' => 0,
                    'verified' => 0,
                    'role_id' => 6,
                    'deleted' => 0,
                ]);
                $current_kepala_sekolah = User::where('email', '=', $kode_registrasi.'@email.com');
                $current_sekolah = Sekolah::where('email', '=', $request->email);
                $semester = DB::table('semester')->where('periode_aktif', '=', '1')->first();
            
                DB::table('kepala_sekolah')
                    ->where('id_sekolah', '=', $current_sekolah->orderby('created_at', 'DESC')->first()->id)
                    ->where('id_semester', '=', 0)
                    ->insert(array(
                        'id_user' => $current_kepala_sekolah->orderby('created_at', 'DESC')->first()->id,
                        'nama' => '', 
                        'id_sekolah' => $current_sekolah->orderby('created_at', 'DESC')->first()->id, 
                        'id_semester' => $semester->id,
                        'role_id' => 0,
                        'user_id' => 0,
                        'created_at' => date('Y-m-d H:i:s'),
                    ));

            }

            $mailData = [
                'title' => 'Selamat, Registrasi Berhasil',
                'body' => 'Registrasi akun Anda pada SimPaud sudah berhasil. Untuk dapat menggunakan layanan di SimPaud, silakan aktivasi email Anda dengan klik tombol di bawah ini',
                'footer' => 'Email ini dikirim secara otomatis melalui sistem SimPaud.',
                // 'enkripsi' => Crypt::encryptString($request->email."-".$kode_registrasi."-".$role_id),
                'enkripsi' => base64_encode($request->email."-".$kode_registrasi."-".$role_id),
                'base_url' => env('APP_URL')
            ];
            Mail::to($request->email)->send(new EmailKonfirmasi($mailData));
            
        }

        // Auth::login($user);

        // return redirect(RouteServiceProvider::HOME);
        // return Inertia::render('Auth/Registrasi_Status', 
        // [
        //     'status' => 'Berhasil',
        //     'message' => 'Registrasi akun Anda pada SimPaud sudah berhasil. Untuk dapat menggunakan layanan di SimPaud, silakan aktivasi email Anda.'
        // ]);

        return redirect('/registrasi-status');

        // if($request->id_sekolah){
        //     return redirect('/registrasi/siswa/'.$request->id_sekolah)->with('message', 'New siswa is added successfully.');
        // }else{
        //     return redirect()->route('registrasi')->with('message', 'New sekolah is added successfully.');
        // }
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
