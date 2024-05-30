// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect } from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, usePage, Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, props, semester, filtering, id_semester }) {
    
    const { guru, flash } = usePage().props

    filtering = filtering || {};
        const doFilterData = (name, value) => {
            if (value) {
                filtering[name] = value;
            } else {
                delete filtering[name];
            }

        router.get('/guru-pengampu', filtering);
    };

    const doSearchData = (name, e) => {
        if (e.key !== "Enter") return;
    
        doFilterData(name, e.target.value);
    };

    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Guru Pengampu</h2>}
        >
            <Head title="Guru Pengampu" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Guru Pengampu</h1>

                            {flash.message && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-5 rounded relative" role="alert">
                                <strong className="font-bold">Berhasil!</strong> &nbsp;<span className="block sm:inline">{flash.message}</span>
                              </div>
                            )}

                            <div className="-mx-2 md:items-center md:flex mb-5">
                                <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 px-2">
                                    <label className="font-bold text-sm">Periode Semester</label>
                                    <select name="id_semester" 
                                    defaultValue={filtering.id_semester} 
                                    className="w-full px-4 py-2" onChange={(e) =>
                                        doFilterData("id_semester", e.target.value)
                                    }>
                                        <option value="">-Pilih Semester-</option>
                                        {semester.map(({ id, nama }) => {

                                        if (id_semester == id){
                                            return <option value={id} selected>{nama}</option>
                                        }

                                        return <option value={id}>{nama}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
  
                            <div className="overflow-auto">
                                <table className="table-auto w-full">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            {/* <th className="border px-4 py-2 text-sm">No.</th> */}
                                            <th colSpan="2" className="border px-4 py-2 text-sm">Nama Guru</th>
                                            <th className="border px-4 py-2 text-sm">Alamat Email</th>
                                            <th className="border px-4 py-2 text-sm">Kelompok</th>
                                            <th className="border px-4 py-2 text-sm">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {guru.data.map(({ id, nama, email, jenis_kelamin, foto, kelompok }) => (
                                            <tr>
                                                {/* <td className="border px-4 py-2 text-sm">{ id }</td> */}
                                                <td className="border px-4 py-2 text-sm"><img src={ (foto) ? "/images/guru/"+foto : (jenis_kelamin == 'L') ? "/images/man.png" : "/images/woman.png" } alt="" width="70" /></td>
                                                <td className="border px-4 py-2 text-sm">{ nama }</td>
                                                <td className="border px-4 py-2 text-sm">{ email }</td>
                                                <td className="border px-4 py-2 text-sm">{ kelompok }</td>
                                                <td className="border px-4 py-2 text-sm">
                                                    <Link
                                                        tabIndex="1"
                                                        className="px-4 py-2 text-sm text-white bg-blue-500 rounded"
                                                        href={route("kelompok-guru", id+'-'+id_semester)}
                                                    >
                                                        Kelompok
                                                    </Link>
                                                    
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
