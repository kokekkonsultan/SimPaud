import React, { useState, useEffect } from 'react'
import { Link, useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';

const Kontak = () => {

  const { flash } = usePage().props;
  const [isClicked, setIsClicked] = useState(false);

  const { data, setData, errors, post } = useForm({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const submit = (e) => {
      e.preventDefault();
      setIsClicked(true);

      setTimeout(() => {
          setIsClicked(false);
      }, 5000); // Reset the button state after 2 seconds

      post(route('kirim-kontak'));
  };

  return (
    <>
        <section
        id='kontak'
        className='mx-auto max-w-7xl sm:px-6 lg:px-8 bg-gray-50 rounded-2xl p-5 md:mt-10 md:mb-10'
        >
        
        <div
        className='font-BalooBhaina text-3xl text-center mt-10'
        >
        Kontak
        </div>

        {/* <div className="grid grid-cols-2 gap-4 mt-10">
            <div> */}
        <div className="flex flex-wrap mt-10">
            <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 p-2">
                <p className='font-BalooBhaina text-gray-800 text-2xl'>
                Pusat Pengembangan Pendidikan Anak Usia Dini dan Pendidikan Masyarakat 
                </p>
                <p className='font-livic mt-5 text-sm'>Twitter</p>
                <p className='font-livic mt-2 text-sm'>Facebook</p>
                <p className='font-livic mt-2 text-sm'>Instagram</p>
                
                {/* <p className='font-livic text-lg mt-10'>Rujukan</p> */}
            </div>
            <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 p-2">
              
              {/* Tampilkan Peta Disini */}
              {/* <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.8575955667466!2d110.40396631477424!3d-7.142460894842641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70861ee8400a69%3A0x4c572502739a7d95!2sPP+Paud+Dan+Dikmas+Jawa+Tengah!5e0!3m2!1sen!2sid!4v1565937319902!5m2!1sen!2sid"
                width="100%"
                height="350"
                frameborder="0"
                style={{ border: 0 }}
                allowfullscreen=""
                aria-hidden="false"
                tabindex="0"
            /> */}

{flash.message && <div className="mb-4 font-medium text-sm text-green-600">{flash.message}</div>}


<form onSubmit={submit}>
            <div className="grid md:grid-cols-2 md:gap-6">

            <div>
                <div className="col-span-full">
                  <label htmlFor="kata-sandi" className="block text-sm md:text-base font-medium leading-6 text-gray-900 font-livic">
                    Nama <span className='text-red-600'>*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      onChange={(e) => setData('name', e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sipaud-blue-100 sm:text-sm sm:leading-6"
                    />
                    <InputError message={errors.name} className="mt-2" />
                  </div>
                </div>
                
                <div className="col-span-full mt-2">
                  <label htmlFor="kata-sandi" className="block text-sm md:text-base font-medium leading-6 text-gray-900 font-livic">
                    Nomor Telepon <span className='text-red-600'>*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      required
                      onChange={(e) => setData('phone', e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sipaud-blue-100 sm:text-sm sm:leading-6"
                    />
                    <InputError message={errors.phone} className="mt-2" />
                  </div>
                </div>
            </div>

            <div>

                <div className="col-span-full">
                  <label htmlFor="email" className="block text-sm md:text-base font-medium leading-6 text-gray-900 font-livic">
                    Email <span className='text-red-600'>*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      autoComplete="email"
                      onChange={(e) => setData('email', e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sipaud-blue-100 sm:text-sm sm:leading-6"
                    />
                    <InputError message={errors.email} className="mt-2" />
                  </div>
                </div>

                <div className="col-span-full mt-2">
                  <label htmlFor="kata-sandi" className="block text-sm md:text-base font-medium leading-6 text-gray-900 font-livic">
                    Subyek <span className='text-red-600'>*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      required
                      onChange={(e) => setData('subject', e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sipaud-blue-100 sm:text-sm sm:leading-6"
                    />
                    <InputError message={errors.subject} className="mt-2" />
                  </div>
                </div>

                
            </div>
        </div>

        <div className="col-span-full mt-2">
                  <label htmlFor="kata-sandi" className="block text-sm md:text-base font-medium leading-6 text-gray-900 font-livic">
                    Pesan <span className='text-red-600'>*</span>
                  </label>
                  <div className="mt-2">
                    <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        onChange={(e) => setData('message', e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sipaud-blue-100 sm:text-sm sm:leading-6 font-livic"
                      />
                    <InputError message={errors.message} className="mt-2" />
                  </div>
                </div>

                <div className='mt-5'>
                  <button
                    type="submit"
                    disabled={isClicked}
                    className="rounded-3xl w-full bg-yellow-600 px-3 py-2 text-sm md:text-base font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600 font-livic"
                  >
                    {isClicked ? (
                    <span>
                        <span className="spinner" />
                        Proses...
                    </span>
                ) : (
                    'Kirim'
                )}
                  </button>
                </div>

                </form>
              
              </div>
        </div>

        </section>
    </>
  )
}

export default Kontak