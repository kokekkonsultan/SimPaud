// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Create({ auth }) {
  
    const { data, setData, errors, post } = useForm({
        id_metode: "",
        kode: "",
        nama: "",
    });

    const metodes = [
        {id: "2", nama: "Capaian Pembelajaran"}, 
        {id: "3", nama: "P5"}
    ]
  
    function handleSubmit(e) {
        e.preventDefault();
        Swal.fire({
            title: 'Simpan Data Dimensi?',
            type: 'warning',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oke',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                post(route("dimensi.store"));
            }
        });
    }
  
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah Dimensi</h2>}
        >
            <Head title="Dimensi" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white">

                            <h1 className="text-2xl mb-5">Tambah Dimensi</h1>
  
                            {/* <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
                                    href={ route("dimensi.index") }
                                >
                                    Kembali
                                </Link>
                            </div> */}
  
                        <div className='bg-white rounded-lg shadow-md p-10 md:h-full m-2 md:m-0'>
                            <form name="createForm" onSubmit={handleSubmit}>
                                <div className="flex flex-col">
                                    <div className="mb-4">
                                        <label className="">Metode <span className='text-red-600'>*</span></label>
                                        <select name="id_metode" required className="w-full px-4 py-2" onChange={(e) =>
                                                setData("id_metode", e.target.value)
                                            }>
                                            <option value="">-Pilih Metode-</option>
                                            {metodes.map(({ id, nama }) => (
                                                <option value={id}>{nama}</option>
                                            ))}
                                        </select>
                                        <span className="text-red-600">
                                            {errors.id_metode}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Kode <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Kode"
                                            name="kode"
                                            required
                                            value={data.kode}
                                            onChange={(e) =>
                                                setData("kode", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.kode}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Nama Dimensi <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nama Dimensi"
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
                                </div>
                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 text-white bg-green-500 rounded"
                                    >
                                        Simpan
                                    </button> <Link
                                            className="px-6 py-2 text-white bg-orange-500 rounded focus:outline-none"
                                            href={ route("dimensi.index") }
                                        >
                                            Batalkan
                                        </Link>
                                </div>
                            </form>
                        </div>
  
                        </div>
                    </div>
                </div>
            {/* </div> */}
        </DashboardLayout>
    );
}
