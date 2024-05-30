// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect } from 'react';
import FrontLayout from '@/Layouts/FrontLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Registrasi({ agama }) {
  const { id_sekolah, flash } = usePage().props;

  const { data, setData, post, processing, errors, reset } = useForm({
      id_sekolah: id_sekolah || "",
      name: '',
      email: '',
      jenis_kelamin: '',
      id_agama: '',
      npsn: '',
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

  useEffect(() => {
      return () => {
          reset('password', 'password_confirmation');
      };
  }, []);

  const submit = (e) => {
      e.preventDefault();

      post(route('register'));
  };
  
  return (
      <FrontLayout
          header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Registrasi</h2>}
      >
          <Head title="Registrasi" />

          
          <div class="container my-24 mx-auto md:px-6">
  <section class="mb-32">
    <div class="flex flex-wrap">
      <div class="mb-10 w-full shrink-0 grow-0 basis-auto md:mb-0 md:w-6/12 md:px-3 lg:px-6">
        <h2 class="mb-6 text-3xl font-bold">Registrasi Siswa</h2>
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

            <input
                                    type="hidden"
                                    name="id_sekolah"
                                    value={data.id_sekolah}
                                    onChange={(e) =>
                                        setData("id_sekolah", e.target.value)
                                    }
                                />

                <div class="flex-1 px-2">
                    <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Nama Lengkap</label>
                    <input type="text" id="name"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required placeholder="Nama Lengkap" class="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
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
                <div class="flex-1 px-2">
                    <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Jenis Kelamin</label>
                    <select name="jenis_kelamin" className="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" onChange={(e) =>
                            setData("jenis_kelamin", e.target.value)
                        }>
                        <option value="">-Pilih Jenis Kelamin-</option>
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                    </select>
                    <span className="text-red-600">
                        {errors.jenis_kelamin}
                    </span>
                </div>

                <div class="flex-1 px-2 mt-4 md:mt-0">
                    <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Agama</label>
                    <select name="id_agama" className="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" onChange={(e) =>
                            setData("id_agama", e.target.value)
                        }>
                        <option value="">-Pilih Agama-</option>
                        {agama.map(({ id, nama }) => (
                            <option value={id}>{nama}</option>
                        ))}
                    </select>
                    <span className="text-red-600">
                        {errors.id_agama}
                    </span>
                </div>
            </div>

            <div class="mt-4 -mx-2 md:items-center md:flex">
                <div class="flex-1 px-2">
                    <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Tempat Lahir</label>
                    <input type="text" id="tempat_lahir"
                        name="tempat_lahir"
                        value={data.tempat_lahir}
                        onChange={(e) => setData('tempat_lahir', e.target.value)}
                        required  placeholder="Tempat Lahir" class="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                </div>

                <div class="flex-1 px-2 mt-4 md:mt-0">
                    <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Tanggal Lahir</label>
                    <input type="date" id="tanggal_lahir"
                        name="tanggal_lahir"
                        value={data.tanggal_lahir}
                        onChange={(e) => setData('tanggal_lahir', e.target.value)}
                        required  placeholder="Tanggal Lahir" class="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                </div>
            </div>

            <div class="mt-4 -mx-2 md:items-center md:flex">
                <div class="flex-1 px-2">
                    <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Nama Ayah</label>
                    <input type="text" id="nama_ayah"
                        name="nama_ayah"
                        value={data.nama_ayah}
                        onChange={(e) => setData('nama_ayah', e.target.value)}
                        required  placeholder="Nama Ayah" class="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                </div>

                <div class="flex-1 px-2 mt-4 md:mt-0">
                    <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Nomer Telpon</label>
                    <input type="text" id="no_telpon_ayah"
                        name="no_telpon_ayah"
                        value={data.no_telpon_ayah}
                        onChange={(e) => setData('no_telpon_ayah', e.target.value)}
                        required  placeholder="Nomer Telpon Ayah" class="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                </div>
            </div>

            <div class="mt-4 -mx-2 md:items-center md:flex">
                <div class="flex-1 px-2">
                    <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Nomer Kartu Keluarga</label>
                    <input type="text" id="no_kartu_keluarga"
                        name="no_kartu_keluarga"
                        value={data.no_kartu_keluarga}
                        onChange={(e) => setData('no_kartu_keluarga', e.target.value)}
                        required  placeholder="Nomer Kartu Keluarga" class="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
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
                    <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">NIK Orang Tua</label>
                    <input type="text" id="nik_orang_tua"
                        name="nik_orang_tua"
                        value={data.nik_orang_tua}
                        onChange={(e) => setData('nik_orang_tua', e.target.value)}
                        required  placeholder="NIK Orang Tua" class="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
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

            <div class="mt-4 -mx-2 md:items-center md:flex">
                <div class="flex-1 px-2">
                    <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Kartu Keluarga</label>
                    <input
                        id="file-upload-2"
                        type="file"
                        label="Kartu Keluarga"
                        name="kartu_keluarga"
                        onChange={(e) =>
                            setData("kartu_keluarga", e.target.files[0])
                        }
                    />
                </div>

                <div class="flex-1 px-2 mt-4 md:mt-0">
                    
                </div>
            </div>

            <div class="mt-4 -mx-2 md:items-center md:flex">
                <div class="flex-1 px-2">
                    <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Akta Kelahiran</label>
                    <input
                        id="file-upload-3"
                        type="file"
                        label="Akta Kelahiran"
                        name="akta_kelahiran"
                        onChange={(e) =>
                            setData("akta_kelahiran", e.target.files[0])
                        }
                    />
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