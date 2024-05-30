// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect } from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';

export default function Create({ auth, kelompok_usia }) {
  
    // const { data, setData, errors, post } = useForm({
    //     id_elemen: "",
    //     id_kelompok_usia: "",
    //     nama: "",
    //     // fullName: [],
    //     nama2: "",
    // });

    const { data, setData, post, errors, progress } = useForm({
        nama2: "",
        _method: 'POST'
    });

    const [country, setCountry]= useState([]);
    const [countryid, setCountryid]=useState(0);
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
  
    function handleSubmitx(e) {
        e.preventDefault();
        post(route("indikator.store"));
    }


//     const [inputFields, setInputFields] = useState([{
//         fullName:'',
//         emailAddress:'',
//         salary:''  
//     } ]);
 
//     const addInputField = ()=>{
//         setInputFields([...inputFields, {
//             fullName:'',
//             emailAddress:'',
//             salary:''  
//         } ])
      
//     }
//     const removeInputFields = (index)=>{
//         const rows = [...inputFields];
//         rows.splice(index, 1);
//         setInputFields(rows);
//    }
//    const handleChange = (index, evnt)=>{
    
//     const { name, value } = evnt.target;
//     const list = [...inputFields];
//     list[index][name] = value;
//     setInputFields(list);
    
 
 
// }


    const [formValues, setFormValues] = useState([{ name: "", email : ""}])

    let handleChange = (i, e) => {
        let newFormValues = [...formValues];
        newFormValues[i][e.target.name] = e.target.value;
        setFormValues(newFormValues);
      }
    
    let addFormFields = () => {
        setFormValues([...formValues, { name: "", email: "" }])
      }
    
    let removeFormFields = (i) => {
        let newFormValues = [...formValues];
        newFormValues.splice(i, 1);
        setFormValues(newFormValues)
    }
    
    let handleSubmit = (event) => {
        event.preventDefault();
        console.log(formValues);
        // alert(JSON.stringify(formValues));
        // post(route("indikator.store"));
        router.post(route("indikator.store"), {
            nama2: formValues,
            _method: 'POST',
        });
    }

  
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah Indikator</h2>}
        >
            <Head title="Indikator" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Tambah Indikator</h1>
  
                            {/* <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
                                    href={ route("indikator.index") }
                                >
                                    Kembali
                                </Link>
                            </div> */}
  
                            <form name="createForm" onSubmit={handleSubmit}>
                                <div className="flex flex-col">
                                    <div className="mb-4">
                                        <label className="">Dimensi <span className='text-red-600'>*</span></label>
                                        <select name="id_dimensi" required 
                                        className="w-full px-4 py-2 text-sm" 
                                        onChange={(e)=>handlecountry(e)}>
                                            <option value="">-Pilih Dimensi-</option>
                                            {
                                                    country.map( (getcon, index)=>(
                                                        <option key={index} value={getcon.id}>{getcon.nama } </option>
                                                    ))
                                                }
                                        </select>
                                        <span className="text-red-600">
                                            {errors.id_dimensi}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Elemen <span className='text-red-600'>*</span></label>
                                        <select name="id_elemen" required 
                                        className="w-full px-4 py-2 text-sm" onChange={(e) =>
                                            setData("id_elemen", e.target.value)
                                        }>
                                            <option value="">-Pilih Elemen-</option>
                                            {
                                                city.map( (gcity, index)=>(
                                                <option key={index} value={gcity.id}> { gcity.nama} </option>
                                                ))
                                            }
                                        </select>
                                        <span className="text-red-600">
                                            {errors.id_elemen}
                                        </span>
                                    </div>

                                    {kelompok_usia.map((dt, index) => (
                                    <div className="mb-4">
                                        <label className="">{dt.nama}</label>
                                        {/* <input
                                            type="hidden"
                                            name="id_kelompok_usia[]"
                                            value={dt.id}
                                            onChange={(e) =>
                                                setData("id_kelompok_usia"+dt.id, e.target.value)
                                            }
                                        /> */}
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nama Indikator"
                                            name="nama[]"
                                            placeholder="Nama Indikator"
                                            onChange={(e) =>
                                                setData("nama", e.target.value)
                                            }
                                        />
                                        
                                    </div>
                                    ))}
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






                                {/* <div className="container">
            <div className="row">
                <div className="col-sm-8">
                  {
                      inputFields.map((data, index)=>{
                          const {fullName, emailAddress, salary}= data;
                          return(
                            <div className="row my-3" key={index}>
                    <div className="col">
                    <div className="form-group">
                    <input type="text" onChange={(evnt)=>handleChange(index, evnt)} value={fullName} name="fullName" className="form-control"  placeholder="Full Name" />
                    </div>
                    </div>
                    <div className="col">
                    <input type="email" onChange={(evnt)=>handleChange(index, evnt)} value={emailAddress} name="emailAddress" className="form-control" placeholder="Email Address" />
                    </div>
                    <div className="col">
                    <input type="text" onChange={(evnt)=>handleChange(index, evnt)} value={salary} name="salary" className="form-control" placeholder="Salary" />
                    </div>
                    <div className="col">
                
                
                 {(inputFields.length!==1)? <a className="btn btn-outline-danger" onClick={removeInputFields}>Remove</a>:''}
                  
                 
                    </div>
                  </div>
                          )
                      })
                  }
     
                <div className="row">
                    <div className="col-sm-12">
                    <a className="btn btn-outline-success " onClick={addInputField}>Add New</a>
                    </div>
                </div>
                  </div>
                </div>
                <div className="col-sm-4">
                </div>
            </div> */}




                            </form>




                            <form  onSubmit={handleSubmit}>
          {formValues.map((element, index) => (
            <div className="form-inline" key={index}>
              <label>Name</label>
              <input type="text" name="name" value={element.name || ""} onChange={e => handleChange(index, e)} />
              <label>Email</label>
              <input type="text" name="email" value={element.email || ""} onChange={e => handleChange(index, e)} />
              {
                index ? 
                  <button type="button"  className="button remove" onClick={() => removeFormFields(index)}>Remove</button> 
                : null
              }
            </div>
          ))}
          <div className="button-section">
              <button className="button add" type="button" onClick={() => addFormFields()}>Add</button>
              <button className="button submit" type="submit">Submit</button>
          </div>
      </form>





                            



  
                        </div>
                    </div>
                </div>
            {/* </div> */}
        </DashboardLayout>
    );
}
