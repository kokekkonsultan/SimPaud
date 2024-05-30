import React from 'react'
import { Link as NavLink } from '@inertiajs/react';
// import { NavLink } from "react-router-dom"
import { motion } from "framer-motion"

const Hero = () => {
  return (
    <>
        <div
        id='home'
        className='min-h-screen bg-sipaud-blue-800 text-white mt-16'
        >
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div
                className='p-10 md:p-20'
                >
                    <div className="md:grid md:grid-cols-2 md:gap-16">


                        <div>

                        <div
                        className='text-white font-BalooBhaina pt-5 text-5xl leading-tight'
                        >
                        Mudahkan Proses Penilaian Harian Peserta Didik Anda
                        </div>
                        <div
                        className='text-white font-livic leading-relaxed mt-5'
                        >
                        Dikembangkan dengan program Kurikulum Merdeka. Dilengkapi dengan fitur penilaian harian berdasarkan Kompetensi Dasar, input nilai harian peseta didik menjadi lebih mudah. Tersedia juga fitur untuk mencatat perkembangan Emosi dan Jasmani
                        </div>
                        </div>

                        <div>
                            <NavLink
                            href='/registrasi'
                            >
                            <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className='text-2xl text-center font-livic bg-gradient-to-b from-sipaud-red-100 to-sipaud-red-300 p-5 rounded-full mt-10 md:mt-0 shadow-md'
                            >
                                Daftarkan Sekolah Anda
                            </motion.div>
                            </NavLink>
                            <div className='text-white font-livic text-sm text-center italic mt-5'>
                            Setelah sekolah anda terdaftar di SimPaud, guru-guru di Sekolah anda dapat melakukan penilaian dengan lebih mudah dan cepat
                            </div>

                            <NavLink
                            href='/login'
                            >
                                <div
                                className='font-livic text-center border-2 border-white rounded-lg p-4 mt-10 hover:bg-white hover:text-gray-950 hover:border-sipaud-blue-800'
                                >
                                Login ke SimPaud
                                </div>
                            </NavLink>

                            <div className='mt-5 font-livic text-sm text-center'>
                            atau login ke SimPaud jika sudah pernah mendaftar
                            </div>
                        </div>

                    </div>



                    <div className="md:grid md:grid-cols-2 md:gap-16">
                        <div
                        className='text-center z-0'
                        >
                        <img
                        className="h-20 w-auto mt-10"
                            src="/img/site/kurikulum-merdeka-merdeka-mengajar.png"
                            alt="Kurikulum Merdeka Logo"
                        />
                        </div>

                        <div></div>
                    </div>

                </div>
            </div>



            

            <div className="grid grid-cols-2 gap-4 -mt-44">
                <div
                className='bg-center bg-contain bg-no-repeat'
                style={{ backgroundImage: `url('/img/site/pattern-dark01.png')` }}
                >
                    
                </div>
                <div
                className='justify-self-end'
                >
                    <img
                    className="w-full pr-10 pb-10 md:w-auto invisible md:visible"
                    src="/img/site/sipendi-logo-2.png"
                    alt="Kurikulum Merdeka Logo"
                    />
                </div>
            </div>

            
        </div>
        <div className='h-5 bg-sipaud-blue-900'></div>
    </>
  )
}

export default Hero