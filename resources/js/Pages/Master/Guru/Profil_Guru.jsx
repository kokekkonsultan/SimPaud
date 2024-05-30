// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect } from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Edit({ auth, props }) {
  
    const { guru, errors } = usePage().props;
    const { data, setData, post } = useForm({
        nama: guru.nama || "",
        jenis_kelamin: guru.jenis_kelamin || "",
        nip: guru.nip || "",
        alamat: guru.alamat || "",
        email: guru.email || "",
        no_telpon: guru.no_telpon || "",
        tempat_lahir: guru.tempat_lahir || "",
        tanggal_lahir: guru.tanggal_lahir || "",
        // foto: "/images/guru/"+guru.foto || "",
        foto: "",
        foto_lama: guru.foto || "",
        // tanda_tangan: "/images/guru/"+guru.tanda_tangan || "",
        tanda_tangan: "",
        tanda_tangan_lama: guru.tanda_tangan || "",
        id_user: guru.id_user,
        _method: 'PUT'
    });

    const jenis_kelamin = [
        {id: "L", nama: "Laki-laki"}, 
        {id: "P", nama: "Perempuan"}
    ]

    const [editNama, setEditNama] = useState(guru.nama);
    const [editJenisKelamin, setEditJenisKelamin] = useState(guru.jenis_kelamin);
    const [editNIP, setEditNIP] = useState(guru.nip);
    const [editAlamat, setEditAlamat] = useState(guru.alamat);
    const [editEmail, setEditEmail] = useState(guru.email);
    const [editTelpon, setEditTelpon] = useState(guru.no_telpon);
    const [editTempatLahir, setEditTempatLahir] = useState(guru.tempat_lahir);
    const [editTanggalLahir, setEditTanggalLahir] = useState(guru.tanggal_lahir);
    const [editFoto, setEditFoto] = useState(guru.foto);
    const [fotoTampil] = useState("/images/guru/"+guru.foto);
    const [editTandaTangan, setEditTandaTangan] = useState(guru.tanda_tangan);
    const [tandatanganTampil] = useState("/images/guru/"+guru.tanda_tangan);
    const [editIDUser, setEditIDUser] = useState(guru.id_user);
  
    function handleSubmit(e) {
        e.preventDefault();
        // put(route("guru.update", guru.id));

        Swal.fire({
            title: 'Simpan Data Guru?',
            type: 'warning',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oke',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                router.post(`/profil-guru`, {
                    nama: editNama,
                    jenis_kelamin: editJenisKelamin,
                    nip: editNIP,
                    alamat: editAlamat,
                    email: editEmail,
                    no_telpon: editTelpon,
                    tempat_lahir: editTempatLahir,
                    tanggal_lahir: editTanggalLahir,
                    foto: data.foto,
                    foto_lama: editFoto,
                    tanda_tangan: data.tanda_tangan,
                    tanda_tangan_lama: editTandaTangan,
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Profil Guru</h2>}
        >
            <Head title="Guru" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Edit Profil Guru</h1>
  
                            {/* <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
                                    href={ route("guru.index") }
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
                                        <label className="">Nama Guru <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nama Guru"
                                            name="nama"
                                            required
                                            value={editNama}
                                            onChange={(e) =>
                                                setEditNama(e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.nama}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">NIP</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="NIP"
                                            name="nip"
                                            value={editNIP}
                                            onChange={(e) =>
                                                setEditNIP(e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.nip}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Jenis Kelamin <span className='text-red-600'>*</span></label>
                                        <select name="jenis_kelamin" required className="w-full px-4 py-2" onChange={(e) =>
                                                setEditJenisKelamin(e.target.value)
                                            }>
                                            <option value="">-Pilih Jenis Kelamin-</option>
                                            {jenis_kelamin.map(({ id, nama }) => {
                                                
                                                if (guru.jenis_kelamin == id){
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
                                        <label className="">Tempat Lahir</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Tempat Lahir"
                                            name="tempat_lahir"
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
                                        <label className="">Tanggal Lahir</label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-2"
                                            label="Tanggal Lahir"
                                            name="tanggal_lahir"
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
                                        <label className="">Alamat</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Alamat"
                                            name="alamat"
                                            value={editAlamat}
                                            onChange={(e) =>
                                                setEditAlamat(e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.alamat}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Nomor Telepon</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nomor Telepon"
                                            name="no_telpon"
                                            value={editTelpon}
                                            onChange={(e) =>
                                                setEditTelpon(e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.no_telpon}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Email <span className='text-red-600'>*</span></label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2"
                                            label="Email"
                                            name="email"
                                            required
                                            value={editEmail}
                                            onChange={(e) =>
                                                setEditEmail(e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.email}
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
                                        name="tanda_tangan_lama"
                                        value={editTandaTangan}
                                        onChange={(e) =>
                                            setEditTandaTangan(e.target.value)
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
                                        <label className="">Tanda Tangan</label>
                                        <img src={tandatanganTampil} alt="" width="200" />
                                        <input
                                            id="file-upload-2"
                                            type="file"
                                            className="w-full px-4 py-2"
                                            label="Tanda Tangan"
                                            name="tanda_tangan"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setData("tanda_tangan", e.target.files[0])
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.tanda_tangan}
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
