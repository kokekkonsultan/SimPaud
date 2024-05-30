import React, { useState } from 'react'
import { Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
// import { Link } from "react-router-dom"

const ForgotPassword = ({ status }) => {

  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });
  const [isClicked, setIsClicked] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setIsClicked(true);

      setTimeout(() => {
          setIsClicked(false);
      }, 3000); // Reset the button state after 2 seconds

    post(route('password.email'));
  };

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
                <p className='text-center font-BalooBhaina text-2xl'>Lupa Kata Sandi?</p>

                {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                <form onSubmit={submit}>
                <div className="col-span-full mt-10">

                    <div className='font-livic text-sm p-5 bg-[#D1ECF1] mb-3 rounded-lg text-sipaud-blue-900'>
                    Anda dapat mengatur ulang kata sandi apabila Anda lupa, kami akan mengirimkan tautan untuk mengatur ulang kata sandi ke email anda.
                    </div>

                  <label htmlFor="email" className="block text-sm md:text-base font-medium leading-6 text-gray-900 font-livic">
                  Email akun SimPaud <span className='text-red-600'>*</span>
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

                <div className='mt-5'>
                  <button
                    type="submit"
                    disabled={isClicked}
                    className="rounded-3xl w-full bg-yellow-600 px-3 py-2 text-sm md:text-base font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600 font-livic"
                  >
                    {isClicked ? (
                    <span>
                        <span className="spinner" />
                        Memeriksa...
                    </span>
                ) : (
                    'Submit'
                )}
                  </button>
                </div>

                </form>
                <style>
                {`
                        .spinner {
                            margin-right: 10px;
                            border: 2px solid rgba(255, 255, 255, 0.3);
                            border-top: 2px solid white;
                            border-radius: 50%;
                            width: 14px;
                            height: 14px;
                            animation: spin 1s linear infinite;
                            display: inline-block;
                        }

                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}
                </style>


                <div className='text-center border-b-2 p-3'>
                  
                </div>

                <div className='p-3 text-center'>
                  <p className='text-sm font-livic'>
                    Sudah ingat? silahkan
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

export default ForgotPassword