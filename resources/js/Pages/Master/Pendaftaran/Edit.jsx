// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect } from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Swal from 'sweetalert2';

export default function Edit({ auth, props, tahun_ajaran }) {

    const { pendaftaran, errors } = usePage().props;
    const { data, setData, post } = useForm({
        id_tahun_ajaran: pendaftaran.id_tahun_ajaran || "",
        nama: pendaftaran.nama || "",
        tanggal_mulai: pendaftaran.tanggal_mulai || "",
        tanggal_selesai: pendaftaran.tanggal_selesai || "",
        deskripsi: pendaftaran.deskripsi || "",
        _method: 'PUT'
    });

    const [editTahunAjaran, setEditTahunAjaran] = useState(pendaftaran.id_tahun_ajaran);
    const [editNama, setEditNama] = useState(pendaftaran.nama);
    const [editTanggalMulai, setEditTanggalMulai] = useState(pendaftaran.tanggal_mulai);
    const [editTanggalSelesai, setEditTanggalSelesai] = useState(pendaftaran.tanggal_selesai);
    const [editDeskripsi, setEditDeskripsi] = useState({
        content: pendaftaran.deskripsi
    });

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setEditDeskripsi({
            ...editDeskripsi,
            content: data
        });
    };
  
    function handleSubmit(e) {
        e.preventDefault();
        console.log(editDeskripsi);
        Swal.fire({
            title: 'Simpan Data Pendaftaran?',
            type: 'warning',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oke',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                // put(route("pendaftaran.update", pendaftaran.id));
                router.post(`/pendaftaran/${pendaftaran.id}`, {
                    id_tahun_ajaran: editTahunAjaran,
                    nama: editNama,
                    tanggal_mulai: editTanggalMulai,
                    tanggal_selesai: editTanggalSelesai,
                    deskripsi: editDeskripsi,
                    _method: 'PUT',
                });
            }
        });
    }
  
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Pendaftaran</h2>}
        >
            <Head title="Pendaftaran" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Edit Pendaftaran</h1>
  
                            {/* <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
                                    href={ route("pendaftaran.index") }
                                >
                                    Kembali
                                </Link>
                            </div> */}
  
  <form name="createForm" onSubmit={handleSubmit}>
                                <div className="flex flex-col">

                                    {/* <div className="mb-4">
                                        <label className="">Tahun Ajaran <span className='text-red-600'>*</span></label>
                                        <select name="id_tahun_ajaran" required className="w-full px-4 py-2" onChange={(e) =>
                                                setData("id_tahun_ajaran", e.target.value)
                                            }>
                                            <option value="">-Pilih Tahun Ajaran-</option>
                                            {tahun_ajaran.map(({ id, nama, periode_aktif }) => {
                                                
                                                if (pendaftaran.id_tahun_ajaran == id){
                                                    return <option value={id} selected>{nama}</option>
                                                }

                                                return <option value={id}>{nama}</option>
                                            })}
                                        </select>
                                        <span className="text-red-600">
                                            {errors.id_tahun_ajaran}
                                        </span>
                                    </div> */}

                                    <div className="mb-4">
                                        <label className="">Judul <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Judul"
                                            name="nama"
                                            required
                                            defaultValue={data.nama}
                                            onChange={(e) =>
                                                // setData("nama", e.target.value)
                                                setEditNama(e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.nama}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Tanggal Mulai <span className='text-red-600'>*</span></label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-2"
                                            label="Tanggal Mulai"
                                            name="tanggal_mulai"
                                            required
                                            defaultValue={data.tanggal_mulai}
                                            onChange={(e) =>
                                                // setData("tanggal_mulai", e.target.value)
                                                setEditTanggalMulai(e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.tanggal_mulai}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Tanggal Selesai <span className='text-red-600'>*</span></label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-2"
                                            label="Tanggal Selesai"
                                            name="tanggal_selesai"
                                            required
                                            defaultValue={data.tanggal_selesai}
                                            onChange={(e) =>
                                                // setData("tanggal_selesai", e.target.value)
                                                setEditTanggalSelesai(e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.tanggal_selesai}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Deskripsi Pendaftaran <span className='text-red-600'>*</span></label>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={data.deskripsi}
                                            onChange={handleEditorChange}
                                            config={{
                                                ckfinder: {
                                                    uploadUrl: '/api/upload',
                                                },
                                            }}
                                        />
                                        {/* <textarea
                                            id="deskripsi"
                                            name="deskripsi"
                                            placeholder=''
                                            rows={5}
                                            className="w-full px-4 py-2"
                                            required
                                            value={data.deskripsi}
                                            onChange={(e) => setData('deskripsi', e.target.value)}
                                        /> */}
                                        <span className="text-red-600">
                                            {errors.deskripsi}
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
                                            href={ route("pendaftaran.index") }
                                        >
                                            Batalkan
                                        </Link>
                                </div>
                            </form>

                            <style>
                            {`
                            .ck-editor__editable_inline {
                                min-height: 200px;
                                    }
                            `}
                            </style>
  
                        </div>
                    </div>
                </div>
            {/* </div> */}
        </DashboardLayout>
    );
}
