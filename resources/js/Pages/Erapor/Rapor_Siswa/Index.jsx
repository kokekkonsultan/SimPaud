// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect } from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, usePage, Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import Swal from 'sweetalert2';

export default function Index({ auth, props, semester, id_semester, kelompok_usia, kelompok, searching, filtering, jenis_semester, role_id }) {
    
    const { rapor_siswa, flash } = usePage().props

    filtering = filtering || {};
        const doFilterData = (name, value) => {
            if (value) {
                filtering[name] = value;
            } else {
                delete filtering[name];
            }

        router.get('/rapor-siswa', filtering);
    };

    const doSearchData = (name, e) => {
        if (e.key !== "Enter") return;
    
        doFilterData(name, e.target.value);
    };

    const jasmanikesehatanData = (id, jasmani_kesehatan) => {
        // if (confirm("Apakah Anda yakin ingin mengaktifkan/menonaktifkan data ini?")) {
        //     Inertia.get(`/rapor-siswa/jasmani-kesehatan/${id}/${jasmani_kesehatan}`);
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
                router.get(`/rapor-siswa/jasmani-kesehatan/${id}/${jasmani_kesehatan}`);
                Swal.fire(
                    'Diubah!',
                    'Data berhasil diubah.',
                    'success'
                );
            }
        });
    }

    const statusData = (id, status) => {
        // if (confirm("Apakah Anda yakin ingin mengaktifkan/menonaktifkan data ini?")) {
        //     Inertia.get(`/rapor-siswa/status-rapor/${id}/${status}`);
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
                router.get(`/rapor-siswa/status-rapor/${id}/${status}`);
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Rapor Siswa</h2>}
        >
            <Head title="Rapor Siswa" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Rapor Siswa</h1>

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
                                            <th className="border px-4 py-2 text-sm">Jasmani dan Kesehatan</th>
                                            { (role_id == 5) ? "" : <th className="border px-4 py-2 text-sm">Unduh Rapor</th> }
                                            <th className="border px-4 py-2 text-sm">Dilihat Orang Tua</th>
                                            <th className="border px-4 py-2 text-sm">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rapor_siswa.data.map((dt1,index) => ( // { id, id_kelompok_siswa, nama_panggilan, nama_lengkap, no_induk, foto, jenis_kelamin, jasmani_kesehatan, status, dilihat_orang_tua, kelompok, kelompok_usia, id_rapor_siswa }
                                            <tr>
                                                {/* <td className="border px-4 py-2 text-sm">{ id }</td> */}
                                                {/* <td className="border px-4 py-2 text-sm"><img src={ (foto) ? "/images/siswa/"+foto : (jenis_kelamin == 'L') ? "/images/boy.png" : "/images/girl.png" } alt="" width="70" /></td> */}
                                                <td className="border px-4 py-2 text-sm"><b>{ dt1.kelompok }</b><br />{ dt1.kelompok_usia }</td>
                                                <td className="border px-4 py-2 text-sm"><img src={ (dt1.foto) ? "/images/siswa/"+dt1.foto : (dt1.jenis_kelamin == 'L') ? "/images/boy.png" : "/images/girl.png" } alt="" width="70" /></td>
                                                <td className="border px-4 py-2 text-sm"><b>{ dt1.nama_panggilan }</b><br />{ dt1.nama_lengkap }<br />No. Induk: { dt1.no_induk }</td>
                                                
                                                { (dt1.id_rapor_siswa) ? <td className="border px-4 py-2 text-sm"><span className="text-xs">Tampilkan Catatan Jasmani dan Kesehatan pada rapor { dt1.nama_panggilan }?</span><br />
                                                <a
                                                        style={{ cursor: 'pointer' }}
                                                        tabIndex="1"
                                                        className="px-2 py-1 text-xs text-white bg-blue-500 rounded"
                                                        onClick={ () => jasmanikesehatanData(dt1.id_rapor_siswa, dt1.jasmani_kesehatan) }
                                                    >{ (dt1.jasmani_kesehatan == 1) ? 'Iya' : 'Tidak' }</a></td> : <td className="border px-4 py-2 text-sm"></td> }
                                                { (role_id == 5) ? "" : (dt1.id_rapor_siswa) ? <td className="border px-4 py-2 text-sm"><span className="text-xs">Orang Tua { dt1.nama_panggilan } dapat mengunduh rapor ini?</span><br />
                                                <a
                                                        style={{ cursor: 'pointer' }}
                                                        tabIndex="1"
                                                        className="px-2 py-1 text-xs text-white bg-blue-500 rounded"
                                                        onClick={ () => statusData(dt1.id_rapor_siswa, dt1.status) }
                                                    >{ (dt1.status == 1) ? 'Iya' : 'Tidak' }</a></td> : <td className="border px-4 py-2 text-sm"></td> }
                                                { (dt1.id_rapor_siswa) ? <td className="border px-4 py-2 text-sm">{ (dt1.dilihat_orang_tua == 1) ? 'Sudah Dilihat' : 'Belum Dilihat' }</td> : <td className="border px-4 py-2 text-sm"></td> }
                                                { <td className="border px-4 py-2 text-sm">
                                                    { (role_id == 5) ? "" :  (dt1.id_rapor_siswa) ? 
                                                    <Link
                                                        tabIndex="1"
                                                        className="px-4 py-2 text-sm text-white bg-yellow-500 rounded"
                                                        href={route("rapor-siswa.edit", dt1.id_kelompok_siswa+"-"+id_semester)}
                                                    >
                                                        Edit
                                                    </Link> : ((dt1.jumlah_penilaian)) ? <Link
                                                        tabIndex="1"
                                                        className="px-4 py-2 text-sm text-white bg-blue-500 rounded"
                                                        href={route("rapor-siswa", dt1.id_kelompok_siswa+"-"+id_semester)}
                                                    >
                                                        Buat
                                                    </Link> : "" }
                                                    &nbsp;
                                                    { (dt1.id_rapor_siswa) ?
                                                    <a
                                                        tabIndex="1"
                                                        target="_blank"
                                                        className="px-4 py-2 text-sm text-white bg-green-500 rounded"
                                                        href={route("lihat-rapor", dt1.id_kelompok_siswa+"-"+id_semester)}
                                                    >
                                                        Lihat
                                                    </a> : '' }
                                                    
                                                    {/* {dt1.jumlah_penilaian.map((dt2) => (
                                                    <span> { dt2.jumlah_penilaian }</span>
                                                    ))}  */}

                                                    

                                                </td> }
                                            </tr>
                                        ))}
    
                                        {rapor_siswa.data.length === 0 && (
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

                            <Pagination className="mt-6" links={rapor_siswa.links} />

                        </div>
                    </div>
                </div>
            {/* </div> */}
        </DashboardLayout>
    );
}
