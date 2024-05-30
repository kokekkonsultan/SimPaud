// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// import FrontLayout from '@/Layouts/FrontLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, Link } from '@inertiajs/react';
import QRCode from 'qrcode.react';

export default function Barcode({ auth, props, sekolah, template, base_url }) {
  
  return (
      <>
          <Head title="Barcode" />

          <div className="container mx-auto">
            
              <table className="table-auto w-full">
                  <tbody>
                      <tr>
                          <td className="flex items-center justify-center">
                              
                              <div className="relative">
                                  <img src={ "/images/background-"+template+".jpg" } alt="" width="800" />
                                  <div className="absolute inset-0 flex justify-center">
                                      
                                      <div className="pt-6">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td className="text-center text-4xl "><b>{ sekolah.nama }</b></td>
                                                </tr>
                                                <tr>
                                                    <td className="text-center text-sm">{ sekolah.alamat }, { sekolah.kecamatan } - { sekolah.kotakab }</td>
                                                </tr>
                                                { (sekolah.no_telpon) ? 
                                                <tr>
                                                    <td className="text-center text-sm">Telp: { sekolah.no_telpon } </td>
                                                </tr>
                                                : "" }
                                                <tr>
                                                    <td className="h-20">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td className={ (template == 'dark') ? "text-center text-3xl text-white" : "text-center text-3xl text-black" }><h1><b>Pendaftaran Peserta Didik Baru</b></h1></td>
                                                </tr>
                                                <tr>
                                                    <td className="h-16">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td className={ (template == 'dark') ? "text-center text-xl text-white" : "text-center text-xl text-black" }><h1>Mohon dapat mengisi form registrasi dibawah ini </h1></td>
                                                </tr>
                                                
                                                <tr>
                                                    <td className="h-96 flex items-center justify-center pt-40 align-top"><QRCode value={ base_url+'/registrasi/sekolah/'+sekolah.slug } imageSettings={{
    src: (sekolah.foto) ? "/images/sekolah/"+sekolah.foto : "/images/tutwuri_logo.png",
    x: undefined,
    y: undefined,
    height: 50,
    width: 50,
  }} size={300}/></td>
                                                </tr>
                                                <tr>
                                                    <td className="h-36">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td className={ (template == 'dark') ? "text-center text-base text-white" : "text-center text-base text-black" }>Atau kunjungi link pendaftaran dibawah ini</td>
                                                </tr>
                                                <tr>
                                                    <td className={ (template == 'dark') ? "text-center text-xl text-white pt-6" : "text-center text-xl text-black pt-6" }>{ base_url+'/registrasi/sekolah/'+sekolah.slug }</td>
                                                </tr>

                                            </tbody>
                                        </table>
                                        
                                      </div>



                                  </div>
                              </div>

                              
                          </td>
                      </tr>
                  </tbody>
              </table>

          </div>
      </>
  );
}