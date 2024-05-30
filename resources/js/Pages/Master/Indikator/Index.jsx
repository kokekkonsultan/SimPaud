// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, usePage, Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import Swal from 'sweetalert2';

export default function Index({ auth, props, kelompok_usia, id_kelompok_usia, filtering }) {
    
    const { indikator, flash } = usePage().props // indikators, 
  
    function destroy(e) {
        if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            router.delete(route("indikator.destroy", e.currentTarget.id));
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
                router.delete(route("indikator.destroy", id));
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

        router.get('/indikator', filtering);
    };

    const doSearchData = (name, e) => {
        if (e.key !== "Enter") return;
    
        doFilterData(name, e.target.value);
    };
   
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Indikator</h2>}
        >
            <Head title="Indikator" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Indikator</h1>
  
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
                            
                            <div className="-mx-2 md:items-center md:flex mb-5">
                                <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 px-2 text-sm">
                                    <label className="font-bold text-sm">Kelompok Usia</label>
                                    <select name="id_kelompok_usia" 
                                    className="w-full px-4 py-2" 
                                    defaultValue={filtering.id_kelompok_usia} 
                                    onChange={(e) =>
                                        doFilterData("id_kelompok_usia", e.target.value)
                                    }>
                                        <option value="">-Pilih Kelompok Usia-</option>
                                        {/* {kelompok_usia.map(({ id, nama }) => (
                                            <option value={id}>{nama}</option>
                                        ))} */}
                                        {kelompok_usia.map(({ id, nama }) => {
                                            if (id_kelompok_usia == id){
                                                return <option value={id} selected>{nama}</option>
                                            }
                                            return <option value={id}>{nama}</option>
                                        })}

                                    </select>
                                </div>
                            </div>
                            {/* <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white bg-green-500 rounded-md focus:outline-none"
                                    href={ route("indikator.create") }
                                >
                                    Tambah Indikator
                                </Link>
                            </div> */}
  
                            {indikator.map((dt1) => ( 
                            <div className="overflow-auto">    
                                <table className="table-auto w-full mb-5">
                                    <tr>
                                        <td colSpan="4" className="border px-4 py-2 bg-gray-100"><b>{ dt1.kode } { dt1.nama }</b></td>
                                    </tr>
                                        <tr className="bg-gray-100">
                                            <th className="border px-4 py-2 text-sm w-10">Kode</th>
                                            <th className="border px-4 py-2 text-sm">Elemen</th>
                                            <th className="border px-4 py-2 text-sm w-96">Nama Indikator</th>
                                            <th className="border px-4 py-2 text-sm w-36">Action</th>
                                        </tr>
                                    
                                    <tbody>
                                        {dt1.subdimensi.map((dt2) => (
                                            <tr>
                                                <td className="border px-4 py-2 text-sm align-top">{ dt2.kode }</td>
                                                <td className="border px-4 py-2 text-sm align-top">{ dt2.nama }</td>
                                                <td className="border px-4 py-2 text-sm">
                                                    {/* <table className="table-auto w-full">
                                                        {dt2.indikator.map((dt3) => (
                                                        <tr>
                                                            <th className="px-4 py-2 text-sm w-60 border-r-2">{ dt3.nama }</th>
                                                            <th className="px-4 py-2 text-sm w-44">
                                                                <Link
                                                                    tabIndex="1"
                                                                    className="px-4 py-2 text-sm text-white bg-blue-500 rounded"
                                                                    href={route("indikator.edit", dt3.id)}
                                                                >
                                                                    Edit
                                                                </Link>
                                                                <button
                                                                    onClick={destroy}
                                                                    id={dt3.id}
                                                                    tabIndex="-1"
                                                                    type="button"
                                                                    className="mx-1 px-4 py-2 text-sm text-white bg-red-500 rounded"
                                                                >
                                                                    Hapus
                                                                </button>
                                                            </th>
                                                        </tr>
                                                        ))}
                                                    </table> */}
                                                    <ul className="list-disc">
                                                        {dt2.indikator.map((dt3) => (
                                                        <li className="ml-4">{ dt3.nama }</li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td className="border px-4 py-2 align-top">
                                                        {/* { (dt2.jumlah > 0) ? */}
                                                        <Link
                                                            tabIndex="1"
                                                            className="px-4 py-2 text-sm text-white bg-blue-500 rounded"
                                                            href={route("indikator.edit", dt2.id)}
                                                        >
                                                            Edit
                                                        </Link>
                                                         {/* : "" } */}
                                                        {/* { (dt2.jumlah > 0) ?
                                                        <button
                                                            onClick={destroy}
                                                            id={dt2.id}
                                                            tabIndex="-1"
                                                            type="button"
                                                            className="mx-1 px-4 py-2 text-sm text-white bg-red-500 rounded"
                                                        >
                                                            Hapus
                                                        </button> : "" } */}
                                                </td>
                                            </tr>
                                        ))}
    
                                        
                                    </tbody>
                                </table>
                            </div>
                            ))}

{indikator.length === 0 && (
                                        <tr>
                                            <td
                                                className="px-6 py-4 border-t text-sm"
                                                colSpan="4"
                                            >
                                                Tidak ada data.
                                            </td>
                                        </tr>
                                    )}

                            {/* <Pagination className="mt-6" links={indikator.links} /> */}

                        </div>
                    </div>
                </div>
            {/* </div> */}
        </DashboardLayout>
    );
}
