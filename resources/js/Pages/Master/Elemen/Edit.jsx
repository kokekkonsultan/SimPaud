// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Edit({ auth, props, dimensi }) {
  
    const { elemen } = usePage().props;
    const { data, setData, put, errors } = useForm({
        id_dimensi: elemen.id_dimensi || "",
        kode: elemen.kode || "",
        nama: elemen.nama || "",
    });
  
    function handleSubmit(e) {
        e.preventDefault();
        Swal.fire({
            title: 'Simpan Data Elemen?',
            type: 'warning',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oke',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                put(route("elemen.update", elemen.id));
            }
        });
    }
  
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Elemen</h2>}
        >
            <Head title="Elemen" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Edit Elemen</h1>
  
                            {/* <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
                                    href={ route("elemen.index") }
                                >
                                    Kembali
                                </Link>
                            </div> */}
  
                            <form name="createForm" onSubmit={handleSubmit}>
                                <div className="flex flex-col">
                                    <div className="mb-4">
                                        <label className="">Dimensi <span className='text-red-600'>*</span></label>
                                        <select name="id_dimensi" required className="w-full px-4 py-2" onChange={(e) =>
                                                setData("id_dimensi", e.target.value)
                                            }>
                                            <option value="">-Pilih Dimensi-</option>
                                            {dimensi.map(({ id, nama }) => {
                                                
                                                if (elemen.id_dimensi == id){
                                                    return <option value={id} selected>{nama}</option>
                                                }

                                                return <option value={id}>{nama}</option>
                                            })}
                                        </select>
                                        <span className="text-red-600">
                                            {errors.id_dimensi}
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
                                    <div className="mb-0">
                                        <label className="">Nama Elemen <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nama Elemen"
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
                                            href={ route("elemen.index") }
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
