import React, { useState, useEffect } from 'react'
import { Link, useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
// import { Link } from "react-router-dom"

const Register = () => {

  const { flash } = usePage().props;
  const [isClicked, setIsClicked] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
      name: '',
      email: '',
      status_sekolah: '',
      no_telpon: '',
      npsn: '',
      sk_pendirian_sekolah: '',
      alamat: '',
      password: '',
      password_confirmation: '',
  });

  const status_sekolah = [
      { nama_status: "Negeri", id_status: 1 },
      { nama_status: "Swasta", id_status: 2 },
  ];

  const [statusNpsn, setStatusNpsn] = useState(false);
  const [statusNpsnSekolah, setStatusNpsnSekolah] = useState(false);
  const [pilihNpsn, setPilihNpsn] = useState(false);

  const checkPilihNpsn = () => {
      setPilihNpsn(!pilihNpsn);

      if(pilihNpsn == true) {
          setStatusNpsn(false);
      } else {
          setStatusNpsn(true);
      }
  }

  function statusSekolahChangeHandler (e) {
      if(e.target.value != 'Pilih Status Sekolah'){

          if(e.target.value == 1)
          {
              setStatusNpsn(true);
              setStatusNpsnSekolah(false);
          } else if(e.target.value == 2) {
              setStatusNpsn(false);
              setStatusNpsnSekolah(true);
          } else {
              setStatusNpsnSekolah(false);
              setStatusNpsn(false);
          }

      } else {
          setStatusNpsn(false);
          setStatusNpsnSekolah(false);
          setPilihNpsn(false);
      }
      setData('status_sekolah', e.target.value);
      // console.log(e.target.value);

  }

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState);
  }

  const [country, setCountry]= useState([]);
    const [countryid, setCountryid]=useState(0);
    const [st, setSt]= useState([]);
    const [stateid, setStateid]= useState(0);
    const [city, setCity]= useState([]);

     useEffect( ()=>{
         const getcountry= async()=>{
             const rescountry= await fetch("/dataprovinsi");
             const rescon= await rescountry.json();
             setCountry(await rescon);
         }
         getcountry();
     },[]);

     const handlecountry=(event)=>{
         const getcountryid= event.target.value;
         setCountryid(getcountryid);
     }

     useEffect( ()=>{
     const getstate= async()=>{
         const resstate= await fetch(`/datakota/${countryid}`);
         const resst= await resstate.json();
         setSt(await resst);
     }
    getstate();
     },[countryid]);

     const handlestate=(event)=>{
        const getstateid= event.target.value;
        setStateid(getstateid);
    }

    useEffect( ()=>{
        const getcity= async()=>{   
            const rescity= await fetch(`/datakecamatan/${stateid}`);
            const rcity= await rescity.json();
            setCity(await rcity);
        }
    getcity();
    },[stateid]);

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
      }, 2000); // Reset the button state after 2 seconds

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

              <div className='mt-5 md:mt-40'>
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
                <p className='text-center font-BalooBhaina text-2xl'>Registrasi Akun Sekolah</p>

                {flash.message && <div className="mb-4 font-medium text-sm text-green-600">{flash.message}</div>}

                <form onSubmit={submit}>

                <input
                    type="hidden"
                    name="role_id"
                    value="3"
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
                        Nama Sekolah <span className='text-red-600'>*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          autoComplete="nama-sekolah"
                          placeholder='Nama Satuan Pendidikan'
                          onChange={(e) => setData('name', e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sipaud-blue-100 sm:text-sm sm:leading-6 font-livic"
                        />
                        <InputError message={errors.name} className="mt-2" />
                      </div>
                    </div>

                    <div className="col-span-full mt-4">
                      <label htmlFor="status-sekolah" className="block text-sm md:text-base font-medium leading-6 text-gray-900 font-livic">
                        Status Sekolah <span className='text-red-600'>*</span>
                      </label>
                      <div className="mt-2">
                        <select
                          id='status_sekolah'
                          name="status_sekolah"
                          required
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sipaud-blue-100 sm:text-sm sm:leading-6 font-livic"
                          onChange={statusSekolahChangeHandler}
                        >
                          <option>-Pilih Status Sekolah-</option>
                          {status_sekolah.map(item => (
                              <option key={item.id_status} value={item.id_status}>{item.nama_status}</option>
                          ))}
                        </select>
                        <InputError message={errors.status_sekolah} className="mt-2" />
                      </div>
                  </div>

                  {(statusNpsnSekolah == true)?
                    <div className="mt-3">
                        <label
                        htmlFor="status_npsn"
                        className="block font-medium leading-6 text-gray-900 font-livic"
                        >
                            Sudah memiliki NPSN ?
                        </label>
                        <div className="mt-2">

                        <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <input
                          id="comments"
                          name="comments"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-sipaud-blue-100 focus:ring-sipaud-blue-100"
                        //   onChange={statusNpsnSekolahChangeHandler}
                        checked={pilihNpsn}
                        onChange={checkPilihNpsn}
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <label htmlFor="comments" className="font-medium text-gray-900">
                          Centang bila sudah memiliki
                        </label>
                      </div>
                    </div>

                        </div>
                    </div>
                    : ""
                    }


                    {(statusNpsn == true)?
                    <div className="mt-3">
                        <label
                        htmlFor="npsn"
                        className="block text-sm font-medium leading-6 text-gray-900 font-livic"
                        >
                            NPSN  <span className='text-red-600'>*</span> <span className='text-sm font-light'>(Nomor Pokok Sekolah Nasional)</span>
                        </label>
                        <div className="mt-2">
                            <input
                            type="number"
                            name="npsn"
                            id="npsn"
                            autoComplete="given-name"
                            placeholder='8 Digit'
                            onChange={(e) => setData('npsn', e.target.value)}
                            className="block w-48 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sipaud-blue-100 sm:text-sm sm:leading-6 font-livic"
                            />
                        </div>
                    </div>
                    :
                    ""
                    }

                    <div className="col-span-full mt-4">
                      <label htmlFor="provinsi" className="block text-sm md:text-base font-medium leading-6 text-gray-900 font-livic">
                        Provinsi <span className='text-red-600'>*</span>
                      </label>
                      <div className="mt-2">
                        <select
                        id='provinsi'
                        name='provinsi'
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sipaud-blue-100 sm:text-sm sm:leading-6 font-livic"
                        onChange={(e)=>handlecountry(e)}
                        >
                        <option>-Pilih Provinsi-</option>
                        {
                            country.map( (getcon, index)=>(
                                <option key={index} value={getcon.kode_wilayah}>{getcon.nama } </option>
                                ))
                        }
                        </select>
                        <InputError message={errors.provinsi} className="mt-2" />
                      </div>
                    </div>

                    <div className="col-span-full mt-4">
                      <label htmlFor="kab-kota" className="block text-sm md:text-base font-medium leading-6 text-gray-900 font-livic">
                        Kabupaten/ Kota <span className='text-red-600'>*</span>
                      </label>
                      <div className="mt-2">
                        <select
                        id='kab-kota'
                        name='kabupaten_kota'
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sipaud-blue-100 sm:text-sm sm:leading-6 font-livic"
                        onChange={(e)=>handlestate(e)}
                        >
                        <option>-Pilih Kabupaten / Kota-</option>
                        {
                            st.map( (getst, index)=>(
                            <option key={index} value={getst.kode_wilayah}>{getst.nama } </option>
                            )) 
                        }
                        </select>
                        <InputError message={errors.kabupaten_kota} className="mt-2" />
                      </div>
                    </div>

                    <div className="col-span-full mt-4">
                      <label htmlFor="kecamatan" className="block text-sm md:text-base font-medium leading-6 text-gray-900 font-livic">
                        Kecamatan <span className='text-red-600'>*</span>
                      </label>
                      <div className="mt-2">
                        <select
                        id='kecamatan'
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sipaud-blue-100 sm:text-sm sm:leading-6 font-livic"
                        onChange={(e) =>setData("kecamatan", e.target.value)}
                        >
                        <option>-Pilih Kecamatan-</option>
                        {
                            city.map( (gcity, index)=>(
                            <option key={index} value={gcity.kode_wilayah}> { gcity.nama} </option>
                            ))
                        }
                        </select>
                        <InputError message={errors.kecamatan} className="mt-2" />
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
                            placeholder='Alamat Sekolah'
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
                      <label htmlFor="nomor-telepon" className="block text-sm md:text-base font-medium leading-6 text-gray-900 font-livic">
                        Nomor Telepon <span className='text-red-600'>*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="no_telpon"
                          id="no_telpon"
                          required
                          autoComplete="nomor-telepon"
                          placeholder='Nomor Telepon Sekolah/ HP'
                          onChange={(e) => setData('no_telpon', e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sipaud-blue-100 sm:text-sm sm:leading-6 font-livic"
                        />
                        <InputError message={errors.no_telpon} className="mt-2" />
                      </div>
                    </div>

                    <div className="col-span-full mt-4">
                      <label htmlFor="sk-pendirian-sekolah" className="block text-sm md:text-base font-medium leading-6 text-gray-900 font-livic">
                        SK Pendirian Sekolah <span className='text-red-600'>*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="sk_pendirian_sekolah"
                          id="sk_pendirian_sekolah"
                          required
                          autoComplete="sk-pendirian-sekolah"
                          placeholder='Nomor SK pendirian Sekolah'
                          onChange={(e) => setData('sk_pendirian_sekolah', e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sipaud-blue-100 sm:text-sm sm:leading-6 font-livic"
                        />
                        <InputError message={errors.sk_pendirian_sekolah} className="mt-2" />
                      </div>
                    </div>

                    <div className="col-span-full mt-4">
                      <label htmlFor="kata-sandi" className="block text-sm md:text-base font-medium leading-6 text-gray-900 font-livic">
                        Buat Kata Sandi <span className='text-red-600'>*</span>
                      </label>
                      <div className="mt-2 relative">

                        <input
                          type={isPasswordVisible ? "text" : "password"}
                          name="password"
                          id="password"
                          required
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
                          required
                          autoComplete="current-password"
                          placeholder='Ketikkan ulang kata sandi'
                          onChange={(e) => setData('password_confirmation', e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sipaud-blue-100 sm:text-sm sm:leading-6 font-livic"
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                      </div>
                    </div>



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
                </div>

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