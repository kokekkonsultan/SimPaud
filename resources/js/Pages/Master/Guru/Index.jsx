// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect } from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, usePage, Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import Swal from 'sweetalert2';

export default function Index({ auth, props, filtering }) {
    
    const { guru, flash } = usePage().props
    // const [ search, setSearch ] = useState(searching.search || '')
    
    // const doSearchData = (e) =>{
    //     e.preventDefault();
    //     // Inertia.get('/guru', { search }, { preserveState : true });
    //     router.get('/guru', { search }, { preserveState: true })
    // }

    filtering = filtering || {};
        const doFilterData = (name, value) => {
            if (value) {
                filtering[name] = value;
            } else {
                delete filtering[name];
            }

        router.get('/guru', filtering);
    };

    const doSearchData = (name, e) => {
        if (e.key !== "Enter") return;
    
        doFilterData(name, e.target.value);
    };
  
    function destroy(e) {
        if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            router.delete(route("guru.destroy", e.currentTarget.id));
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
                router.delete(route("guru.destroy", id));
                Swal.fire(
                    'Dihapus!',
                    'Data berhasil dihapus.',
                    'success'
                );
            }
        });
    };

    const statusData = (id_user, status) => {
        // if (confirm("Apakah Anda yakin ingin mengaktifkan/menonaktifkan data ini?")) {
        //     Inertia.get(`/sekolah/status/${id_user}/${status}`);
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
                router.get(`/guru/status/${id_user}/${status}`);
                Swal.fire(
                    'Diubah!',
                    'Data berhasil diubah.',
                    'success'
                );
            }
        });
    }
   
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Guru</h2>}
        >
            <Head title="Guru" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Data Guru</h1>

                            {/* <div className="flex items-center">
                                <input
                                    id="search"
                                    type="search"
                                    className="w-full px-4 py-2"
                                    label="Nama Guru"
                                    name="search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <Input
                                    type="search"
                                    name="search"
                                    value={query}
                                    id="search"
                                    autoComplete="search"
                                    className="mt-1 block w-full shadow-sm sm:text-sm"
                                    placeholder={`Search here...`}
                                    handleChange={(e) => setQuery(e.target.value)}
                                />
                                <Button className="ml-3">Reset</Button> 
                            </div>*/}
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
                                    <label className="font-bold text-sm">Cari Guru</label>
                                    <input
                                        className="w-full text-sm"
                                        defaultValue={filtering.search}
                                        placeholder="Nama"
                                        onBlur={(e) =>
                                            filtering("search", e.target.value)
                                        }
                                        onKeyPress={(e) => doSearchData("search", e)}
                                        />
                                    {/* <form onSubmit={doSearchData}>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            value={search}
                                            placeholder="Nama / NIP"
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                        />
                                        <button
                                            type="submit"
                                            className="px-6 py-2 text-white bg-green-500 rounded"
                                        >
                                            Cari
                                        </button>
                                    </form> */}
                                </div>
                                <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 px-2 pt-5">
                                    <Link
                                        className="px-6 py-2 text-white text-sm bg-green-500 rounded-md focus:outline-none"
                                        href={ route("guru.create") }
                                    >
                                        Tambah Guru
                                    </Link>
                                </div>
                            </div>
  
                            <div className="overflow-auto">
                                <table className="table-auto w-full">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            {/* <th className="border px-4 py-2 text-sm">No.</th> */}
                                            <th colSpan="2" className="border px-4 py-2 text-sm">Nama Guru</th>
                                            <th className="border px-4 py-2 text-sm">Tempat/Tanggal Lahir</th>
                                            <th className="border px-4 py-2 text-sm">Nomer Telpon</th>
                                            <th className="border px-4 py-2 text-sm">Alamat Email</th>
                                            <th className="border px-4 py-2 text-sm w-32">Status</th>
                                            <th className="border px-4 py-2 text-sm">Password Default</th>
                                            <th className="border px-4 py-2 text-sm w-48">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {guru.data.map(({ id, nama, tempat_lahir, tanggal_lahir, no_telpon, email, foto, jenis_kelamin, id_user, status, password_default }) => (
                                            <tr>
                                                {/* <td className="border px-4 py-2 text-sm">{ id }</td> */}
                                                <td className="border px-4 py-2 text-sm"><img src={ (foto) ? "/images/guru/"+foto : (jenis_kelamin == 'L') ? "/images/man.png" : "/images/woman.png" } alt="" width="70" /></td>
                                                <td className="border px-4 py-2 text-sm">{ nama }</td>
                                                <td className="border px-4 py-2 text-sm">{ tempat_lahir } / { tanggal_lahir }</td>
                                                <td className="border px-4 py-2 text-sm">{ no_telpon }</td>
                                                <td className="border px-4 py-2 text-sm">{ email }</td>
                                                <td className="border px-4 py-2 text-sm text-center">{/* (status == 1) ? 'Aktif' : 'Non-Aktif' */}{ (status == 1) ? <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400" onClick={ () => statusData(id_user, status) } style={{ cursor: 'pointer' }}>Aktif</span> : <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-400 border border-yellow-400" onClick={ () => statusData(id_user, status) } style={{ cursor: 'pointer' }}>Non-Aktif</span> }</td>
                                                <td className="border px-4 py-2 text-sm text-center"><span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">{ password_default }</span></td>
                                                <td className="border px-4 py-2 text-sm">
                                                    <Link
                                                        tabIndex="1"
                                                        className="px-4 py-2 text-sm text-white bg-blue-500 rounded"
                                                        href={route("guru.edit", id)}
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        // onClick={destroy}
                                                        onClick={() => handleDelete(id)}
                                                        id={id}
                                                        tabIndex="-1"
                                                        type="button"
                                                        className="mx-1 px-4 py-2 text-sm text-white bg-red-500 rounded"
                                                    >
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
    
                                        {guru.data.length === 0 && (
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

                            <Pagination className="mt-6" links={guru.links} />

                        </div>
                    </div>
                </div>
            {/* </div> */}
        </DashboardLayout>
    );
}
