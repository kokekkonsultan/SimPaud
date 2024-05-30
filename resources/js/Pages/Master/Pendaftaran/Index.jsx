// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, usePage, Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import Swal from 'sweetalert2';

export default function Index({ auth, props, tahun_ajaran, id_tahun_ajaran, filtering }) {
    
    const { pendaftaran, flash } = usePage().props
    const urut = (pendaftaran.current_page - 1) * pendaftaran.per_page;
  
    function destroy(e) {
        if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            router.delete(route("pendaftaran.destroy", e.currentTarget.id));
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
                router.delete(route("pendaftaran.destroy", id));
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

        router.get('/pendaftaran', filtering);
    };

    const doSearchData = (name, e) => {
        if (e.key !== "Enter") return;
    
        doFilterData(name, e.target.value);
    };

    const statusData = (id) => {
        // if (confirm("Apakah Anda yakin ingin mengaktifkan/menonaktifkan data ini?")) {
        //     Inertia.get(`/pendaftaran/status/${id}`);
        // }
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "ingin mengaktifkan/menonaktifkan data ini?",
            type: 'warning',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oke',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                router.get(`/pendaftaran/status/${id}`);
                Swal.fire(
                    'Diubah!',
                    'Data berhasil diubah.',
                    'success'
                );
            }
        });
    }
   
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Pendaftaran</h2>}
        >
            <Head title="Pendaftaran" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Pendaftaran</h1>
  
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
                                {/* <div className="w-1/4 px-2">
                                    <label className="font-bold text-sm">Tahun Ajaran</label>
                                    <select name="id_tahun_ajaran" 
                                    defaultValue={filtering.id_tahun_ajaran} 
                                    className="w-full px-4 py-2 text-sm" onChange={(e) =>
                                        doFilterData("id_tahun_ajaran", e.target.value)
                                    }>
                                        <option value="">-Pilih Tahun Ajaran-</option>
                                        {tahun_ajaran.map(({ id, nama }) => {
                                            if (id_tahun_ajaran == id){
                                                return <option value={id} selected>{nama}</option>
                                            }
                                        return <option value={id}>{nama}</option>
                                        })}
                                    </select>
                                </div> */}
                                <div className="w-1/4 px-2 pt-5">
                                    <Link
                                        className="px-6 py-2 text-white text-sm bg-green-500 rounded-md focus:outline-none"
                                        href={ route("pendaftaran.create") }
                                    >
                                        Tambah Pendaftaran
                                    </Link>
                                </div>
                            </div>
  
                            <div className="overflow-auto">
                                <table className="table-auto w-full">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border px-4 py-2 text-sm">No.</th>
                                            <th className="border px-4 py-2 text-sm">Judul</th>
                                            {/* <th className="border px-4 py-2 text-sm">Tahun Ajaran</th> */}
                                            <th className="border px-4 py-2 text-sm">Tanggal Mulai</th>
                                            <th className="border px-4 py-2 text-sm">Tanggal Selesai</th>
                                            <th className="border px-4 py-2 text-sm">Status</th>
                                            {/* <th className="border px-4 py-2 text-sm">Link Pendaftaran</th> */}
                                            <th className="border px-4 py-2 text-sm">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendaftaran.data.map((dt, index) => (//{ id, tahun_ajaran, tanggal_mulai, tanggal_selesai, url }
                                            <tr key={ index }>
                                                <td className="border px-4 py-2 text-sm">{ urut + index + 1 }</td>
                                                <td className="border px-4 py-2 text-sm">{ dt.nama }</td>
                                                {/* <td className="border px-4 py-2 text-sm">{ dt.tahun_ajaran }</td> */}
                                                <td className="border px-4 py-2 text-sm text-center">{ dt.tanggal_mulai }</td>
                                                <td className="border px-4 py-2 text-sm text-center">{ dt.tanggal_selesai }</td>
                                                <td className="border px-4 py-2 text-sm text-center">{/* (dt.status == 1) ? 'Aktif' : '' */}{ (dt.status == 1) ? <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400" onClick={ () => statusData(dt.id) } style={{ cursor: 'pointer' }}>Aktif</span> : <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-400 border border-yellow-400" onClick={ () => statusData(dt.id) } style={{ cursor: 'pointer' }}>Non-Aktif</span> }</td>
                                                {/* <td className="border px-4 py-2 text-sm">{ dt.url }</td> */}
                                                <td className="border px-4 py-2 text-sm">
                                                    <Link
                                                        tabIndex="1"
                                                        className="px-4 py-2 text-sm text-white bg-blue-500 rounded"
                                                        href={route("pendaftaran.edit", dt.id)}
                                                    >
                                                        Edit
                                                    </Link> 
                                                    {/* { (dt.status == 1) ? '' : 
                                                    <a
                                                        style={{ cursor: 'pointer' }}
                                                        tabIndex="1"
                                                        className="px-4 py-2 text-sm text-white bg-yellow-500 rounded"
                                                        onClick={ () => statusData(dt.id) }
                                                    >
                                                        { (dt.status == 1) ? 'Non-Aktif' : 'Aktif' }
                                                    </a> } */}
                                                    <button
                                                        // onClick={destroy}
                                                        onClick={() => handleDelete(dt.id)}
                                                        id={dt.id}
                                                        tabIndex="-1"
                                                        type="button"
                                                        className="mx-1 px-4 py-2 text-sm text-white bg-red-500 rounded"
                                                    >
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
    
                                        {pendaftaran.data.length === 0 && (
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

                            <Pagination className="mt-6" links={pendaftaran.links} />

                        </div>
                    </div>
                </div>
            {/* </div> */}
        </DashboardLayout>
    );
}
