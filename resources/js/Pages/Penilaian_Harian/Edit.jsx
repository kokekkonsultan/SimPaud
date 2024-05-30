// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect } from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Swal from 'sweetalert2';

export default function Edit({ auth, props, id_kelompok_siswa, id_semester, id_kelompok, penilaian, tanggal_penilaian, format_tanggal_penilaian, jml_indikator }) {
  
    const { siswa } = usePage().props;

    // const { data, setData, put, errors } = useForm({
    //     nama_lengkap: siswa.nama_lengkap || "",
    //     nama_panggilan: siswa.nama_panggilan || "",
    //     no_induk: siswa.no_induk || "",
    //     nisn: siswa.nisn || "",
    //     jenis_kelamin: siswa.jenis_kelamin || "",
    //     foto: siswa.foto || "",
    //     kelompok: siswa.kelompok || "",
    //     usia_tahun: siswa.usia_tahun || "",

    //     tanggal_penilaian: tanggal_penilaian,
    //     id_kelompok_siswa: id_kelompok_siswa,
    //     id_kelompok: id_kelompok,
    //     muncul: [],
    //     catatan: [],
    // });

    const { data, setData, post, errors, progress } = useForm({
        nama_lengkap: siswa.nama_lengkap || "",
        nama_panggilan: siswa.nama_panggilan || "",
        no_induk: siswa.no_induk || "",
        nisn: siswa.nisn || "",
        jenis_kelamin: siswa.jenis_kelamin || "",
        foto: siswa.foto || "",
        kelompok: siswa.kelompok || "",
        usia_tahun: siswa.usia_tahun || "",

        tanggal_penilaian: tanggal_penilaian,
        id_kelompok_siswa: id_kelompok_siswa,
        id_kelompok: id_kelompok,
        // id_kelompok: "",
        // data_penilaian: "",
        _method: 'PUT'
    });
  
    // function handleSubmitxxx(e) {
    //     e.preventDefault();
    //     put(route("penilaian-harian.update", siswa.id_siswa));
    // }

    
    const [editTanggalPenilaian, setEditTanggalPenilaian] = useState(tanggal_penilaian);
    const [editKelompokSiswa, setEditKelompokSiswa] = useState(id_kelompok_siswa);
    const [editKelompok, setEditKelompok] = useState(id_kelompok);

    const metodes = [
        {id: "SM", nama: "Sudah Muncul"}, 
        {id: "BM", nama: "Belum Muncul"}
    ]

    // const handleChangeIndikator = (e) => {
    //     let id = e.target.value;
    //     setData("id_indikator", [...data.id_indikator, id]);
    // };

    // const handleChangeMuncul = (e) => {
    //     let id = e.target.value;
    //     setData("muncul", [...data.muncul, id]);
    // };

    // const handleChangeCatatan = (e) => {
    //     let id = e.target.value;
    //     setData("catatan", [...data.catatan, id]);
    // };


    // const [formData, setFormData] = useState([{ muncul: "", catatan : ""}]);
    // const [formData, setFormData] = useState({ muncul: "", catatan : ""});

    const handleChangex = (i, e) => {
        const helper = [...formData];
        helper[`${i}`] = e.target.value;
        setFormData(helper);
        console.log(helper);
    }

    const handleChangexxx = (i, e) => {
        let newFormValues = [...formData];
        newFormValues[e.target.name] = e.target.value;
        setFormData(newFormValues);
    }

    const handleChangexx = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleChangexxxx = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleChange = (i, e) => {
        const { name, value } = e.target;
        const newFormValues = [...formData];
        newFormValues[i][name] = value;
        setFormData(newFormValues);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(formDataC);
        Swal.fire({
            title: 'Simpan Data Penilaian Harian?',
            type: 'warning',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oke',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                router.post(`/penilaian-harian/${siswa.id}`, {
                    data_penilaian: formDataM,
                    data_penilaian2: formDataC,
                    // data_penilaian3: formDataI,
                    id_kelompok: editKelompok,
                    id_kelompok_siswa: editKelompokSiswa,
                    tanggal_penilaian: editTanggalPenilaian,
                    _method: 'PUT',
                });

            }
        });
        // try {
        //     await axios.put(`/api/items/${itemId}`, formData);
        //     alert('Item updated successfully');
        // } catch (error) {
        //     console.error('Error updating item:', error);
        // }
    };



    // const [formData, setFormData] = useState({
    //     penilaian: [{ muncul: '', catatan: '' }]
    // });

    const handleSelectChange = (i, e) => {
        // const newFormValues = [...formData.penilaian];
        const { name, value } = e.target;
        const newFormValues = [...formDataM];
        // newFormValues[i].muncul = e.target.value;
        newFormValues[`${i}`] = e.target.id+'====='+value;
        // newFormValues[i].muncul = value;
        // setFormData({ penilaian: newFormValues });
        setFormDataM(newFormValues);

        // const helper = [...formData.penilaian];
        // helper[`${i}`] = e.target.value;
        // setFormData({ penilaian: helper });
        
    };

    const handleInputChange = (i, e) => {
        // const newFormValues = [...formData.penilaian];
        const { name, value } = e.target;
        const newFormValues = [...formDataC];
        // newFormValues[i].catatan = e.target.value;
        newFormValues[`${i}`] = e.target.id+'====='+value;
        // newFormValues[i].catatan = value;
        // setFormData({ penilaian: newFormValues });
        setFormDataC(newFormValues);

        // const helper = [...formData.penilaian];
        // helper[`${i}`] = e.target.value;
        // setFormData({ penilaian: helper });
    };

    const handleImageChange = (i, e) => {
        // const newFormValues = [...formData.penilaian];
        const { name, value } = e.target;
        const newFormValues = [...formDataI];
        // newFormValues[i].catatan = e.target.value;
        newFormValues[`${i}`] = e.target.files[0];
        // newFormValues[i].catatan = value;
        // setFormData({ penilaian: newFormValues });
        setFormDataI(newFormValues);

        // const helper = [...formData.penilaian];
        // helper[`${i}`] = e.target.value;
        // setFormData({ penilaian: helper });
    };

    // const [formData, setFormData] = useState([{
    //     muncul: '',
    //     catatan: '',
    // }]);

    const [formDataM, setFormDataM] = useState([]);
    const [formDataC, setFormDataC] = useState([]);
    const [formDataI, setFormDataI] = useState([]);

    const handleInputChangexx = (i, e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleInputChangexxxx = (i, e) => {
        console.log(i);
        const { name, value } = e.target;
        const newFormData = [...formData];
        newFormData[i][name] = value;
        setFormData(newFormData);
    };

    // const addField = () => {
    //     setFormData({
    //         penilaian: [...formData.users, { gender: '', name: '' }]
    //     });
    // };
  
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

                            <h1 className="text-2xl mb-5">Penilaian Harian</h1>
  
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
                                        <td className="border px-4 py-2"><b>{ data.nama_panggilan }</b> - { data.nama_lengkap }<br />{ (data.jenis_kelamin == 'L') ? "Laki-laki" : "Perempuan" } - { data.usia_tahun } Th - { data.kelompok } <br />No. Induk: { data.no_induk } | NISN: { data.nisn }</td>
                                    </tr>
                                </tbody>
                            </table>

                            <b>{format_tanggal_penilaian}</b>
  
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
                                    name="id_kelompok"
                                    value={id_kelompok}
                                    onChange={(e) =>
                                        setData("id_kelompok", e.target.value)
                                    }
                                />
                                <input
                                    type="hidden"
                                    name="tanggal_penilaian"
                                    value={tanggal_penilaian}
                                    onChange={(e) =>
                                        setData("tanggal_penilaian", e.target.value)
                                    }
                                />

                                <div className="flex flex-col">

                                    
                                    {/* <div className="mb-4">
                                        <input type="checkbox" 
                                        name="indicator[]" 
                                        id={`indicator${id}`}
                                        value={id}
                                        onChange={handleChange}
                                        ></input> 
                                        
                                    </div> */}

                            <div className="overflow-auto">
                                <table className="table-auto w-full mb-5">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th rowSpan="2" className="border px-4 py-2 text-sm">No.</th>
                                            <th rowSpan="2" className="border px-4 py-2 text-sm">Tujuan Pembelajaran</th>
                                            <th colSpan="3" className="border px-4 py-2 text-sm">Hasil Pengamatan</th>
                                            {/* <th rowSpan="2" className="border px-4 py-2 text-sm">Foto</th> */}
                                        </tr>
                                        <tr className="bg-gray-100">
                                            <th className="border px-4 py-2 text-sm">Indikator</th>
                                            <th className="border px-4 py-2 text-sm">Skala</th>
                                            <th className="border px-4 py-2 text-sm">Catatan</th>
                                            {/* <th className="border px-4 py-2 text-sm">Foto</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { penilaian.map((dt1, index) => ( 
                                        <tr key={ index }>
                                            <td className="border px-4 py-2 text-sm align-top">{ index + 1 }</td>
                                            <td className="border px-4 py-2 text-sm align-top">{ dt1.nama_elemen }</td>
                                            <td className="border px-4 py-2 text-sm align-top">{ dt1.nama }</td>
                                            <td className="border px-4 py-2 w-48 align-top">
                                                <input
                                                    type="hidden"
                                                    className="w-full px-4 py-2 mb-2"
                                                    name="id_indikator"
                                                    // onChange={handleChangeIndikator}
                                                    key={dt1.id}
                                                    value={dt1.id}
                                                />

                                                <select 
                                                id={dt1.id}
                                                name="muncul" 
                                                required 
                                                className="w-full px-4 py-2" 
                                                // onChange={handleChangeMuncul}
                                                onChange={e => handleSelectChange(index, e)}
                                                >
                                                <option value="">-Pilih-</option>
                                                {/* {metodes.map(({ id, nama }) => (
                                                    <option value={id}>{nama}</option>
                                                ))} */}
                                                {metodes.map(({ id, nama }) => {
                                                
                                                    if (dt1.muncul == id){
                                                        return <option value={id} selected>{nama}</option>
                                                    }

                                                    return <option value={id}>{nama}</option>
                                                    }
                                                )}
                                                </select></td>
                                            <td className="border px-4 py-2 w-96"><textarea
                                                id={dt1.id}
                                                name="catatan"
                                                placeholder='Catatan'
                                                required
                                                rows={5}
                                                // onChange={handleChangeCatatan}
                                                defaultValue={dt1.catatan}
                                                onChange={e => handleInputChange(index, e)}
                                                className="w-full px-4 py-2"
                                            /></td>
                                            {/* <td className="border px-4 py-2 w-60"><input
                                                id="file-upload"
                                                type="file"
                                                className="w-full px-4 py-2"
                                                label="Foto"
                                                name="foto"
                                                onChange={(e) =>
                                                    setData("foto", e.target.files[0])
                                                }
                                            /></td> */}
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>


                                <div className="flex flex-col">
                                    <div className="w-1/2">

                                    

                                    {/* { penilaian.map((dt1) => ( 
                                    <div className="overflow-auto">
                                        <table className="table-auto w-full mb-5">
                                            <tr>
                                                <td className="border px-4 py-2 bg-gray-100"><b>{ dt1.nama }</b></td>
                                            </tr>
                                            <tbody>
                                                {dt1.subdimensi.map((dt2) => (
                                                    <tr>
                                                        <td className="border px-4 py-2 text-sm align-top">
                                                            <ul className="list-disc">
                                                                <li className="ml-4"><b>{ dt2.kode }</b><br />{ dt2.nama }</li>
                                                            </ul>
                                                            
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    ))} */}

                                    </div>
                                </div>
                                    
                                
                                    {/* {penilaian.map(({ id, nama }) => (
                                    <div className='border-t-2 pt-4'>
                                        <b>{nama}</b>
                                        <div className="mb-4">
                                            <label className="">Muncul</label>
                                            <select name="muncul" className="w-full px-4 py-2" onChange={(e) =>
                                                    setData("muncul", e.target.value)
                                                }>
                                                <option value="">-Pilih Penilaian-</option>
                                                
                                            </select>
                                            <span className="text-red-600">
                                                {errors.muncul}
                                            </span>
                                        </div>
                                        <div className="mb-4">
                                            <label className="">Catatan</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2"
                                                label="Catatan"
                                                name="catatan"
                                                value={data.catatan}
                                                onChange={(e) =>
                                                    setData("catatan", e.target.value)
                                                }
                                            />
                                            <span className="text-red-600">
                                                {errors.catatan}
                                            </span>
                                        </div>

                                        <div className="mb-4">
                                            <label className="">Foto</label>
                                            <input
                                                id="file-upload"
                                                type="file"
                                                className="w-full px-4 py-2"
                                                label="Foto"
                                                name="foto"
                                                onChange={(e) =>
                                                    setData("foto", e.target.files[0])
                                                }
                                            />
                                            <span className="text-red-600">
                                                {errors.foto}
                                            </span>
                                        </div>

                                    </div>
                                    ))} */}

                                    
                                </div>
                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 text-white bg-green-500 rounded"
                                    >
                                        Simpan
                                    </button> <Link
                                            className="px-6 py-2 text-white bg-orange-500 rounded focus:outline-none"
                                            href={ route("penilaian-harian.index") }
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
