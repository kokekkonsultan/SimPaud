<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\SekolahController;
use App\Http\Controllers\GuruController;
use App\Http\Controllers\SiswaController;

use App\Http\Controllers\KelompokController;
use App\Http\Controllers\DimensiController;
use App\Http\Controllers\ElemenController;
use App\Http\Controllers\IndikatorController;

use App\Http\Controllers\PageController;
use App\Http\Controllers\GuruPengampuController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KepalaSekolahController;

use App\Http\Controllers\JasmaniKesehatanController;
use App\Http\Controllers\IndikatorPenilaianHarianController;
use App\Http\Controllers\PenilaianHarianController;
use App\Http\Controllers\LaporanHarianController;
use App\Http\Controllers\LaporanMingguanController;
use App\Http\Controllers\LaporanBulananController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PendaftaranController;

use App\Http\Controllers\RaporSiswaController;
use App\Http\Controllers\SttbController;
use App\Http\Controllers\SettingRaporSiswaController;
use App\Http\Controllers\SettingSttbController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::get('/', function(){
//     return Inertia::render('Home');
// });
Route::get('/', [PageController::class, 'home'])->name('home');

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::resource('sekolah', SekolahController::class);
    Route::resource('guru', GuruController::class);
    Route::get('/guru/status/{id_user}/{status}', [GuruController::class, 'status_guru'])->name('status-guru');
    Route::resource('siswa', SiswaController::class);

    Route::resource('kelompok', KelompokController::class);
    Route::resource('dimensi', DimensiController::class);
    Route::resource('elemen', ElemenController::class);
    Route::resource('indikator', IndikatorController::class);
    Route::get('/indikator/hapus-indikator/{id}', [IndikatorController::class, 'hapus_indikator'])->name('hapus-indikator');
    // Route::get('/indikator2', [IndikatorController::class, 'index2'])->name('index2');

    Route::resource('kepala-sekolah', KepalaSekolahController::class);
    Route::resource('pendaftaran', PendaftaranController::class);
    Route::get('/link-pendaftaran', [PendaftaranController::class, 'link_pendaftaran'])->name('link-pendaftaran');
    Route::get('/pendaftaran/status/{id}', [PendaftaranController::class, 'status_pendaftaran'])->name('status-pendaftaran');
    Route::get('/scan-barcode/{template}', [PendaftaranController::class, 'scan_barcode'])->name('scan-barcode');

    Route::resource('roles', RoleController::class);
    Route::get('/roles/pilih-permission/{id_role}/{id_permission}', [RoleController::class, 'pilih_permission'])->name('pilih-permission');

    Route::resource('rapor-siswa', RaporSiswaController::class);
    Route::get('/rapor-siswa/{id}', [RaporSiswaController::class, 'show'])->name('rapor-siswa');
    Route::get('/rapor-siswa/jasmani-kesehatan/{id}/{status}', [RaporSiswaController::class, 'jasmani_kesehatan'])->name('jasmani-kesehatan-status');
    Route::get('/rapor-siswa/status-rapor/{id}/{status}', [RaporSiswaController::class, 'status_rapor'])->name('status-rapor');
    Route::get('/rapor-siswa/lihat/{id}', [RaporSiswaController::class, 'lihat_rapor'])->name('lihat-rapor');
    Route::get('/rapor-siswa/hapus-narasi-pendahuluan-foto/{id_rapor_siswa}/{id}', [RaporSiswaController::class, 'hapus_narasi_pendahuluan_foto'])->name('hapus-narasi-pendahuluan-foto');
    Route::get('/rapor-siswa/hapus-narasi-dimensi-foto/{id_rapor_siswa}/{id}', [RaporSiswaController::class, 'hapus_narasi_dimensi_foto'])->name('hapus-narasi-dimensi-foto');

    Route::resource('sttb', SttbController::class);
    Route::get('/sttb/{id}', [SttbController::class, 'sttb'])->name('sttb');
    Route::resource('setting-rapor-siswa', SettingRaporSiswaController::class);
    Route::resource('setting-sttb', SettingSttbController::class);
    // Route::get('/sttb/lihat/{id}', [SttbController::class, 'lihat_sttb'])->name('lihat-sttb');
    Route::get('/sttb/lihat/{id}', [SttbController::class, 'lihat_sttb'])->name('lihat-sttb');

    Route::resource('jasmani-kesehatan', JasmaniKesehatanController::class);
    Route::get('/jasmani-kesehatan/{id}', [JasmaniKesehatanController::class, 'jasmani_kesehatan'])->name('jasmani-kesehatan');
    // Route::get('/jasmani-kesehatan/{id_kelompok_siswa}/{bulan_ke}/{id_semester}', [JasmaniKesehatanController::class, 'jasmani_kesehatan'])->name('jasmani-kesehatan');
    Route::post('/jasmani-kesehatan-edit/{id_kelompok_siswa}', [JasmaniKesehatanController::class, 'jasmani_kesehatan_update'])->name('jasmani-kesehatan-edit.update');

    Route::resource('penilaian-harian', PenilaianHarianController::class);
    // Route::get('/penilaian-harian/{id}', [PenilaianHarianController::class, 'penilaian_harian'])->name('penilaian-harian');
    // Route::post('/penilaian-harian-edit/{id_kelompok_siswa}', [PenilaianHarianController::class, 'penilaian_harian_update'])->name('penilaian-harian-edit.update');

    Route::resource('indikator-penilaian-harian', IndikatorPenilaianHarianController::class);
    Route::get('/indikator-penilaian-harian/{id}', [IndikatorPenilaianHarianController::class, 'indikator_penilaian_harian'])->name('indikator-penilaian-harian');
    Route::post('/indikator-penilaian-harian-edit/{id_kelompok}', [IndikatorPenilaianHarianController::class, 'indikator_penilaian_harian_update'])->name('indikator-penilaian-harian-edit.update');
    Route::get('/indikator-penilaian-harian-delete/{id_kelompok}/{tanggal_penilaian}', [IndikatorPenilaianHarianController::class, 'destroy'])->name('indikator-penilaian-harian-delete.destroy');
    Route::get('/indikator-penilaian-harian/pilih-indikator/{id_kelompok}/{tanggal_penilaian}/{id_indikator}/{status}/{id_setting}', [IndikatorPenilaianHarianController::class, 'pilih_indikator'])->name('pilih-indikator');

    Route::resource('laporan-harian', LaporanHarianController::class);
    Route::get('/laporan-harian/{id}', [LaporanHarianController::class, 'laporan_harian'])->name('laporan-harian');
    Route::get('/laporan-harian/lihat/{id}', [LaporanHarianController::class, 'lihat_laporan'])->name('lihat-laporan-harian');

    Route::resource('laporan-mingguan', LaporanMingguanController::class);
    Route::get('/laporan-mingguan/lihat/{id}', [LaporanMingguanController::class, 'lihat_laporan'])->name('lihat-laporan-mingguan');

    Route::resource('laporan-bulanan', LaporanBulananController::class);
    Route::get('/laporan-bulanan/lihat/{id}', [LaporanBulananController::class, 'lihat_laporan'])->name('lihat-laporan-bulanan');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/profil-sekolah', [SekolahController::class, 'profil_sekolah'])->name('profil-sekolah');
    Route::put('/profil-sekolah', [SekolahController::class, 'profil_sekolah_update'])->name('profil-sekolah.update');
    // Route::post('/profil-sekolah/{id}', [SekolahController::class, 'profil_sekolah_update'])->name('profil-sekolah.update');
    Route::post('/sekolah/{id}', [SekolahController::class, 'update'])->name('sekolah.update');
    Route::post('/siswa/{id}', [SiswaController::class, 'update'])->name('siswa.update');
    Route::post('/kepala-sekolah/{id}', [KepalaSekolahController::class, 'update'])->name('kepala-sekolah.update');
    Route::get('/verval-sekolah', [SekolahController::class, 'verifikasi_validasi'])->name('verval-sekolah');
    Route::post('/setting-rapor-siswa/{id}', [SettingRaporSiswaController::class, 'update'])->name('setting-rapor-siswa.update');

    Route::get('/profil-guru', [GuruController::class, 'profil_guru'])->name('profil-guru');
    Route::put('/profil-guru', [GuruController::class, 'profil_guru_update'])->name('profil-guru.update');

    Route::get('/profil-siswa', [SiswaController::class, 'profil_siswa'])->name('profil-siswa');
    Route::put('/profil-siswa', [SiswaController::class, 'profil_siswa_update'])->name('profil-siswa.update');

    Route::get('/profil-kepala-sekolah', [KepalaSekolahController::class, 'profil_kepala_sekolah'])->name('profil-kepala-sekolah');
    Route::put('/profil-kepala-sekolah', [KepalaSekolahController::class, 'profil_kepala_sekolah_update'])->name('profil-kepala-sekolah.update');

    Route::get('/siswa/keluar/{id}', [SiswaController::class, 'siswa_keluar'])->name('siswa-keluar');
    Route::put('/siswa/keluar/{id}', [SiswaController::class, 'siswa_keluar_update'])->name('siswa-keluar.update');
    Route::get('/verval-siswa', [SiswaController::class, 'verifikasi_validasi'])->name('verval-siswa');

    Route::get('/kelompok/siswa/{id}', [KelompokController::class, 'kelompok_siswa'])->name('kelompok-siswa');
    Route::get('/kelompok/siswa/masuk/{id}/{id_siswa}/{id_semester}', [KelompokController::class, 'kelompok_siswa_masuk'])->name('kelompok-siswa-masuk');
    Route::get('/kelompok/siswa/keluar/{id}/{id_siswa}/{id_semester}', [KelompokController::class, 'kelompok_siswa_keluar'])->name('kelompok-siswa-keluar');

    Route::get('/guru-pengampu', [GuruPengampuController::class, 'index'])->name('guru-pengampu.index');
    Route::get('/guru-pengampu/kelompok/{id}', [GuruPengampuController::class, 'kelompok_guru'])->name('kelompok-guru');
    Route::get('/guru-pengampu/kelompok/masuk/{id}/{id_kelompok}', [GuruPengampuController::class, 'kelompok_guru_masuk'])->name('kelompok-guru-masuk');
    Route::get('/guru-pengampu/kelompok/keluar/{id}/{id_kelompok}', [GuruPengampuController::class, 'kelompok_guru_keluar'])->name('kelompok-guru-keluar');

    Route::get('/sekolah/verifikasi/{id_user}', [SekolahController::class, 'verifikasi_sekolah'])->name('verifikasi-sekolah');
    Route::get('/sekolah/status/{id_user}/{status}', [SekolahController::class, 'status_sekolah'])->name('status-sekolah');
    
    Route::get('/siswa/verifikasi/{id_user}', [SiswaController::class, 'verifikasi_siswa'])->name('verifikasi-siswa');
    Route::get('/siswa/status/{id_user}/{status}', [SiswaController::class, 'status_siswa'])->name('status-siswa');

    Route::get('/setting-sttb/status/{id}/{status}', [SettingSttbController::class, 'status_template'])->name('status-template');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/datadimensi', [IndikatorController::class, 'getDimensiList'])->name('datadimensi');
    Route::get('/dataelemen/{id_dimensi}', [IndikatorController::class, 'getElemenList'])->name('dataelemen');

    Route::get('/datasiswa/{id}', [SiswaController::class, 'getSiswa'])->name('datasiswa');
    Route::get('/datasekolah/{id}', [SekolahController::class, 'getSekolah'])->name('datasekolah');
});

// Route::get('/tentang-kurikulum-merdeka', [PageController::class, 'tentang'])->name('tentang-kurikulum-merdeka');
// Route::get('/fitur', [PageController::class, 'fitur'])->name('fitur');
// Route::get('/testimonial', [PageController::class, 'testimonial'])->name('testimonial');
// Route::get('/cara-registrasi', [PageController::class, 'cara_registrasi'])->name('cara-registrasi');
// Route::get('/kontak', [PageController::class, 'kontak'])->name('kontak');
Route::get('/login', [PageController::class, 'login'])->name('login');

Route::get('/registrasi', [PageController::class, 'registrasi'])->name('registrasi');
Route::get('/registrasi/sekolah/{slug}', [PageController::class, 'registrasi_siswa'])->name('registrasi-siswa');
Route::get('/konfirmasi-akun/{enkripsi}', [PageController::class, 'konfirmasi_akun'])->name('konfirmasi-akun');
Route::get('/konfirmasi-status', [PageController::class, 'konfirmasi_status'])->name('konfirmasi-status');
Route::get('/registrasi-status', [PageController::class, 'registrasi_status'])->name('registrasi-status');

Route::get('/dataprovinsi', [PageController::class, 'getProvinceList'])->name('dataprovinsi');
Route::get('/datakota/{kode_wilayah}', [PageController::class, 'getCityList'])->name('datakota');
Route::get('/datakecamatan/{kode_wilayah}', [PageController::class, 'getDistrictList'])->name('datakecamatan');

Route::post('/actionlogin', [PageController::class, 'actionlogin'])->name('actionlogin');
Route::post('/kirim-kontak', [PageController::class, 'kirim_kontak'])->name('kirim-kontak');
Route::get('/404', function () {
    abort(404);
});

Route::any('/ckfinder/connector', '\CKSource\CKFinderBridge\Controller\CKFinderController@requestAction')
    ->name('ckfinder_connector');

Route::any('/ckfinder/browser', '\CKSource\CKFinderBridge\Controller\CKFinderController@browserAction')
    ->name('ckfinder_browser');

require __DIR__.'/auth.php';
