// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from 'react';
import FrontLayout from '@/Layouts/FrontLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Registrasi({ }) {

    const { flash } = usePage().props;

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
        {id: "1", nama: "Negeri"}, 
        {id: "2", nama: "Swasta"}
    ]

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
        if(e.target.value != '-Pilih Status Sekolah-'){
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
    }

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'));
    };

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
  
    return (
      <FrontLayout
          header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Registrasi</h2>}
      >
          <Head title="Registrasi" />

          
          <div class="container my-24 mx-auto md:px-6">
  <section class="mb-32">
    <div class="flex flex-wrap">
      <div class="mb-10 w-full shrink-0 grow-0 basis-auto md:mb-0 md:w-6/12 md:px-3 lg:px-6">
        <h2 class="mb-6 text-3xl font-bold">Registrasi Akun Sekolah</h2>
        <img src="/img/site/logo/sipendi-logo-2.png" className="w-3/4" alt="Sipendi logo" />
      </div>
      <div class="mb-12 w-full shrink-0 grow-0 basis-auto md:mb-0 md:w-6/12 md:px-3 lg:px-6">

      {flash.message && (
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-5 rounded relative" role="alert">
        <strong class="font-bold">Berhasil!</strong> &nbsp;<span class="block sm:inline">{flash.message}</span>
        </div>
    )}

        <form onSubmit={submit}>
            <div class="-mx-2 md:items-center md:flex">
                <div class="flex-1 px-2">
                    <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Nama Sekolah</label>
                    <input type="text" id="name"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required placeholder="Nama Satuan Pendidikan" class="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                    <span className="text-red-600">
                        {errors.name}
                    </span>
                </div>

                <div class="flex-1 px-2 mt-4 md:mt-0">
                    <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Email</label>
                    <input type="email" id="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required placeholder="Alamat email aktif" class="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                </div>
            </div>

            <div class="mt-4 -mx-2 md:items-center md:flex">
                {/* <div class="flex-1 px-2">
                    <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Status Sekolah</label>
                    <select name="status_sekolah" className="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" onChange={(e) =>
                            setData("status_sekolah", e.target.value)
                        }>
                        <option value="">-Pilih Status Sekolah-</option>
                        {status_sekolah.map(({ id, nama }) => (
                            <option value={id}>{nama}</option>
                        ))}
                    </select>
                    <span className="text-red-600">
                        {errors.status_sekolah}
                    </span>
                </div> */}

                <div class="flex-1 px-2">
                    <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Status Sekolah</label>
                    <select name="status_sekolah" className="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" 
                    onChange={statusSekolahChangeHandler}>
                        <option value="">-Pilih Status Sekolah-</option>
                        {status_sekolah.map(({ id, nama }) => (
                            <option key={id} value={id}>{nama}</option>
                        ))}
                    </select>
                    <span className="text-red-600">
                        {errors.status_sekolah}
                    </span>
                </div>

                <div class="flex-1 px-2 mt-4 md:mt-0">
                    <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Nomor Telepon</label>
                    <input type="text" id="no_telpon"
                        name="no_telpon"
                        value={data.no_telpon}
                        onChange={(e) => setData('no_telpon', e.target.value)}
                        required placeholder="Nomor telepon / selular sekolah" class="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                </div>
            </div>

            <div class="mt-4 -mx-2 md:items-center md:flex">
                
                <div class="flex-1 px-2">
                    {(statusNpsnSekolah == true)?
                        <div>
                            <label class="block text-sm text-gray-600 dark:text-gray-200">Sudah memiliki NPSN?</label>
                            <input
                            id="comments"
                            name="comments"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            checked={pilihNpsn}
                            onChange={checkPilihNpsn}
                            /> &nbsp;<label class="text-sm text-gray-600 dark:text-gray-200">Centang bila sudah memiliki</label>
                        </div>
                    :
                    ""
                    }

                    {(statusNpsn == true)?  
                        <div>
                            <label class="block mb-2 mt-2 text-sm text-gray-600 dark:text-gray-200">NPSN</label>
                            <input type="text" id="npsn"
                                name="npsn"
                                value={data.npsn}
                                onChange={(e) => setData('npsn', e.target.value)}
                                required  placeholder="8 Digit" class="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                        </div>
                    :
                    ""
                    }
                </div>

                <div class="flex-1 px-2 mt-4 md:mt-0">
                    
                </div>
            </div>

            <div class="mt-4 -mx-2 md:items-center md:flex">
                <div class="flex-1 px-2">
                    <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Provinsi</label>
                    <select name="provinsi" className="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" onChange={(e)=>handlecountry(e)}>
                        <option value="">-Pilih Provinsi-</option>
                        {
                            country.map( (getcon, index)=>(
                                <option key={index} value={getcon.kode_wilayah}>{getcon.nama } </option>
                                ))
                        }
                    </select>
                </div>

                <div class="flex-1 px-2 mt-4 md:mt-0">
                    <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">SK Pendirian Sekolah</label>
                    <input type="text" id="sk_pendirian_sekolah"
                        name="sk_pendirian_sekolah"
                        value={data.sk_pendirian_sekolah}
                        onChange={(e) => setData('sk_pendirian_sekolah', e.target.value)}
                        required  placeholder="Nomor SK pendirian Sekolah" class="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                </div>
            </div>


            <div class="mt-4 -mx-2 md:items-center md:flex">
                <div class="flex-1 px-2">
                    <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Kota</label>
                    <select name="kota" className="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" onChange={(e)=>handlestate(e)}>
                        <option value="">-Pilih Kota-</option>
                        {
                            st.map( (getst, index)=>(
                            <option key={index} value={getst.kode_wilayah}>{getst.nama } </option>
                            )) 
                        }
                    </select>
                </div>

                <div class="flex-1 px-2 mt-4 md:mt-0">
                    <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Kata Sandi</label>
                    <input type="password" id="password"
                        name="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required  placeholder="Kata sandi akun SiPAUD" class="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                </div>
            </div>

            <div class="mt-4 -mx-2 md:items-center md:flex">
                <div class="flex-1 px-2">
                    <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Kecamatan</label>
                    <select name="kode_wilayah" className="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" onChange={(e) =>
                            setData("kode_wilayah", e.target.value)
                        }>
                        <option value="">-Pilih Kecamatan-</option>
                        {
                            city.map( (gcity, index)=>(
                            <option key={index} value={gcity.kode_wilayah}> { gcity.nama} </option>
                            ))
                        }
                    </select>
                </div>

                <div class="flex-1 px-2 mt-4 md:mt-0">
                    <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Konfirmasi Kata Sandi</label>
                    <input type="password" id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required  placeholder="Konfirmasi kata sandi akun SiPAUD" class="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                </div>
            </div>

            <div class="mt-4 -mx-2 md:items-center md:flex">
                <div class="flex-1 px-2">
                    <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Alamat</label>
                    <textarea id="alamat"
                        name="alamat"
                        value={data.alamat}
                        onChange={(e) => setData('alamat', e.target.value)}
                        required  class="block w-full h-32 px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="Alamat jalan Sekolah"></textarea>
                </div>

                <div class="flex-1 px-2 mt-4 md:mt-0">
                    
                </div>
            </div>

            {/* <div class="mt-4">
                <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Email address</label>
                <input type="email" placeholder="johndoe@example.com" class="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
            </div>

            <div class="w-full mt-4">
                <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Alamat</label>
                <textarea class="block w-full h-32 px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg md:h-56 dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="Alamat jalan Sekolah"></textarea>
            </div> */}

            <button class="w-full px-6 py-3 mt-4 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                Daftarkan
            </button>
        </form>
      </div>
    </div>
  </section>
</div>


      </FrontLayout>
  );
}