// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect } from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Swal from 'sweetalert2';

export default function Create({ auth, tahun_ajaran }) {
  
    const { errors } = usePage().props;

    const { data, setData, post } = useForm({
        id_tahun_ajaran: "",
        nama: "",
        tanggal_mulai: "",
        tanggal_selesai: "",
        deskripsi: "",
        _method: 'POST'
    });

    const [editTahunAjaran, setEditTahunAjaran] = useState("");
    const [editNama, setEditNama] = useState("");
    const [editTanggalMulai, setEditTanggalMulai] = useState("");
    const [editTanggalSelesai, setEditTanggalSelesai] = useState("");
    const [editDeskripsi, setEditDeskripsi] = useState({
        content: ""
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
                // post(route("pendaftaran.store"));
                router.post(`/pendaftaran`, {
                    id_tahun_ajaran: editTahunAjaran,
                    nama: editNama,
                    tanggal_mulai: editTanggalMulai,
                    tanggal_selesai: editTanggalSelesai,
                    deskripsi: editDeskripsi,
                    _method: 'POST',
                });
            }
        });
    }
  
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah Pendaftaran</h2>}
        >
            <Head title="Pendaftaran" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Tambah Pendaftaran</h1>
  
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
                                            {tahun_ajaran.map(({ id, nama }) => (
                                                <option value={id}>{nama}</option>
                                            ))}
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
                                            // value={data.nama}
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
                                            // value={data.tanggal_mulai}
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
                                            // value={data.tanggal_selesai}
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
                                            data={editDeskripsi.content}
                                            config={{
                                                ckfinder: {
                                                    uploadUrl: '/api/upload',
                                                    // uploadUrl: '/ckfinder/connector?command=QuickUpload&type=Files',
                                                    // options: {
                                                    //     resourceType: 'Images'
                                                    // }
                                                },
                                                // toolbar: [
                                                //     'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'imageUpload', 'undo', 'redo'
                                                // ]
                                            }}
                                            onChange={handleEditorChange}
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
