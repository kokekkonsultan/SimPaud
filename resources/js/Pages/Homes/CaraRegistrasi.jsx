import React from 'react'
import { Link as NavLink } from '@inertiajs/react';
// import { NavLink } from "react-router-dom"

import {
    ShieldCheckIcon,
    KeyIcon,
    EnvelopeIcon,
    BookOpenIcon,
  } from '@heroicons/react/24/outline'

const CaraRegistrasi = () => {
  return (
    <>
        <section
        id='cara-registrasi'
        className='mx-auto max-w-7xl sm:px-6 lg:px-8 mt-32'
        >
        <div
        className='font-BalooBhaina text-xl md:text-4xl text-center mt-10 text-gray-900'
        >
        4 Cara mudah Registrasi SimPaud
        </div>

        <div className="grid md:grid-cols-4 md:gap-4 mt-10">
        <div className=''>
            <div className='bg-white rounded-lg shadow-lg p-10 text-center md:h-full m-2 md:m-0'>

                <div className='grid justify-items-center'>
                    <div className='h-16 w-16 rounded-full bg-red-400 flex items-center justify-center'><BookOpenIcon className="h-7 w-7 text-white" /></div>
                </div>
                <div className='mt-10 font-livic font-bold'>
                1. Isi Form
                </div>
                <div className='mt-5 font-livic'>
                Isi formulir registrasi.
                </div>
            </div>
        </div>
        <div className=''>
            <div className='bg-white rounded-lg shadow-lg p-10 text-center md:h-full m-2 md:m-0'>

                <div className='grid justify-items-center'>
                    <div className='h-16 w-16 rounded-full bg-red-400 flex items-center justify-center'><EnvelopeIcon className="h-7 w-7 text-white" /></div>
                </div>
                <div className='mt-10 font-livic font-bold'>
                2. Konfirmasi Email
                </div>
                <div className='mt-5 font-livic'>
                Klik tautan pada kotak masuk Email yang didaftarkan
                </div>
            </div>
        </div>
        <div className=''>
            <div className='bg-white rounded-lg shadow-lg p-10 text-center md:h-full m-2 md:m-0'>

                <div className='grid justify-items-center'>
                    <div className='h-16 w-16 rounded-full bg-red-400 flex items-center justify-center'><ShieldCheckIcon className="h-7 w-7 text-white" /></div>
                </div>
                <div className='mt-10 font-livic font-bold'>
                3. Verifikasi Admin
                </div>
                <div className='mt-5 font-livic'>
                Admin SimPaud akan meverifikasi data anda
                </div>
            </div>
        </div>
        <div className=''>
            <div className='bg-white rounded-lg shadow-lg p-10 text-center md:h-full m-2 md:m-0'>

                <div className='grid justify-items-center'>
                    <div className='h-16 w-16 rounded-full bg-red-400 flex items-center justify-center'><KeyIcon className="h-7 w-7 text-white" /></div>
                </div>
                <div className='mt-10 font-livic font-bold'>
                4. Login
                </div>
                <div className='mt-5 font-livic'>
                Setelah terverifikasi, login menggunakan akses yang dikirimkan ke Email
                </div>
            </div>
        </div>
        
        </div>

    
        <div className='grid justify-items-center'>

            <div className='mt-16 text-center w-full md:w-1/2'>
                <div>
                    <NavLink
                    href="/registrasi"
                    className="rounded-3xl w-full bg-yellow-600 px-5 py-5 text-sm md:text-base font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600 font-livic"
                    >
                    Daftarkan Sekolah Anda Sekarang
                    </NavLink>
                </div>
                <div className='font-livic text-sm italic mt-10 text-gray-800'>
                    Setelah sekolah anda terdaftar di SimPaud, guru-guru di Sekolah anda dapat melakukan penilaian dengan lebih mudah dan cepat
                </div>
            </div>
        </div>

        </section>
    </>
  )
}

export default CaraRegistrasi