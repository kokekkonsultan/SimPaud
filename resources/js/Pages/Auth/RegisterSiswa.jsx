import React, { useState, useEffect } from 'react'
import { Link, useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
// import { Link } from "react-router-dom"

const Register = ({ agama }) => {

  const { sekolah, pendaftaran, formpendaftaran, tanggal_pendaftaran, flash } = usePage().props;
  const [isClicked, setIsClicked] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
      id_sekolah: sekolah.id || "",
      name: '',
      email: '',
      jenis_kelamin: '',
      agama: '',
      // nisn: '',
      tempat_lahir: '',
      tanggal_lahir: '',
      nama_ayah: '',
      no_telpon_ayah: '',
      no_kartu_keluarga: '',
      nik_orang_tua: '',
      alamat: '',
      password: '',
      password_confirmation: '',
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState);
  }

  useEffect(() => {
      return () => {
          reset('password', 'password_confirmation');
      };
  }, []);

  const submit = (e) => {
      e.preventDefault();
      setIsClicked(true);

      setTimeout(() => {
          setIsClicked(false);
      }, 3000); // Reset the button state after 2 seconds

      post(route('register'));
  };

  return (
    <>
      <div
      className='min-h-screen bg-sipaud-blue-800 bg-center bg-cover bg-no-repeat'
      style={{ backgroundImage: `url('/img/site/bg-login.jpg')` }}
      >
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className='md:flex p-5 md:p-10'>
            <div className='w-full md:w-2/6 '>

              <div className={ (formpendaftaran==0) ? "mt-5 md:mt-40" : "mt-5 md:mt-0" }>
              <p className='font-BalooBhaina text-3xl text-white'>Yuk Daftar</p>
              <p className='font-livic text-white'>
              untuk menikmati semua Fitur SimPaud. Isi form registrasi berikut.
              </p>
              </div>
              <Link
              href='/'
              >
                <img
                className="w-auto mt-10 mb-5"
                src="/img/site/sipaud-logo-3.png"
                alt="Kurikulum Merdeka Logo"
                />
              </Link>

            </div>
            <div className='w-full md:w-4/6'>


            <div className='w-full bg-white rounded-lg p-5 shadow-md'>
              <div>
              { (formpendaftaran==4) ? 'Data Sekolah Tidak Ditemukan' : 
                <div>
                <p className='text-center font-BalooBhaina text-2xl'>Registrasi Siswa</p>
                <p className='text-center font-BalooBhaina'><span className='text-xl'>"{ sekolah.nama }"</span>
                <br />{ sekolah.alamat }, { sekolah.kecamatan } - { sekolah.kotakab } 
                <br />{ (sekolah.no_telpon) ? 'Telp: '+sekolah.no_telpon : "" }
                </p>
                </div>
                }

                <p className='text-center pt-5'><span className='text-red'>
                { (formpendaftaran==1) ? 'Pendaftaran Belum Dimulai' : '' }
                { (formpendaftaran==2) ? 'Pendaftaran Sudah Berakhir' : '' }
                { (formpendaftaran==3) ? 'Pendaftaran Belum Dibuka' : '' }
                </span></p>
                { ((pendaftaran) && (formpendaftaran==0)) ? 
                <div style={{ whiteSpace: 'pre-line' }}>
                <hr />
                <p className='text-center font-BalooBhaina pt-5'><span className='text-xl'>{ pendaftaran.nama }</span></p>
                <p className='text-center pb-4'>Tanggal { tanggal_pendaftaran }</p>
                {/* { pendaftaran.deskripsi } */}
                <div dangerouslySetInnerHTML={{ __html: pendaftaran.deskripsi }} />
                </div> : '' }

                {flash.message && <div className="mb-4 font-medium text-sm text-green-600">{flash.message}</div>}

                { (formpendaftaran==0) ? 
                <form onSubmit={submit}>

                <input
                    type="hidden"
                    name="id_sekolah"
                    value={data.id_sekolah}
                    onChange={(e) =>
                        setData("id_sekolah", e.target.value)
                    }
                />

                <input
                    type="hidden"
                    name="role_id"
                    value="5"
                    onChange={(e) =>
                        setData("role_id", e.target.value)
                    }
                />

                <div className='font-livic text-sm p-5 bg-[#D1ECF1] mb-7 rounded-lg text-sipaud-blue-900 mt-10'>
                Isian dengan tanda (*) Wajib diisi
                </div>

                <div className="grid md:grid-cols-2 md:gap-6">

                <div>

                    <div className="col-span-full">
                      <label htmlFor="nama-sekolah" className="block text-sm md:text-base font-medium leading-6 text-gray-900 font-livic">
                        Nama Lengkap <span className='text-red-600'>*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          autoComplete="nama-lengkap"
                          placeholder='Nama Lengkap'
                          onChange={(e) => setData('name', e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sipaud-blue-100 sm:text-sm sm:leading-6 font-livic"
                        />
                        <InputError message={errors.name} className="mt-2" />
                      </div>
                    </div>

                    <div className="col-span-full mt-4">
                      <label htmlFor="jenis-kelamin" className="block text-sm md:text-base font-medium leading-6 text-gray-900 font-livic">
                        Jenis Kelamin <span className='text-red-600'>*</span>
                      </label>
                      <div className="mt-2">
                        <select 
                        name="jenis_kelamin" 
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sipaud-blue-100 sm:text-sm sm:leading-6 font-livic" onChange={(e) =>
                              setData("jenis_kelamin", e.target.value)
                          }>
                          <option value="">-Pilih Jenis Kelamin-</option>
                          <option value="L">Laki-laki</option>
                          <option value="P">Perempuan</option>
                        </select>
                        <InputError message={errors.jenis_kelamin} className="mt-2" />
                      </div>
                    </div>

                    <div className="col-span-full mt-4">
                      <label htmlFor="tempat-lahir" className="block text-sm md:text-base font-medium leading-6 text-gray-900 font-livic">
                        Tempat Lahir <span className='text-red-600'>*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="tempat_lahir"
                          id="tempat_lahir"
                          required
                          autoComplete="tempat-lahir"
                          placeholder='Tempat Lahir'
                          onChange={(e) => setData('tempat_lahir', e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sipaud-blue-100 sm:text-sm sm:leading-6 font-livic"
                        />
                        <InputError message={errors.tempat_lahir} className="mt-2" />
                      </div>
                    </div>

                    <div className="col-span-full mt-4">
                      <label htmlFor="nama-ayah" className="block text-sm md:text-base font-medium leading-6 text-gray-900 font-livic">
                        Nama Ayah <span className='text-red-600'>*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="nama_ayah"
                          id="nama_ayah"
                          required
                          autoComplete="nama-ayah"
                          placeholder='Nama Ayah'
                          onChange={(e) => setData('nama_ayah', e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sipaud-blue-100 sm:text-sm sm:leading-6 font-livic"
                        />
                        <InputError message={errors.nama_ayah} className="mt-2" />
                      </div>
                    </div>

                    <div className="col-span-full mt-4">
                      <label htmlFor="kecamatan" className="block text-sm md:text-base font-medium leading-6 text-gray-900 font-livic">
                        Nomer Telpon Ayah <span className='text-red-600'>*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="no_telpon_ayah"
                          id="no_telpon_ayah"
                          required
                          autoComplete="nomor-telepon-ayah"
                          placeholder='Nomor Telepon Ayah/ HP'
                          onChange={(e) => setData('no_telpon_ayah', e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sipaud-blue-100 sm:text-sm sm:leading-6 font-livic"
                        />
                        <InputError message={errors.no_telpon_ayah} className="mt-2" />
                      </div>
                    </div>

                    <div className="col-span-full mt-4">
                      <label htmlFor="alamat-jalan" className="block text-sm md:text-base font-medium leading-6 text-gray-900 font-livic">
                        Alamat <span className='text-red-600'>*</span>
                        </label>
                        <div className="mt-2">
                          <textarea
                            id="alamat"
                            name="alamat"
                            placeholder='Alamat'
                            rows={5}
                            required
                            onChange={(e) => setData('alamat', e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sipaud-blue-100 sm:text-sm sm:leading-6 font-livic"
                            defaultValue={''}
                          />
                          <InputError message={errors.alamat} className="mt-2" />
                        </div>
                      </div>







                </div>
                
                <div>

                    <div className="col-span-full">
                      <label htmlFor="email" className="block text-sm md:text-base font-medium leading-6 text-gray-900 font-livic">
                        Email <span className='text-red-600'>*</span> <span className='text-sm font-light'>(alamat email harus aktif)</span>
                      </label>
                      <div className="mt-2">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          required
                          autoComplete="email"
                          placeholder='Alamat email aktif'
                          onChange={(e) => setData('email', e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sipaud-blue-100 sm:text-sm sm:leading-6 font-livic"
                        />
                        <InputError message={errors.email} className="mt-2" />
                      </div>
                    </div>

                    <div className="col-span-full mt-4">
                      <label htmlFor="agama" className="block text-sm md:text-base font-medium leading-6 text-gray-900 font-livic">
                        Agama <span className='text-red-600'>*</span>
                      </label>
                      <div className="mt-2">
                        <select 
                        name="agama" 
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sipaud-blue-100 sm:text-sm sm:leading-6 font-livic" onChange={(e) =>
                              setData("agama", e.target.value)
                          }>
                          <option value="">-Pilih Agama-</option>
                          {agama.map(({ id, nama }) => (
                              <option value={id}>{nama}</option>
                          ))}
                        </select>
                        <InputError message={errors.agama} className="mt-2" />
                      </div>
                    </div>

                    <div className="col-span-full mt-4">
                      <label htmlFor="tanggal-lahir" className="block text-sm md:text-base font-medium leading-6 text-gray-900 font-livic">
                        Tanggal Lahir <span className='text-red-600'>*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          type="date"
                          name="tanggal_lahir"
                          id="tanggal_lahir"
                          required
                          autoComplete="tanggal-lahir"
                          placeholder='Tanggal Lahir'
                          onChange={(e) => setData('tanggal_lahir', e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sipaud-blue-100 sm:text-sm sm:leading-6 font-livic"
                        />
                        <InputError message={errors.tanggal_lahir} className="mt-2" />
                      </div>
                    </div>

                    <div className="col-span-full mt-4">
                      <label htmlFor="no-kartu-keluarga" className="block text-sm md:text-base font-medium leading-6 text-gray-900 font-livic">
                        Nomer Kartu Keluarga <span className='text-red-600'>*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="no_kartu_keluarga"
                          id="no_kartu_keluarga"
                          required
                          autoComplete="no-kartu-keluarga"
                          placeholder='Nomer Kartu Keluarga'
                          onChange={(e) => setData('no_kartu_keluarga', e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sipaud-blue-100 sm:text-sm sm:leading-6 font-livic"
                        />
                        <InputError message={errors.no_kartu_keluarga} className="mt-2" />
                      </div>
                    </div>

                    <div className="col-span-full mt-4">
                      <label htmlFor="nik-orang-tua" className="block text-sm md:text-base font-medium leading-6 text-gray-900 font-livic">
                        NIK Orang Tua <span className='text-red-600'>*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="nik_orang_tua"
                          id="nik_orang_tua"
                          required
                          autoComplete="nik-orang-tua"
                          placeholder='NIK Orang Tua'
                          onChange={(e) => setData('nik_orang_tua', e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sipaud-blue-100 sm:text-sm sm:leading-6 font-livic"
                        />
                        <InputError message={errors.nik_orang_tua} className="mt-2" />
                      </div>
                    </div>

                    {/* <div className="col-span-full mt-4">
                      <label htmlFor="kata-sandi" className="block text-sm md:text-base font-medium leading-6 text-gray-900 font-livic">
                        Buat Kata Sandi <span className='text-red-600'>*</span>
                      </label>
                      <div className="mt-2 relative">

                        <input
                          type={isPasswordVisible ? "text" : "password"}
                          name="password"
                          id="password"
                          autoComplete="current-password"
                          placeholder='Kata sandi akun SimPaud'
                          onChange={(e) => setData('password', e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sipaud-blue-100 sm:text-sm sm:leading-6 font-livic"
                        />

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
                        <InputError message={errors.password} className="mt-2" />
                        
                      </div>
                    </div>

                    <div className="col-span-full mt-4">
                      <label htmlFor="konfirmasi-sandi" className="block text-sm md:text-base font-medium leading-6 text-gray-900 font-livic">
                        Konfirmasi Kata Sandi <span className='text-red-600'>*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          type="password"
                          name="password_confirmation"
                          id="password_confirmation"
                          autoComplete="current-password"
                          placeholder='Ketikkan ulang kata sandi'
                          onChange={(e) => setData('password_confirmation', e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sipaud-blue-100 sm:text-sm sm:leading-6 font-livic"
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                      </div>
                    </div> */}



                </div>







                </div>



                
                
                

                

                <div className='mt-10'>
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
                    'Daftarkan'
                )}
                  </button>
                </div>

                </form> : '' }

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

                        .image-style-side {
                          float: right;
                          margin-left: 1.5em;
                          max-width: 50%;
                        }
                    `}
                </style>


                <div className='text-center border-b-2 p-3'>
                  
                </div>
                { (formpendaftaran==0) ? 
                <div className='flex p-3 justify-center'>
                  <p className='text-sm font-livic'>
                  Sudah mempunyai akun? silahkan
                  </p>
                  <Link
                  href='/login'
                  className='text-sm font-livic text-sipaud-blue-900 ml-1'
                  >
                    Login
                  </Link>
                </div> : '' }

              </div>
            </div>



            </div>

          </div>
          
          <div className='w-full text-white text-sm text-center font-livic mt-5 md:mt-10 p-10'>
          ©2024 SimPaud
          </div>



        </div>
        
        
      </div>
    </>
  )
}

export default Register