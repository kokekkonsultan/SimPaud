// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect } from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Create({ auth }) {
  
    const { data, setData, errors, post } = useForm({
        nama: "",
        status_sekolah: "",
        npsn: "",
        alamat: "",
        email: "",
        no_telpon: "",
        sk_pendirian_sekolah: "",
        foto: "",
        password: "",
        password_confirmation: "",
    });

    const status_sekolah = [
        {id: "1", nama: "Negeri"}, 
        {id: "2", nama: "Swasta"}
    ]

    const [statusNpsn, setStatusNpsn] = useState(false);
    const [statusNpsnSekolah, setStatusNpsnSekolah] = useState(false);
    const [pilihNpsn, setPilihNpsn] = useState(false);

    const checkPilihNpsn = () => {
        setPilihNpsn(!pilihNpsn);

        if(pilihNpsn == true) {
            setStatusNpsn(false);
        } else {
            setStatusNpsn(true);
        }
    }

    function statusSekolahChangeHandler (e) {
        if(e.target.value != '-Pilih Status Sekolah-'){

            if(e.target.value == 1)
            {
                setStatusNpsn(true);
                setStatusNpsnSekolah(false);
            } else if(e.target.value == 2) {
                setStatusNpsn(false);
                setStatusNpsnSekolah(true);
            } else {
                setStatusNpsnSekolah(false);
                setStatusNpsn(false);
            }

        } else {
            setStatusNpsn(false);
            setStatusNpsnSekolah(false);
            setPilihNpsn(false);
        }
        setData('status_sekolah', e.target.value);
        // console.log(e.target.value);

    }
  
    function handleSubmit(e) {
        e.preventDefault();
        Swal.fire({
            title: 'Simpan Data Sekolah?',
            type: 'warning',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oke',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                post(route("sekolah.store"));
            }
        });
    }

    const [country, setCountry]= useState([]);
    const [countryid, setCountryid]=useState('');
    const [st, setSt]= useState([]);
    const [stateid, setStateid]= useState('');
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
  
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah Sekolah</h2>}
        >
            <Head title="Sekolah" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Tambah Sekolah</h1>
  
                            {/* <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
                                    href={ route("sekolah.index") }
                                >
                                    Kembali
                                </Link>
                            </div> */}
  
                            <form name="createForm" onSubmit={handleSubmit}>
                                <div className="flex flex-col">
                                    <div className="mb-4">
                                        <label className="">Nama Sekolah <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nama Sekolah"
                                            name="nama"
                                            required
                                            value={data.nama}
                                            onChange={(e) =>
                                                setData("nama", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.nama}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Status Sekolah <span className='text-red-600'>*</span></label>
                                        <select name="status_sekolah" required className="w-full px-4 py-2" onChange={statusSekolahChangeHandler}>
                                            <option value="">-Pilih Status Sekolah-</option>
                                            {status_sekolah.map(({ id, nama }) => (
                                                <option value={id}>{nama}</option>
                                            ))}
                                        </select>
                                        <span className="text-red-600">
                                            {errors.status_sekolah}
                                        </span>
                                    </div>

                                    {(statusNpsnSekolah == true)?
                                    <div className="">
                                        <label>Sudah memiliki NPSN ?</label>
                                        <div className="mb-2">
                                            <div className="relative flex gap-x-3">
                                                <div className="flex h-6 items-center">
                                                    <input
                                                    id="comments"
                                                    name="comments"
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300 text-sipaud-blue-100 focus:ring-sipaud-blue-100"
                                                    //   onChange={statusNpsnSekolahChangeHandler}
                                                    checked={pilihNpsn}
                                                    onChange={checkPilihNpsn}
                                                    />
                                                </div>
                                                <div className="text-sm leading-6">
                                                    <label>
                                                    Centang bila sudah memiliki
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div> : "" }


                                    {(statusNpsn == true)?
                                    <div className="mb-4">
                                        <label className="">NPSN <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="NPSN"
                                            name="npsn"
                                            required
                                            value={data.npsn}
                                            onChange={(e) =>
                                                setData("npsn", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.npsn}
                                        </span>
                                    </div> : ""}

                                    <div className="mb-4">
                                        <label className="">Provinsi <span className='text-red-600'>*</span></label>
                                        <select name="provinsi" required className="w-full px-4 py-2" onChange={(e)=>handlecountry(e)}>
                                            <option value="">-Pilih Provinsi-</option>
                                            {
                                                country.map( (getcon, index)=>(
                                                <option key={index} value={getcon.kode_wilayah}>{getcon.nama } </option>
                                                ))
                                            }
                                        </select>
                                        <span className="text-red-600">
                                            {errors.provinsi}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Kota <span className='text-red-600'>*</span></label>
                                        <select name="kota" required className="w-full px-4 py-2" onChange={(e)=>handlestate(e)}>
                                            <option value="">-Pilih Kota-</option>
                                            {
                                                st.map( (getst, index)=>(
                                                <option key={index} value={getst.kode_wilayah}>{getst.nama } </option>
                                                )) 
                                            }
                                        </select>
                                        <span className="text-red-600">
                                            {errors.kota}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Kecamatan  <span className='text-red-600'>*</span></label>
                                        <select name="kode_wilayah" required className="w-full px-4 py-2" onChange={(e) =>
                                                setData("kode_wilayah", e.target.value)
                                            }>
                                            <option value="">-Pilih Kecamatan-</option>
                                            {
                                                city.map( (gcity, index)=>(
                                                <option key={index} value={gcity.kode_wilayah}> { gcity.nama} </option>
                                                ))
                                            }
                                        </select>
                                        <span className="text-red-600">
                                            {errors.kecamatan}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Alamat <span className='text-red-600'>*</span></label>
                                        {/* <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Alamat"
                                            name="alamat"
                                            required
                                            value={data.alamat}
                                            onChange={(e) =>
                                                setData("alamat", e.target.value)
                                            }
                                        /> */}
                                        <textarea
                                            id="alamat"
                                            name="alamat"
                                            placeholder='Alamat'
                                            rows={5}
                                            className="w-full px-4 py-2"
                                            required
                                            value={data.alamat}
                                            onChange={(e) => setData('alamat', e.target.value)}
                                        />
                                        <span className="text-red-600">
                                            {errors.alamat}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Email <span className='text-red-600'>*</span></label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2"
                                            label="Email"
                                            name="email"
                                            required
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.email}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Nomor Telepon <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nomor Telepon"
                                            name="no_telpon"
                                            required
                                            value={data.no_telpon}
                                            onChange={(e) =>
                                                setData("no_telpon", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.no_telpon}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Nomor Fax</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nomor fax"
                                            name="fax"
                                            value={data.fax}
                                            onChange={(e) =>
                                                setData("fax", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.fax}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Website</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Website"
                                            name="website"
                                            value={data.website}
                                            onChange={(e) =>
                                                setData("website", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.website}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">SK Pendirian Sekolah <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="SK Pendirian Sekolah"
                                            name="sk_pendirian_sekolah"
                                            required
                                            value={data.sk_pendirian_sekolah}
                                            onChange={(e) =>
                                                setData("sk_pendirian_sekolah", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.sk_pendirian_sekolah}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Kepala Sekolah <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Kepala Sekolah"
                                            name="kepala_sekolah"
                                            value={data.kepala_sekolah}
                                            onChange={(e) =>
                                                setData("kepala_sekolah", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.kepala_sekolah}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Foto</label>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            className="w-full px-4 py-2"
                                            label="Foto"
                                            name="foto"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setData("foto", e.target.files[0])
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.foto}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Kata Sandi <span className='text-red-600'>*</span></label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2"
                                            label="Password"
                                            name="password"
                                            required
                                            value={data.password}
                                            onChange={(e) =>
                                                setData("password", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.password}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Konfirmasi Kata Sandi <span className='text-red-600'>*</span></label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2"
                                            label="Password Confirmation"
                                            name="password_confirmation"
                                            required
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData("password_confirmation", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.password_confirmation}
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
                                            href={ route("sekolah.index") }
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
