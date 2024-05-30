// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Create({ auth, tahun_ajaran, agama, jenis_keluar, data_tahun_ajaran }) {
  
    const { data, setData, errors, post } = useForm({
        id_tahun_ajaran: data_tahun_ajaran.id || "",
        tanggal_masuk: "",
        nama_lengkap: "",
        nama_panggilan: "",
        no_induk: "",
        nisn: "",
        jenis_kelamin: "",
        id_agama: "",
        tempat_lahir: "",
        tanggal_lahir: "",
        hobi: "",

        anak_ke: "",
        nama_ayah: "",
        pekerjaan_ayah: "",
        no_telpon_ayah: "",
        nama_ibu: "",
        pekerjaan_ibu: "",
        no_telpon_ibu: "",
        nama_wali: "",
        pekerjaan_wali: "",
        no_telpon_wali: "",

        alamat: "",
        email_orang_tua: "",
        id_jenis_keluar: "",
        tanggal_keluar: "",
        catatan_keluar: "",
        no_kartu_keluarga: "",
        nik_orang_tua: "",

        password: "",
        password_confirmation: "",
    });
  
    function handleSubmit(e) {
        e.preventDefault();
        Swal.fire({
            title: 'Simpan Data Peserta Didik?',
            type: 'warning',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oke',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                post(route("siswa.store"));
            }
        });
    }
  
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah Siswa</h2>}
        >
            <Head title="Siswa" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Tambah Data Peserta Didik</h1>
  
                            {/* <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
                                    href={ route("siswa.index") }
                                >
                                    Kembali
                                </Link>
                            </div> */}
  
                            <form name="createForm" onSubmit={handleSubmit}>
                                <div className="flex flex-col">
                                    <div className="mb-4">
                                        <label className="">Tahun Ajaran <span className='text-red-600'>*</span></label>
                                        <select name="id_tahun_ajaran" required defaultValue={data.id_tahun_ajaran} className="w-full px-4 py-2" onChange={(e) =>
                                                setData("id_tahun_ajaran", e.target.value)
                                            }>
                                            <option value="">-Pilih Tahun Ajaran-</option>
                                            {/* {tahun_ajaran.map(({ id, nama }) => (
                                                <option value={id}>{nama}</option>
                                            ))} */}
                                            {tahun_ajaran.map(({ id, nama, periode_aktif }) => {
                                                
                                                if (periode_aktif == 1){
                                                    return <option value={id} selected>{nama}</option>
                                                }

                                                return <option value={id}>{nama}</option>
                                            })}
                                        </select>
                                        <span className="text-red-600">
                                            {errors.id_tahun_ajaran}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Tanggal Masuk <span className='text-red-600'>*</span></label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-2"
                                            label="Tanggal Masuk"
                                            name="tanggal_masuk"
                                            required
                                            value={data.tanggal_masuk}
                                            onChange={(e) =>
                                                setData("tanggal_masuk", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.tanggal_masuk}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Nama Lengkap <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nama Lengkap"
                                            name="nama_lengkap"
                                            required
                                            value={data.nama_lengkap}
                                            onChange={(e) =>
                                                setData("nama_lengkap", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.nama_lengkap}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Nama Panggilan <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nama Panggilan"
                                            name="nama_panggilan"
                                            required
                                            value={data.nama_panggilan}
                                            onChange={(e) =>
                                                setData("nama_panggilan", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.nama_panggilan}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Nomor Induk <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nomor Induk"
                                            name="no_induk"
                                            required
                                            value={data.no_induk}
                                            onChange={(e) =>
                                                setData("no_induk", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.no_induk}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">NISN</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="NISN"
                                            name="nisn"
                                            value={data.nisn}
                                            onChange={(e) =>
                                                setData("nisn", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.nisn}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Jenis Kelamin <span className='text-red-600'>*</span></label>
                                        <select name="jenis_kelamin" required className="w-full px-4 py-2" onChange={(e) =>
                                                setData("jenis_kelamin", e.target.value)
                                            }>
                                            <option value="">-Pilih Jenis Kelamin-</option>
                                            <option value="L">Laki-laki</option>
                                            <option value="P">Perempuan</option>
                                        </select>
                                        <span className="text-red-600">
                                            {errors.jenis_kelamin}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Agama <span className='text-red-600'>*</span></label>
                                        <select name="id_agama" required className="w-full px-4 py-2" onChange={(e) =>
                                                setData("id_agama", e.target.value)
                                            }>
                                            <option value="">-Pilih Agama-</option>
                                            {agama.map(({ id, nama }) => (
                                                <option value={id}>{nama}</option>
                                            ))}
                                        </select>
                                        <span className="text-red-600">
                                            {errors.id_agama}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Tempat Lahir <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Tempat Lahir"
                                            name="tempat_lahir"
                                            required
                                            value={data.tempat_lahir}
                                            onChange={(e) =>
                                                setData("tempat_lahir", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.tempat_lahir}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Tanggal Lahir <span className='text-red-600'>*</span></label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-2"
                                            label="Tanggal Lahir"
                                            name="tanggal_lahir"
                                            required
                                            value={data.tanggal_lahir}
                                            onChange={(e) =>
                                                setData("tanggal_lahir", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.tanggal_lahir}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Hobi <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Hobi"
                                            name="hobi"
                                            required
                                            value={data.hobi}
                                            onChange={(e) =>
                                                setData("hobi", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.hobi}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Anak Ke <span className='text-red-600'>*</span></label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2"
                                            label="Anak Ke"
                                            name="anak_ke"
                                            required
                                            value={data.anak_ke}
                                            onChange={(e) =>
                                                setData("anak_ke", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.anak_ke}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Nama Ayah <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nama Ayah"
                                            name="nama_ayah"
                                            required
                                            value={data.nama_ayah}
                                            onChange={(e) =>
                                                setData("nama_ayah", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.nama_ayah}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Pekerjaan Ayah</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Pekerjaan Ayah"
                                            name="pekerjaan_ayah"
                                            value={data.pekerjaan_ayah}
                                            onChange={(e) =>
                                                setData("pekerjaan_ayah", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.pekerjaan_ayah}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Nomor Telepon Ayah <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nomor Telepon Ayah"
                                            name="no_telpon_ayah"
                                            required
                                            value={data.no_telpon_ayah}
                                            onChange={(e) =>
                                                setData("no_telpon_ayah", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.no_telpon_ayah}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Nama Ibu</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nama Ibu"
                                            name="nama_ibu"
                                            value={data.nama_ibu}
                                            onChange={(e) =>
                                                setData("nama_ibu", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.nama_ibu}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Pekerjaan Ibu</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Pekerjaan Ibu"
                                            name="pekerjaan_ibu"
                                            value={data.pekerjaan_ibu}
                                            onChange={(e) =>
                                                setData("pekerjaan_ibu", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.pekerjaan_ibu}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Nomor Telepon Ibu</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nomor Telepon Ibu"
                                            name="no_telpon_ibu"
                                            value={data.no_telpon_ibu}
                                            onChange={(e) =>
                                                setData("no_telpon_ibu", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.no_telpon_ibu}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Nama Wali</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nama Wali"
                                            name="nama_wali"
                                            value={data.nama_wali}
                                            onChange={(e) =>
                                                setData("nama_wali", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.nama_wali}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Pekerjaan Wali</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Pekerjaan Wali"
                                            name="pekerjaan_wali"
                                            value={data.pekerjaan_wali}
                                            onChange={(e) =>
                                                setData("pekerjaan_wali", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.pekerjaan_wali}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Nomor Telepon Wali</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nomor Telepon Wali"
                                            name="no_telpon_wali"
                                            value={data.no_telpon_wali}
                                            onChange={(e) =>
                                                setData("no_telpon_wali", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.no_telpon_wali}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Alamat <span className='text-red-600'>*</span></label>
                                        {/* <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Alamat"
                                            name="alamat"
                                            required
                                            value={data.alamat}
                                            onChange={(e) =>
                                                setData("alamat", e.target.value)
                                            }
                                        /> */}
                                        <textarea
                                            id="alamat"
                                            name="alamat"
                                            placeholder='Alamat'
                                            rows={5}
                                            className="w-full px-4 py-2"
                                            required
                                            value={data.alamat}
                                            onChange={(e) => setData('alamat', e.target.value)}
                                        />
                                        <span className="text-red-600">
                                            {errors.alamat}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Email Orang Tua / Wali <span className='text-red-600'>*</span></label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2"
                                            label="Email Orang Tua"
                                            name="email_orang_tua"
                                            required
                                            value={data.email_orang_tua}
                                            onChange={(e) =>
                                                setData("email_orang_tua", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.email_orang_tua}
                                        </span>
                                    </div>

                                    {/* <div className="mb-4">
                                        <label className="">Jenis Keluar</label>
                                        <select name="id_jenis_keluar" className="w-full px-4 py-2" onChange={(e) =>
                                                setData("id_jenis_keluar", e.target.value)
                                            }>
                                            <option value="">-Pilih Jenis Keluar-</option>
                                            {jenis_keluar.map(({ id, nama }) => (
                                                <option value={id}>{nama}</option>
                                            ))}
                                        </select>
                                        <span className="text-red-600">
                                            {errors.id_jenis_keluar}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Tanggal Keluar</label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-2"
                                            label="Tanggal Keluar"
                                            name="tanggal_keluar"
                                            value={data.tanggal_keluar}
                                            onChange={(e) =>
                                                setData("tanggal_keluar", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.tanggal_keluar}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Catatan Keluar</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Catatan Keluar"
                                            name="catatan_keluar"
                                            value={data.catatan_keluar}
                                            onChange={(e) =>
                                                setData("catatan_keluar", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.catatan_keluar}
                                        </span>
                                    </div> */}

                                    <div className="mb-4">
                                        <label className="">Nomor Kartu Keluarga <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nomor Kartu Keluarga"
                                            name="no_kartu_keluarga"
                                            required
                                            value={data.no_kartu_keluarga}
                                            onChange={(e) =>
                                                setData("no_kartu_keluarga", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.no_kartu_keluarga}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">NIK Orang Tua <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="NIK Orang Tua"
                                            name="nik_orang_tua"
                                            required
                                            value={data.nik_orang_tua}
                                            onChange={(e) =>
                                                setData("nik_orang_tua", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.nik_orang_tua}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Foto</label>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            className="w-full px-4 py-2"
                                            label="Foto"
                                            name="foto"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setData("foto", e.target.files[0])
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.foto}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Kartu Keluarga</label>
                                        <input
                                            id="file-upload-2"
                                            type="file"
                                            className="w-full px-4 py-2"
                                            label="Kartu Keluarga"
                                            name="kartu_keluarga"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setData("kartu_keluarga", e.target.files[0])
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.kartu_keluarga}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Akta Kelahiran</label>
                                        <input
                                            id="file-upload-3"
                                            type="file"
                                            className="w-full px-4 py-2"
                                            label="Akta Kelahiran"
                                            name="akta_kelahiran"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setData("akta_kelahiran", e.target.files[0])
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.akta_kelahiran}
                                        </span>
                                    </div>
                                    
                                    {/* <div className="mb-4">
                                        <label className="">Kata Sandi <span className='text-red-600'>*</span></label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2"
                                            label="Password"
                                            name="password"
                                            required
                                            value={data.password}
                                            onChange={(e) =>
                                                setData("password", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.password}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Konfirmasi Kata Sandi <span className='text-red-600'>*</span></label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2"
                                            label="Password Confirmation"
                                            name="password_confirmation"
                                            required
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData("password_confirmation", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.password_confirmation}
                                        </span>
                                    </div> */}
                                    
                                </div>
                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 text-white bg-green-500 rounded"
                                    >
                                        Simpan
                                    </button> <Link
                                            className="px-6 py-2 text-white bg-orange-500 rounded focus:outline-none"
                                            href={ route("siswa.index") }
                                        >
                                            Batalkan
                                        </Link>
                                </div>
                            </form>
  
                        </div>
                    </div>
                </div>
            {/* </div> */}
        </DashboardLayout>
    );
}
