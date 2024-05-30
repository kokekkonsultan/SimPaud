// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect } from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, usePage, Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import Swal from 'sweetalert2';

export default function Index({ auth, props }) {
    
    const { setting_sttb, flash } = usePage().props

    const statusData = (id, status) => {
        // if (confirm("Apakah Anda yakin ingin mengaktifkan/menonaktifkan data ini?")) {
        //     Inertia.get(`/setting-sttb/status/${id}/${status}`);
        // }
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "ingin mengaktifkan/menonaktifkan data ini?",
            type: 'warning',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oke',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                router.get(`/setting-sttb/status/${id}/${status}`);
                Swal.fire(
                    'Diubah!',
                    'Data berhasil diubah.',
                    'success'
                );
            }
        });
    }

    function destroy(e) {
        if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            router.delete(route("setting-sttb.destroy", e.currentTarget.id));
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
                router.delete(route("setting-sttb.destroy", id));
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Setting STTB</h2>}
        >
            <Head title="Setting STTB" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Setting STTB</h1>

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

                            <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white text-sm bg-green-500 rounded-md focus:outline-none"
                                    href={ route("setting-sttb.create") }
                                >
                                    Tambah Template
                                </Link>
                            </div>
  
                            {/* <div className="-mx-2 md:items-center md:flex"> */}
                            <div className="grid md:grid-cols-4 md:gap-6">

                                {/* {setting_sttb.map(({ id, template, id_sekolah, status }) => ( */}
                                {setting_sttb.map((dt, index) => (
                                    <div className="" key={ index }>

                                        <div className="relative">
                                            <a
                                                style={{ cursor: 'pointer' }}
                                                onClick={ () => statusData(dt.id, dt.status) }
                                            ><img src={ (dt.template) ? "/images/template/"+dt.template : "" } alt="" />
                                            </a>
                                            { (dt.status == 1) ?
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <img src="/images/check-icon.png" alt="" />
                                            </div> : "" }
                                        </div>

                                        {/* <img src={ (dt.template) ? "/images/template/"+dt.template : "" } alt="" /> */}
                                        {/* { (dt.status == 1) ?
                                        <Link
                                            tabIndex="1"
                                            className="px-4 py-2 text-sm text-white bg-green-500 rounded"
                                        >Aktif
                                        </Link> : "" }
                                        { (dt.status == 0) ?
                                        <Link
                                            tabIndex="1"
                                            className="px-4 py-2 text-sm text-white bg-yellow-500 rounded"
                                            onClick={ () => statusData(dt.id, dt.status) }
                                        >Non-Aktif
                                        </Link> : "" } */}
                                        { ((index+1) > 4) ?
                                        <button
                                            // onClick={destroy}
                                            onClick={() => handleDelete(dt.id)}
                                            id={dt.id}
                                            tabIndex="-1"
                                            type="button"
                                            className="mx-1 px-4 py-2 text-sm text-white bg-red-500 rounded"
                                        >
                                            Hapus
                                        </button> : "" }

                                    </div>
                                ))}
                            </div>

                            {setting_sttb.length === 0 && (
                                <div className="px-6 py-4 text-sm">
                                        Tidak ada data.
                                </div>
                            )}
                            

                        </div>
                    </div>
                </div>
            {/* </div> */}
        </DashboardLayout>
    );
}
