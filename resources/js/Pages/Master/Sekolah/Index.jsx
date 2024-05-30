// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { Fragment, useState, useEffect } from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, usePage, Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
// import ModalWithButtons from '@/Components/ModalWithButtons';

import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';

export default function Index({ auth, props, searching, filtering, id_provinsi, id_kota, id_kode_wilayah }) {
    
    const { sekolah, flash } = usePage().props

    const [open, setOpen] = useState(false)
    // const [ search, setSearch ] = useState(searching.search || '')
  
    function destroy(e) {
        if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            router.delete(route("sekolah.destroy", e.currentTarget.id));
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
                router.delete(route("sekolah.destroy", id));
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
                router.get(`/sekolah/status/${id_user}/${status}`);
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
    //         Inertia.get(`/sekolah/verifikasi/${id_user}`);
    //     }
    // }

    // const doSearchData = (e) =>{
    //     e.preventDefault();
    //     // Inertia.get('/sekolah', { search }, { preserveState : true });
    //     router.get('/sekolah', { search }, { preserveState: true })
    // }

    filtering = filtering || {};
        const doFilterData = (name, value) => {
            if (value) {
                filtering[name] = value;
            } else {
                delete filtering[name];
            }

        router.get('/sekolah', filtering);
    };

    const doSearchData = (name, e) => {
        if (e.key !== "Enter") return;
    
        doFilterData(name, e.target.value);
    };

    // let onShowDialogWithButtons = () => {
    //     setDialogIsOpen(true);
    // }


    const [country, setCountry]= useState([]);
    const [countryid, setCountryid]=useState(id_provinsi);
    const [st, setSt]= useState([]);
    const [stateid, setStateid]= useState(id_kota);
    const [city, setCity]= useState([]);

     useEffect( ()=>{
         const getcountry= async()=>{
             const rescountry= await fetch("/dataprovinsi");
             const rescon= await rescountry.json();
             setCountry(await rescon);
         }
         getcountry();
     },[]);

     const handlecountry=(event)=>{
         const getcountryid= event.target.value;
         setCountryid(getcountryid);
     }

     useEffect( ()=>{
     const getstate= async()=>{
         const resstate= await fetch(`/datakota/${countryid}`);
         const resst= await resstate.json();
         setSt(await resst);
     }
    getstate();
     },[countryid]);

     const handlestate=(event)=>{
        const getstateid= event.target.value;
        setStateid(getstateid);
    }

    useEffect( ()=>{
        const getcity= async()=>{   
            const rescity= await fetch(`/datakecamatan/${stateid}`);
            const rcity= await rescity.json();
            setCity(await rcity);
        }
    getcity();
    },[stateid]);

    const [sk, setSk]= useState([]);
    const [sekolahid, setSekolahid]= useState();

    const showDetail=(id)=>{
        const getsekolahid= id;
        setSekolahid(getsekolahid);
        setOpen(true);
    }

    useEffect( ()=>{
    const getsekolah= async()=>{
        const ressekolah= await fetch(`/datasekolah/${sekolahid}`);
        const ressk= await ressekolah.json();
        setSk(await ressk);
    }
    getsekolah();
    },[sekolahid]);
   
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Sekolah</h2>}
        >
            <Head title="Sekolah" />

            {/* <a className="btn-indigo ml-2"
                        onClick={onShowDialogWithButtons}>
                    Show Form Modal
                </a> */}

            {/* <ModalWithButtons
                    title="Create Organization"
                    open={dialogIsOpen}
                    onClose={() => setDialogIsOpen(false)}
                    onConfirm={() => setDialogIsOpen(false)}
                    buttons={
                        <React.Fragment>
                            <div className="p-1">
                                <LoadingSmallButton
                                    loading={sending}
                                    onClick={handleSubmit}
                                    className="btn-indigo ml-auto"
                                >
                                    Save
                                </LoadingSmallButton>
                            </div>
                        </React.Fragment>
                    }
                >
                    <div className="bg-white rounded shadow overflow-hidden max-w-3xl">
                        <form>
                            <div className="p-4 -mr-3 -mb-4 flex flex-wrap">
                                <TextInput
                                    className="pr-4 pb-4 w-full "
                                    label="Name"
                                    name="name"
                                    errors={errors.name}
                                    value={values.name}
                                    onChange={handleChange}
                                />

                                <TextInput
                                    className="pr-4 pb-4 w-full "
                                    label="E-Mail"
                                    name="email"
                                    errors={errors.email}
                                    value={values.email}
                                    onChange={handleChange}
                                />
                            </div>

                        </form>
                    </div>

                </ModalWithButtons> */}
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            
                            <h1 className="text-2xl mb-5">Sekolah</h1>
                        
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
                                                <td className="text-center max-w-2xl flex justify-center items-center"><img src={ (st.foto) ? "/images/sekolah/"+st.foto : "/images/tutwuri_logo.png" } alt="" width="100" /></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    
                                                    <table className="table-auto w-full mt-2">
                                                        <tbody>
                                                            <tr>
                                                                <td colSpan="2" className="text-center"><span className="text-xl font-bold">{st.nama}</span></td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan="2" className="text-center text-sm">NPSN: {sk.npsn}</td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan="2">&nbsp;</td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan="2" className="border-t">&nbsp;</td>
                                                            </tr>
                                                            {/* <tr>
                                                                <td className="text-right"><b>Nama Sekolah</b></td>
                                                                <td className="px-4">{sk.nama}</td>
                                                            </tr> */}
                                                            <tr>
                                                                <td className="text-right text-sm w-56"><b>Status Sekolah</b></td>
                                                                <td className="px-4 text-sm">{ (sk.status_sekolah == 1) ? "Negeri" : "Swasta" }</td>
                                                            </tr>
                                                            {/* <tr>
                                                                <td className="text-right"><b>NPSN</b></td>
                                                                <td className="px-4">{sk.npsn}</td>
                                                            </tr> */}
                                                            <tr>
                                                                <td className="text-right text-sm"><b>SK Pendirian Sekolah</b></td>
                                                                <td className="px-4 text-sm">{sk.sk_pendirian_sekolah}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-right text-sm"><b>Kode Registrasi SimPaud</b></td>
                                                                <td className="px-4 text-sm">{sk.kode_registrasi}</td>
                                                            </tr>
                                                            
                                                            <tr>
                                                                <td colSpan="2">&nbsp;</td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan="2" className="border-t">&nbsp;</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-right text-sm"><b>Provinsi</b></td>
                                                                <td className="px-4 text-sm">{sk.provinsi}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-right text-sm"><b>Kota / Kabupaten</b></td>
                                                                <td className="px-4 text-sm">{sk.kotakab}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-right text-sm"><b>Kecamatan</b></td>
                                                                <td className="px-4 text-sm">{sk.kecamatan}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-right text-sm align-top"><b>Alamat</b></td>
                                                                <td className="px-4 text-sm">{sk.alamat}</td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan="2">&nbsp;</td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan="2" className="border-t">&nbsp;</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-right text-sm"><b>Nomor Telepon</b></td>
                                                                <td className="px-4 text-sm">{sk.no_telpon}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-right text-sm"><b>Nomor Fax</b></td>
                                                                <td className="px-4 text-sm">{sk.no_fax}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-right text-sm"><b>Email</b></td>
                                                                <td className="px-4 text-sm">{sk.email}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-right text-sm"><b>Website</b></td>
                                                                <td className="px-4 text-sm">{sk.website}</td>
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
                                    <label className="font-bold text-sm">Provinsi</label>
                                    <select name="kode_provinsi" 
                                    defaultValue={filtering.kode_provinsi} 
                                    className="w-full px-4 py-2 text-sm" 
                                    onChange={(e)=>handlecountry(e)}>
                                            <option value="">-Pilih Provinsi-</option>
                                            {
                                                // country.map( (getcon, index)=>(
                                                //     <option key={index} value={getcon.kode_wilayah}>{getcon.nama } </option>
                                                //    ))
                                                country.map(( {kode_wilayah, nama} ) => {
                                                    if (id_provinsi == kode_wilayah){
                                                        return <option value={kode_wilayah} selected>{nama}</option>
                                                    }
                                                    return <option value={kode_wilayah}>{nama}</option>
                                                    }
                                                )
                                            }
                                    </select>
                                </div>
                                <div className="flex-1 px-2">
                                    <label className="font-bold text-sm">Kota</label>
                                    <select name="kode_kota" 
                                    defaultValue={filtering.kode_kota} 
                                    className="w-full px-4 py-2 text-sm" 
                                    onChange={(e)=>handlestate(e)}>
                                            <option value="">-Pilih Kota-</option>
                                            {
                                                // st.map( (getst, index)=>(
                                                // <option key={index} value={getst.kode_wilayah}>{getst.nama } </option>
                                                // )) 
                                                st.map(( {kode_wilayah, nama} ) => {
                                                    if (id_kota == kode_wilayah){
                                                        return <option value={kode_wilayah} selected>{nama}</option>
                                                    }
                                                    return <option value={kode_wilayah}>{nama}</option>
                                                    }
                                                )
                                            }
                                    </select>
                                </div>
                                <div className="flex-1 px-2">
                                    <label className="font-bold text-sm">Kecamatan</label>
                                    <select name="kode_wilayah" 
                                    defaultValue={filtering.kode_wilayah} 
                                    className="w-full px-4 py-2 text-sm" 
                                    onChange={(e) => doFilterData("kode_wilayah", e.target.value)}>
                                            <option value="">-Pilih Kecamatan-</option>
                                            {
                                                // city.map( (gcity, index)=>(
                                                // <option key={index} value={gcity.kode_wilayah}> { gcity.nama} </option>
                                                // ))
                                                city.map(( {kode_wilayah, nama} ) => {
                                                    if (id_kode_wilayah == kode_wilayah){
                                                        return <option value={kode_wilayah} selected>{nama}</option>
                                                    }
                                                    return <option value={kode_wilayah}>{nama}</option>
                                                    }
                                                )
                                            }
                                    </select>
                                </div>
                                <div className="flex-1 px-2">
                                    <label className="font-bold text-sm">Cari Sekolah</label>
                                    <input
                                        className="w-full text-sm"
                                        defaultValue={filtering.search}
                                        placeholder="Nama Sekolah / NPSN / Email / No Telp"
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
                                            placeholder="Nama Sekolah / NPSN / Email / No Telp"
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
                                    </form>     */}
                                </div>
                                <div className="flex-1 px-2 pt-5">
                                    <Link
                                        className="px-6 py-2 text-white text-sm bg-green-500 rounded-md focus:outline-none"
                                        href={ route("sekolah.create") }
                                    >
                                        Tambah Sekolah
                                    </Link>
                                </div>
                            </div>
  
                            <div className="overflow-auto">
                                <table className="table-auto w-full">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            {/* <th className="px-4 py-2 text-sm">No.</th> */}
                                            <th colSpan="2" className="border px-4 py-2 text-sm">Nama Sekolah</th>
                                            <th className="border px-4 py-2 text-sm">Status Sekolah</th>
                                            <th className="border px-4 py-2 text-sm">Wilayah</th>
                                            <th className="border px-4 py-2 text-sm">Kontak</th>
                                            <th className="border px-4 py-2 text-sm w-32">Status</th>
                                            <th className="border px-4 py-2 text-sm w-48">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sekolah.data.map(({ id, nama, status_sekolah, npsn, sk_pendirian_sekolah, provinsi, kotakab, kecamatan, email, no_telpon, status, verified, id_user, foto }) => (
                                            <tr>
                                                {/* <td className="border px-4 py-2 text-sm">{ id }</td> */}
                                                <td className="border px-4 py-2 text-sm" onClick={(e)=>showDetail(id)} style={{ cursor: 'pointer' }}><img src={ (foto) ? "/images/sekolah/"+foto : "/images/tutwuri_logo.png" } alt="" width="70" /></td>
                                                <td className="border px-4 py-2 text-sm" onClick={(e)=>showDetail(id)} style={{ cursor: 'pointer' }}><b>{ nama }</b><br />{ npsn }<br />{ sk_pendirian_sekolah }</td>
                                                <td className="border px-4 py-2 text-sm text-center">{ (status_sekolah == 1) ? 'Negeri' : 'Swasta' }</td>
                                                <td className="border px-4 py-2 text-sm">{ provinsi }<br />{ kotakab }<br />{ kecamatan }</td>
                                                <td className="border px-4 py-2 text-sm">{ email }<br />{ no_telpon }</td>
                                                <td className="border px-4 py-2 text-sm text-center">{/* (status == 1) ? 'Aktif' : 'Non-Aktif' */}{ (status == 1) ? <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400" onClick={ () => statusData(id_user, status) } style={{ cursor: 'pointer' }}>Aktif</span> : <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-400 border border-yellow-400" onClick={ () => statusData(id_user, status) } style={{ cursor: 'pointer' }}>Non-Aktif</span> }</td>
                                                <td className="border px-4 py-2 text-sm">
                                                    <Link
                                                        tabIndex="1"
                                                        className="px-4 py-2 text-sm text-white bg-blue-500 rounded"
                                                        href={route("sekolah.edit", id)}
                                                    >
                                                        Edit
                                                    </Link> 
                                                    {/* <a
                                                        style={{ cursor: 'pointer' }}
                                                        tabIndex="1"
                                                        className="px-4 py-2 text-sm text-white bg-yellow-500 rounded"
                                                        onClick={ () => statusData(id_user, status) }
                                                    >
                                                        { (status == 1) ? 'Non-Aktif' : 'Aktif' }
                                                    </a> */}
                                                    {/* { (verified == 0) ? <Link
                                                        tabIndex="1"
                                                        className="px-4 py-2 text-sm text-white bg-yellow-500 rounded"
                                                        onClick={ () => verifiedData(id_user) }
                                                    >
                                                        Verifikasi
                                                    </Link>
                                                    :
                                                    "" } */}
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
    
                                        {sekolah.data.length === 0 && (
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

                            <Pagination className="mt-6" links={sekolah.links} />

                        </div>
                    </div>
                </div>
            {/* </div> */}
        </DashboardLayout>
    );
}
