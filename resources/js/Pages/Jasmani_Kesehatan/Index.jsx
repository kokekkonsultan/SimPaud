// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect } from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, usePage, Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, props, semester, bulan, bulan_ke, id_semester, kelompok_usia, kelompok, searching, filtering, jenis_semester, role_id }) {
    
    const { jasmani_kesehatan, flash } = usePage().props

    // const [ search, setSearch ] = useState(searching.search || '')

    // const doSearchData = (e) =>{
    //     e.preventDefault();
    //     router.get('/jasmani-kesehatan', { search }, { preserveState: true })
    // }

    filtering = filtering || {};
        const doFilterData = (name, value) => {
            if (value) {
                filtering[name] = value;
            } else {
                delete filtering[name];
            }

        router.get('/jasmani-kesehatan', filtering);
    };

    const doSearchData = (name, e) => {
        if (e.key !== "Enter") return;
    
        doFilterData(name, e.target.value);
    };

    const databulan = [
        {id: "1", nama: "Juli", semester: "1"}, 
        {id: "2", nama: "Agustus", semester: "1"},
        {id: "3", nama: "September", semester: "1"},
        {id: "4", nama: "Oktober", semester: "1"},
        {id: "5", nama: "November", semester: "1"},
        {id: "6", nama: "Desember", semester: "1"},
        {id: "1", nama: "Januari", semester: "2"}, 
        {id: "2", nama: "Februari", semester: "2"},
        {id: "3", nama: "Maret", semester: "2"},
        {id: "4", nama: "April", semester: "2"},
        {id: "5", nama: "Mei", semester: "2"},
        {id: "6", nama: "Juni", semester: "2"}
    ]
   
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Jasmani Kesehatan</h2>}
        >
            <Head title="Jasmani Kesehatan" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Jasmani dan Kesehatan</h1>

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
                                <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 px-2">
                                    <label className="font-bold text-sm">Bulan</label>
                                    <select name="bulan" 
                                    defaultValue={filtering.bulan} 
                                    className="w-full px-4 py-2 text-sm" onChange={(e) =>
                                        doFilterData("bulan", e.target.value)
                                    }>
                                        <option value="">-Pilih Bulan-</option>
                                        {databulan.map(({ id, nama, semester }) => {
                                                if (jenis_semester == semester){
                                                    if (bulan_ke == id){
                                                        return <option value={id} selected>{nama}</option>
                                                    }

                                                    return <option value={id}>{nama}</option>
                                                }
                                            })}
                                    </select>
                                </div>
                                { (role_id == 5) ? "" :
                                <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 px-2">
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
                                </div> }

                                { (role_id == 5) ? "" :
                                <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 px-2">
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
                                </div> }

                                { (role_id == 5) ? "" :
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

                                    {/* <form onSubmit={doSearchData}>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            value={search}
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
                                </div> }
                                
                            </div>
  
                            <div className="overflow-auto">
                                <table className="table-auto w-full">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            {/* <th className="border px-4 py-2 text-sm">No.</th> */}
                                            <th className="border px-4 py-2 text-sm">Kelompok</th>
                                            <th colSpan="2" className="border px-4 py-2 text-sm">Nama</th>
                                            <th className="border px-4 py-2 text-sm">Mata</th>
                                            <th className="border px-4 py-2 text-sm">Mulut</th>
                                            <th className="border px-4 py-2 text-sm">Gigi</th>
                                            <th className="border px-4 py-2 text-sm">Telinga</th>
                                            <th className="border px-4 py-2 text-sm">Hidung</th>
                                            <th className="border px-4 py-2 text-sm">Lingkar Kepala</th>
                                            <th className="border px-4 py-2 text-sm">Berat Badan</th>
                                            <th className="border px-4 py-2 text-sm">Tinggi Badan</th>
                                            { (role_id == 5) ? "" : <th className="border px-4 py-2 text-sm">Action</th> }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {jasmani_kesehatan.data.map(({ id, id_kelompok_siswa, nama_panggilan, nama_lengkap, no_induk, foto, jenis_kelamin, mata, mulut, gigi, telinga, hidung, lingkar_kepala, berat_badan, tinggi_badan, kelompok, kelompok_usia }) => (
                                            <tr>
                                                {/* <td className="border px-4 py-2 text-sm">{ id }</td> */}
                                                {/* <td className="border px-4 py-2 text-sm"><img src={ (foto) ? "/images/siswa/"+foto : (jenis_kelamin == 'L') ? "/images/boy.png" : "/images/girl.png" } alt="" width="70" /></td> */}
                                                <td className="border px-4 py-2 text-sm"><b>{ kelompok }</b><br />{ kelompok_usia }</td>
                                                <td className="border px-4 py-2 text-sm"><img src={ (foto) ? "/images/siswa/"+foto : (jenis_kelamin == 'L') ? "/images/boy.png" : "/images/girl.png" } alt="" width="70" /></td>
                                                <td className="border px-4 py-2 text-sm"><b>{ nama_panggilan }</b><br />{ nama_lengkap }<br />No. Induk: { no_induk }</td>
                                                <td className="border px-4 py-2 text-sm">{ (mata) ? mata : '-' }</td>
                                                <td className="border px-4 py-2 text-sm">{ (mulut) ? mulut : '-' }</td>
                                                <td className="border px-4 py-2 text-sm">{ (gigi) ? gigi : '-' }</td>
                                                <td className="border px-4 py-2 text-sm">{ (telinga) ? telinga : '-' }</td>
                                                <td className="border px-4 py-2 text-sm">{ (hidung) ? hidung : '-' }</td>
                                                <td className="border px-4 py-2 text-sm">{ (lingkar_kepala) ? lingkar_kepala : '-' } Cm</td>
                                                <td className="border px-4 py-2 text-sm">{ (berat_badan) ? berat_badan : '-' } Kg</td>
                                                <td className="border px-4 py-2 text-sm">{ (tinggi_badan) ? tinggi_badan : '-' } Cm</td>
                                                { (role_id == 5) ? "" : <td className="border px-4 py-2 text-sm">
                                                    <Link
                                                        tabIndex="1"
                                                        className="px-4 py-2 text-sm text-white bg-blue-500 rounded"
                                                        href={route("jasmani-kesehatan", id_kelompok_siswa+"-"+bulan_ke+"-"+id_semester)}
                                                    >
                                                        Edit
                                                    </Link>
                                                    {/* <Link
                                                        tabIndex="1"
                                                        className="px-4 py-2 text-sm text-white bg-blue-500 rounded"
                                                        onClick={ () => editData(id_kelompok_siswa, bulan_ke, id_semester) }
                                                    >
                                                        Edit
                                                    </Link> */}
                                                </td> }
                                            </tr>
                                        ))}
    
                                        {jasmani_kesehatan.data.length === 0 && (
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

                            <Pagination className="mt-6" links={jasmani_kesehatan.links} />

                        </div>
                    </div>
                </div>
            {/* </div> */}
        </DashboardLayout>
    );
}
