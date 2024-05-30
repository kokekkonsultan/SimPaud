// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, Fragment, useEffect } from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, usePage, Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import Swal from 'sweetalert2';

import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function Index({ auth, props, tahun_ajaran, jenis_keluar, searching, filtering }) {
    
    const { siswa, flash } = usePage().props

    const [open, setOpen] = useState(false)

    // const [ search, setSearch ] = useState(searching.search || '')
    
    const statusData = (id_user, status) => {
        // if (confirm("Apakah Anda yakin ingin mengaktifkan/menonaktifkan data ini?")) {
        //     Inertia.get(`/siswa/status/${id_user}/${status}`);
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
                router.get(`/siswa/status/${id_user}/${status}`);
                Swal.fire(
                    'Diubah!',
                    'Data berhasil diubah.',
                    'success'
                );
            }
        });
    }

    // const verifiedData = (id_user) => {
    //     if (confirm("Are you sure you want to verified this data?")) {
    //         Inertia.get(`/siswa/verifikasi/${id_user}`);
    //     }
    // }

    // const doSearchData = (e) =>{
    //     e.preventDefault();
    //     // Inertia.get('/siswa', { search }, { preserveState : true });
    //     router.get('/siswa', { search }, { preserveState: true })
    // }

    filtering = filtering || {};
        const doFilterData = (name, value) => {
            if (value) {
                filtering[name] = value;
            } else {
                delete filtering[name];
            }

        router.get('/siswa', filtering);
    };

    const doSearchData = (name, e) => {
        if (e.key !== "Enter") return;
    
        doFilterData(name, e.target.value);
    };
  
    function destroy(e) {
        if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            router.delete(route("siswa.destroy", e.currentTarget.id));
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
                router.delete(route("siswa.destroy", id));
                Swal.fire(
                    'Dihapus!',
                    'Data berhasil dihapus.',
                    'success'
                );
            }
        });
    };

    const [st, setSt]= useState([]);
    const [siswaid, setSiswaid]= useState();

    const showDetail=(id)=>{
        const getsiswaid= id;
        setSiswaid(getsiswaid);
        setOpen(true);
    }

    useEffect( ()=>{
    const getsiswa= async()=>{
        const ressiswa= await fetch(`/datasiswa/${siswaid}`);
        const resst= await ressiswa.json();
        setSt(await resst);
    }
    getsiswa();
    },[siswaid]);
   
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Siswa</h2>}
        >
            <Head title="Siswa" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Data Peserta Didik</h1>

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

<Transition.Root show={open} as={Fragment}>
                        <Dialog as="div" className="relative z-10" tabIndex="99999" onClose={setOpen}>
                            <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            >
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                            </Transition.Child>

                            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">

                                    

                                    <table className="table-auto w-full mt-2">
                                        <tbody>
                                            <tr>
                                                <td className="text-center max-w-2xl flex justify-center items-center"><img src={ (st.foto) ? "/images/siswa/"+st.foto : (st.jenis_kelamin == 'L') ? "/images/boy.png" : "/images/girl.png" } alt="" width="100" /></td>
                                            </tr>
                                            <tr>
                                                <td>

                                                    <table className="table-auto w-full mt-2">
                                                        <tbody>
                                                            {/* <tr>
                                                                <td colSpan="2" className="text-center max-w-2xl flex justify-center items-center"><p className="max-w-2xl flex justify-center items-center"><img src={ (st.foto) ? "/images/siswa/"+st.foto : (st.jenis_kelamin == 'L') ? "/images/boy.png" : "/images/girl.png" } alt="" width="70" /></p></td>
                                                            </tr> */}
                                                            <tr>
                                                                <td colSpan="2" className="text-center"><span className="text-xl font-bold">{st.nama_panggilan}</span><br />{st.nama_lengkap}</td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan="2" className="text-center text-sm">{ (st.jenis_kelamin == 'L') ? "Laki-laki" : "Perempuan" }, {st.usia_tahun} Thn {st.usia_bulan} Bln</td>
                                                            </tr>
                                                            {/* <tr>
                                                                <td className="text-right"><b>Nama Panggilan</b></td>
                                                                <td className="px-4">{st.nama_panggilan}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-right"><b>Nama Lengkap</b></td>
                                                                <td className="px-4">{st.nama_lengkap}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-right"><b>Jenis Kelamin</b></td>
                                                                <td className="px-4">{ (st.jenis_kelamin == 'L') ? "Laki-laki" : "Perempuan" }</td>
                                                            </tr> */}
                                                            <tr>
                                                                <td colSpan="2">&nbsp;</td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan="2" className="border-t">&nbsp;</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-right text-sm"><b>No. Induk</b></td>
                                                                <td className="px-4 text-sm">{st.no_induk}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-right text-sm"><b>NISN</b></td>
                                                                <td className="px-4 text-sm">{st.nisn}</td>
                                                            </tr>

                                                            <tr>
                                                                <td colSpan="2">&nbsp;</td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan="2" className="border-t">&nbsp;</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-right text-sm"><b>Tempat / Tanggal Lahir</b></td>
                                                                <td className="px-4 text-sm">{st.tempat_lahir} / {st.tanggal_lahir}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-right text-sm"><b>Agama</b></td>
                                                                <td className="px-4 text-sm">{st.agama}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-right text-sm"><b>Tahun Ajaran Masuk</b></td>
                                                                <td className="px-4 text-sm">{st.tahun_ajaran}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-right text-sm"><b>Tanggal Masuk</b></td>
                                                                <td className="px-4 text-sm">{st.tanggal_masuk}</td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan="2">&nbsp;</td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan="2" className="border-t">&nbsp;</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-right text-sm"><b>Anak Ke</b></td>
                                                                <td className="px-4 text-sm">{st.anak_ke}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-right text-sm"><b>Nama Ayah</b></td>
                                                                <td className="px-4 text-sm">{st.nama_ayah}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-right text-sm"><b>Pekerjaan Ayah</b></td>
                                                                <td className="px-4 text-sm">{st.pekerjaan_ayah}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-right text-sm"><b>Nama Ibu</b></td>
                                                                <td className="px-4 text-sm">{st.nama_ibu}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-right text-sm"><b>Pekerjaan Ibu</b></td>
                                                                <td className="px-4 text-sm">{st.pekerjaan_ibu}</td>
                                                            </tr>
                                                            {/* <tr>
                                                                <td className="text-right text-sm"><b>Nomor Telepon Ayah</b></td>
                                                                <td className="px-4 text-sm">{st.no_telpon_ayah}</td>
                                                            </tr> */}
                                                            <tr>
                                                                <td className="text-right text-sm"><b>Email Orang Tua</b></td>
                                                                <td className="px-4 text-sm">{st.email_orang_tua}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-right text-sm"><b>Nomor Kartu Keluarga</b></td>
                                                                <td className="px-4 text-sm">{st.no_kartu_keluarga}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-right text-sm"><b>NIK Orang Tua</b></td>
                                                                <td className="px-4 text-sm">{st.nik_orang_tua}</td>
                                                            </tr>
                                                            
                                                        </tbody>
                                                    </table>

                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    

                                        
                                    </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 mb-2">
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={() => setOpen(false)}
                                    >
                                        Tutup
                                    </button>
                                    </div>
                                </Dialog.Panel>
                                </Transition.Child>
                            </div>
                            </div>
                        </Dialog>
                        </Transition.Root>
  
                            <div className="-mx-2 md:items-center md:flex mb-5">
                                <div className="flex-1 px-2">
                                    <label className="font-bold text-sm">Tahun Ajaran</label>
                                    <select name="id_tahun_ajaran" defaultValue={filtering.id_tahun_ajaran} 
                                    className="w-full px-4 py-2 text-sm" onChange={(e) =>
                                        doFilterData("id_tahun_ajaran", e.target.value)
                                    }>
                                        <option value="">-Pilih Tahun Ajaran-</option>
                                        {tahun_ajaran.map(({ id, nama }) => (
                                            <option value={id}>{nama}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1 px-2">
                                    <label className="font-bold text-sm">Jenis Keluar</label>
                                    <select name="id_jenis_keluar" 
                                    defaultValue={filtering.id_jenis_keluar} 
                                    className="w-full px-4 py-2 text-sm" onChange={(e) =>
                                        doFilterData("id_jenis_keluar", e.target.value)
                                    }>
                                        <option value="">-Pilih Jenis Keluar-</option>
                                        {jenis_keluar.map(({ id, nama }) => (
                                            <option value={id}>{nama}</option>
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
                                    {/* <form onSubmit={doSearchData}>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            value={search}
                                            placeholder="Nama / No Induk"
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
                                <div className="flex-1 px-2 pt-5">
                                    <Link
                                        className="px-6 py-2 text-white text-sm bg-green-500 rounded-md focus:outline-none"
                                        href={ route("siswa.create") }
                                    >
                                        Tambah Siswa
                                    </Link>
                                </div>
                            </div>
  
                            <div className="overflow-auto">
                                <table className="table-auto w-full">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            {/* <th className="border px-4 py-2 text-sm">No.</th> */}
                                            <th colSpan="2" className="border px-4 py-2 text-sm">Nama</th>
                                            <th className="border px-4 py-2 text-sm">Tempat/Tanggal Lahir</th>
                                            <th className="border px-4 py-2 text-sm">Tahun Ajaran</th>
                                            {/* <th className="border px-4 py-2 text-sm">Agama</th> */}
                                            <th className="border px-4 py-2 text-sm w-32">Status</th>
                                            <th className="border px-4 py-2 text-sm">Password Default</th>
                                            <th className="border px-4 py-2 text-sm">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {siswa.data.map(({ id, nama_panggilan, nama_lengkap, no_induk, tempat_lahir, tanggal_lahir, tahun_ajaran, agama, status, foto, verified, id_user, jenis_kelamin, usia_tahun, usia_bulan, password_default }) => (
                                            <tr>
                                                {/* <td className="border px-4 py-2 text-sm">{ id }</td> */}
                                                <td className="border px-4 py-2 text-sm" onClick={(e)=>showDetail(id)} style={{ cursor: 'pointer' }}><img src={ (foto) ? "/images/siswa/"+foto : (jenis_kelamin == 'L') ? "/images/boy.png" : "/images/girl.png" } alt="" width="70" /></td>
                                                <td className="border px-4 py-2 text-sm" onClick={(e)=>showDetail(id)} style={{ cursor: 'pointer' }}><b>{ nama_panggilan }</b><br />{ nama_lengkap }<br />No. Induk: { no_induk }</td>
                                                <td className="border px-4 py-2 text-sm">{ tempat_lahir } / { tanggal_lahir }<br />({ usia_tahun } Thn { usia_bulan } Bln)</td>
                                                <td className="border px-4 py-2 text-sm text-center"><span className="bg-sky-100 text-sky-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-sky-400 border border-sky-400">{ tahun_ajaran }</span></td>
                                                {/* <td className="border px-4 py-2 text-sm">{ agama }</td> */}
                                                <td className="border px-4 py-2 text-sm text-center">{/* (status == 1) ? 'Aktif' : 'Non-Aktif' */}{ (status == 1) ? <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400" onClick={ () => statusData(id_user, status) } style={{ cursor: 'pointer' }}>Aktif</span> : <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-400 border border-yellow-400" onClick={ () => statusData(id_user, status) } style={{ cursor: 'pointer' }}>Non-Aktif</span> }</td>
                                                <td className="border px-4 py-2 text-sm text-center"><span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">{ password_default }</span></td>
                                                <td className="border px-4 py-2 text-sm">
                                                    <div><Link
                                                        tabIndex="1"
                                                        className="px-4 py-2 text-sm text-white bg-blue-500 rounded"
                                                        href={route("siswa.edit", id)}
                                                    >
                                                        Edit
                                                    </Link>&nbsp;
                                                    {/* <a
                                                        style={{ cursor: 'pointer' }}
                                                        tabIndex="1"
                                                        className="px-4 py-2 text-sm text-white bg-yellow-500 rounded"
                                                        onClick={ () => statusData(id_user, status) }
                                                    >
                                                        { (status == 1) ? 'Non-Aktif' : 'Aktif' }
                                                    </a>&nbsp; */}
                                                    <Link
                                                        tabIndex="1"
                                                        className="px-4 py-2 text-sm text-white bg-yellow-500 rounded"
                                                        href={route("siswa-keluar", id)}
                                                    >
                                                        Keluar
                                                    </Link></div>
                                                    <div className="pt-3"><button
                                                        // onClick={destroy}
                                                        onClick={() => handleDelete(id)}
                                                        id={id}
                                                        tabIndex="-1"
                                                        type="button"
                                                        className="px-4 py-2 text-sm text-white bg-red-500 rounded"
                                                    >
                                                        Hapus
                                                    </button></div>
                                                </td>
                                            </tr>
                                        ))}
    
                                        {siswa.data.length === 0 && (
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

                            <Pagination className="mt-6" links={siswa.links} />

                        </div>
                    </div>
                </div>
            {/* </div> */}
        </DashboardLayout>
    );
}
