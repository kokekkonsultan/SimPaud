// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect } from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Edit({ auth, props }) {
  
    const { setting_rapor_siswa, id_semester } = usePage().props;
    const { data, setData, post, errors, progress } = useForm({
        tanggal_rapor: setting_rapor_siswa.tanggal_rapor || "",
        tahun_ajaran: setting_rapor_siswa.tahun_ajaran || "",
        semester: setting_rapor_siswa.semester || "",
        id_semester: id_semester || "",
        _method: 'PUT'
    });


    const [editTanggalRapor, setEditTanggalRapor] = useState(setting_rapor_siswa.tanggal_rapor);
    const [editTahunAjaran, setEditTahunAjaran] = useState(setting_rapor_siswa.tahun_ajaran);
    const [editSemester, setEditSemester] = useState(setting_rapor_siswa.semester);
    const [editIDSemester, setEditIDSemester] = useState(id_semester);
  
    function handleSubmit(e) {
        e.preventDefault();
        // put(route("setting-rapor-siswa.update", setting_rapor_siswa.id));

        Swal.fire({
            title: 'Simpan Setting Data Rapor Siswa?',
            type: 'warning',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oke',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                router.post(`/setting-rapor-siswa/${setting_rapor_siswa.id}`, {
                    tanggal_rapor: editTanggalRapor,
                    tahun_ajaran: editTahunAjaran,
                    semester: editSemester,
                    id_semester: editIDSemester,
                    _method: 'PUT',
                });
            }
        });
    }
  
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Setting Rapor Siswa</h2>}
        >
            <Head title="Setting Rapor Siswa" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Edit Setting Rapor Siswa</h1>
  
                            {/* <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
                                    href={ route("setting-rapor-siswa.index") }
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
                                    name="id_semester"
                                    value={editIDSemester}
                                    onChange={(e) =>
                                        setEditIDSemester(e.target.value)
                                    }
                                />

                                <div className="flex flex-col">
                                    <div className="mb-4">
                                        <label className="">Tanggal Rapor <span className='text-red-600'>*</span></label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-2"
                                            label="Tanggal Rapor"
                                            name="tanggal_rapor"
                                            required
                                            value={editTanggalRapor}
                                            onChange={(e) =>
                                                setEditTanggalRapor(e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.tanggal_rapor}
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
                                            href={ route("setting-rapor-siswa.index") }
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
