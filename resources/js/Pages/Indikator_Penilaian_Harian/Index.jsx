// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect } from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, usePage, Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import Swal from 'sweetalert2';

export default function Index({ auth, props, filtering, tanggal_penilaian, format_tanggal_penilaian }) {
    
    const { indikator, flash } = usePage().props

    filtering = filtering || {};
        const doFilterData = (name, value) => {
            if (value) {
                filtering[name] = value;
            } else {
                delete filtering[name];
            }

        router.get('/indikator-penilaian-harian', filtering);
    };

    const doSearchData = (name, e) => {
        if (e.key !== "Enter") return;
    
        doFilterData(name, e.target.value);
    };

    const handleDateChange = (name, e) => {
        const newDate = e.target.value;
        doFilterData(name, e.target.value);
    };

    // function destroy(e) {
    //     if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
    //         router.delete(route("indikator-penilaian-harian.destroy", e.currentTarget.id));
    //     }
    // }

    const deleteData = (id_kelompok, tanggal_penilaian) => {
        // if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
        //     Inertia.get(`/indikator-penilaian-harian-delete/${id_kelompok}/${tanggal_penilaian}`);
        // }
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
                router.get(`/indikator-penilaian-harian-delete/${id_kelompok}/${tanggal_penilaian}`);
            }
        });
    }
   
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Indikator Penilaian Harian</h2>}
        >
            <Head title="Indikator Penilaian Harian" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Indikator Penilaian Harian</h1>

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
                                    <label className="font-bold text-sm">Tanggal Penilaian</label>
                                    <input
                                        type="date"
                                        className="w-full text-sm"
                                        defaultValue={tanggal_penilaian}
                                        placeholder="Tanggal Penilaian"
                                        // onBlur={(e) => filtering("tanggal_penilaian", e.target.value)}
                                        // onKeyPress={(e) => doSearchData("tanggal_penilaian", e)}
                                        onChange={(e) => handleDateChange("tanggal_penilaian", e)}
                                        />
                                </div>
                            </div>
                            
                            
  <b>{format_tanggal_penilaian}</b>

                            <div className="overflow-auto">
                                <table className="table-auto w-full">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            {/* <th className="border px-4 py-2 text-sm">No.</th> */}
                                            <th className="border px-4 py-2 text-sm">Kelompok</th>
                                            <th className="border px-4 py-2 text-sm">Indikator</th>
                                            <th className="border px-4 py-2 text-sm">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {indikator.data.map(({ id, kelompok, usia, jml }) => (
                                            <tr>
                                                {/* <td className="border px-4 py-2 text-sm">{ id }</td> */}
                                                <td className="border px-4 py-2 text-sm">{ kelompok } ({ usia })</td>
                                                <td className="border px-4 py-2 text-sm">{ (jml > 0) ? jml+' Indikator' : 'Belum Disetting' }</td>
                                                <td className="border px-4 py-2 text-sm">
                                                    <Link
                                                        tabIndex="1"
                                                        className="px-4 py-2 text-sm text-white bg-blue-500 rounded"
                                                        href={route("indikator-penilaian-harian.edit", id+"-"+tanggal_penilaian)}
                                                    >
                                                        Setting
                                                    </Link>
                                                    { (jml > 0) ? 
                                                    <button
                                                        onClick={ () => deleteData(id, tanggal_penilaian) }
                                                        id={id}
                                                        tabIndex="-1"
                                                        type="button"
                                                        className="mx-1 px-4 py-2 text-sm text-white bg-red-500 rounded"
                                                    >
                                                        Hapus
                                                    </button> : "" }
                                                </td>
                                            </tr>
                                        ))}
    
                                        {indikator.data.length === 0 && (
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

                            <Pagination className="mt-6" links={indikator.links} />

                        </div>
                    </div>
                </div>
            {/* </div> */}
        </DashboardLayout>
    );
}
