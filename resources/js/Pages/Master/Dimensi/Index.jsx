// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect } from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, usePage, Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import Swal from 'sweetalert2';

export default function Index({ auth, props, filtering }) {
    
    const { dimensi, flash } = usePage().props
    // const [loading, setLoading] = useState(true);
    const urut = (dimensi.current_page - 1) * dimensi.per_page;
  
    function destroy(e) {
        if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            router.delete(route("dimensi.destroy", e.currentTarget.id));
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
                router.delete(route("dimensi.destroy", id));
                Swal.fire(
                    'Dihapus!',
                    'Data berhasil dihapus.',
                    'success'
                );
            }
        });
    };


    filtering = filtering || {};
        const doFilterData = (name, value) => {
            if (value) {
                filtering[name] = value;
            } else {
                delete filtering[name];
            }

        router.get('/dimensi', filtering);
    };

    const doSearchData = (name, e) => {
        if (e.key !== "Enter") return;
    
        doFilterData(name, e.target.value);
    };

    const metodes = [
        {id: "2", nama: "Capaian Pembelajaran"}, 
        {id: "3", nama: "P5"}
    ]

    // setTimeout(() => {
    //     setLoading(false);
    // }, 1000); // Reset the button state after 2 seconds

    // if (loading) {
    //     return (
    //         <div className="loading-spinner">
    //             Loading...
    //         </div>
    //     );
    // }

    
   
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dimensi</h2>}
        >
            <Head title="Dimensi" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Dimensi</h1>

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
                                    <label className="font-bold text-sm">Metode</label>
                                    <select name="id_metode" 
                                    defaultValue={filtering.id_metode} 
                                    className="w-full px-4 py-2 text-sm" onChange={(e) =>
                                        doFilterData("id_metode", e.target.value)
                                    }>
                                        <option value="">-Pilih Metode-</option>
                                        {metodes.map(({ id, nama }) => (
                                            <option value={id}>{nama}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 px-2">
                                    <label className="font-bold text-sm">Cari Nama Dimensi</label>
                                    <input
                                        className="w-full text-sm"
                                        defaultValue={filtering.search}
                                        placeholder="Nama"
                                        onBlur={(e) =>
                                            filtering("search", e.target.value)
                                        }
                                        onKeyPress={(e) => doSearchData("search", e)}
                                        />
                                </div>
                                <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 px-2 pt-5">
                                    <Link
                                        className="px-6 py-2 text-white text-sm bg-green-500 rounded-md focus:outline-none"
                                        href={ route("dimensi.create") }
                                    >
                                        Tambah Dimensi
                                    </Link>
                                </div>
                            </div>
  
                            {/* <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white text-sm bg-green-500 rounded-md focus:outline-none"
                                    href={ route("dimensi.create") }
                                >
                                    Tambah Dimensi
                                </Link>
                            </div> */}
  
                            <div className="overflow-auto">
                                <table className="table-auto w-full">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border px-4 py-2 text-sm">No.</th>
                                            <th className="border px-4 py-2 text-sm">Metode</th>
                                            <th className="border px-4 py-2 text-sm">Kode</th>
                                            <th className="border px-4 py-2 text-sm">Nama Dimensi</th>
                                            <th className="border px-4 py-2 text-sm">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dimensi.data.map((dt, index) => ( // { id, id_metode, kode, nama }
                                            <tr key={ index }>
                                                <td className="border px-4 py-2 text-sm">{ urut + index + 1 }</td>
                                                <td className="border px-4 py-2 text-sm">{ (dt.id_metode == 2) ? 'Capaian Pembelajaran' : 'P5' }</td>
                                                <td className="border px-4 py-2 text-sm">{ dt.kode }</td>
                                                <td className="border px-4 py-2 text-sm">{ dt.nama }</td>
                                                <td className="border px-4 py-2 text-sm">
                                                    <Link
                                                        tabIndex="1"
                                                        className="px-4 py-2 text-sm text-white bg-blue-500 rounded"
                                                        href={route("dimensi.edit", dt.id)}
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        // onClick={destroy}
                                                        onClick={() => handleDelete(dt.id)}
                                                        id={dt.id}
                                                        tabIndex="-1"
                                                        type="button"
                                                        className="mx-1 px-4 py-2 text-sm text-white bg-red-500 rounded"
                                                    >
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
    
                                        {dimensi.data.length === 0 && (
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

                            <Pagination className="mt-6" links={dimensi.links} />

                        </div>
                    </div>
                </div>
            {/* </div> */}
        </DashboardLayout>
    );
}
