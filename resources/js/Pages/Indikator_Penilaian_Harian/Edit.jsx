// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import { Accordion, AccordionItem } from '@szhsin/react-accordion';
import chevron from "./chevron-down.svg";
import styles from "./styles.module.css";
import Swal from 'sweetalert2';

export default function Edit({ auth, props, id_kelompok, kelompok, indikator, tanggal_penilaian, id_setting, format_tanggal_penilaian }) {
  
    const { data, setData, put, errors } = useForm({
        nama: kelompok.nama || "",
        kelompok_usia: kelompok.kelompok_usia || "",
        id_kelompok: id_kelompok,
        tanggal_penilaian: tanggal_penilaian,
        indicator: [],
    });
  
    function handleSubmit(e) {
        e.preventDefault();
        Swal.fire({
            title: 'Simpan Data Indikator Penilaian Harian?',
            type: 'warning',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oke',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                put(route("indikator-penilaian-harian.update", id_kelompok+"-"+tanggal_penilaian));
            }
        });
    }

    const handleChange = (e) => {
        let id = e.target.value;
        if (e.target.checked) {
            setData("indicator", [...data.indicator, id]);
        } else {
            setData(
                "indicator",
                data.indicator.filter((item) => {
                    return item !== id;
                })
            );
        }
    };

    const handleChangexxx = (e) => {
        setData(
            e.target.name,
            e.target.type === "checkbox" ? e.target.checked : e.target.value
        );
    };

    const selectedData = (id_kelompok, tanggal_penilaian, id_indikator, status, id_setting) => {
        // if (confirm("Are you sure you want to verified this data?")) {
            Inertia.get(`/indikator-penilaian-harian/pilih-indikator/${id_kelompok}/${tanggal_penilaian}/${id_indikator}/${status}/${id_setting}`);
        // }
    }
    
  
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Indikator Penilaian Harian</h2>}
        >
            <Head title="Indikator Penilaian Harian" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Setting Indikator Penilaian Harian</h1>
  
                            {/* <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
                                    href={ route("indikator-penilaian-harian.index") }
                                >
                                    Kembali
                                </Link>
                            </div> */}

                            {/* <table className="table-auto w-full mb-5">
                                <tbody>
                                    <tr>
                                        <td className="border px-4 py-2 text-sm">Kelompok <b>{ data.nama }</b> ({ data.kelompok_usia })</td>
                                        <td className="border px-4 py-2 text-sm w-64"><b>{ format_tanggal_penilaian }</b></td>
                                    </tr>
                                </tbody>
                            </table> */}

                            <table className="table-fixed w-full mb-5">
                                <tbody>
                                    <tr>
                                        <td className="border px-4 py-2 w-40">Kelompok</td>
                                        <td className="border px-4 py-2"><b>{data.nama}</b> ({ data.kelompok_usia })</td>
                                    </tr>
                                    <tr>
                                        <td className="border px-4 py-2 w-40">Hari / Tanggal</td>
                                        <td className="border px-4 py-2"><b>{format_tanggal_penilaian}</b></td>
                                    </tr>
                                </tbody>
                            </table>
  
                            <form name="createForm" onSubmit={handleSubmit}>
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
                                    <div className="w-full sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/4">

                                    {/* {indikator.map((dt1) => ( 
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
                                                            
                                                            <div className='ml-4 font-bold'>Indikator:</div>
                                                            <ul>
                                                                {dt2.indikator.map((dt3) => (
                                                                <li className="ml-4 mt-1"><input type="checkbox" 
                                                                name="indicator[]" 
                                                                id={`indicator${dt3.id}`}
                                                                value={dt3.id}
                                                                defaultChecked={ (dt3.ceked == 1) ? true : false }
                                                                // checked={ (dt3.ceked == 1) ? true : '' }
                                                                // onChange={handleChange}
                                                                onClick={ () => selectedData(id_kelompok, tanggal_penilaian, dt3.id, dt3.ceked, id_setting) }
                                                                ></input> { dt3.nama }</li>
                                                                ))}
                                                            </ul>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    ))} */}


                                    {/* <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"/>
</svg> */}

{/* className="border" contentProps={{
                                        className: "transition-height duration-200 ease-out"
                                        }}
                                        panelProps={{ className: "p-2" }} <div className="relative"><img
          className="ml-auto transition-transform duration-200 ease-out"
          src={chevron}
          alt="Chevron"
        /></div> */}

                                    <Accordion allowMultiple>
                                        {indikator.map((dt1) => ( 
                                        <AccordionItem 
                                        header={
                                            <>
                                              {dt1.nama}
                                              <img className={styles.chevron} src={chevron} alt="Chevron Down" />
                                            </>
                                          } 
                                        className={styles.item}
                                        buttonProps={{
                                            className: ({ isEnter }) =>
                                              `${styles.itemBtn} ${isEnter && styles.itemBtnExpanded}`,
                                          }}
                                        contentProps={{ className: styles.itemContent }}
                                        panelProps={{ className: styles.itemPanel }}>


                                            
                                            <div className="overflow-auto">    
                                                <table className="table-auto w-full mb-5">
                                                    <tbody>
                                                    {dt1.subdimensi.map((dt2) => (
                                                        <tr>
                                                            <td className="border-b px-4 py-2 text-sm align-top">
                                                                <ul className="list-disc">
                                                                    <li className="ml-4"><b>{ dt2.kode }</b><br />{ dt2.nama }</li>
                                                                </ul>
                                                                <div className='ml-4 font-bold'>Indikator:</div>
                                                                <ul>
                                                                    {dt2.indikator.map((dt3) => (
                                                                    <li className="ml-4 mt-1"><input type="checkbox" 
                                                                    name="indicator[]" 
                                                                    id={`indicator${dt3.id}`}
                                                                    value={dt3.id}
                                                                    defaultChecked={ (dt3.ceked == 1) ? true : false }
                                                                    // checked={ (dt3.ceked == 1) ? true : '' }
                                                                    // onChange={handleChange}
                                                                    onClick={ () => selectedData(id_kelompok, tanggal_penilaian, dt3.id, dt3.ceked, id_setting) }
                                                                    ></input> { dt3.nama }</li>
                                                                    ))}
                                                                </ul>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                        </AccordionItem>
                                        ))}
                                    </Accordion>

    {/* <div className={styles.accordion}>
        <Accordion transition transitionTimeout={250}>
          <AccordionItem header="What is Lorem Ipsum?" initialEntered>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </AccordionItem>

          <AccordionItem header="Where does it come from?">
            Quisque eget luctus mi, vehicula mollis lorem. Proin fringilla vel
            erat quis sodales. Nam ex enim, eleifend venenatis lectus vitae.
          </AccordionItem>

          <AccordionItem header="Why do we use it?">
            Suspendisse massa risus, pretium id interdum in, dictum sit amet
            ante. Fusce vulputate purus sed tempus feugiat.
          </AccordionItem>
        </Accordion>
      </div> */}



                                    {/* {indikator.map(({ id, nama }) => (
                                    <div className="mb-4">
                                        <input type="checkbox" 
                                        name="indicator[]" 
                                        id={`indicator${id}`}
                                        value={id}
                                        onChange={handleChange}
                                        ></input> {nama}
                                        
                                    </div>
                                    ))} */}
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
                                            href={ route("indikator-penilaian-harian.index") }
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
