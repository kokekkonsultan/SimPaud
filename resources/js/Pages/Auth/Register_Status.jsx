import React, { useState } from 'react'
import { Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
// import { Link } from "react-router-dom"

const KonfirmasiStatus = ({ status, message }) => {


  return (
    <>
        <div
      className='min-h-screen bg-sipaud-blue-800 bg-center bg-cover bg-no-repeat'
      style={{ backgroundImage: `url('/img/site/bg-login.jpg')` }}
      >
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            
          <div className="grid md:grid-cols-2 md:gap-6 md:place-content-center md:min-h-screen">
            
            <div className='w-full p-5'>
              <Link
              href='/'
              >
                <img
                className="w-auto mt-10"
                src="/img/site/sipaud-logo-3.png"
                alt="Kurikulum Merdeka Logo"
                />
              </Link>
            </div>

            <div className='w-full bg-white rounded-lg p-5 shadow-md'>
              <div>
                <p className='text-center font-BalooBhaina text-2xl'>Registrasi Akun Berhasil</p>

                <div className='p-3 text-center'>
                  <p className='text-sm font-livic'>
                  Registrasi akun Anda pada SimPaud sudah berhasil. Untuk dapat menggunakan layanan di SimPaud, silakan aktivasi email Anda.
                  </p>
                  
                </div>

                <div className='p-3 text-center'>
                  <p className='text-sm font-livic'>
                    Sudah aktivasi? silahkan
                  </p>
                  <Link
                  href='/login'
                  className='text-sm font-livic text-sipaud-blue-900'
                  >
                    Login
                  </Link>
                </div>


              </div>
            </div>

            <div className='md:col-span-2 text-white text-sm text-center font-livic mt-5 md:mt-10'>
            ©2024 SimPaud
            </div>

          </div>



          </div>
        </div>
        
      </div>
    </>
  )
}

export default KonfirmasiStatus