// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect } from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Edit({ auth, props, jasmani_kesehatan, id_kelompok_siswa, id_semester, bulan_ke, nama_bulan, nama_semester }) {

    const { data, setData, post, errors } = useForm({
        nama_lengkap: jasmani_kesehatan.nama_lengkap || "",
        nama_panggilan: jasmani_kesehatan.nama_panggilan || "",
        no_induk: jasmani_kesehatan.no_induk || "",
        nisn: jasmani_kesehatan.nisn || "",
        jenis_kelamin: jasmani_kesehatan.jenis_kelamin || "",
        foto: jasmani_kesehatan.foto || "",

        mata: jasmani_kesehatan.mata || "",
        mulut: jasmani_kesehatan.mulut || "",
        gigi: jasmani_kesehatan.gigi || "",
        telinga: jasmani_kesehatan.telinga || "",
        hidung: jasmani_kesehatan.hidung || "",
        lingkar_kepala: jasmani_kesehatan.lingkar_kepala || "",
        berat_badan: jasmani_kesehatan.berat_badan || "",
        tinggi_badan: jasmani_kesehatan.tinggi_badan || "",
    });

    const kondisi = [
        {id: "Baik", nama: "Baik"}, 
        {id: "Cukup", nama: "Cukup"},
        {id: "Kurang", nama: "Kurang"}
    ]
  
    function handleSubmit(e) {
        e.preventDefault();
        Swal.fire({
            title: 'Simpan Data Jasmani dan Kesehatan?',
            type: 'warning',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oke',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                post(route("jasmani-kesehatan-edit.update", id_kelompok_siswa+"-"+bulan_ke+"-"+id_semester));
            }
        });
    }
  
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

                            <h1 className="text-2xl mb-5">Catatan Jasmani dan Kesehatan</h1>
  
                            {/* <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
                                    href={ route("jasmani-kesehatan.index") }
                                >
                                    Kembali
                                </Link>
                            </div> */}

                            <table className="table-fixed w-full mb-5">
                                <tbody>
                                    <tr>
                                        <td className="border px-4 py-2 w-40"><img src={ (data.foto) ? "/images/siswa/"+data.foto : (data.jenis_kelamin == 'L') ? "/images/boy.png" : "/images/girl.png" } alt="" width="70" /></td>
                                        <td className="border px-4 py-2"><b>{ data.nama_panggilan }</b> - { data.nama_lengkap }<br />No. Induk: { data.no_induk } | NISN: { data.nisn }</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="flex mb-6"><b>{nama_bulan}</b> &nbsp;-&nbsp; <b>{nama_semester}</b></div>
  
                            <form name="createForm" onSubmit={handleSubmit}>

                            <input
                                type="hidden"
                                name="id_kelompok_siswa"
                                value={id_kelompok_siswa}
                                onChange={(e) =>
                                    setData("id_kelompok_siswa", e.target.value)
                                }
                            />

                            <input
                                type="hidden"
                                name="bulan"
                                value={bulan_ke}
                                onChange={(e) =>
                                    setData("bulan", e.target.value)
                                }
                            />

                            <input
                                type="hidden"
                                name="id_semester"
                                value={id_semester}
                                onChange={(e) =>
                                    setData("id_semester", e.target.value)
                                }
                            />


                                <div className="flex flex-col">
                                    <div className="mb-4">
                                        <label className="">Mata <span className='text-red-600'>*</span></label>
                                        <select name="mata" required className="w-full px-4 py-2" onChange={(e) =>
                                                setData("mata", e.target.value)
                                            }>
                                            <option value="">-Pilih-</option>
                                            {kondisi.map(({ id, nama }) => {
                                                
                                                if (jasmani_kesehatan.mata == id){
                                                    return <option value={id} selected>{nama}</option>
                                                }

                                                return <option value={id}>{nama}</option>
                                            })}
                                        </select>
                                        <span className="text-red-600">
                                            {errors.mata}
                                        </span>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="">Mulut <span className='text-red-600'>*</span></label>
                                        <select name="mulut" required className="w-full px-4 py-2" onChange={(e) =>
                                                setData("mulut", e.target.value)
                                            }>
                                            <option value="">-Pilih-</option>
                                            {kondisi.map(({ id, nama }) => {
                                                
                                                if (jasmani_kesehatan.mulut == id){
                                                    return <option value={id} selected>{nama}</option>
                                                }

                                                return <option value={id}>{nama}</option>
                                            })}
                                        </select>
                                        <span className="text-red-600">
                                            {errors.mulut}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Gigi <span className='text-red-600'>*</span></label>
                                        <select name="gigi" required className="w-full px-4 py-2" onChange={(e) =>
                                                setData("gigi", e.target.value)
                                            }>
                                            <option value="">-Pilih-</option>
                                            {kondisi.map(({ id, nama }) => {
                                                
                                                if (jasmani_kesehatan.gigi == id){
                                                    return <option value={id} selected>{nama}</option>
                                                }

                                                return <option value={id}>{nama}</option>
                                            })}
                                        </select>
                                        <span className="text-red-600">
                                            {errors.gigi}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Telinga <span className='text-red-600'>*</span></label>
                                        <select name="telinga" required className="w-full px-4 py-2" onChange={(e) =>
                                                setData("telinga", e.target.value)
                                            }>
                                            <option value="">-Pilih-</option>
                                            {kondisi.map(({ id, nama }) => {
                                                
                                                if (jasmani_kesehatan.telinga == id){
                                                    return <option value={id} selected>{nama}</option>
                                                }

                                                return <option value={id}>{nama}</option>
                                            })}
                                        </select>
                                        <span className="text-red-600">
                                            {errors.telinga}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Hidung <span className='text-red-600'>*</span></label>
                                        <select name="hidung" required className="w-full px-4 py-2" onChange={(e) =>
                                                setData("hidung", e.target.value)
                                            }>
                                            <option value="">-Pilih-</option>
                                            {kondisi.map(({ id, nama }) => {
                                                
                                                if (jasmani_kesehatan.hidung == id){
                                                    return <option value={id} selected>{nama}</option>
                                                }

                                                return <option value={id}>{nama}</option>
                                            })}
                                        </select>
                                        <span className="text-red-600">
                                            {errors.hidung}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Lingkar Kepala <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Lingkar Kepala"
                                            name="lingkar_kepala"
                                            required
                                            value={data.lingkar_kepala}
                                            onChange={(e) =>
                                                setData("lingkar_kepala", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.lingkar_kepala}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Berat Badan <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Berat Badan"
                                            name="berat_badan"
                                            required
                                            value={data.berat_badan}
                                            onChange={(e) =>
                                                setData("berat_badan", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.berat_badan}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Tinggi Badan <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Tinggi Badan"
                                            name="tinggi_badan"
                                            required
                                            value={data.tinggi_badan}
                                            onChange={(e) =>
                                                setData("tinggi_badan", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.tinggi_badan}
                                        </span>
                                    </div>

                                </div>
                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 text-white bg-green-500 rounded"
                                    >
                                        Simpan
                                    </button> <Link
                                            className="px-6 py-2 text-white bg-orange-500 rounded focus:outline-none"
                                            href={ route("jasmani-kesehatan.index") }
                                        >
                                            Batalkan
                                        </Link>
                                </div>
                            </form>
  
                        </div>
                    </div>
                </div>
            {/* </div> */}
        </DashboardLayout>
    );
}
