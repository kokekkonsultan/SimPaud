// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect } from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, usePage, Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import Swal from 'sweetalert2';

export default function Index({ auth, props, tahun_ajaran, jenis_sttb, searching, filtering }) {
    
    const { sttb, flash } = usePage().props

    filtering = filtering || {};
        const doFilterData = (name, value) => {
            if (value) {
                filtering[name] = value;
            } else {
                delete filtering[name];
            }

        router.get('/sttb', filtering);
    };

    const doSearchData = (name, e) => {
        if (e.key !== "Enter") return;
    
        doFilterData(name, e.target.value);
    };
  
   
    function destroy(e) {
        if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            router.delete(route("sttb.destroy", e.currentTarget.id));
        }
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "ingin menghapus data ini?",
            type: 'warning',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oke',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                router.delete(route("sttb.destroy", id));
                Swal.fire(
                    'Dihapus!',
                    'Data berhasil dihapus.',
                    'success'
                );
            }
        });
    };

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

                            <h1 className="text-2xl mb-5">STTB</h1>

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
  
                            <div className="-mx-2 md:items-center md:flex mb-5">
                                <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 px-2">
                                    <label className="font-bold text-sm">Tahun Ajaran</label>
                                    <select name="id_tahun_ajaran" defaultValue={filtering.id_tahun_ajaran} 
                                    className="w-full px-4 py-2 text-sm" onChange={(e) =>
                                        doFilterData("id_tahun_ajaran", e.target.value)
                                    }>
                                        <option value="">-Pilih Tahun Ajaran-</option>
                                        {tahun_ajaran.map(({ id, nama }) => (
                                            <option value={id}>{nama}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 px-2">
                                    <label className="font-bold text-sm">Jenis STTB</label>
                                    <select name="id_jenis_sttb" 
                                    defaultValue={filtering.id_jenis_sttb} 
                                    className="w-full px-4 py-2 text-sm" onChange={(e) =>
                                        doFilterData("id_jenis_sttb", e.target.value)
                                    }>
                                        <option value="">-Pilih Jenis STTB-</option>
                                        {jenis_sttb.map(({ id, nama }) => (
                                            <option value={id}>{nama}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 px-2">
                                    <label className="font-bold text-sm">Cari Peserta Didik</label>
                                    <input
                                        className="w-full text-sm"
                                        defaultValue={filtering.search}
                                        placeholder="Nama / No. Induk"
                                        onBlur={(e) =>
                                            filtering("search", e.target.value)
                                        }
                                        onKeyPress={(e) => doSearchData("search", e)}
                                        />
                                </div>
                            </div>
  
                            <div className="overflow-auto">
                                <table className="table-auto w-full">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            {/* <th className="border px-4 py-2 text-sm">No.</th> */}
                                            <th colSpan="2" className="border px-4 py-2 text-sm">Nama</th>
                                            <th className="border px-4 py-2 text-sm">Tempat/Tanggal Lahir</th>
                                            <th className="border px-4 py-2 text-sm">Tahun Angkatan</th>
                                            <th className="border px-4 py-2 text-sm">Tanggal Masuk</th>
                                            <th className="border px-4 py-2 text-sm">STTB</th>
                                            <th className="border px-4 py-2 text-sm w-40">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sttb.data.map((dt) => ( //{ id, nama_panggilan, nama_lengkap, no_induk, tempat_lahir, tanggal_lahir_siswa, usia_tahun, usia_bulan, tanggal_masuk_siswa, tahun_ajaran, agama, status, foto, verified, id_user, jenis_kelamin }
                                            <tr>
                                                {/* <td className="border px-4 py-2 text-sm">{ id }</td> */}
                                                <td className="border px-4 py-2 text-sm"><img src={ (dt.foto) ? "/images/sttb/"+dt.foto : (dt.jenis_kelamin == 'L') ? "/images/boy.png" : "/images/girl.png" } alt="" width="70" /></td>
                                                <td className="border px-4 py-2 text-sm"><b>{ dt.nama_panggilan }</b><br />{ dt.nama_lengkap }<br />No. Induk: { dt.no_induk }</td>
                                                <td className="border px-4 py-2 text-sm">{ dt.tempat_lahir } / { dt.tanggal_lahir_siswa }<br />({ dt.usia_tahun } Thn { dt.usia_bulan } Bln)</td>
                                                <td className="border px-4 py-2 text-sm text-center"><span className="bg-sky-100 text-sky-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-sky-400 border border-sky-400">{ dt.tahun_ajaran }</span></td>
                                                <td className="border px-4 py-2 text-sm text-center">{ dt.tanggal_masuk_siswa }</td>
                                                <td className="border text-sm w-40">
                                                    
                                                    <table className="table-auto w-full">
                                                        {dt.substtb.map((dt2) => (
                                                        <tr>
                                                            <td className="border-b px-4 py-2 text-sm w-60">{ dt2.nama }<br />{ dt2.nomor_sttb }
                                                                <div className="pt-1">
                                                                <a
                                                                    tabIndex="1"
                                                                    target="_blank"
                                                                    className="px-2 py-1 text-xs text-white bg-green-500 rounded"
                                                                    href={route("lihat-sttb", dt2.id)}
                                                                >
                                                                    Lihat
                                                                </a> <Link
                                                                    tabIndex="1"
                                                                    className="px-2 py-1 text-xs text-white bg-blue-500 rounded"
                                                                    href={route("sttb.edit", dt2.id)}
                                                                >
                                                                    Edit
                                                                </Link><button
                                                                    // onClick={destroy}
                                                                    onClick={() => handleDelete(dt2.id)}
                                                                    id={dt2.id}
                                                                    tabIndex="-1"
                                                                    type="button"
                                                                    className="mx-1 px-2 py-1 text-xs text-white bg-red-500 rounded"
                                                                >
                                                                    Hapus
                                                                </button>
                                                                </div>
                                                            </td>
                                                            {/* <td className="px-4 py-2 text-sm w-60">{ dt2.nama }<br />{ dt2.nomor_sttb }</td>
                                                            <td className="px-4 py-2 text-sm w-44">
                                                                <a
                                                                    tabIndex="1"
                                                                    target="_blank"
                                                                    className="px-4 py-2 text-sm text-white bg-green-500 rounded"
                                                                    href={route("lihat-sttb", dt2.id)}
                                                                >
                                                                    Lihat
                                                                </a> &nbsp;
                                                                <Link
                                                                    tabIndex="1"
                                                                    className="px-4 py-2 text-sm text-white bg-blue-500 rounded"
                                                                    href={route("sttb.edit", dt2.id)}
                                                                >
                                                                    Edit
                                                                </Link> &nbsp;
                                                                <button
                                                                    // onClick={destroy}
                                                                    onClick={() => handleDelete(dt2.id)}
                                                                    id={dt2.id}
                                                                    tabIndex="-1"
                                                                    type="button"
                                                                    className="mx-1 px-4 py-2 text-sm text-white bg-red-500 rounded"
                                                                >
                                                                    Hapus
                                                                </button>
                                                            </td> */}
                                                        </tr>
                                                        ))}

                                                        {dt.substtb.length === 0 && (
                                                        <tr>
                                                            <td
                                                                className="px-4 py-2 text-sm text-red-500"
                                                                colSpan="2"
                                                            >
                                                                Belum ada STTB.
                                                            </td>
                                                        </tr>
                                                        )}
                                                    </table>
                                                    
                                                </td>
                                                <td className="border px-4 py-2 text-sm">
                                                    <Link
                                                        tabIndex="1"
                                                        className="px-4 py-2 text-sm text-white bg-blue-500 rounded"
                                                        href={route("sttb", dt.id)}
                                                    >
                                                        Buat Baru
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
    
                                        {sttb.data.length === 0 && (
                                            <tr>
                                                <td
                                                    className="px-6 py-4 border-t text-sm"
                                                    colSpan="4"
                                                >
                                                    Tidak ada data.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <Pagination className="mt-6" links={sttb.links} />

                        </div>
                    </div>
                </div>
            {/* </div> */}
        </DashboardLayout>
    );
}
