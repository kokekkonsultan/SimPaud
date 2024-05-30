// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, usePage, Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import Swal from 'sweetalert2';

export default function Index({ auth, props, sekolah, base_url }) {
    
    const copyClipboard = (slug) => {
        navigator.clipboard.writeText(base_url+"/registrasi/sekolah/"+slug)
        Swal.fire(
            'Disalin!',
            'Link pendaftaran berhasil disalin.',
            'success'
        );
    };

    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Link Pendaftaran</h2>}
        >
            <Head title="Link Pendaftaran" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Link Pendaftaran</h1>
  
                            <div className="text-center">

                                
                                Anda bisa menggunakan link pendaftaran untuk dibagikan kepada calon peserta didik di bawah ini.<br /><br />
                                <input
                                    type="text"
                                    className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 w-96 px-4 py-2"
                                    value={ base_url+"/registrasi/sekolah/"+sekolah.slug}
                                /> &nbsp; <Link
                                className="px-6 py-2 text-white text-sm bg-blue-500 rounded-md focus:outline-none"
                                onClick={() => copyClipboard(sekolah.slug)}
                                // onClick={() => {navigator.clipboard.writeText(base_url+"/registrasi/sekolah/"+sekolah.slug)}}
                            >
                                Copy Link
                                </Link><br /><br />
                                Atau gunakan tombol dibawah ini.<br /><br />
                                <a
                                target="_blank"
                                        className="px-6 py-2 text-white text-sm bg-green-500 rounded-md focus:outline-none"
                                        href={ base_url+'/registrasi/sekolah/'+sekolah.slug }
                                    >
                                        Menuju Link Pendaftaran
                                    </a>

                            </div>

                            

                        </div>


                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Scan Barcode</h1>

                            <div className="grid md:grid-cols-4 md:gap-4">
                                
                                <div className='bg-white rounded-lg shadow-lg p-10 text-center md:h-full m-2 md:m-0'>
                                    <div className='font-livic'>
                                        Latar Belakang Gelap
                                    </div>
                                    <div className='flex justify-center items-center'>
                                    <a
                                                                    tabIndex="1"
                                                                    target="_blank"
                                                                    href={route("scan-barcode", 'dark')}
                                                                >
                                        <img src="/images/small-background-dark.jpg" alt="" />
                                        </a>
                                        
                                    </div>
                                </div>
                                
                                <div className='bg-white rounded-lg shadow-lg p-10 text-center md:h-full m-2 md:m-0'>
                                    <div className='font-livic'>
                                        Latar Belakang Terang
                                    </div>
                                    <div className='flex justify-center items-center'>
                                    <a
                                                                    tabIndex="1"
                                                                    target="_blank"
                                                                    href={route("scan-barcode", 'light')}
                                                                >
                                        <img src="/images/small-background-light.jpg" alt="" />
                                        </a>
                                    </div>
                                </div>
                                

                            </div>

                        </div>


                    </div>
                </div>
            {/* </div> */}
        </DashboardLayout>
    );
}
