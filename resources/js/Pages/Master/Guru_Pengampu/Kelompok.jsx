// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';

export default function Edit({ auth, props }) {
  
    const { guru, kelompok_sudah, kelompok_belum } = usePage().props;

    const { data, setData, errors } = useForm({
        id_guru: guru.id || "",
        nama: guru.nama || "",
        email: guru.email || "",
        jenis_kelamin: guru.jenis_kelamin || "",
        foto: guru.foto || "",
    });
  
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Guru Kelompok</h2>}
        >
            <Head title="Guru Kelompok" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Pengaturan Kelompok</h1>
  
                            {/* <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
                                    href={ route("guru-pengampu.index") }
                                >
                                    Kembali
                                </Link>
                            </div> */}

                            <table className="table-fixed w-full mb-5">
                                <tbody>
                                    <tr>
                                        <td className="border px-4 py-2 text-sm w-40"><img src={ (data.foto) ? "/images/guru/"+data.foto : (data.jenis_kelamin == 'L') ? "/images/man.png" : "/images/woman.png" } alt="" width="70" /></td>
                                        <td className="border px-4 py-2 text-sm"><b>{ data.nama }</b><br />{ data.email }</td>
                                    </tr>
                                </tbody>
                            </table>
  
                            <div className="mt-4 -mx-2 mb-5 md:items-center md:flex">
                                <div className="flex-1 px-2 align-top">
                                    <label><b>Kelompok Diampu</b></label>
                                    <div className="overflow-auto">
                                        <table className="table-auto w-full">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border px-4 py-2 text-sm">No.</th>
                                                    <th className="border px-4 py-2 text-sm">Nama Kelompok</th>
                                                    <th className="border px-4 py-2 text-sm">Kelompok Usia</th>
                                                    <th className="border px-4 py-2 text-sm">Jumlah Siswa</th>
                                                    <th className="border px-4 py-2 text-sm">Jumlah Guru</th>
                                                    <th className="border px-4 py-2 text-sm">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {kelompok_sudah.map((dt, index) => ( // { id, nama, kelompok_usia, jml_siswa, jml_guru }
                                                    <tr key={ index }>
                                                        <td className="border px-4 py-2 text-sm">{ index + 1 }</td>
                                                        <td className="border px-4 py-2 text-sm">{ dt.nama }</td>
                                                        <td className="border px-4 py-2 text-sm">{ dt.kelompok_usia  }</td>
                                                        <td className="border px-4 py-2 text-sm">{ dt.jml_siswa }</td>
                                                        <td className="border px-4 py-2 text-sm">{ dt.jml_guru }</td>
                                                        <td className="border px-4 py-2 text-sm">
                                                            <Link
                                                                tabIndex="1"
                                                                className="px-4 py-2 text-sm text-white bg-blue-500 rounded"
                                                                href={route("kelompok-guru-keluar", {
                                                                    'id': data.id_guru,
                                                                    'id_kelompok': dt.id,
                                                                })}
                                                            >
                                                                Keluar
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
            
                                                {kelompok_sudah.length === 0 && (
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
                                </div>

                                <div className="flex-1 px-2 mt-4 md:mt-0 align-top">
                                    <label><b>Kelompok Tidak Diampu</b></label>
                                    <div className="overflow-auto">
                                        <table className="table-auto w-full">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border px-4 py-2 text-sm">No.</th>
                                                    <th className="border px-4 py-2 text-sm">Nama Kelompok</th>
                                                    <th className="border px-4 py-2 text-sm">Kelompok Usia</th>
                                                    <th className="border px-4 py-2 text-sm">Jumlah Siswa</th>
                                                    <th className="border px-4 py-2 text-sm">Jumlah Guru</th>
                                                    <th className="border px-4 py-2 text-sm">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {kelompok_belum.map((dt, index) => ( // { id, nama, kelompok_usia, jml_siswa, jml_guru }
                                                    <tr key={ index }>
                                                        <td className="border px-4 py-2 text-sm">{ index + 1 }</td>
                                                        <td className="border px-4 py-2 text-sm">{ dt.nama }</td>
                                                        <td className="border px-4 py-2 text-sm">{ dt.kelompok_usia  }</td>
                                                        <td className="border px-4 py-2 text-sm">{ dt.jml_siswa }</td>
                                                        <td className="border px-4 py-2 text-sm">{ dt.jml_guru }</td>
                                                        <td className="border px-4 py-2 text-sm">
                                                            <Link
                                                                tabIndex="1"
                                                                className="px-4 py-2 text-sm text-white bg-blue-500 rounded"
                                                                href={route("kelompok-guru-masuk", {
                                                                    'id': data.id_guru,
                                                                    'id_kelompok': dt.id,
                                                                })}
                                                            >
                                                                Masuk
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
            
                                                {kelompok_belum.length === 0 && (
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
                                </div>
                            </div>

                            <Link
                                className="px-6 py-2 text-white text-sm bg-orange-500 rounded focus:outline-none"
                                href={ route("guru-pengampu.index") }
                            >
                                Kembali
                            </Link>
  
                        </div>
                    </div>
                </div>
            {/* </div> */}
        </DashboardLayout>
    );
}
