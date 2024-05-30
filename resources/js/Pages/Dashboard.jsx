// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DashboardLayout from '../Layouts/DashboardLayout';
import React, { useState, useEffect } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';

export default function Dashboard({ auth, props }) {

    const { sekolah, siswa, rekap, role_id, flash } = usePage().props;
    const [isLoading, setIsLoading] = useState(true);

    const Card = ({ title, description }) => (
        <div className="p-4 bg-white shadow-lg rounded-lg mb-4">
          <h2 className="text-4xl font-semibold mb-2">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
    );

    /*const Spinner = () => {
        return (
            <div className="spinner">
                <div className="double-bounce1"></div>
                <div className="double-bounce2"></div>
            </div>
        );
    };

    useEffect(() => {
        // Simulate a network request or other asynchronous operation
        setTimeout(() => {
            setIsLoading(false);
        }, 3000); // Simulate a 3-second loading time
    }, []);*/

    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            {/* <div className="py-12"> */}
                {/* <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">You're logged in!</div>
                    </div>
                </div> */}

                <style>
                    {`
                        // Spinner.css
                        .spinner {
                            width: 40px;
                            height: 40px;
                            position: relative;
                            margin: 100px auto;
                        }
                        
                        .double-bounce1, .double-bounce2 {
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                            background-color: #333;
                            opacity: 0.6;
                            position: absolute;
                            top: 0;
                            left: 0;
                            animation: bounce 2.0s infinite ease-in-out;
                        }
                        
                        .double-bounce2 {
                            animation-delay: -1.0s;
                        }
                        
                        @keyframes bounce {
                            0%, 100% { transform: scale(0.0) }
                            50% { transform: scale(1.0) }
                        }
                    `}
                </style>

                {/* {isLoading ? (
                    <Spinner />
                ) : "" } */}




                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white">

                        <h1 className="text-2xl mb-5">Dashboard</h1>

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


                        {(role_id == 2)?
                                <div className="flex flex-wrap">
                                    <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 p-2">
                                        <Card title={ rekap.jml_sekolah } description="Jumlah Sekolah" />
                                    </div>
                                    <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 p-2">
                                        <Card title={ rekap.jml_guru } description="Jumlah Guru" />
                                    </div>
                                    <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 p-2">
                                        <Card title={ rekap.jml_peserta_didik } description="Jumlah Peserta Didik" />
                                    </div>
                                    <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 p-2">
                                        <Card title={ rekap.jml_permintaan } description="Jumlah Permintaan" />
                                    </div>
                                </div> : "" }

                        <div className="mt-4 -mx-2 md:items-center md:flex">
                            <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 px-2">
                                
                                {(role_id == 3 || role_id == 4 || role_id == 6) ?
                                    <div className="bg-white overflow-hidden shadow rounded-lg border">
                                        <div className="px-4 py-5 sm:px-6">
                                            <h3 className="text-lg leading-6 font-bold text-center text-gray-900">
                                                Profil Sekolah
                                            </h3>
                                            <p className="mt-3 max-w-2xl text-sm text-gray-500 flex justify-center items-center">
                                            <img src={ (sekolah.foto) ? '/images/sekolah/'+sekolah.foto : '/images/tutwuri_logo.png' } width="200" />
                                            </p>
                                        </div>
                                        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                                            <dl className="sm:divide-y sm:divide-gray-200">
                                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-bold text-gray-500">
                                                        Nama Sekolah
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                        { sekolah.nama }
                                                    </dd>
                                                </div>
                                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-bold text-gray-500">
                                                        Status Sekolah
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    { (sekolah.status_sekolah == 1) ? 'Negeri' : 'Swasta' }
                                                    </dd>
                                                </div>
                                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-bold text-gray-500">
                                                        NPSN
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                        { sekolah.npsn }
                                                    </dd>
                                                </div>
                                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-bold text-gray-500">
                                                        Email
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                        { sekolah.email }
                                                    </dd>
                                                </div>

                                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-bold text-gray-500">
                                                        Kepala Sekolah
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                        { sekolah.kepala_sekolah }
                                                    </dd>
                                                </div>
                                                {/* <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-bold text-gray-500">
                                                        Operator Sekolah
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                        { sekolah.operator_sekolah }
                                                    </dd>
                                                </div> */}

                                                {(role_id == 3 || role_id == 6)?
                                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-bold text-gray-500">
                                                        Status Akun
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">{ (sekolah.verified == 1) ? 'Terverifikasi' : 'Belum Terverifikasi' }</span>
                                                    </dd>
                                                </div>
                                                : "" }

                                                {(role_id == 3 || role_id == 6)?
                                                <div className="py-3 sm:grid sm:gap-4 sm:px-6">
                                                <Link
                                                        tabIndex="1"
                                                        className="px-4 py-2 text-sm text-center text-white bg-blue-500 rounded"
                                                        href={route("profil-sekolah")}
                                                    >
                                                        Ubah Data
                                                    </Link>
                                                </div>
                                                : "" }
                                                
                                            </dl>
                                        </div>
                                    </div> : "" }

                                {(role_id == 5) ?
                                    <div className="bg-white overflow-hidden shadow rounded-lg border">
                                        <div className="px-4 py-5 sm:px-6">
                                            <h3 className="text-lg leading-6 font-bold text-center text-gray-900">
                                                Profil Siswa
                                            </h3>
                                            <p className="mt-3 max-w-2xl text-sm text-gray-500 flex justify-center items-center">
                                            <img src={ (siswa.foto) ? '/images/siswa/'+siswa.foto : (siswa.jenis_kelamin == 'L') ? "/images/boy.png" : "/images/girl.png" } width="200" />
                                            </p>
                                        </div>
                                        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                                            <dl className="sm:divide-y sm:divide-gray-200">
                                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-bold text-gray-500">
                                                        Nama Lengkap
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                        { siswa.nama_lengkap }
                                                    </dd>
                                                </div>
                                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-bold text-gray-500">
                                                        Jenis Kelamin
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    { (siswa.jenis_kelamin == 'L') ? 'Laki-laki' : 'Perempuan' }
                                                    </dd>
                                                </div>
                                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-bold text-gray-500">
                                                        Nomer Induk
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                        { siswa.no_induk }
                                                    </dd>
                                                </div>
                                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-bold text-gray-500">
                                                        Email Orang Tua
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                        { siswa.email_orang_tua }
                                                    </dd>
                                                </div>
                                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-bold text-gray-500">
                                                        Nama Ayah
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                        { siswa.nama_ayah }
                                                    </dd>
                                                </div>
                                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-bold text-gray-500">
                                                        Status Akun
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">{ (siswa.verified == 1) ? 'Terverifikasi' : 'Belum Terverifikasi' }</span>
                                                    </dd>
                                                </div>
                                                
                                                <div className="py-3 sm:grid sm:gap-4 sm:px-6">
                                                <Link
                                                        tabIndex="1"
                                                        className="px-4 py-2 text-sm text-center text-white bg-blue-500 rounded"
                                                        href={route("profil-siswa")}
                                                    >
                                                        Ubah Data
                                                    </Link>
                                                </div>
                                                

                                            </dl>
                                        </div>
                                    </div> : "" }

                            </div>
                            <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 px-2 align-top">

                                {(role_id == 3 || role_id == 6) ?
                                <div className="flex flex-wrap">
                                    <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 p-2">
                                        <Card title={ rekap.jml_guru } description="Jumlah Guru" />
                                    </div>
                                    <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 p-2">
                                        <Card title={ rekap.jml_peserta_didik } description="Jumlah Peserta Didik" />
                                    </div>
                                    <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 p-2">
                                        <Card title={ rekap.jml_kelompok } description="Jumlah Kelompok" />
                                    </div>
                                    <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 p-2">
                                        <Card title={ rekap.jml_permintaan } description="Jumlah Permintaan" />
                                    </div>
                                </div> : "" }

                                {(role_id == 4) ?
                                <div className="flex flex-wrap">
                                    <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 p-2">
                                        <Card title={ rekap.jml_peserta_didik } description="Jumlah Peserta Didik Diampu" />
                                    </div>
                                    <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 p-2">
                                        <Card title={ rekap.jml_kelompok } description="Jumlah Kelompok Diampu" />
                                    </div>
                                </div> : "" }

                            </div>
                        </div>

                        

                            {(role_id == 22)?
                            // <div className="w-1/4 px-2 mt-4 md:mt-0">
                            // {
                            //     "Jumlah Sekolah = "+rekap.jml_sekolah+
                            //     "Jumlah Permintaan = "+rekap.jml_permintaan+
                            //     "Jumlah Guru = "+rekap.jml_guru+
                            //     "Jumlah Peserta Didik = "+rekap.jml_peserta_didik
                            // }
                            // </div>
                            <div className="grid md:grid-cols-4 md:gap-4 mt-10">
                                <div className=''>
                                    <div className='bg-white rounded-lg shadow-lg p-10 text-center md:h-full m-2 md:m-0'>
                                        <div className='mt-10 font-livic font-bold text-4xl'>
                                        { rekap.jml_sekolah }
                                        </div>
                                        <div className='mt-5 font-livic'>
                                        Jumlah Sekolah
                                        </div>
                                    </div>
                                </div>
                                <div className=''>
                                    <div className='bg-white rounded-lg shadow-lg p-10 text-center md:h-full m-2 md:m-0'>

                                        <div className='mt-10 font-livic font-bold text-4xl'>
                                        { rekap.jml_permintaan }
                                        </div>
                                        <div className='mt-5 font-livic'>
                                        Jumlah Permintaan
                                        </div>
                                    </div>
                                </div>
                                <div className=''>
                                    <div className='bg-white rounded-lg shadow-lg p-10 text-center md:h-full m-2 md:m-0'>

                                        <div className='mt-10 font-livic font-bold text-4xl'>
                                        { rekap.jml_guru }
                                        </div>
                                        <div className='mt-5 font-livic'>
                                        Jumlah Guru
                                        </div>
                                    </div>
                                </div>
                                <div className=''>
                                    <div className='bg-white rounded-lg shadow-lg p-10 text-center md:h-full m-2 md:m-0'>

                                        <div className='mt-10 font-livic font-bold text-4xl'>
                                        { rekap.jml_peserta_didik }
                                        </div>
                                        <div className='mt-5 font-livic'>
                                        Jumlah Peserta Didik
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            : "" }

                            
  
                            {(role_id == 33 || role_id == 66)?
                            <div className="grid md:grid-cols-4 md:gap-4 mt-10">
                                <div className=''>
                                    <div className='bg-white rounded-lg shadow-lg p-10 text-center md:h-full m-2 md:m-0'>
                                        <div className='mt-10 font-livic font-bold text-4xl'>
                                        { rekap.jml_guru }
                                        </div>
                                        <div className='mt-5 font-livic'>
                                        Jumlah Guru
                                        </div>
                                    </div>
                                </div>
                                <div className=''>
                                    <div className='bg-white rounded-lg shadow-lg p-10 text-center md:h-full m-2 md:m-0'>
                                        <div className='mt-10 font-livic font-bold text-4xl'>
                                        { rekap.jml_peserta_didik }
                                        </div>
                                        <div className='mt-5 font-livic'>
                                        Jumlah Peserta Didik
                                        </div>
                                    </div>
                                </div>
                                <div className=''>
                                    <div className='bg-white rounded-lg shadow-lg p-10 text-center md:h-full m-2 md:m-0'>

                                        <div className='mt-10 font-livic font-bold text-4xl'>
                                        { rekap.jml_kelompok }
                                        </div>
                                        <div className='mt-5 font-livic'>
                                        Jumlah Kelompok
                                        </div>
                                    </div>
                                </div>
                                <div className=''>
                                    <div className='bg-white rounded-lg shadow-lg p-10 text-center md:h-full m-2 md:m-0'>

                                        <div className='mt-10 font-livic font-bold text-4xl'>
                                        { rekap.jml_permintaan }
                                        </div>
                                        <div className='mt-5 font-livic'>
                                        Jumlah Permintaan
                                        </div>
                                    </div>
                                </div>
                                

                            </div>
                            : "" }


                            {(role_id == 44)?
                            <div className="grid md:grid-cols-4 md:gap-4 mt-10">
                                {/* <div className=''>
                                    <div className='bg-white rounded-lg shadow-lg p-10 text-center md:h-full m-2 md:m-0'>

                                        <div className='mt-10 font-livic font-bold'>
                                        { rekap.jml_peserta_didik }
                                        </div>
                                        <div className='mt-5 font-livic'>
                                        Jumlah Peserta Didik
                                        </div>
                                    </div>
                                </div>
                                <div className=''>
                                    <div className='bg-white rounded-lg shadow-lg p-10 text-center md:h-full m-2 md:m-0'>
                                        <div className='mt-10 font-livic font-bold'>
                                        { rekap.jml_guru }
                                        </div>
                                        <div className='mt-5 font-livic'>
                                        Jumlah Guru
                                        </div>
                                    </div>
                                </div> */}
                                <div className=''>
                                    <div className='bg-white rounded-lg shadow-lg p-10 text-center md:h-full m-2 md:m-0'>

                                        <div className='mt-10 font-livic font-bold text-4xl'>
                                        { rekap.jml_peserta_didik }
                                        </div>
                                        <div className='mt-5 font-livic'>
                                        Jumlah Peserta Didik Diampu
                                        </div>
                                    </div>
                                </div>
                                <div className=''>
                                    <div className='bg-white rounded-lg shadow-lg p-10 text-center md:h-full m-2 md:m-0'>

                                        <div className='mt-10 font-livic font-bold text-4xl'>
                                        { rekap.jml_kelompok }
                                        </div>
                                        <div className='mt-5 font-livic'>
                                        Jumlah Kelompok Diampu
                                        </div>
                                    </div>
                                </div>
                                

                            </div>
                            : "" }



                            {(role_id == 3 || role_id == 4 || role_id == 6)?
                            <div className="mt-4 -mx-2 md:items-center md:flex">
                                <div className="w-1/2 px-2">
                                    
                                    

                                </div>

                               
                                {/* <div className="w-2/4 px-2 mt-4 md:mt-0">
                                {
                                    (role_id == 3) ? "Jumlah Guru = "+rekap.jml_guru+
                                    "Jumlah Peserta Didik = "+rekap.jml_peserta_didik+
                                    "Jumlah Kelompok = "+rekap.jml_kelompok : "Jumlah Kelompok Diampu = "+rekap.jml_kelompok+
                                    "Jumlah Peserta Didik = "+rekap.jml_peserta_didik
                                }
                                </div> */}

                            </div>
                            : "" }


                            {(role_id == 5)?
                            <div className="mt-4 -mx-2 md:items-center md:flex">
                                <div className="w-1/2 px-2">
                                    
                                    

                                </div>

                            </div>
                            : "" }

                        </div>
                    </div>
                </div>

                
            {/* </div> */}
        </DashboardLayout>
    );
}
