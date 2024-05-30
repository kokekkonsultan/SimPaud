// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect } from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Swal from 'sweetalert2';

export default function Edit({ auth, props, id_kelompok_siswa, id_semester, narasi_dimensi, data_narasi_pendahuluan_foto }) {

    const { siswa, rapor_siswa, errors } = usePage().props;

    // const { data, setData, put, errors } = useForm({
    //     nama_lengkap: siswa.nama_lengkap || "",
    //     nama_panggilan: siswa.nama_panggilan || "",
    //     no_induk: siswa.no_induk || "",
    //     nisn: siswa.nisn || "",
    //     jenis_kelamin: siswa.jenis_kelamin || "",
    //     foto: siswa.foto || "",
    //     kelompok: siswa.kelompok || "",
    //     usia_tahun: siswa.usia_tahun || "",

    //     id_kelompok_siswa: id_kelompok_siswa,
    //     id_semester: id_semester,
    //     id_dimensi: [],
    //     narasi_dimensi: [],

    //     narasi_pendahuluan: rapor_siswa.narasi_pendahuluan || "",
    //     narasi_penutup: rapor_siswa.narasi_penutup || "",
    //     izin: rapor_siswa.izin || "",
    //     sakit: rapor_siswa.sakit || "",
    //     alpa: rapor_siswa.alpa || "",
    // });

    const { data, setData, post, progress } = useForm({
        nama_lengkap: siswa.nama_lengkap || "",
        nama_panggilan: siswa.nama_panggilan || "",
        no_induk: siswa.no_induk || "",
        nisn: siswa.nisn || "",
        jenis_kelamin: siswa.jenis_kelamin || "",
        foto: siswa.foto || "",
        kelompok: siswa.kelompok || "",
        usia_tahun: siswa.usia_tahun || "",

        id_kelompok_siswa: id_kelompok_siswa,
        id_semester: id_semester,
        narasi_pendahuluan: rapor_siswa.narasi_pendahuluan,
        narasi_penutup: rapor_siswa.narasi_penutup,
        izin: rapor_siswa.izin,
        sakit: rapor_siswa.sakit,
        alpa: rapor_siswa.alpa,

        foto_pendahuluan: [],
        _method: 'PUT'
    });

    // const kondisi = [
    //     {id: "Baik", nama: "Baik"}, 
    //     {id: "Cukup", nama: "Cukup"},
    //     {id: "Kurang", nama: "Kurang"}
    // ]
  
    // function handleSubmit(e) {
    //     e.preventDefault();
    //     put(route("rapor-siswa.update", id_kelompok_siswa));
    // }

    // const handleChangeIDDimensi = (e) => {
    //     let id = e.target.value;
    //     setData("id_dimensi", [...data.id_dimensi, id]);
    // };

    // const handleChangeNarasiDimensi = (e) => {
    //     let id = e.target.value;
    //     setData("narasi_dimensi", [...data.narasi_dimensi, id]);
    // };

    const [editKelompok, setEditKelompok] = useState(id_kelompok_siswa);
    const [editSemester, setEditSemester] = useState(id_semester);
    // const [editPendahuluan, setEditPendahuluan] = useState(rapor_siswa.narasi_pendahuluan);
    // const [editPenutup, setEditPenutup] = useState(rapor_siswa.narasi_penutup);
    const [editPendahuluan, setEditPendahuluan] = useState({
        content: rapor_siswa.narasi_pendahuluan
    });
    const [editPenutup, setEditPenutup] = useState({
        content: rapor_siswa.narasi_penutup
    });
    const [editIzin, setEditIzin] = useState(rapor_siswa.izin);
    const [editSakit, setEditSakit] = useState(rapor_siswa.sakit);
    const [editAlpa, setEditAlpa] = useState(rapor_siswa.alpa);
    const [formData, setFormData] = useState("");
    const [formDataFoto, setFormDataFoto] = useState([]); // { foto: [] }
    const [formDataFotoPendahuluan, setFormDataFotoPendahuluan] = useState([]);

    const handleChange = (i, e) => {
        const helper = [...formData];
        // if (e.target.name === "foto") {
        //     helper[`${i}`] = e.target.id+'====='+e.target.files[0];
        // }else{
            helper[`${i}`] = e.target.id+'====='+e.target.value;
        // }
        setFormData(helper);
    }

    const handleEditorChange = (i, e, editor, id_dimensi) => {
        const data = editor.getData();
        const helper = [...formData];
        helper[`${i}`] = id_dimensi+'====='+data;
        setFormData(helper);
    };

    const handleFotoChange = (i, e) => {
        const helper = [...formDataFoto];
        // if (e.target.name === "foto") {
            // helper[`${i}`] = e.target.id+'====='+e.target.files;
            helper[e.target.id] = e.target.files;
        // }else{
        //     helper[`${i}`] = e.target.id+'====='+e.target.value;
        // }
        setFormDataFoto(helper);
    }

    const handleFotoPendahuluanChange = (e) => {
        const helper = e.target.files;
        setFormDataFotoPendahuluan(helper);
    }

    const handleEditorPendahuluanChange = (event, editor) => {
        const data = editor.getData();
        setEditPendahuluan({
            ...editPendahuluan,
            content: data
        });
    };

    const handleEditorPenutupChange = (event, editor) => {
        const data = editor.getData();
        setEditPenutup({
            ...editPenutup,
            content: data
        });
        // console.log(editPenutup);
    };

    // const [inputs, setInputs] = useState([{ nama_dimensi: '', foto: [] }]);
    // const handleChanges = (index, event) => {
    //     const values = [...inputs];
    //     if (event.target.name === "foto") {
    //         values[`${index}`] = event.target.id+'====='+event.target.files;
    //     } else {
    //         values[`${index}`] = event.target.id+'====='+event.target.value;
    //     }
    //     setInputs(values);
    // };

    const handleSubmit = (event) => {
        event.preventDefault();
        // console.log(formData);
        // const formDatas = new FormData();
        // formData.forEach((input, index) => {
        //     formDatas.append(`formData[${index}][narasi_dimensi]`, input.narasi_dimensi);
        //     formDatas.append(`formData[${index}][foto]`, input.foto);
        // });

        // const formDatas = new FormData();
        // formData.forEach((input, index) => {
        //     // console.log(input.foto.length);
        //     formData.append(`formData[${index}][nama_dimensi]`, input.nama_dimensi);
        //     for (let i = 0; i < input.foto.length; i++) {
        //         formData.append(`formData[${index}][foto][]`, input.foto[i]);
        //     }
        // });

        // const formDatas = new FormData();
        // inputs.forEach((input, index) => {
        //     formDatas.append(`inputs[${index}][nama_dimensi]`, input.nama_dimensi);
        //     // for (let i = 0; i < input.foto.length; i++) {
        //     //     formDatas.append(`inputs[${index}][foto][]`, input.foto[i]);
        //     // }
        // });

        // const product = new FormData();
        // if (formDataFoto) {
        //     for (const file of formDataFoto) {
        //     product.append("image", file);
        //     }
        // }
        // console.log(formDataFotoPendahuluan);

        // const formDataFotos = new FormData();
        // formDataFoto.forEach((input, index) => {
        //     // console.log(input.foto.length);
        //     for (let i = 0; i < formDataFoto.length; i++) {
        //         formDataFoto.append(`formDataFoto[${index}][foto][]`, input.foto[i]);
        //     }
        // });
        // for (let i = 0; i < formDataFoto.length; i++) {
        //     formDataFotos.append('foto[]', files[i]);
        // }

        // formDataFoto.forEach((image_file) => {
        //     formDataFotos.append('foto[]', image_file);
        // });

        // console.log(formDataFotos);

        // const formDataFotoPendahuluans = new FormData();
        // for (let i = 0; i < formDataFotoPendahuluan.length; i++) {
        //     formDataFotoPendahuluans.append('foto_pendahuluan[]', formDataFotoPendahuluan[i]);
        // }

        // console.log(formData);
        Swal.fire({
            title: 'Simpan Data Rapor Siswa?',
            type: 'warning',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oke',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                router.post(`/rapor-siswa/${id_kelompok_siswa}`, {
                    data_narasi_dimensi: formData,
                    data_narasi_dimensi_foto: formDataFoto,
                    // data_narasi_pendahuluan_foto: formDataFotoPendahuluans,
                    id_kelompok_siswa: editKelompok,
                    id_semester: editSemester,

                    narasi_pendahuluan: editPendahuluan,
                    narasi_penutup: editPenutup,
                    izin: editIzin,
                    sakit: editSakit,
                    alpa: editAlpa,

                    foto_pendahuluan: formDataFotoPendahuluan,
                    _method: 'PUT',

                    // headers: {
                    //     'Content-Type': 'multipart/form-data'
                    // }
                });
            }
        });
    }

    const deleteFotoPendahuluanData = (id_rapor_siswa, id) => {
        // if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
        //     Inertia.get(`/rapor-siswa/hapus-narasi-pendahuluan-foto/${id_rapor_siswa}/${id}`);
        // }
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
                router.get(`/rapor-siswa/hapus-narasi-pendahuluan-foto/${id_rapor_siswa}/${id}`);
                Swal.fire(
                    'Dihapus!',
                    'Data berhasil dihapus.',
                    'success'
                );
            }
        });
    }

    const deleteFotoData = (id_rapor_siswa, id) => {
        // if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
        //     Inertia.get(`/rapor-siswa/hapus-narasi-dimensi-foto/${id_rapor_siswa}/${id}`);
        // }
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
                router.get(`/rapor-siswa/hapus-narasi-dimensi-foto/${id_rapor_siswa}/${id}`);
                Swal.fire(
                    'Dihapus!',
                    'Data berhasil dihapus.',
                    'success'
                );
            }
        });
    }
  
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Rapor Siswa</h2>}
        >
            <Head title="Rapor Siswa" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Rapor Siswa</h1>
  
                            {/* <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
                                    href={ route("rapor-siswa.index") }
                                >
                                    Kembali
                                </Link>
                            </div> */}

                            <table className="table-auto w-full mb-5">
                                <tbody>
                                    <tr>
                                        <td className="border px-4 py-2 w-40"><img src={ (data.foto) ? "/images/siswa/"+data.foto : (data.jenis_kelamin == 'L') ? "/images/boy.png" : "/images/girl.png" } alt="" width="70" /></td>
                                        <td className="border px-4 py-2"><b>{ data.nama_panggilan }</b> - { data.nama_lengkap }<br />{ (data.jenis_kelamin == 'L') ? "Laki-laki" : "Perempuan" } - { data.usia_tahun } Th - { data.kelompok } <br />No. Induk: { data.no_induk } | NISN: { data.nisn }</td>
                                    </tr>
                                </tbody>
                            </table>

                            <form name="createForm" onSubmit={handleSubmit}>

                            <input
                                type="hidden"
                                name="id_kelompok_siswa"
                                value={id_kelompok_siswa}
                                onChange={(e) =>
                                    setData("id_kelompok_siswa", e.target.value)
                                }
                            />

                            <input
                                type="hidden"
                                name="id_semester"
                                value={id_semester}
                                onChange={(e) =>
                                    setData("id_semester", e.target.value)
                                }
                            />


                                <div className="flex flex-col">
                                    <div>
                                        <label className="">Narasi Pendahuluan <span className='text-red-600'>*</span></label>
                                        {/* <CKEditor
                                            editor={ ClassicEditor }
                                            data=""
                                            onReady={ editor => {
                                                // You can store the "editor" and use when it is needed.
                                                console.log( 'Editor is ready to use!', editor );
                                            } }
                                            onChange={ ( event ) => {
                                                console.log( event );
                                            } }
                                            onBlur={ ( event, editor ) => {
                                                console.log( 'Blur.', editor );
                                            } }
                                            onFocus={ ( event, editor ) => {
                                                console.log( 'Focus.', editor );
                                            } }
                                        /> */}

                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={editPendahuluan.content}
                                            onChange={handleEditorPendahuluanChange}
                                            config={{
                                                ckfinder: {
                                                    uploadUrl: '/api/upload',
                                                },
                                            }}
                                        />

                                        {/* <textarea
                                            id="narasi_pendahuluan"
                                            name="narasi_pendahuluan"
                                            placeholder='Narasi Pendahuluan'
                                            rows={5}
                                            className="w-full px-4 py-2"
                                            required
                                            defaultValue={data.narasi_pendahuluan}
                                            // onChange={(e) => setData("narasi_pendahuluan", e.target.value)}
                                            onChange={(e) => setEditPendahuluan(e.target.value)}
                                        /> */}
                                        <span className="text-red-600">
                                            {errors.narasi_pendahuluan}
                                        </span>
                                        
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Foto</label>
                                        <input
                                            type="file"
                                            multiple
                                            className="w-full px-4 py-2"
                                            label="Foto"
                                            name="foto_pendahuluan"
                                            accept="image/*"
                                            onChange={e => handleFotoPendahuluanChange(e)}
                                        />
                                    </div>
                                    <div className="flex flex-wrap">
                                        { data_narasi_pendahuluan_foto.map((foto1, index) => (  
                                        <div className="w-full sm:w-1/4 md:w-1/4 lg:w-1/4 xl:w-1/4 p-2">
                                            <div className="flex justify-center items-center">
                                                <img src={"/images/rapor/"+foto1.foto} alt="" width="200" />
                                            </div>
                                            <div className="text-center"><a
                                                                style={{ cursor: 'pointer' }}
                                                                tabIndex="1"
                                                                className="px-4 py-2 text-sm text-white bg-red-500 rounded"
                                                                onClick={ () => deleteFotoPendahuluanData(id_kelompok_siswa+"-"+id_semester, foto1.id) }
                                                            >
                                                                Hapus
                                                            </a></div>
                                        </div>
                                        ))}
                                    </div>
                                    <hr className="mt-4 mb-4"></hr>

                                    { narasi_dimensi.map((dt1, index) => (  //value={dt1.id_dimensi}
                                    <div>
                                        <div>
                                            <input
                                                type="hidden"
                                                name="id_dimensi[]"
                                                
                                                // onChange={(e) =>
                                                //     onChange={handleChangeIDDimensi}
                                                // }
                                            />

                                            <label className="">Narasi { dt1.nama_dimensi } { (dt1.kode) ? (dt1.kode == 'SM') ? <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">{ dt1.keterangan }</span> : <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-400 border border-yellow-400">{ dt1.keterangan }</span> : "" } {/*<span className='text-red-600'>*</span>*/}</label>
                                            {/* <CKEditor
                                                editor={ ClassicEditor }
                                                data=""
                                                onReady={ editor => {
                                                    // You can store the "editor" and use when it is needed.
                                                    console.log( 'Editor is ready to use!', editor );
                                                } }
                                                onChange={ ( event ) => {
                                                    console.log( event );
                                                } }
                                                onBlur={ ( event, editor ) => {
                                                    console.log( 'Blur.', editor );
                                                } }
                                                onFocus={ ( event, editor ) => {
                                                    console.log( 'Focus.', editor );
                                                } }
                                            /> */}
                                            <CKEditor
                                                editor={ClassicEditor}
                                                data={dt1.narasi}
                                                onChange={(e, editor) => handleEditorChange(index, e, editor, dt1.id_dimensi)}
                                                config={{
                                                    ckfinder: {
                                                        uploadUrl: '/api/upload',
                                                    },
                                                }}
                                            />
                                            {/* <textarea
                                                // id="narasi_dimensi"
                                                name="narasi_dimensi"
                                                // placeholder={ "Narasi "+dt1.nama_dimensi }
                                                rows={5}
                                                className="w-full px-4 py-2"
                                                defaultValue={dt1.narasi}
                                                id={dt1.id_dimensi}
                                                onChange={e => handleChange(index, e)}
                                                // onChange={handleChangeNarasiDimensi}
                                            /> */}
                                            <span className="text-red-600">
                                                {errors.narasi_dimensi}
                                            </span>
                                        </div>

                                        <div className="mb-4">
                                            <label className="">Foto Karya</label>
                                            <input
                                                id={dt1.id_dimensi}
                                                type="file"
                                                multiple
                                                className="w-full px-4 py-2"
                                                label="Foto"
                                                name="foto"
                                                accept="image/*"
                                                onChange={e => handleFotoChange(index, e)}
                                            />
                                        
                                        </div>

                                        <div className="flex flex-wrap">
                                            { dt1.data_narasi_dimensi_foto.map((foto2, index) => (  
                                            <div className="w-full sm:w-1/4 md:w-1/4 lg:w-1/4 xl:w-1/4 p-2">
                                                <div className="flex justify-center items-center">
                                                    <img src={"/images/rapor/"+foto2.foto} alt="" width="200" />
                                                </div>
                                                <div className="text-center"><a
                                                                    style={{ cursor: 'pointer' }}
                                                                    tabIndex="1"
                                                                    className="px-4 py-2 text-sm text-white bg-red-500 rounded"
                                                                    onClick={ () => deleteFotoData(id_kelompok_siswa+"-"+id_semester, foto2.id) }
                                                                >
                                                                    Hapus
                                                                </a></div>
                                            </div>
                                            ))}
                                        </div>
                                        <hr className="mt-4 mb-4"></hr>
                                    </div>
                                    ))}
                                    
                                    <div className="mb-4">
                                        <label className="">Narasi Penutup <span className='text-red-600'>*</span></label>
                                        {/* <CKEditor
                                            editor={ ClassicEditor }
                                            data=""
                                            onReady={ editor => {
                                                // You can store the "editor" and use when it is needed.
                                                console.log( 'Editor is ready to use!', editor );
                                            } }
                                            onChange={ ( event ) => {
                                                console.log( event );
                                            } }
                                            onBlur={ ( event, editor ) => {
                                                console.log( 'Blur.', editor );
                                            } }
                                            onFocus={ ( event, editor ) => {
                                                console.log( 'Focus.', editor );
                                            } }
                                        /> */}

                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={editPenutup.content}
                                            onChange={handleEditorPenutupChange}
                                            config={{
                                                ckfinder: {
                                                    uploadUrl: '/api/upload',
                                                },
                                            }}
                                        />

                                        {/* <textarea
                                            id="narasi_penutup"
                                            name="narasi_penutup"
                                            placeholder='Narasi Penutup'
                                            rows={5}
                                            className="w-full px-4 py-2"
                                            required
                                            defaultValue={data.narasi_penutup}
                                            // onChange={(e) => setData("narasi_penutup", e.target.value)}
                                            onChange={(e) => setEditPenutup(e.target.value)}
                                        /> */}
                                        <span className="text-red-600">
                                            {errors.narasi_penutup}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label className="">Izin <span className='text-red-600'>*</span></label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2"
                                            label="Izin"
                                            name="izin"
                                            required
                                            defaultValue={data.izin}
                                            // onChange={(e) =>
                                            //     setData("izin", e.target.value)
                                            // }
                                            onChange={(e) =>
                                                setEditIzin(e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.izin}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Sakit <span className='text-red-600'>*</span></label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2"
                                            label="Sakit"
                                            name="sakit"
                                            required
                                            defaultValue={data.sakit}
                                            // onChange={(e) =>
                                            //     setData("sakit", e.target.value)
                                            // }
                                            onChange={(e) =>
                                                setEditSakit(e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.sakit}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Alpa <span className='text-red-600'>*</span></label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2"
                                            label="Alpa"
                                            name="alpa"
                                            required
                                            defaultValue={data.alpa}
                                            // onChange={(e) =>
                                            //     setData("alpa", e.target.value)
                                            // }
                                            onChange={(e) =>
                                                setEditAlpa(e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.alpa}
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
                                            href={ route("rapor-siswa.index") }
                                        >
                                            Batalkan
                                        </Link>
                                </div>
                            </form>
                            <style>
                            {`
                            .ck-editor__editable_inline {
                                min-height: 200px;
                                    }
                            `}
                            </style>
  
                        </div>
                    </div>
                </div>
            {/* </div> */}
        </DashboardLayout>
    );
}
