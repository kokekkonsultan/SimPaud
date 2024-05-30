// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect } from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Edit({ auth, props, agama }) {
  
    const { siswa, errors } = usePage().props;
    // console.log(siswa.id_agama);

    const { data, setData, post } = useForm({
        // id_tahun_ajaran: siswa.id_tahun_ajaran || "",
        // tanggal_masuk: siswa.tanggal_masuk || "",
        nama_lengkap: siswa.nama_lengkap || "",
        nama_panggilan: siswa.nama_panggilan || "",
        no_induk: siswa.no_induk || "",
        nisn: siswa.nisn || "",
        jenis_kelamin: siswa.jenis_kelamin || "",
        id_agama: siswa.id_agama || "",
        tempat_lahir: siswa.tempat_lahir || "",
        tanggal_lahir: siswa.tanggal_lahir || "",
        hobi: siswa.hobi || "",

        anak_ke: siswa.anak_ke || "",
        nama_ayah: siswa.nama_ayah || "",
        pekerjaan_ayah: siswa.pekerjaan_ayah || "",
        no_telpon_ayah: siswa.no_telpon_ayah || "",
        nama_ibu: siswa.nama_ibu || "",
        pekerjaan_ibu: siswa.pekerjaan_ibu || "",
        no_telpon_ibu: siswa.no_telpon_ibu || "",
        nama_wali: siswa.nama_wali || "",
        pekerjaan_wali: siswa.pekerjaan_wali || "",
        no_telpon_wali: siswa.no_telpon_wali || "",

        alamat: siswa.alamat || "",
        email_orang_tua: siswa.email_orang_tua || "",
        // id_jenis_keluar: siswa.id_jenis_keluar || "",
        // tanggal_keluar: siswa.tanggal_keluar || "",
        // catatan_keluar: siswa.catatan_keluar || "",
        no_kartu_keluarga: siswa.no_kartu_keluarga || "",
        nik_orang_tua: siswa.nik_orang_tua || "",

        // foto: "/images/siswa/"+siswa.foto || "",
        foto: "",
        foto_lama: siswa.foto || "",
        // kartu_keluarga: "/images/siswa/"+siswa.kartu_keluarga || "",
        kartu_keluarga: "",
        kartu_keluarga_lama: siswa.kartu_keluarga || "",
        // akta_kelahiran: "/images/siswa/"+siswa.akta_kelahiran || "",
        akta_kelahiran: "",
        akta_kelahiran_lama: siswa.akta_kelahiran || "",
        _method: 'PUT'
    });

    const jenis_kelamin = [
        {id: "L", nama: "Laki-laki"}, 
        {id: "P", nama: "Perempuan"}
    ]

    // const [editTahunAjaran, setEditTahunAjaran] = useState(siswa.id_tahun_ajaran);
    // const [editTanggalMasuk, setEditTanggalMasuk] = useState(siswa.tanggal_masuk);
    const [editNamaLengkap, setEditNamaLengkap] = useState(siswa.nama_lengkap);
    const [editNamaPanggilan, setEditNamaPanggilan] = useState(siswa.nama_panggilan);
    const [editJenisKelamin, setEditJenisKelamin] = useState(siswa.jenis_kelamin);
    const [editNomerInduk, setEditNomerInduk] = useState(siswa.no_induk);
    const [editNISN, setEditNISN] = useState(siswa.nisn);
    const [editAgama, setEditAgama] = useState(siswa.id_agama);
    const [editTempatLahir, setEditTempatLahir] = useState(siswa.tempat_lahir);
    const [editTanggalLahir, setEditTanggalLahir] = useState(siswa.tanggal_lahir);
    const [editHobi, setEditHobi] = useState(siswa.hobi);

    const [editAnakKe, setEditAnakKe] = useState(siswa.anak_ke);
    const [editNamaAyah, setEditNamaAyah] = useState(siswa.nama_ayah);
    const [editPekerjaanAyah, setEditPekerjaanAyah] = useState(siswa.pekerjaan_ayah);
    const [editTelponAyah, setEditTelponAyah] = useState(siswa.no_telpon_ayah);
    const [editNamaIbu, setEditNamaIbu] = useState(siswa.nama_ibu);
    const [editPekerjaanIbu, setEditPekerjaanIbu] = useState(siswa.pekerjaan_ibu);
    const [editTelponIbu, setEditTelponIbu] = useState(siswa.no_telpon_ibu);
    const [editNamaWali, setEditNamaWali] = useState(siswa.nama_wali);
    const [editPekerjaanWali, setEditPekerjaanWali] = useState(siswa.pekerjaan_wali);
    const [editTelponWali, setEditTelponWali] = useState(siswa.no_telpon_wali);

    const [editAlamat, setEditAlamat] = useState(siswa.alamat);
    const [editEmail, setEditEmail] = useState(siswa.email_orang_tua);
    const [editNomerKK, setEditNomerKK] = useState(siswa.no_kartu_keluarga);
    const [editNIK, setEditNIK] = useState(siswa.nik_orang_tua);
    
    const [editFoto, setEditFoto] = useState(siswa.foto);
    const [fotoTampil] = useState("/images/siswa/"+siswa.foto);
    const [editKartuKeluarga, setEditKartuKeluarga] = useState(siswa.kartu_keluarga);
    const [kartukeluargaTampil] = useState("/images/siswa/"+siswa.kartu_keluarga);
    const [editAktaKelahiran, setEditAktaKelahiran] = useState(siswa.akta_kelahiran);
    const [aktakelahiranTampil] = useState("/images/siswa/"+siswa.akta_kelahiran);
    const [editIDUser, setEditIDUser] = useState(siswa.id_user);
  
    function handleSubmit(e) {
        e.preventDefault();
        // put(route("siswa.update", siswa.id));
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
                router.post(`/profil-siswa`, {
                    // id_tahun_ajaran: editTahunAjaran,
                    // tanggal_masuk: editTanggalMasuk,
                    nama_lengkap: editNamaLengkap,
                    nama_panggilan: editNamaPanggilan,
                    no_induk: editNomerInduk,
                    nisn: editNISN,
                    jenis_kelamin: editJenisKelamin,
                    id_agama: editAgama,
                    tempat_lahir: editTempatLahir,
                    tanggal_lahir: editTanggalLahir,
                    hobi: editHobi,

                    anak_ke: editAnakKe,
                    nama_ayah: editNamaAyah,
                    pekerjaan_ayah: editPekerjaanAyah,
                    no_telpon_ayah: editTelponAyah,
                    nama_ibu: editNamaIbu,
                    pekerjaan_ibu: editPekerjaanIbu,
                    no_telpon_ibu: editTelponIbu,
                    nama_wali: editNamaWali,
                    pekerjaan_wali: editPekerjaanWali,
                    no_telpon_wali: editTelponWali,

                    alamat: editAlamat,
                    email_orang_tua: editEmail,
                    no_kartu_keluarga: editNomerKK,
                    nik_orang_tua: editNIK,

                    foto: data.foto,
                    foto_lama: editFoto,
                    kartu_keluarga: data.kartu_keluarga,
                    kartu_keluarga_lama: editKartuKeluarga,
                    akta_kelahiran: data.akta_kelahiran,
                    akta_kelahiran_lama: editAktaKelahiran,
                    id_user: editIDUser,
                    password: data.password,
                    password_confirmation: data.password_confirmation,
                    _method: 'PUT',
                });
            }
        });
    }
  
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Profil Siswa</h2>}
        >
            <Head title="Siswa" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Edit Profil Siswa</h1>
  
                            {/* <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
                                    href={ route("siswa.index") }
                                >
                                    Kembali
                                </Link>
                            </div> */}
  
                            <form name="createForm" onSubmit={handleSubmit}>
                                <input
                                    type="hidden"
                                    name="id_user"
                                    value={editIDUser}
                                    onChange={(e) =>
                                        setEditIDUser(e.target.value)
                                    }
                                />

                                <div className="flex flex-col">
                                    <div className="mb-4">
                                        <label className="">Nama Lengkap <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nama Lengkap"
                                            name="nama_lengkap"
                                            required
                                            value={editNamaLengkap}
                                            onChange={(e) =>
                                                setEditNamaLengkap(e.target.value)
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
                                            value={editNamaPanggilan}
                                            onChange={(e) =>
                                                setEditNamaPanggilan(e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.nama_panggilan}
                                        </span>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="">Jenis Kelamin <span className='text-red-600'>*</span></label>
                                        <select name="jenis_kelamin" required className="w-full px-4 py-2" onChange={(e) =>
                                                setEditJenisKelamin(e.target.value)
                                            }>
                                            <option value="">-Pilih Jenis Kelamin-</option>
                                            {jenis_kelamin.map(({ id, nama }) => {
                                                
                                                if (siswa.jenis_kelamin == id){
                                                    return <option value={id} selected>{nama}</option>
                                                }

                                                return <option value={id}>{nama}</option>
                                            })}
                                        </select>
                                        <span className="text-red-600">
                                            {errors.jenis_kelamin}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Agama <span className='text-red-600'>*</span></label>
                                        {/* <select name="id_agama" className="w-full px-4 py-2" onChange={(e) =>
                                                setData("id_agama", e.target.value)
                                            }>
                                            <option value="">-Pilih Agama-</option>
                                            {agama.map(({ id, nama }) => (
                                                <option value={id}>{nama}</option>
                                            ))}
                                        </select> */}

                                        <select name="id_agama" required className="w-full px-4 py-2" onChange={(e) =>
                                                setEditAgama(e.target.value)
                                        }>
                                            <option value="">-Pilih Agama-</option>
                                            {agama.map(( {id, nama} ) => {
                                                
                                                if (siswa.id_agama == id){
                                                    return <option value={id} selected>{nama}</option>
                                                }

                                                return <option value={id}>{nama}</option>
                                            }
                                            )}
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
                                            value={editTempatLahir}
                                            onChange={(e) =>
                                                setEditTempatLahir(e.target.value)
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
                                            value={editTanggalLahir}
                                            onChange={(e) =>
                                                setEditTanggalLahir(e.target.value)
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
                                            value={editHobi}
                                            onChange={(e) =>
                                                setEditHobi(e.target.value)
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
                                            value={editAnakKe}
                                            onChange={(e) =>
                                                setEditAnakKe(e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.anak_ke}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Nama Ayah</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nama Ayah"
                                            name="nama_ayah"
                                            value={editNamaAyah}
                                            onChange={(e) =>
                                                setEditNamaAyah(e.target.value)
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
                                            value={editPekerjaanAyah}
                                            onChange={(e) =>
                                                setEditPekerjaanAyah(e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.pekerjaan_ayah}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Nomor Telepon Ayah</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nomor Telepon Ayah"
                                            name="no_telpon_ayah"
                                            value={editTelponAyah}
                                            onChange={(e) =>
                                                setEditTelponAyah(e.target.value)
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
                                            value={editNamaIbu}
                                            onChange={(e) =>
                                                setEditNamaIbu(e.target.value)
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
                                            value={editPekerjaanIbu}
                                            onChange={(e) =>
                                                setEditPekerjaanIbu(e.target.value)
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
                                            value={editTelponIbu}
                                            onChange={(e) =>
                                                setEditTelponIbu(e.target.value)
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
                                            value={editNamaWali}
                                            onChange={(e) =>
                                                setEditNamaWali(e.target.value)
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
                                            value={editPekerjaanWali}
                                            onChange={(e) =>
                                                setEditPekerjaanWali(e.target.value)
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
                                            value={editTelponWali}
                                            onChange={(e) =>
                                                setEditTelponWali(e.target.value)
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
                                            value={editAlamat}
                                            onChange={(e) =>
                                                setEditAlamat(e.target.value)
                                            }
                                        /> */}
                                        <textarea
                                            id="alamat"
                                            name="alamat"
                                            placeholder='Alamat'
                                            rows={5}
                                            className="w-full px-4 py-2"
                                            required
                                            value={editAlamat}
                                            onChange={(e) => setEditAlamat(e.target.value)}
                                        />
                                        <span className="text-red-600">
                                            {errors.alamat}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Email Orang Tua <span className='text-red-600'>*</span></label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2"
                                            label="Email Orang Tua"
                                            name="email_orang_tua"
                                            required
                                            value={editEmail}
                                            onChange={(e) =>
                                                setEditEmail(e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.email_orang_tua}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Nomor Kartu Keluarga <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nomor Kartu Keluarga"
                                            name="no_kartu_keluarga"
                                            required
                                            value={editNomerKK}
                                            onChange={(e) =>
                                                setEditNomerKK(e.target.value)
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
                                            value={editNIK}
                                            onChange={(e) =>
                                                setEditNIK(e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.nik_orang_tua}
                                        </span>
                                    </div>

                                    <input
                                        type="hidden"
                                        name="foto_lama"
                                        value={editFoto}
                                        onChange={(e) =>
                                            setEditFoto(e.target.value)
                                        }
                                    />

                                    <input
                                        type="hidden"
                                        name="kartu_keluarga_lama"
                                        value={editKartuKeluarga}
                                        onChange={(e) =>
                                            setEditKartuKeluarga(e.target.value)
                                        }
                                    />

                                    <input
                                        type="hidden"
                                        name="akta_kelahiran_lama"
                                        value={editAktaKelahiran}
                                        onChange={(e) =>
                                            setEditAktaKelahiran(e.target.value)
                                        }
                                    />

                                    <div className="mb-4">
                                        <label className="">Foto</label>
                                        <img src={fotoTampil} alt="" width="200" />
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
                                        <img src={kartukeluargaTampil} alt="" width="200" />
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
                                        <img src={aktakelahiranTampil} alt="" width="200" />
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

                                    <div className="mb-4">
                                        <label className="">Kata Sandi Baru</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2"
                                            label="Password"
                                            name="password"
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
                                        <label className="">Konfirmasi Kata Sandi Baru</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2"
                                            label="Password Confirmation"
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData("password_confirmation", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.password_confirmation}
                                        </span>
                                    </div>

                                </div>
                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 text-white bg-green-500 rounded"
                                    >
                                        Simpan
                                    </button> <Link
                                            className="px-6 py-2 text-white bg-orange-500 rounded focus:outline-none"
                                            href={ route("dashboard") }
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
