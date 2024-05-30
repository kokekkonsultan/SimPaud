// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Create({ auth }) {
  
    const { data, setData, errors, post } = useForm({
        nama: "",
        jenis_kelamin: "",
        nip: "",
        alamat: "",
        email: "",
        no_telpon: "",
        tempat_lahir: "",
        tanggal_lahir: "",
        foto: "",
        tanda_tangan: "",
        password: "",
        password_confirmation: "",
    });

    const jenis_kelamin = [
        {id: "L", nama: "Laki-laki"}, 
        {id: "P", nama: "Perempuan"}
    ]
  
    function handleSubmit(e) {
        e.preventDefault();
        Swal.fire({
            title: 'Simpan Data Guru?',
            type: 'warning',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oke',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                post(route("guru.store"));
            }
        });
    }
  
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah Guru</h2>}
        >
            <Head title="Guru" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Tambah Data Guru</h1>
  
                            {/* <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
                                    href={ route("guru.index") }
                                >
                                    Kembali
                                </Link>
                            </div> */}
  
                            <form name="createForm" onSubmit={handleSubmit}>
                                <div className="flex flex-col">
                                    <div className="mb-4">
                                        <label className="">Nama Guru <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nama Guru"
                                            name="nama"
                                            required
                                            value={data.nama}
                                            onChange={(e) =>
                                                setData("nama", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.nama}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">NIP</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="NIP"
                                            name="nip"
                                            value={data.nip}
                                            onChange={(e) =>
                                                setData("nip", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.nip}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Jenis Kelamin <span className='text-red-600'>*</span></label>
                                        <select name="jenis_kelamin" required className="w-full px-4 py-2" onChange={(e) =>
                                                setData("jenis_kelamin", e.target.value)
                                            }>
                                            <option value="">-Pilih Jenis Kelamin-</option>
                                            {jenis_kelamin.map(({ id, nama }) => (
                                                <option value={id}>{nama}</option>
                                            ))}
                                        </select>
                                        <span className="text-red-600">
                                            {errors.jenis_kelamin}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Tempat Lahir</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Tempat Lahir"
                                            name="tempat_lahir"
                                            value={data.tempat_lahir}
                                            onChange={(e) =>
                                                setData("tempat_lahir", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.tempat_lahir}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Tanggal Lahir</label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-2"
                                            label="Tanggal Lahir"
                                            name="tanggal_lahir"
                                            value={data.tanggal_lahir}
                                            onChange={(e) =>
                                                setData("tanggal_lahir", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.tanggal_lahir}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Alamat</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Alamat"
                                            name="alamat"
                                            value={data.alamat}
                                            onChange={(e) =>
                                                setData("alamat", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.alamat}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Nomor Telepon</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nomor Telepon"
                                            name="no_telpon"
                                            value={data.no_telpon}
                                            onChange={(e) =>
                                                setData("no_telpon", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.no_telpon}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Email <span className='text-red-600'>*</span></label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2"
                                            label="Email"
                                            name="email"
                                            required
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.email}
                                        </span>
                                    </div>
                                    

                                    <div className="mb-4">
                                        <label className="">Foto</label>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            className="w-full px-4 py-2"
                                            label="Foto"
                                            name="foto"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setData("foto", e.target.files[0])
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.foto}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Tanda Tangan</label>
                                        <input
                                            id="file-upload-2"
                                            type="file"
                                            className="w-full px-4 py-2"
                                            label="Tanda Tangan"
                                            name="tanda_tangan"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setData("tanda_tangan", e.target.files[0])
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.tanda_tangan}
                                        </span>
                                    </div>

                                    {/* <div className="mb-4">
                                        <label className="">Kata Sandi</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2"
                                            label="Password"
                                            name="password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData("password", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.password}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Konfirmasi Kata Sandi</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2"
                                            label="Password Confirmation"
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData("password_confirmation", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.password_confirmation}
                                        </span>
                                    </div> */}
                                    
                                </div>
                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 text-white bg-green-500 rounded"
                                    >
                                        Simpan
                                    </button> <Link
                                            className="px-6 py-2 text-white bg-orange-500 rounded focus:outline-none"
                                            href={ route("guru.index") }
                                        >
                                            Batalkan
                                        </Link>
                                </div>
                            </form>
  
                        </div>
                    </div>
                </div>
            {/* </div> */}
        </DashboardLayout>
    );
}
