// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect } from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, usePage, Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, props }) {
    
    const { kepala_sekolah, flash } = usePage().props
   
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Kepala Sekolah</h2>}
        >
            <Head title="Kepala Sekolah" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Kepala Sekolah</h1>
  
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
  
                            <div className="overflow-auto">
                                <table className="table-auto w-full">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            {/* <th className="border px-4 py-2 text-sm">No.</th> */}
                                            <th className="border px-4 py-2 text-sm">Tahun Ajaran</th>
                                            <th className="border px-4 py-2 text-sm">Semester</th>
                                            <th className="border px-4 py-2 text-sm">Periode Aktif</th>
                                            <th className="border px-4 py-2 text-sm">Nama Kepala Sekolah</th>
                                            <th className="border px-4 py-2 text-sm">Tanda Tangan</th>
                                            <th className="border px-4 py-2 text-sm">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {kepala_sekolah.data.map(({ id, nama, tanda_tangan, tahun_ajaran, semester, periode_aktif }) => (
                                            <tr>
                                                {/* <td className="border px-4 py-2 text-sm">{ id }</td> */}
                                                <td className="border px-4 py-2 text-sm text-center"><span className="bg-sky-100 text-sky-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-sky-400 border border-sky-400">{ tahun_ajaran }</span></td>
                                                <td className="border px-4 py-2 text-sm text-center">{ semester }</td>
                                                <td className="border px-4 py-2 text-sm text-center">{/* (periode_aktif == 1) ? 'Aktif' : '' */}{ (periode_aktif == 1) ? <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">Aktif</span> : '' }</td>
                                                <td className="border px-4 py-2 text-sm">{ nama }</td>
                                                <td className="border px-4 py-2"><div className="text-center flex justify-center items-center"><img src={ (tanda_tangan) ? "/images/sekolah/"+tanda_tangan : "/images/tutwuri_logo.png" } alt="" width="70" /></div></td>
                                                <td className="border px-4 py-2 text-sm">
                                                { (id) ?
                                                    <Link
                                                        tabIndex="1"
                                                        className="px-4 py-2 text-sm text-white bg-blue-500 rounded"
                                                        href={route("kepala-sekolah.edit", id)}
                                                    >
                                                        Edit
                                                    </Link> : '' }
                                                </td>
                                            </tr>
                                        ))}
    
                                        {kepala_sekolah.data.length === 0 && (
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

                            <Pagination className="mt-6" links={kepala_sekolah.links} />

                        </div>
                    </div>
                </div>
            {/* </div> */}
        </DashboardLayout>
    );
}
