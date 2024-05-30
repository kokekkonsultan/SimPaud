// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Edit({ auth, props, jenis_keluar }) {
  
    const { siswa } = usePage().props;

    const { data, setData, put, errors } = useForm({
        nama_lengkap: siswa.nama_lengkap || "",
        nama_panggilan: siswa.nama_panggilan || "",
        no_induk: siswa.no_induk || "",
        nisn: siswa.nisn || "",
        jenis_kelamin: siswa.jenis_kelamin || "",
        foto: siswa.foto || "",
        id_jenis_keluar: siswa.id_jenis_keluar || "",
        tanggal_keluar: siswa.tanggal_keluar || "",
        catatan_keluar: siswa.catatan_keluar || "",
    });
  
    function handleSubmit(e) {
        e.preventDefault();
        Swal.fire({
            title: 'Simpan Data Peserta Didik Keluar?',
            type: 'warning',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oke',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                put(route("siswa-keluar.update", siswa.id));
            }
        });
    }
  
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Siswa Keluar</h2>}
        >
            <Head title="Siswa Keluar" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Peserta Didik Keluar</h1>
  
                            {/* <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
                                    href={ route("siswa.index") }
                                >
                                    Kembali
                                </Link>
                            </div> */}

                            <table className="table-auto w-full mb-5">
                                <tbody>
                                    <tr>
                                        <td className="border px-4 py-2 w-40"><img src={ (data.foto) ? "/images/siswa/"+data.foto : (data.jenis_kelamin == 'L') ? "/images/boy.png" : "/images/girl.png" } alt="" width="70" /></td>
                                        <td className="border px-4 py-2"><b>{ data.nama_panggilan }</b> - { data.nama_lengkap }<br />No. Induk: { data.no_induk } | NISN: { data.nisn }</td>
                                    </tr>
                                </tbody>
                            </table>
  
                            <form name="createForm" onSubmit={handleSubmit}>
                                <div className="flex flex-col">

                                    <div className="mb-4">
                                        <label className="">Jenis Keluar <span className='text-red-600'>*</span></label>
                                        <select name="id_jenis_keluar" required className="w-full px-4 py-2" onChange={(e) =>
                                                setData("id_jenis_keluar", e.target.value)
                                            }>
                                            <option value="">-Pilih Jenis Keluar-</option>
                                            {jenis_keluar.map(({ id, nama }) => {
                                                
                                                if (siswa.id_jenis_keluar == id){
                                                    return <option value={id} selected>{nama}</option>
                                                }

                                                return <option value={id}>{nama}</option>
                                            }
                                            )}
                                        </select>
                                        <span className="text-red-600">
                                            {errors.id_jenis_keluar}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Tanggal Keluar <span className='text-red-600'>*</span></label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-2"
                                            label="Tanggal Keluar"
                                            name="tanggal_keluar"
                                            required
                                            value={data.tanggal_keluar}
                                            onChange={(e) =>
                                                setData("tanggal_keluar", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.tanggal_keluar}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Catatan Keluar <span className='text-red-600'>*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Catatan Keluar"
                                            name="catatan_keluar"
                                            required
                                            value={data.catatan_keluar}
                                            onChange={(e) =>
                                                setData("catatan_keluar", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.catatan_keluar}
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
                                            href={ route("siswa.index") }
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
