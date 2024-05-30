import React, { useState, useEffect } from 'react'
import { Link, useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
// import { Link } from "react-router-dom"

const Login = ({ status, canResetPassword }) => {

  const { flash } = usePage().props;

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState);
  }

  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  useEffect(() => {
      return () => {
          reset('password');
      };
  }, []);

  const submit = (e) => {
      e.preventDefault();
      setIsClicked(true);

      setTimeout(() => {
          setIsClicked(false);
      }, 2000); // Reset the button state after 2 seconds

      post(route('actionlogin'));
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
                <p className='text-center font-BalooBhaina text-2xl'>Login ke SimPaud</p>

                {flash.message && <div className="mb-4 font-medium text-sm text-red-600">{flash.message}</div>}

                <form onSubmit={submit}>
                <div className="col-span-full mt-10">
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
                    Kata Sandi <span className='text-red-600'>*</span>
                  </label>
                  <div className="mt-2 relative">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      name="password"
                      id="password"
                      required
                      autoComplete="current-password"
                      onChange={(e) => setData('password', e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sipaud-blue-100 sm:text-sm sm:leading-6"
                    />
                    <InputError message={errors.password} className="mt-2" />
                    <div
                      className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {isPasswordVisible ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      )}
                    </div>
                    
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
                    'Login'
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

                {canResetPassword && (
                <div className='text-center border-b-2 p-3'>
                  <Link
                  href={route('password.request')}
                  className='text-sm font-livic text-sipaud-blue-900'
                  >
                    Lupa Kata Sandi ?
                  </Link>

                </div>
                )}

                <div className='p-3 text-center'>
                  <p className='text-sm font-livic'>
                    Belum punya akun ? silahkan
                  </p>
                  <Link
                  href='/registrasi'
                  className='text-sm font-livic text-sipaud-blue-900'
                  >
                    Buat Akun Sekolah Baru
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

export default Login