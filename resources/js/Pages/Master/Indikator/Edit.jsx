// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect } from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Edit({ auth, props, kelompok_usia, indicators }) {
  
    const { indikator, flash } = usePage().props;

    const { data, setData, post, errors, progress } = useForm({
        id_dimensi: indikator.id_dimensi || "",
        id_elemen: indikator.id || "",
        nama: indikator.nama || "",
        nama_dimensi: indikator.nama_dimensi || "",
        data_indikator: "",
        edit_data_indikator: "",
        // nama_indikator_old: [],
        _method: 'PUT'
    });

    const [editElemen, setEditElemen] = useState(indikator.id);
    // const [editIndikator, setEditindikator] = useState([{ nama_indikator_old: []}]);
    // const [editIndikator, setEditindikator] = useState([{ nama_indikator_old: ""}])

    const [country, setCountry]= useState([]);
    const [countryid, setCountryid]=useState(indikator.id_dimensi);
    const [city, setCity]= useState([]);

    useEffect( ()=>{
        const getcountry= async()=>{
            const rescountry= await fetch("/datadimensi");
            const rescon= await rescountry.json();
            setCountry(await rescon);
        }
        getcountry();
    },[]);

    const handlecountry=(event)=>{
        const getcountryid= event.target.value;
        setCountryid(getcountryid);
    }

    useEffect( ()=>{
        const getcity= async()=>{   
            const rescity= await fetch(`/dataelemen/${countryid}`);
            const rcity= await rescity.json();
            setCity(await rcity);
        }
    getcity();
    },[countryid]);
  
    // function handleSubmit(e) {
    //     e.preventDefault();
    //     // put(route("indikator.update", indikator.id));
    //     router.post(route("indikator.store"), {
    //         data_indikator: formValues,
    //         _method: 'POST',
    //     });
    // }

    // const handleChangeKelompok = (e) => {
    //     let id = e.target.value;
    //     setData("id_kelompok_usia", [...data.id_kelompok_usia, id]);
    // };

    // const handleChange = (e) => {
    //     let id = e.target.value;
    //     setData("nama_indikator", [...data.nama_indikator, id]);
    // };

    // const handleChangeoldxxx = (e) => {
    //     let id = e.target.value;
    //     setData("nama_indikator_old", [...data.nama_indikator_old, id]);
    // };

    const [formValues, setFormValues] = useState([{ id_kelompok_usia: "", nama_indikator : ""}])

    const handleChange = (i, e) => {
        let newFormValues = [...formValues];
        newFormValues[i][e.target.name] = e.target.value;
        setFormValues(newFormValues);
    }
    
    const addFormFields = () => {
        setFormValues([...formValues, { id_kelompok_usia: "", nama_indikator: "" }])
    }
    
    const removeFormFields = (i) => {
        let newFormValues = [...formValues];
        newFormValues.splice(i, 1);
        setFormValues(newFormValues)
    }



    const [formData, setFormData] = useState(""); //[{nama_indikator_old : ""}]

    // const handleChangeoldxx = (index, e) => {
    //     setFormData({
    //         ...formData,
    //         [e.target.name]: e.target.value
    //     });
    // };

    // const [inputs, setInputs] = useState([{ value: '' }]);

    // const handleChangeold = (index, event) => {
    //     const values = [...inputs];
    //     values[index].value = event.target.value;
    //     setInputs(values);
    // };

    // const handleChangeoldx = (index, e) => {
    //     const values = [...formData];
    //     // values[index].value = e.target.value;
    //     values[index][e.target.name] = e.target.value;
    //     setFormData(values);
    // };
    
    const handleChangeold = (i, e) => {
        // console.log(e.target.value);
        // const newFormValues = [...formData];
        // newFormValues[i][e.target.name] = e.target.value;
        // setFormData(newFormValues);
        // const value = e.target.value;
        const helper = [...formData];
        helper[`${i}`] = e.target.id+'====='+e.target.value;
        setFormData(helper);
        // setFormData({
        //     ...formData,
        //     [e.target.name]: value
        // });
        // console.log(helper);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        // console.log(editIndikator);
        Swal.fire({
            title: 'Simpan Data Indikator?',
            type: 'warning',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oke',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                router.post(`/indikator/${indikator.id}`, {
                    data_indikator: formValues,
                    edit_data_indikator: formData,
                    id_elemen: editElemen,
                    // nama_indikator_old: editIndikator,
                    // nama_indikator_old: [],
                    _method: 'PUT',
                });
            }
        });
    }

    const deleteData = (id) => {
        // if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
        //     Inertia.get(`/indikator/hapus-indikator/${id}`);
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
                router.get(`/indikator/hapus-indikator/${id}`);
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Indikator</h2>}
        >
            <Head title="Indikator" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Edit Indikator</h1>

                            {flash.message && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-5 rounded relative" role="alert">
                                <strong className="font-bold">Berhasil!</strong> &nbsp;<span className="block sm:inline">{flash.message}</span>
                              </div>
                            )}
  
                            {/* <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
                                    href={ route("indikator.index") }
                                >
                                    Kembali
                                </Link>
                            </div> */}

                            {/* <table className="table-auto w-full mb-5">
                                <tbody>
                                    <tr>
                                        <td className="border px-4 py-2 text-sm">Dimensi <b>{ data.nama_dimensi }</b></td>
                                        <td className="border px-4 py-2 text-sm">Elemen <b>{ data.nama }</b></td>
                                    </tr>
                                </tbody>
                            </table> */}

                            <table className="table-fixed w-full mb-5">
                                <tbody>
                                    <tr>
                                        <td className="border px-4 py-2 w-40">Dimensi</td>
                                        <td className="border px-4 py-2"><b>{data.nama_dimensi}</b></td>
                                    </tr>
                                    <tr>
                                        <td className="border px-4 py-2 w-40">Elemen</td>
                                        <td className="border px-4 py-2"><b>{data.nama}</b></td>
                                    </tr>
                                </tbody>
                            </table>
  
                            <form name="createForm" onSubmit={handleSubmit}>

                            <input
                                    type="hidden"
                                    name="id_elemen"
                                    value={editElemen}
                                    onChange={(e) =>
                                        setEditElemen(e.target.value)
                                    }
                                />

                                <div className="flex flex-col">
                                    {/* <div className="mb-4">
                                        <label className="">Dimensi <span className='text-red-600'>*</span></label>
                                        <select name="id_dimensi" readOnly required 
                                        className="w-full px-4 py-2" 
                                        onChange={(e)=>handlecountry(e)}>
                                            <option value="">-Pilih Dimensi-</option>
                                            {
                                                    // country.map( (getcon, index)=>(
                                                    //     <option key={index} value={getcon.id}>{getcon.nama } </option>
                                                    // ))
                                                    country.map(( {id, nama} ) => {
                                                        if (data.id_dimensi == id){
                                                            return <option value={id} selected>{nama}</option>
                                                        }
                                                        return <option value={id}>{nama}</option>
                                                        }
                                                    )
                                                }
                                        </select>
                                        <span className="text-red-600">
                                            {errors.id_dimensi}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Elemen <span className='text-red-600'>*</span></label>
                                        <select name="id_elemen" required 
                                        className="w-full px-4 py-2" onChange={(e) =>
                                                setEditElemen(e.target.value)
                                        }>
                                            <option value="">-Pilih Elemen-</option>
                                            {
                                                // city.map( (gcity, index)=>(
                                                // <option key={index} value={gcity.id}> { gcity.nama} </option>
                                                // ))
                                                city.map(( {id, nama} ) => {
                                                    if (data.id_elemen == id){
                                                        return <option value={id} selected>{nama}</option>
                                                    }
                                                    return <option value={id}>{nama}</option>
                                                    }
                                                )
                                            }
                                        </select>
                                        <span className="text-red-600">
                                            {errors.id_elemen}
                                        </span>
                                    </div> */}


                                    <div className="mb-4">
                                        <div className="overflow-auto">    
                                            <table className="table-auto w-full mb-5">
                                                <thead>
                                                    <tr className="bg-gray-100">
                                                        <th className="border px-4 py-2 text-smv w-64">Kelompok Usia</th>
                                                        <th className="border px-4 py-2 text-sm">Indikator</th>
                                                        <th className="border px-4 py-2 text-sm w-40">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                {indicators.map((dt2,index) => (
                                                    <tr key={index}>
                                                        <td className="border px-4 py-2 text-sm">
                                                            {/* <select name="id_kelompok_usia" className="w-full px-4 py-2" onChange={e => handleChange(index, e)}>
                                                                <option value="">-Pilih Kelompok Usia-</option>
                                                                {kelompok_usia.map(({ id, nama }) => {
                                                
                                                                    if (dt2.id_kelompok_usia == id){
                                                                        return <option value={id} selected>{nama}</option>
                                                                    }

                                                                    return <option value={id}>{nama}</option>
                                                                }
                                                                )}
                                                            </select> */}
                                                            {dt2.kelompok_usia}
                                                        </td>
                                                        <td className="border px-4 py-2 text-sm">
                                                            <input
                                                                type="text"
                                                                className="w-full px-4 py-2"
                                                                label="Indikator"
                                                                name="nama_indikator_old"
                                                                defaultValue={dt2.nama}
                                                                id={dt2.id}
                                                                onChange={e => handleChangeold(index, e)}
                                                            />
                                                        </td>
                                                        <td className="border px-4 py-2 text-sm">
                                                            <a
                                                                style={{ cursor: 'pointer' }}
                                                                tabIndex="1"
                                                                className="px-4 py-2 text-sm text-white bg-red-500 rounded"
                                                                onClick={ () => deleteData(dt2.id) }
                                                            >
                                                                Hapus
                                                            </a>
                                                        </td> 
                                                    </tr>
                                                ))}

                                                {formValues.map((element, index) => (
                                                    <tr key={index}>
                                                        <td className="border px-4 py-2 text-sm">
                                                            <select name="id_kelompok_usia" className="w-full px-4 py-2" onChange={e => handleChange(index, e)}>
                                                                <option value="">-Pilih Kelompok Usia-</option>
                                                                {kelompok_usia.map(({ id, nama }) => {
                                                
                                                                    if (element.id_kelompok_usia == id){
                                                                        return <option value={id} selected>{nama}</option>
                                                                    }

                                                                    return <option value={id}>{nama}</option>
                                                                }
                                                                )}
                                                            </select>
                                                        </td>
                                                        <td className="border px-4 py-2 text-sm">
                                                            <input
                                                                type="text"
                                                                className="w-full px-4 py-2"
                                                                label="Indikator"
                                                                name="nama_indikator"
                                                                onChange={e => handleChange(index, e)}
                                                            />
                                                        </td>
                                                        <td className="border px-4 py-2 text-sm">
                                                        { index ? <button type="button"  className="px-6 py-2 text-white bg-red-500 rounded-md focus:outline-none" onClick={() => removeFormFields(index)}>Hapus</button> : '' }
                                                        </td> 
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>

                                            <div className="flex items-center justify-between mb-6">
                                                <button className="px-6 py-2 text-white bg-blue-500 rounded-md focus:outline-none" type="button" onClick={() => addFormFields()}>Tambah Indikator</button>
                                            </div>

                                        </div>    
                                    </div>

                                    {/* {kelompok_usia.map((dt, index) => (
                                    <div className="mb-4" key={index}>
                                        <label className="">Indikator Kelompok Usia {dt.nama}</label>
                                        <input
                                            type="hidden"
                                            name="id_kelompok_usia[]"
                                            id={`id_kelompok_usia${dt.id}`}
                                            value={dt.id}
                                            onChange={handleChangeKelompok}
                                        />
                                        <input
                                            type="hidden"
                                            className="w-full px-4 py-2 mb-2"
                                            name="id_kelompok_usia[]"
                                            onChange={handleChangeKelompok}
                                            key={dt.id}
                                            value={dt.id}
                                        />

                                        {dt.indikator.map((dt2) => (
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 mb-2"
                                            label="Nama Indikator"
                                            name="nama_indikator_old[]"
                                            value={dt2.nama}
                                            placeholder="Nama Indikator"
                                            onChange={handleChangeold}
                                        />
                                        ))}
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 mb-2"
                                            label="Nama Indikator"
                                            name="nama_indikator[]"
                                            placeholder="Nama Indikator"
                                            onChange={handleChange}
                                        />
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
                                            href={ route("indikator.index") }
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
