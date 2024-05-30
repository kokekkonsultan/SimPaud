// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Create({ auth, semester, data_semester, kelompok_usia, guru }) {
  
    const { data, setData, errors, post } = useForm({
        id_semester: data_semester.id || "",
        nama: "",
        id_kelompok_usia: "",
        id_guru: "",
    });
  
    function handleSubmit(e) {
        e.preventDefault();
        Swal.fire({
            title: 'Simpan Data Kelompok dan Siswa?',
            type: 'warning',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oke',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                post(route("kelompok.store"));
            }
        });
    }
  
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah Kelompok</h2>}
        >
            <Head title="Kelompok" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Tambah Kelompok</h1>
  
                            {/* <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
                                    href={ route("kelompok.index") }
                                >
                                    Kembali
                                </Link>
                            </div> */}
  
                            <form name="createForm" onSubmit={handleSubmit}>
                                <div className="flex flex-col">
                                    <div className="mb-4">
                                        <label className="">Periode Semester <span className='text-red-600'>*</span></label>
                                        <select name="id_semester" required defaultValue={data.id_semester} className="w-full px-4 py-2" onChange={(e) =>
                                                setData("id_semester", e.target.value)
                                            }>
                                            <option value="">-Pilih Semester-</option>
                                            {semester.map(({ id, nama, periode_aktif }) => {
                                                
                                                if (periode_aktif == 1){
                                                    return <option value={id} selected>{nama}</option>
                                                }

                                                return <option value={id}>{nama}</option>
                                            })}
                                        </select>
                                        <span className="text-red-600">
                                            {errors.id_semester}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Nama Kelompok <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nama Kelompok"
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
                                        <label className="">Kelompok Usia <span className='text-red-600'>*</span></label>
                                        <select name="id_kelompok_usia" required className="w-full px-4 py-2" onChange={(e) =>
                                                setData("id_kelompok_usia", e.target.value)
                                            }>
                                            <option value="">-Pilih Kelompok Usia-</option>
                                            {kelompok_usia.map(({ id, nama }) => (
                                                <option value={id}>{nama}</option>
                                            ))}
                                        </select>
                                        <span className="text-red-600">
                                            {errors.id_kelompok_usia}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Wali Kelas <span className='text-red-600'>*</span></label>
                                        <select name="id_guru" required className="w-full px-4 py-2" onChange={(e) =>
                                                setData("id_guru", e.target.value)
                                            }>
                                            <option value="">-Pilih Wali Kelas-</option>
                                            {guru.map(({ id, nama }) => (
                                                <option value={id}>{nama}</option>
                                            ))}
                                        </select>
                                        <span className="text-red-600">
                                            {errors.id_guru}
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
                                            href={ route("kelompok.index") }
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
