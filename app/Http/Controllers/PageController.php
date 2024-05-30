<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Agama;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Http\JsonResponse;
use Mail;
use App\Mail\EmailKontak;
use Inertia\Inertia;
use Inertia\Response;

use Input;
use Auth;
use Session;
use Validator;

class PageController extends Controller
{

    public function home()
    {
        return Inertia::render('Homes/Home');
    }

    // public function tentang()
    // {
    //     return Inertia::render('Front/Tentang');
    // }

    // public function fitur()
    // {
    //     return Inertia::render('Front/Fitur');
    // }

    // public function testimonial()
    // {
    //     return Inertia::render('Front/Testimonial');
    // }

    // public function cara_registrasi()
    // {
    //     return Inertia::render('Front/Cara_Registrasi');
    // }

    // public function login()
    // {
    //     return Inertia::render('Auth/Login');
    // }

    public function registrasi()
    {
        if (Auth::check()) {
            return redirect()->route('dashboard');
        } else {
            // return Inertia::render('Front/Registrasi');
            return Inertia::render('Auth/Register');
        }
    }

    public function registrasi_siswa($slug)
    {
        $agama = Agama::get();

        $cek_sekolah = DB::table('sekolah')
        ->whereslug($slug)->count();

        if($cek_sekolah > 0){
            $sekolah = DB::table('sekolah')
            ->select('sekolah.*', 'prov.nama AS provinsi','kotakab.nama AS kotakab','kec.nama AS kecamatan')
            ->leftjoin('wilayah AS prov','prov.kode_wilayah','=',DB::raw("CONCAT(LEFT(sekolah.kode_wilayah,2),'0000')"))
            ->leftjoin('wilayah AS kotakab','kotakab.kode_wilayah','=',DB::raw("CONCAT(LEFT(sekolah.kode_wilayah,4),'00')"))
            ->leftjoin('wilayah AS kec','kec.kode_wilayah','=','sekolah.kode_wilayah')
            ->whereslug($slug)->first();

            $cek_pendaftaran = DB::table('pendaftaran')
                ->where('id_sekolah','=',$sekolah->id)
                ->count();

            if($cek_pendaftaran > 0){
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

                $pendaftaran = DB::table('pendaftaran')
                ->where('id_sekolah','=',$sekolah->id)
                ->where('status','=',1)
                ->first();

                if($pendaftaran){
                    $tanggal_selesai = date('Y-m-d', strtotime($pendaftaran->tanggal_selesai));
                    $tanggal_mulai = date('Y-m-d', strtotime($pendaftaran->tanggal_mulai));

                    if (date("Y-m-d") < $tanggal_mulai) { // belum dimulai
                        $formpendaftaran = 1;
                    // } elseif ((time() >= strtotime($tanggal_selesai))) { // selesai
                    } elseif (date("Y-m-d") > $tanggal_selesai) { // selesai
                        $formpendaftaran = 2;
                    } else {
                        $formpendaftaran = 0;
                    }
                    $tanggal_pendaftaran = date('d', strtotime($pendaftaran->tanggal_mulai)).' '.$nama_bulan[str_replace('0', '', date('m', strtotime($pendaftaran->tanggal_mulai)))].' '.date('Y', strtotime($pendaftaran->tanggal_mulai)).' s/d '.date('d', strtotime($pendaftaran->tanggal_selesai)).' '.$nama_bulan[str_replace('0', '', date('m', strtotime($pendaftaran->tanggal_selesai)))].' '.date('Y', strtotime($pendaftaran->tanggal_selesai));

                }else{
                    $tanggal_pendaftaran = '';
                    $formpendaftaran = '3';
                }
            }else{
                $pendaftaran = '';
                $tanggal_pendaftaran = '';
                $formpendaftaran = '3';
            }
        }else{
            $sekolah = '';
            $pendaftaran = '';
            $tanggal_pendaftaran = '';
            $formpendaftaran = '4';
        }

        

        // if (Auth::check()) {
        //     return redirect()->route('dashboard');
        // } else {
            // return Inertia::render('Front/Registrasi_Siswa');
            return Inertia::render('Auth/RegisterSiswa', 
            [
                'sekolah' => $sekolah,
                'pendaftaran' => $pendaftaran,
                'tanggal_pendaftaran' => $tanggal_pendaftaran,
                'formpendaftaran' => $formpendaftaran,
                'agama' => $agama
            ]);
        // }
    }

    public function registrasi_status()
    {
        return Inertia::render('Auth/Register_Status');
    }

    // public function kontak()
    // {
    //     return Inertia::render('Front/Kontak');
    // }

    public function getProvinceList()
    {
        $province = DB::table("wilayah")
                    ->select("nama","kode_wilayah")
                    ->where("parent_kode_wilayah","000000")
                    ->get();
        return response()->json($province);
    }

    public function getCityList($kode_wilayah)
    {
        $city = DB::table("wilayah")
                    ->where("parent_kode_wilayah",$kode_wilayah)
                    ->select("nama","kode_wilayah")
                    ->get();
        return response()->json($city);
    }
    
    public function getDistrictList($kode_wilayah)
    {
        $district = DB::table("wilayah")
                    ->where("parent_kode_wilayah",$kode_wilayah)
                    ->select("nama","kode_wilayah")
                    ->get();
        return response()->json($district);
    }

    public function actionlogin(Request $request){
        // validate the info, create rules for the inputs
        // $rules = array(
        //     'email' => 'required', // make sure the email is an actual email
        //     'password' => 'required',
        // );

        $rules = [
            'email' => ['required', 'email'],
            'password' => ['required'],//, 'min:8'
        ];

        $messages = [
            'email.required' => 'Email harus diisi.',
            'email.email' => 'Email tidak valid.',
            'password.required' => 'Kata Sandi harus diisi.',
            //'password.min' => 'Kata Sandi minimal 8 karakter.',
        ];

        $request->validate($rules, $messages);

        // $request->validate([
        //     'email' => 'required',
        //     'password' => 'required',
        // ]);

        // run the validation rules on the inputs from the form
        // $validator = Validator::make(Input::all(), $rules);

        // if ($validator->fails()) {
            
        // } else {
            // create our user data for the authentication
            $userdata = array(
                'email' => $request->email,
                'password' => $request->password,
            );

            // attempt to do the login
            if (Auth::attempt($userdata)) {

                if (Auth::user()->status == 0) {
                    Auth::logout();
                    Session::flush();
                    return redirect()->route('login')->with('message', 'Akun anda dinonaktifkan oleh Admin SimPaud, silahkan hubungi Admin SimPaud untuk dapat mengaktifkan kembali akun Anda.');
                }

                if (Auth::user()->deleted_at != '' && Auth::user()->deleted == 1) {
                    Auth::logout();
                    Session::flush();
                    return redirect()->route('login')->with('message', 'Akun anda dinonaktifkan oleh Admin SimPaud, silahkan hubungi Admin SimPaud untuk dapat mengaktifkan kembali akun Anda.');
                }

                if ((Auth::user()->role_id != 1 && Auth::user()->role_id != 2) && Auth::user()->confirmed == 0) {
                    Auth::logout();
                    Session::flush();
                    return redirect()->route('login')->with('message', 'Akun anda belum dikonfirmasi, sikahkan buka email yang telah kami kirimkan ke akun Email Anda, kemudian klik tombol aktivasi.');
                }

                $role = DB::table('roles')->where('id', '=', Auth::user()->role_id)->first()->name;

                if(Auth::user()->role_id == 3 || Auth::user()->role_id == 4 || Auth::user()->role_id == 5 || Auth::user()->role_id == 6){
                    if (Auth::user()->role_id == 3){ //admin sekolah
                        $sekolah = DB::table('sekolah')->where('id_user', '=', Auth::user()->id)->first();
                        Session::put('id_sekolah', $sekolah->id);
                    }else if (Auth::user()->role_id == 6){ //kepala sekolah
                        $kepala_sekolah = DB::table('kepala_sekolah')->where('id_user', '=', Auth::user()->id)->first();
                        $sekolah = DB::table('sekolah')->where('id', '=', $kepala_sekolah->id_sekolah)->first();
                        Session::put('id_sekolah', $sekolah->id);
                    }else if(Auth::user()->role_id == 4){ // guru
                        $guru = DB::table('guru')->where('id_user', '=', Auth::user()->id)->first();
                        $sekolah = DB::table('sekolah')->where('id', '=', $guru->id_sekolah)->first();
                        Session::put('id_sekolah', $guru->id_sekolah);
                        Session::put('id_guru', $guru->id);
                    }else if(Auth::user()->role_id == 5){ // siswa
                        $siswa = DB::table('siswa')->where('id_user', '=', Auth::user()->id)->first();
                        $sekolah = DB::table('sekolah')->where('id', '=', $siswa->id_sekolah)->first();
                        Session::put('id_sekolah', $siswa->id_sekolah);
                        Session::put('id_siswa', $siswa->id);
                    }
                    Session::put('npsn', $sekolah->npsn);
                    Session::put('email_sekolah', $sekolah->email);
                }

                Session::put('role_id', Auth::user()->role_id);
                Session::put('role', $role);
                Session::put('user_id', Auth::user()->id);
                Session::put('user_name', Auth::user()->username);
                Session::put('name', Auth::user()->name);

                $tahun_ajaran = DB::table('tahun_ajaran')->where('periode_aktif', '=', '1')->first();
                $semester = DB::table('semester')->where('periode_aktif', '=', '1')->first();

                Session::put('id_semester', $semester->id);
                Session::put('semester_mulai', $semester->tanggal_mulai);
                Session::put('semester_selesai', $semester->tanggal_selesai);
                Session::put('id_tahun_ajaran', $tahun_ajaran->id);
                Session::put('tahun_ajaran_mulai', $tahun_ajaran->tanggal_mulai);
                Session::put('tahun_ajaran_selesai', $tahun_ajaran->tanggal_selesai);

                // Login log
                // $login_log = array(
                //     'id_user' => Auth::user()->id,
                //     'login_time' => date('Y-m-d H:i:s'),
                //     'ip' => Request::ip(),
                //     'browser' => $_SERVER['HTTP_USER_AGENT'],
                // );
                // $log = DB::table('login_log')->insert($login_log);
                // Login log

                if (Auth::user()->id) {
                    return redirect()->route('dashboard');
                } else {
                    Auth::logout();
                    Session::flush();
                    return redirect()->route('login')->with('message', 'Email atau Kata sandi yang Anda masukkan tidak sesuai');
                }
            } else {
                return redirect()->route('login')->with('message', 'Email atau Kata sandi yang Anda masukkan tidak sesuai');
            }
        // }
    }

    public function konfirmasi_akun($enkripsi){
        // $kode = Crypt::decrypt($enkripsi);
        $kode = base64_decode($enkripsi);
        $data = explode('-', $kode);
        $email = $data[0];
        $kode_registrasi = $data[1];
        $role_id = $data[2];

        if($role_id == 5){
            $cek = DB::table('siswa')
                ->select('siswa.*','users.role_id','users.name')
                ->join('users', 'users.id', '=', 'siswa.id_user')
                ->where('siswa.email_orang_tua', '=', $email)
                ->first();
        }else{
            $cek = DB::table('sekolah')
                ->select('sekolah.*','users.role_id','users.name')
                ->join('users', 'users.id', '=', 'sekolah.id_user')
                ->where('sekolah.email', '=', $email)
                ->where('sekolah.kode_registrasi', '=', $kode_registrasi)
                ->first();
        }

        if ($cek) {
            $confirm = DB::table('users')->where('email', '=', $email)->update(array('confirmed' => 1, 'confirmed_at' => date('Y-m-d H:i:s')));

            if ($confirm) {
                return Inertia::render('Auth/Konfirmasi_Status', 
                [
                    'status' => 'Berhasil',
                    'message' => 'Email anda telah terkonfirmasi, selanjutnya data registrasi akan diperiksa oleh Admin SimPaud, kami akan mengirim pesan pemberitahuan ke email anda setelah data registrasi anda diverifikasi oleh Admin.'
                ]);
            } else {
                return Inertia::render('Auth/Konfirmasi_Status', 
                [
                    'status' => 'Gagal',
                    'message' => 'Email anda gagal terkonfirmasi.'
                ]);
            }
        } else {
            return Inertia::render('Auth/Konfirmasi_Status', 
            [
                'status' => 'Gagal',
                'message' => 'Email anda gagal terkonfirmasi.'
            ]);
        }
    }

    public function kirim_kontak(Request $request){
        
        // $request->validate([
        //     'name' => 'required',
        //     'email' => 'required',
        //     'phone' => 'required',
        //     'subject' => 'required',
        //     'message' => 'required',
        // ]);

        $rules = [
            'phone' => ['required'],
            'subject' => ['required'],
            'message' => ['required'],
            'email' => ['required', 'email'],
            'name' => ['required', 'string', 'max:250'],
        ];

        $messages = [
            'phone.required' => 'Nomor Telepon harus diisi.',
            'subject.required' => 'Subyek harus diisi.',
            'message.required' => 'Pesan harus diisi.',
            'email.required' => 'Email harus diisi.',
            'email.email' => 'Email tidak valid.',
            'name.required' => 'Nama harus diisi.',
        ];

        $request->validate($rules, $messages);

        $mailData = [
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'subject' => $request->subject,
            'message' => $request->message,
            'base_url' => env('APP_URL'),
        ];
        $emailto = 'miftahul.ulum@kokek.com';
        $kirim = Mail::to($emailto)->send(new EmailKontak($mailData));
        if($kirim){
            return redirect()->back()->with('message', 'Pesan berhasil terkirim');
        }else{
            return redirect()->back()->with('message', 'Pesan gagal terkirim');
        }

    }

    // public function delete($module, $id)
    // {
    //     $hapus = DB::table($module)->where('id', $id)->delete();
    //     return redirect()->back(); 
    // }

}
