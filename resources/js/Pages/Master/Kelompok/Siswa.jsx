// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';

export default function Edit({ auth, props, role_id, id_semester }) {
  
    const { kelompok, siswa_sudah, siswa_belum } = usePage().props;

    const { data, setData, errors } = useForm({
        id_kelompok: kelompok.id || "",
        nama: kelompok.nama || "",
        kelompok_usia: kelompok.kelompok_usia || "",
        wali_kelas: kelompok.wali_kelas || "",
    });
  
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Kelompok Siswa</h2>}
        >
            <Head title="Kelompok Siswa" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Pengaturan Siswa</h1>
  
                            {/* <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
                                    href={ route("kelompok.index") }
                                >
                                    Kembali
                                </Link>
                            </div> */}

                            <table className="table-auto w-full mb-5">
                                <tbody>
                                    <tr>
                                        <td className="border px-4 py-2 text-sm"><b>{ data.nama }</b><br />{ data.kelompok_usia }<br />Wali Kelas: { data.wali_kelas }</td>
                                    </tr>
                                </tbody>
                            </table>
  
                            { ((role_id == 3) || (role_id == 6)) ?
                            <div className="mt-4 -mx-2 mb-5 md:items-center md:flex">
                                <div className="flex-1 px-2 align-top">
                                    <label><b>Siswa Sudah Dikelompokkan</b></label>
                                    <div className="overflow-auto">
                                        <table className="table-auto w-full">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border px-4 py-2 text-sm">No.</th>
                                                    <th className="border px-4 py-2 text-sm">No. Induk</th>
                                                    <th className="border px-4 py-2 text-sm">Nama</th>
                                                    <th className="border px-4 py-2 text-sm">Jenis Kelamin</th>
                                                    <th className="border px-4 py-2 text-sm">Usia</th>
                                                    <th className="border px-4 py-2 text-sm">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {siswa_sudah.map((dt, index) => ( //{ id, nama_lengkap, no_induk, jenis_kelamin, usia_tahun, usia_bulan, index }
                                                    <tr key={ index }>
                                                        <td className="border px-4 py-2 text-sm">{ index + 1 }</td>
                                                        <td className="border px-4 py-2 text-sm">{ dt.no_induk }</td>
                                                        <td className="border px-4 py-2 text-sm">{ dt.nama_lengkap }</td>
                                                        <td className="border px-4 py-2 text-sm">{ (dt.jenis_kelamin == 'L') ? 'Laki-laki' : 'Perempuan' }{  }</td>
                                                        <td className="border px-4 py-2 text-sm">{ dt.usia_tahun+' Thn '+dt.usia_bulan+' Bln' }</td>
                                                        <td className="border px-4 py-2 text-sm">
                                                            <Link
                                                                tabIndex="1"
                                                                className="px-4 py-2 text-sm text-white bg-blue-500 rounded"
                                                                href={route("kelompok-siswa-keluar", {
                                                                    'id': data.id_kelompok,
                                                                    'id_siswa': dt.id,
                                                                    'id_semester': id_semester,
                                                                })}
                                                            >
                                                                Keluar
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
            
                                                {siswa_sudah.length === 0 && (
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
                                    <label><b>Siswa Belum Dikelompokkan</b></label>
                                    <div className="overflow-auto">
                                        <table className="table-auto w-full">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border px-4 py-2 text-sm">No.</th>
                                                    <th className="border px-4 py-2 text-sm">No. Induk</th>
                                                    <th className="border px-4 py-2 text-sm">Nama</th>
                                                    <th className="border px-4 py-2 text-sm">Jenis Kelamin</th>
                                                    <th className="border px-4 py-2 text-sm">Usia</th>
                                                    <th className="border px-4 py-2 text-sm">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {siswa_belum.map((dt, index) => ( // { id, nama_lengkap, no_induk, jenis_kelamin, usia_tahun, usia_bulan }
                                                    <tr key={ index }>
                                                        <td className="border px-4 py-2 text-sm">{ index + 1 }</td>
                                                        <td className="border px-4 py-2 text-sm">{ dt.no_induk }</td>
                                                        <td className="border px-4 py-2 text-sm">{ dt.nama_lengkap }</td>
                                                        <td className="border px-4 py-2 text-sm">{ (dt.jenis_kelamin == 'L') ? 'Laki-laki' : 'Perempuan' }{  }</td>
                                                        <td className="border px-4 py-2 text-sm">{ dt.usia_tahun+' Thn '+dt.usia_bulan+' Bln' }</td>
                                                        <td className="border px-4 py-2 text-sm">
                                                            <Link
                                                                tabIndex="1"
                                                                className="px-4 py-2 text-sm text-white bg-blue-500 rounded"
                                                                href={route("kelompok-siswa-masuk", {
                                                                    'id': data.id_kelompok,
                                                                    'id_siswa': dt.id,
                                                                    'id_semester': id_semester,
                                                                })}
                                                            >
                                                                Masuk
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
            
                                                {siswa_belum.length === 0 && (
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
                            </div> : "" }

                            { (role_id == 4) ?
                            <div className="mt-4 -mx-2 mb-5 md:items-center md:flex">
                                <div className="w-3/4 px-2">
                                    <label><b>Siswa Sudah Dikelompokkan</b></label>
                                    <div className="overflow-auto">
                                        <table className="table-auto w-full">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border px-4 py-2 text-sm">No.</th>
                                                    {/* <th className="border px-4 py-2 text-sm">No. Induk</th> */}
                                                    <th colSpan="2" className="border px-4 py-2 text-sm">Nama</th>
                                                    <th className="border px-4 py-2 text-sm">Jenis Kelamin</th>
                                                    <th className="border px-4 py-2 text-sm">Usia</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {siswa_sudah.map((dt, index) => ( //{ id, nama_lengkap, no_induk, jenis_kelamin, usia_tahun, usia_bulan, index }
                                                    <tr key={ index }>
                                                        <td className="border px-4 py-2 text-sm">{ index + 1 }</td>
                                                        {/* <td className="border px-4 py-2 text-sm">{ dt.no_induk }</td> */}
                                                        <td className="border px-4 py-2 text-sm"><img src={ (dt.foto) ? "/images/siswa/"+dt.foto : (dt.jenis_kelamin == 'L') ? "/images/boy.png" : "/images/girl.png" } alt="" width="70" /></td>
                                                        <td className="border px-4 py-2 text-sm"><b>{ dt.nama_panggilan }</b><br />{ dt.nama_lengkap }<br />No. Induk: { dt.no_induk }</td>
                                                        <td className="border px-4 py-2 text-sm">{ (dt.jenis_kelamin == 'L') ? 'Laki-laki' : 'Perempuan' }{  }</td>
                                                        <td className="border px-4 py-2 text-sm">{ dt.usia_tahun+' Thn '+dt.usia_bulan+' Bln' }</td>
                                                    </tr>
                                                ))}
            
                                                {siswa_sudah.length === 0 && (
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

                                {/* <div className="flex-1 px-2 mt-4 md:mt-0">
                                    
                                </div> */}
                            </div> : "" }

                            <Link
                                className="px-6 py-2 text-white text-sm bg-orange-500 rounded focus:outline-none"
                                href={ route("kelompok.index") }
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
