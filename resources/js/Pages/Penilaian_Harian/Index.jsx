// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect } from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, usePage, Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, props, semester, id_semester, kelompok_usia, kelompok, filtering, tanggal_penilaian, dimensi, format_tanggal_penilaian }) {
    
    const { penilaian, flash } = usePage().props

    filtering = filtering || {};
        const doFilterData = (name, value) => {
            if (value) {
                filtering[name] = value;
            } else {
                delete filtering[name];
            }

        router.get('/penilaian-harian', filtering);
    };

    const doSearchData = (name, e) => {
        if (e.key !== "Enter") return;
    
        doFilterData(name, e.target.value);
    };

    const handleDateChange = (name, e) => {
        const newDate = e.target.value;
        doFilterData(name, e.target.value);
    };
   
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Penilaian Harian</h2>}
        >
            <Head title="Penilaian Harian" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Penilaian Harian</h1>

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
                                <div className="flex-1 px-2">
                                    <label className="font-bold text-sm">Periode Semester</label>
                                    <select name="id_semester" 
                                    defaultValue={filtering.id_semester} 
                                    className="w-full px-4 py-2 text-sm" onChange={(e) =>
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
                                
                                <div className="flex-1 px-2">
                                    <label className="font-bold text-sm">Tanggal Penilaian</label>
                                    <input
                                        type="date"
                                        className="w-full text-sm"
                                        defaultValue={tanggal_penilaian}
                                        placeholder="Tanggal Penilaian"
                                        // onBlur={(e) =>
                                        //     filtering("tanggal_penilaian", e.target.value)
                                        // }
                                        // onKeyPress={(e) => doSearchData("tanggal_penilaian", e)}
                                        onChange={(e) => handleDateChange("tanggal_penilaian", e)}
                                        />
                                </div>

                                <div className="flex-1 px-2">
                                    <label className="font-bold text-sm">Kelompok Usia</label>
                                    <select name="id_kelompok_usia" 
                                    defaultValue={filtering.id_kelompok_usia} 
                                    className="w-full px-4 py-2 text-sm" onChange={(e) =>
                                        doFilterData("id_kelompok_usia", e.target.value)
                                    }>
                                        <option value="">-Pilih Kelompok Usia-</option>
                                        {kelompok_usia.map(({ id, nama }) => (
                                            <option value={id}>{nama}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1 px-2">
                                    <label className="font-bold text-sm">Kelompok / Rombel</label>
                                    <select name="id_kelompok" 
                                    defaultValue={filtering.id_kelompok} 
                                    className="w-full px-4 py-2 text-sm" onChange={(e) =>
                                        doFilterData("id_kelompok", e.target.value)
                                    }>
                                        <option value="">-Pilih Kelompok-</option>
                                        {kelompok.map(({ id, nama, kelompok_usia }) => (
                                            <option value={id}>{nama} ({kelompok_usia})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1 px-2">
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

                            <b>{format_tanggal_penilaian}</b>
  
                            <div className="overflow-auto">
                                <table className="table-auto w-full">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            {/* <th className="border px-4 py-2 text-sm">No.</th> */}
                                            <th className="border px-4 py-2 text-sm">Kelompok</th>
                                            <th colSpan="2" className="border px-4 py-2 text-sm">Nama</th>
                                            {dimensi.map(({ id, nama }) => (
                                            <th className="border px-4 py-2 text-sm">{nama.substring(0, 4)}...</th>
                                            ))} 
                                            <th className="border px-4 py-2 text-sm">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {penilaian.data.map((dt1) => ( // { id, id_kelompok_siswa, nama_panggilan, nama_lengkap, no_induk, foto, jenis_kelamin, kelompok, id_kelompok, kelompok_usia, id_setting }
                                            <tr>
                                                {/* <td className="border px-4 py-2 text-sm">{ id }</td> */}
                                                {/* <td className="border px-4 py-2 text-sm"><img src={ (foto) ? "/images/siswa/"+foto : (jenis_kelamin == 'L') ? "/images/boy.png" : "/images/girl.png" } alt="" width="70" /></td> */}
                                                <td className="border px-4 py-2 text-sm"><b>{ dt1.kelompok }</b><br />{ dt1.kelompok_usia }</td>
                                                <td className="border px-4 py-2 text-sm"><img src={ (dt1.foto) ? "/images/siswa/"+dt1.foto : (dt1.jenis_kelamin == 'L') ? "/images/boy.png" : "/images/girl.png" } alt="" width="70" /></td>
                                                <td className="border px-4 py-2 text-sm"><b>{ dt1.nama_panggilan }</b><br />{ dt1.nama_lengkap }<br />No. Induk: { dt1.no_induk }</td>
                                                {dimensi.map((dt2,index) => (
                                                <td className="border px-4 py-2 text-sm">{ (dt1.nilaspek[index].kode) ? (dt1.nilaspek[index].kode == 'SM') ? <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">{ dt1.nilaspek[index].kode }</span> : <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-400 border border-yellow-400">{ dt1.nilaspek[index].kode }</span> : "" }</td>
                                                ))} 
                                                <td className="border px-4 py-2 text-sm">
                                                { (dt1.id_setting) ? 
                                                    <div className="pb-5"><Link
                                                        tabIndex="1"
                                                        className="px-4 py-2 text-sm text-white bg-blue-500 rounded"
                                                        href={route("penilaian-harian.edit", dt1.id_kelompok_siswa+"-"+tanggal_penilaian+"-"+id_semester)}
                                                    >
                                                        Penilaian
                                                    </Link></div> : "" }<div><Link
                                                        tabIndex="1"
                                                        className="px-4 py-2 text-sm text-white bg-orange-500 rounded"
                                                        href={route("indikator-penilaian-harian.edit", dt1.id_kelompok+"-"+tanggal_penilaian)}
                                                    >
                                                        Setting
                                                    </Link></div>
                                                    
                                                </td>
                                            </tr>
                                        ))}
    
                                        {penilaian.data.length === 0 && (
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

                            <Pagination className="mt-6" links={penilaian.links} />

                        </div>
                    </div>
                </div>
            {/* </div> */}
        </DashboardLayout>
    );
}
