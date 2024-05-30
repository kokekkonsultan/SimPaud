// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// import FrontLayout from '@/Layouts/FrontLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, Link } from '@inertiajs/react';

export default function Rapor({ auth, props, siswa, sekolah, kepala_sekolah, rapor_siswa, narasi_dimensi, nama_semester }) {
  
  return (
      <>
          <Head title="Rapor Siswa" />

          <div className="container mx-auto">
            
              <table className="table-auto w-full mb-5">
                  <tbody>
                      <tr>
                          <td className="flex items-center justify-center">
                              
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
                                                    <td className="text-center text-sm">{ sekolah.alamat } { sekolah.kecamatan } { sekolah.kotakab }</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-center text-sm">{ (sekolah.telpon) ? 'Telpon: '+sekolah.telpon+' - ' : "" } Email: { sekolah.email }</td>
                                                </tr>
                                                { (sekolah.npsn) ?
                                                <tr>
                                                    <td className="text-center text-sm">NPSN: { sekolah.npsn }</td>
                                                </tr> : "" }
                                                <tr>
                                                    <td>&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td><hr /></td>
                                                </tr>
                                                <tr>
                                                    <td>&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-center text-2xl"><h1>Catatan Perkembangan Anak</h1></td>
                                                </tr>
                                                <tr>
                                                    <td className="text-center text-sm">{ nama_semester }</td>
                                                </tr>

                                                <tr>
                                                    <td>&nbsp;</td>
                                                </tr>
                                                
                                                <tr>
                                                    <td>
                                                        
                                                    <table className="table-auto w-full">
                                                        <tbody>
                                                            <tr>
                                                                <td rowSpan="3" className="border px-4 py-2 "><img src={ (siswa.foto) ? "/images/siswa/"+siswa.foto : (siswa.jenis_kelamin == 'L') ? "/images/boy.png" : "/images/girl.png" } alt="" width="100" /></td>
                                                                <td className="border px-4 py-2 text-sm"><span className="text-sm">Nama Ananda</span><br /><b>{ siswa.nama_lengkap }</b></td>
                                                                <td className="border px-4 py-2 text-sm"><span className="text-sm">Jenis Kelamin</span><br /><b>{ (siswa.jenis_kelamin == 'L') ? "Laki-laki" : "Perempuan" }</b></td>
                                                                <td className="border px-4 py-2 text-sm"><span className="text-sm">Tempat / Tanggal Lahir</span><br /><b>{ siswa.tempat_lahir } / { siswa.tanggal_lahir }</b></td>
                                                            </tr>
                                                            <tr>
                                                                <td className="border px-4 py-2 text-sm"><span className="text-sm">Tanggal Masuk</span><br /><b>{ siswa.tanggal_masuk }</b></td>
                                                                <td className="border px-4 py-2 text-sm"><span className="text-sm">Kelompok</span><br /><b>{ siswa.kelompok }</b></td>
                                                                <td className="border px-4 py-2 text-sm"><span className="text-sm">No. Induk / NISN</span><br /><b>{ siswa.no_induk } / { siswa.nisn }</b></td>
                                                            </tr>
                                                            <tr>
                                                                <td className="border px-4 py-2 text-sm"><span className="text-sm">Nama Ayah</span><br /><b>{ (siswa.nama_ayah) ? siswa.nama_ayah : "-" }</b></td>
                                                                <td className="border px-4 py-2 text-sm"><span className="text-sm">Nama Ibu</span><br /><b>{ (siswa.nama_ibu) ? siswa.nama_ibu : "-" }</b></td>
                                                                <td className="border px-4 py-2 text-sm"><span className="text-sm">Nama Wali</span><br /><b>{ (siswa.nama_wali) ? siswa.nama_wali : "-" }</b></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>

                                                    </td>
                                                </tr>
                                                
                                                <tr>
                                                    <td>&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-xl"><h1>Pendahuluan</h1></td>
                                                </tr>
                                                <tr>
                                                    <td className="text-sm">{ rapor_siswa.narasi_pendahuluan }</td>
                                                </tr>
                                                <tr>
                                                    <td>&nbsp;</td>
                                                </tr>

                                                { narasi_dimensi.map((dt1, index) => (  //value={dt1.id_dimensi}
                                                    // <tr>
                                                    //     <td>&nbsp;</td>
                                                    // </tr>
                                                    <tr>
                                                        <td className="text-xl"><h1>{ dt1.nama_dimensi }</h1><div className="pb-5 text-sm">{ dt1.narasi }</div></td>
                                                    </tr>
                                                    // <tr>
                                                    //     <td className="text-sm"></td>
                                                    // </tr>
                                                ))}

                                                

                                                
                                                <tr>
                                                    <td className="text-xl"><h1>Penutup</h1></td>
                                                </tr>
                                                <tr>
                                                    <td className="text-sm">{ rapor_siswa.narasi_penutup }</td>
                                                </tr>

                                                <tr>
                                                    <td>&nbsp;</td>
                                                </tr>
                                                
                                                <tr>
                                                    <td>
                                                        
                                                    <table className="table-auto w-full">
                                                        <tbody>
                                                            <tr>
                                                                <td className="border px-4 py-2 text-xl">Absensi</td>
                                                                <td className="border px-4 py-2 text-sm"><span className="text-sm">Izin</span><br /><b>{ rapor_siswa.izin }</b></td>
                                                                <td className="border px-4 py-2 text-sm"><span className="text-sm">Sakit</span><br /><b>{ rapor_siswa.sakit }</b></td>
                                                                <td className="border px-4 py-2 text-sm"><span className="text-sm">Alpa</span><br /><b>{ rapor_siswa.alpa }</b></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>

                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>&nbsp;</td>
                                                </tr>
                                                
                                                <tr>
                                                    <td>
                                                        
                                                    <table className="table-auto w-full">
                                                        <tbody>
                                                            <tr>
                                                                <td className="text-center text-sm"></td>
                                                                <td className="text-center text-sm">{ sekolah.kotakab }, { siswa.tanggal_rapor }</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-center px-4 py-2 text-sm">Kepala Sekolah</td>
                                                                <td className="text-center px-4 py-2 text-sm">Wali Kelas</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-center"><div className="flex items-center justify-center">{ (kepala_sekolah.tanda_tangan) ? <img src={ (kepala_sekolah.tanda_tangan) ? "/images/sekolah/"+kepala_sekolah.tanda_tangan : "" } width="100" /> : "" }</div></td>
                                                                <td className="text-center"><div className="flex items-center justify-center">{ (siswa.tanda_tangan) ? <img src={ (siswa.tanda_tangan) ? "/images/guru/"+siswa.tanda_tangan : "" } width="100" /> : "" }</div></td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-center text-sm"><b>{ kepala_sekolah.nama }</b></td>
                                                                <td className="text-center text-sm"><b>{ siswa.wali_kelas }</b></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>

                                                    </td>
                                                </tr>
                                                
                                            </tbody>
                                        </table>
                                        
                                      </div>

                              
                          </td>
                      </tr>
                  </tbody>
              </table>

          </div>
      </>
  );
}