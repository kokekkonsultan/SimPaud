// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect } from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Edit({ auth, props }) {
  
    const { kepala_sekolah, errors } = usePage().props;
    const { data, setData, post, progress } = useForm({
        nama: kepala_sekolah.nama || "",
        email: kepala_sekolah.email || "",
        tahun_ajaran: kepala_sekolah.tahun_ajaran || "",
        semester: kepala_sekolah.semester || "",
        tanda_tangan: "",
        // tanda_tangan: "/images/sekolah/"+kepala_sekolah.tanda_tangan || "",
        tanda_tangan_lama: kepala_sekolah.tanda_tangan || "",
        id_user: kepala_sekolah.id_user,
        _method: 'PUT'
    });


    const [editNama, setEditNama] = useState(kepala_sekolah.nama);
    const [editEmail, setEditEmail] = useState(kepala_sekolah.email);
    const [editTahunAjaran, setEditTahunAjaran] = useState(kepala_sekolah.tahun_ajaran);
    const [editSemester, setEditSemester] = useState(kepala_sekolah.semester);
    const [editTandaTangan, setEditTandaTangan] = useState(kepala_sekolah.tanda_tangan);
    const [tandatanganTampil] = useState("/images/sekolah/"+kepala_sekolah.tanda_tangan);
    const [editIDUser, setEditIDUser] = useState(kepala_sekolah.id_user);
  
    function handleSubmit(e) {
        e.preventDefault();
        // put(route("kepala-sekolah.update", kepala_sekolah.id));
        Swal.fire({
            title: 'Simpan Data Kepala Sekolah?',
            type: 'warning',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oke',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                router.post(`/kepala-sekolah/${kepala_sekolah.id}`, {
                    nama: editNama,
                    email: editEmail,
                    tahun_ajaran: editTahunAjaran,
                    semester: editSemester,
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Kepala Sekolah</h2>}
        >
            <Head title="Kepala Sekolah" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Edit Kepala Sekolah</h1>
  
                            {/* <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
                                    href={ route("kepala-sekolah.index") }
                                >
                                    Kembali
                                </Link>
                            </div> */}

                            <table className="table-fixed w-full mb-5">
                                <tbody>
                                    <tr>
                                        <td className="border px-4 py-2 w-40">Tahun Ajaran</td>
                                        <td className="border px-4 py-2"><b>{editTahunAjaran}</b></td>
                                    </tr>
                                    <tr>
                                        <td className="border px-4 py-2 w-40">Semester</td>
                                        <td className="border px-4 py-2"><b>{editSemester}</b></td>
                                    </tr>
                                </tbody>
                            </table>
  
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
                                        <label className="">Nama Kepala Sekolah <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nama Sekolah"
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

                                    <input
                                        type="hidden"
                                        name="tanda_tangan_lama"
                                        value={editTandaTangan}
                                        onChange={(e) =>
                                            setEditTandaTangan(e.target.value)
                                        }
                                    />

                                    <div className="mb-4">
                                        <label className="">Tanda Tangan</label>
                                        <img src={tandatanganTampil} alt="" width="200" />
                                        <input
                                            id="file-upload"
                                            type="file"
                                            className="w-full px-4 py-2"
                                            label="Tanda Tangan"
                                            name="tanda_tangan"
                                            onChange={(e) =>
                                                setData("tanda_tangan", e.target.files[0])
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.tanda_tangan}
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
                                            href={ route("kepala-sekolah.index") }
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
