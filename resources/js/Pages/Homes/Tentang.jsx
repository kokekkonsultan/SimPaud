import React from 'react'

const Tentang = () => {
  return (
    <>
    <div 
    className='py-5 bg-right-bottom bg-no-repeat'
    style={{ backgroundImage: `url('/img/site/pattern-light01.png')` }}
    >
        <section 
        id='tentang-simpaud'
        className="mx-auto max-w-7xl sm:px-6 lg:px-8"
        >
        <div
        className='font-BalooBhaina text-3xl text-center mt-10'
        >
        Tentang SimPaud
        </div>

        <div
        className='p-10 md:p-20'
        >
            
            <div className="md:grid md:grid-cols-2 md:gap-16">
                <div
                className=''
                >
                <img
                    className="w-full pr-10 pb-10"
                    src="/img/site/logo-kurikulum-merdeka-belajar.png"
                    alt="Kurikulum Merdeka Logo"
                />
                </div>

                <div className='font-livic'>
                <p><span className='font-bold'>SimPaud</span> singkatan dari Sistem Informasi Penilaian Perkembangan Anak Usia Dini. Tujuan di buatnya SimPaud ini adalah untuk mempermudah dan mempercepat pendidik untuk membuat sebuah penilaian. SimPaud dikembangkan mengikuti program Kurikulum Merdeka.</p>
                <p><span className='font-bold'>Kurikulum Merdeka</span> adalah kurikulum dengan pembelajaran intrakurikuler yang beragam di mana konten akan lebih optimal agar peserta didik memiliki cukup waktu untuk mendalami konsep dan menguatkan kompetensi. Guru memiliki keleluasaan untuk memilih berbagai perangkat ajar sehingga pembelajaran dapat disesuaikan dengan kebutuhan belajar dan minat peserta didik.</p>
                <p>SimPaud dilengkapi dengan fitur penilaian harian berdasarkan Kompetensi Dasar, input nilai harian peseta didik menjadi lebih mudah. Tersedia juga fitur untuk mencatat perkembangan Emosi dan Jasmani.</p>
                </div>
            </div>
        </div>
        </section>
        </div>
    </>
  )
}

export default Tentang