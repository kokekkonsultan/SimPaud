// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, usePage, Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import Swal from 'sweetalert2';

export default function Index({ auth, props, semester, kelompok_usia, filtering, id_semester, role_id }) {
    
    const { kelompok, flash } = usePage().props
  
    function destroy(e) {
        if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            router.delete(route("kelompok.destroy", e.currentTarget.id));
        }
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "ingin menghapus data ini?",
            type: 'warning',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oke',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                router.delete(route("kelompok.destroy", id));
                Swal.fire(
                    'Dihapus!',
                    'Data berhasil dihapus.',
                    'success'
                );
            }
        });
    };

    filtering = filtering || {};
        const doFilterData = (name, value) => {
            if (value) {
                filtering[name] = value;
            } else {
                delete filtering[name];
            }

        router.get('/kelompok', filtering);
    };

    const doSearchData = (name, e) => {
        if (e.key !== "Enter") return;
    
        doFilterData(name, e.target.value);
    };
   
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Kelompok</h2>}
        >
            <Head title="Kelompok" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Kelompok dan Siswa</h1>
  
                            {flash.message && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-5 rounded relative" role="alert">
                                <strong className="font-bold">Berhasil!</strong> &nbsp;<span className="block sm:inline">{flash.message}</span>
                              </div>
                            )}

                            {flash.error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-5 rounded relative" role="alert">
                                <strong className="font-bold">Gagal!</strong> &nbsp;<span className="block sm:inline">{flash.error}</span>
                              </div>
                            )}

                            { ((role_id == 3) || (role_id == 6)) ?
                            <div className="-mx-2 md:items-center md:flex mb-5">
                                <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 px-2">
                                    <label className="font-bold text-sm">Periode Semester</label>
                                    <select name="id_semester" 
                                    defaultValue={filtering.id_semester} 
                                    className="w-full px-4 py-2 text-sm" onChange={(e) =>
                                        doFilterData("id_semester", e.target.value)
                                    }>
                                        <option value="">-Pilih Semester-</option>
                                        {semester.map(({ id, nama }) => {
                                            if (id_semester == id){
                                                return <option value={id} selected>{nama}</option>
                                            }
                                        return <option value={id}>{nama}</option>
                                        })}
                                    </select>
                                </div>
                                <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 px-2">
                                    <label className="font-bold text-sm">Kelompok Usia</label>
                                    <select name="id_kelompok_usia" 
                                    defaultValue={filtering.id_kelompok_usia} 
                                    className="w-full px-4 py-2 text-sm" onChange={(e) =>
                                        doFilterData("id_kelompok_usia", e.target.value)
                                    }>
                                        <option value="">-Pilih Kelompok Usia-</option>
                                        {kelompok_usia.map(({ id, nama }) => (
                                            <option value={id}>{nama}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 px-2 pt-5">
                                    <Link
                                        className="px-6 py-2 text-white text-sm bg-green-500 rounded-md focus:outline-none"
                                        href={ route("kelompok.create") }
                                    >
                                        Tambah Kelompok
                                    </Link>
                                </div>
                            </div> : "" }
  
                            <div className="overflow-auto">
                                <table className="table-auto w-full">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            {/* <th className="border px-4 py-2 text-sm">No.</th> */}
                                            <th className="border px-4 py-2 text-sm">Nama Kelompok</th>
                                            <th className="border px-4 py-2 text-sm">Kelompok Usia</th>
                                            <th className="border px-4 py-2 text-sm">Wali Kelas</th>
                                            <th className="border px-4 py-2 text-sm">Siswa</th>
                                            <th className="border px-4 py-2 text-sm">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {kelompok.data.map(({ id, nama, kelompok_usia, wali_kelas, siswa }) => (
                                            <tr>
                                                {/* <td className="border px-4 py-2 text-sm">{ id }</td> */}
                                                <td className="border px-4 py-2 text-sm">{ nama }</td>
                                                <td className="border px-4 py-2 text-sm">{ kelompok_usia }</td>
                                                <td className="border px-4 py-2 text-sm">{ wali_kelas }</td>
                                                <td className="border px-4 py-2 text-sm">{ siswa }</td>
                                                <td className="border px-4 py-2 text-sm">
                                                    { ((role_id == 3) || (role_id == 6)) ?
                                                    <Link
                                                        tabIndex="1"
                                                        className="px-4 py-2 text-sm text-white bg-blue-500 rounded"
                                                        href={route("kelompok.edit", id)}
                                                    >
                                                        Edit
                                                    </Link> : "" }&nbsp;
                                                    <Link
                                                        tabIndex="1"
                                                        className="px-4 py-2 text-sm text-white bg-yellow-500 rounded"
                                                        href={route("kelompok-siswa", id+'-'+id_semester)}
                                                    >
                                                        Siswa
                                                    </Link>
                                                    { ((role_id == 3) || (role_id == 6)) ?
                                                    <button
                                                        // onClick={destroy}
                                                        onClick={() => handleDelete(id)}
                                                        id={id}
                                                        tabIndex="-1"
                                                        type="button"
                                                        className="mx-1 px-4 py-2 text-sm text-white bg-red-500 rounded"
                                                    >
                                                        Hapus
                                                    </button> : "" }
                                                </td>
                                            </tr>
                                        ))}
    
                                        {kelompok.data.length === 0 && (
                                            <tr>
                                                <td
                                                    className="px-6 py-4 border-t text-sm"
                                                    colSpan="4"
                                                >
                                                    Tidak ada data.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <Pagination className="mt-6" links={kelompok.links} />

                        </div>
                    </div>
                </div>
            {/* </div> */}
        </DashboardLayout>
    );
}
