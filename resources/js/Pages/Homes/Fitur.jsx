import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const getConfigurable = () => ({
  // showArrows: boolean('showArrows', true, tooglesGroupId),
  // showStatus: boolean('showStatus', true, tooglesGroupId),
  // showIndicators: boolean('showIndicators', false, tooglesGroupId),
  // infiniteLoop: boolean('infiniteLoop', true, tooglesGroupId),
  // showThumbs: boolean('showThumbs', false, tooglesGroupId),
  // useKeyboardArrows: boolean('useKeyboardArrows', true, tooglesGroupId),
  // autoPlay: boolean('autoPlay', true, tooglesGroupId),
  // stopOnHover: boolean('stopOnHover', true, tooglesGroupId),
  // swipeable: boolean('swipeable', true, tooglesGroupId),
  // dynamicHeight: boolean('dynamicHeight', true, tooglesGroupId),
  // emulateTouch: boolean('emulateTouch', true, tooglesGroupId),
  // autoFocus: boolean('autoFocus', false, tooglesGroupId),
  // thumbWidth: number('thumbWidth', 100, {}, valuesGroupId),
  // selectedItem: number('selectedItem', 0, {}, valuesGroupId),
  // interval: number('interval', 2000, {}, valuesGroupId),
  // transitionTime: number('transitionTime', 500, {}, valuesGroupId),
  // swipeScrollTolerance: number('swipeScrollTolerance', 5, {}, valuesGroupId),
  // ariaLabel: text('ariaLabel', undefined),
  showIndicators: false,
  autoPlay: true,
  showThumbs: false,
  showStatus: false,
  infiniteLoop: true,
  interval: 3000,
  swipeable: true,
});

const Fitur = () => {
  return (
    <>
    <div 
    className='bg-[#ACD4EF] py-5 bg-left-bottom bg-no-repeat'
    style={{ backgroundImage: `url('/img/site/pattern-light02.png')` }}
    >
        <section
        id='fitur'
        className='mx-auto max-w-7xl sm:px-6 lg:px-8'
        >
        <div
        className='font-BalooBhaina text-4xl text-center mt-10'
        >
        Fitur SimPaud
        </div>

        <div className="grid md:grid-cols-3 md:gap-5 mt-10 mb-10 p-5 md:p-0">
            <div className='col-span-2'>
              {/* Masukkan gambar disini */}
              {/* <img
                    className="w-full pr-10 pb-10"
                    src="/img/site/fitur-sipaud1.png"
                    alt=""
                /> */}
            {/* <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
              <Carousel>
                <img src="https://flowbite.com/docs/images/carousel/carousel-1.svg" alt="..." />
                <img src="https://flowbite.com/docs/images/carousel/carousel-2.svg" alt="..." />
                <img src="https://flowbite.com/docs/images/carousel/carousel-3.svg" alt="..." />
                <img src="https://flowbite.com/docs/images/carousel/carousel-4.svg" alt="..." />
                <img src="https://flowbite.com/docs/images/carousel/carousel-5.svg" alt="..." />
              </Carousel>
            </div> */}


            <Carousel { ...getConfigurable() }>
                <div>
                    <img src="/images/fitur-sipaud1.png" />
                    {/* <p className="legend">Legend 1</p> */}
                </div>
                <div>
                    <img src="/images/fitur-sipaud2.png" />
                    {/* <p className="legend">Legend 2</p> */}
                </div>
                <div>
                    <img src="/images/fitur-sipaud3.png" />
                    {/* <p className="legend">Legend 3</p> */}
                </div>
                <div>
                    <img src="/images/fitur-sipaud4.png" />
                    {/* <p className="legend">Legend 3</p> */}
                </div>
            </Carousel>



            </div>
            <div>

              <div className='hover:text-sipaud-blue-900 hover:cursor-pointer'>
                <p className='font-BalooBhaina text-3xl '>Penilaian Harian</p>
                <p className='font-livic mt-2'>
                Fitur ini digunakan untuk menilai peserta didik berdasarkan kompetensi dasar.
                </p>
              </div>
              <div className='hover:text-sipaud-blue-900 hover:cursor-pointer mt-12'>
                <p className='font-BalooBhaina text-3xl '>Catatan Perkembangan</p>
                <p className='font-livic mt-2'>
                Fitur ini digunakan untuk menilai emosi, jasmani dan kesehatan peserta didik per bulan.
                </p>
              </div>
              <div className='hover:text-sipaud-blue-900 hover:cursor-pointer mt-12'>
                <p className='font-BalooBhaina text-3xl '>Laporan {/* Grafik &  */}Cetak</p>
                <p className='font-livic mt-2'>
                Terdapat fitur laporan penilaian dan perkembangan dalam bentuk {/* grafik atau  */}cetak.
                </p>
              </div>
              <div className='hover:text-sipaud-blue-900 hover:cursor-pointer mt-12'>
                <p className='font-BalooBhaina text-3xl '>Kurikulum Merdeka</p>
                <p className='font-livic mt-2'>
                Kurikulum Merdeka memberikan keleluasaan kepada pendidik untuk menciptakan pembelajaran berkualitas.
                </p>
              </div>

            </div>
        </div>



        </section>

    </div>
    </>
  )
}

export default Fitur