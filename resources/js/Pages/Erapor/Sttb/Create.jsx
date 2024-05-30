// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect } from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Edit({ auth, props, siswa, id_siswa, jenis_sttb }) {

    const { flash } = usePage().props

    const { data, setData, post, errors } = useForm({
        nama_lengkap: siswa.nama_lengkap || "",
        nama_panggilan: siswa.nama_panggilan || "",
        no_induk: siswa.no_induk || "",
        nisn: siswa.nisn || "",
        jenis_kelamin: siswa.jenis_kelamin || "",
        usia_tahun: siswa.usia_tahun || "",
        usia_bulan: siswa.usia_bulan || "",
        kelompok: siswa.kelompok || "",
        foto: siswa.foto || "",

        id_siswa: id_siswa || "",
        id_jenis_sttb: "",
        nomor_sttb: "",
        tanggal_sttb: "",
    });
  
    function handleSubmit(e) {
        e.preventDefault();
        Swal.fire({
            title: 'Simpan Data STTB?',
            type: 'warning',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oke',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                post(route("sttb.store"));
            }

        });
    }
  
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">STTB</h2>}
        >
            <Head title="STTB" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Buat STTB</h1>

                            {flash.message && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-5 rounded relative" role="alert">
                                <strong className="font-bold">Berhasil!</strong> &nbsp;<span className="block sm:inline">{flash.message}</span>
                              </div>
                            )}

                            {flash.error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-5 rounded relative" role="alert">
                                <strong className="font-bold">Gagal!</strong> &nbsp;<span className="block sm:inline">{flash.error}</span>
                              </div>
                            )}
  
                            {/* <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
                                    href={ route("sttb.index") }
                                >
                                    Kembali
                                </Link>
                            </div> */}

                            <table className="table-fixed w-full mb-5">
                                <tbody>
                                    <tr>
                                        <td className="border px-4 py-2 w-40"><img src={ (data.foto) ? "/images/siswa/"+data.foto : (data.jenis_kelamin == 'L') ? "/images/boy.png" : "/images/girl.png" } alt="" width="70" /></td>
                                        <td className="border px-4 py-2"><b>{ data.nama_panggilan }</b> - <b>{ data.nama_lengkap }</b><br />{ (data.jenis_kelamin == 'L') ? "Laki-laki" : "Perempuan" } | { data.usia_tahun } Thn { data.usia_bulan } Bln  | Kelompok: { data.kelompok }<br />No. Induk: { data.no_induk } | NISN: { data.nisn }</td>
                                    </tr>
                                </tbody>
                            </table>

                            <form name="createForm" onSubmit={handleSubmit}>

                                <input
                                    type="hidden"
                                    name="id_siswa"
                                    value={id_siswa}
                                    onChange={(e) =>
                                        setData("id_siswa", e.target.value)
                                    }
                                />

                                <div className="flex flex-col">
                                    <div className="mb-4">
                                        <label className="">Jenis STTB <span className='text-red-600'>*</span></label>
                                        <select name="id_jenis_sttb" required className="w-full px-4 py-2" onChange={(e) =>
                                                setData("id_jenis_sttb", e.target.value)
                                            }>
                                            <option value="">-Pilih Jenis STTB-</option>
                                            {jenis_sttb.map(({ id, nama }) => {
                                                return <option value={id}>{nama}</option>
                                            })}
                                        </select>
                                        <span className="text-red-600">
                                            {errors.id_jenis_sttb}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Nomor STTB <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nomor STTB"
                                            name="nomor_sttb"
                                            required
                                            value={data.nomor_sttb}
                                            onChange={(e) =>
                                                setData("nomor_sttb", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.nomor_sttb}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Tanggal STTB <span className='text-red-600'>*</span></label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-2"
                                            label="Tanggal STTB"
                                            name="tanggal_sttb"
                                            required
                                            value={data.tanggal_sttb}
                                            onChange={(e) =>
                                                setData("tanggal_sttb", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.tanggal_sttb}
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
                                            href={ route("sttb.index") }
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
