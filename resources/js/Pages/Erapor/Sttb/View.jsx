// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// import FrontLayout from '@/Layouts/FrontLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, Link } from '@inertiajs/react';

export default function Sttb({ auth, props, sttb, sekolah, template }) {
  
  return (
      <>
          <Head title="STTB" />

          <div className="container mx-auto">
            
              <table className="table-auto w-full">
                  <tbody>
                      <tr>
                          <td className="flex items-center justify-center">
                              
                              <div className="relative">
                                  <img src={ (template.template) ? "/images/template/"+template.template : "" } alt="" />
                                  <div class="absolute inset-0 flex items-center justify-center">
                                      
                                      <div>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td className="flex items-center justify-center"><img src={ (sekolah.foto) ? "/images/sekolah/"+sekolah.foto : "/images/tutwuri_logo.png" } alt="Nama Sekolah" width="150" /></td>
                                                </tr>
                                                <tr>
                                                    <td className="text-center text-xl"><h1>{ sekolah.nama }</h1></td>
                                                </tr>
                                                <tr>
                                                    <td className="text-center text-sm">{ sekolah.alamat }</td>
                                                </tr>
                                                <tr>
                                                    <td>&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-center text-2xl"><h1>Surat Tanda Tamat Belajar</h1></td>
                                                </tr>
                                                <tr>
                                                    <td className="text-center text-sm">Nomor: { sttb.nomor_sttb }</td>
                                                </tr>
                                                <tr>
                                                    <td>&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-center text-sm">Yang bertanda tangan di bawah ini, Kepala Sekolah <b>{ sekolah.nama }</b> menerangkan bahwa:</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-center text-xl">{ sttb.nama_lengkap }</td>
                                                </tr>

                                                <tr>
                                                    <td>&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td className="flex items-center justify-center">
                                                      
                                                        <table>
                                                            <tbody>
                                                                <tr>
                                                                    <td className="text-sm">Nomor Induk</td>
                                                                    <td className="text-center text-sm w-5">:</td>
                                                                    <td className="text-sm">{ sttb.no_induk }</td>
                                                                </tr>
                                                                { (sttb.nisn) ?
                                                                <tr>
                                                                    <td className="text-sm">NISN</td>
                                                                    <td className="text-center text-sm">:</td>
                                                                    <td className="text-sm">{ sttb.nisn }</td>
                                                                </tr> : "" }
                                                                
                                                                <tr>
                                                                    <td className="text-sm">Tempat / Tanggal Lahir</td>
                                                                    <td className="text-center text-sm">:</td>
                                                                    <td className="text-sm">{ sttb.tempat_lahir } / { sttb.tanggal_lahir }</td>
                                                                </tr>
                                                                { (sttb.nama_ayah || sttb.nama_ibu) ? 
                                                                <tr>
                                                                    <td className="text-sm">Nama Orang Tua</td>
                                                                    <td className="text-center text-sm">:</td>
                                                                    <td className="text-sm">{ (sttb.nama_ayah) ? sttb.nama_ayah : sttb.nama_ibu }</td>
                                                                </tr> : "" }
                                                                { (sttb.nama_wali) ? 
                                                                <tr>
                                                                    <td className="text-sm">Nama Wali</td>
                                                                    <td className="text-center text-sm">:</td>
                                                                    <td className="text-sm">{ sttb.nama_wali }</td>
                                                                </tr> : "" }
                                                            </tbody>
                                                        </table>

                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-center text-sm">
                                                    Telah selesai mengikuti Program Pendidikan Anak Usia Dini (PAUD)<br /><b>{ sttb.jenis_sttb }</b> di <b>{ sekolah.nama }</b><br />Tahun Ajaran { sttb.tahun_ajaran }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td className="flex items-center justify-center">

                                                        <table>
                                                            <tbody>
                                                                <tr>
                                                                    <td className="text-sm"><img src={ (sttb.foto) ? "/images/siswa/"+sttb.foto : (sttb.jenis_kelamin == 'L') ? "/images/boy.png" : "/images/girl.png" } alt="" width="100" /></td>
                                                                    <td>&nbsp;</td>
                                                                    <td>&nbsp;</td>
                                                                    <td>

                                                                        <table>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td className="text-center text-sm">{ sekolah.kotakab }, { sttb.tanggal_sttb }<br />Kepala Sekolah</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td className="text-center flex items-center justify-center">{ (sttb.tanda_tangan) ? <img src={ (sttb.tanda_tangan) ? "/images/sekolah/"+sttb.tanda_tangan : "" } width="100" /> : "<br /><br /><br /><br />" }</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td className="text-center text-sm"><b>{ sttb.kepala_sekolah }</b></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>

                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>

                                                    </td>
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