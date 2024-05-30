// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, useForm, Link } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Create({ auth, permission }) {
  
    const { data, setData, errors, post } = useForm({
        name: "",
        guard_name: "",
    });
  
    function handleSubmit(e) {
        e.preventDefault();
        Swal.fire({
            title: 'Simpan Data Roles?',
            type: 'warning',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oke',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                post(route("roles.store"));
            }
        });
    }

    const handleChange = (e) => {
        let id = e.target.value;
        if (e.target.checked) {
            setData("permission", [...data.permission, id]);
        } else {
            setData(
                "permission",
                data.permission.filter((item) => {
                    return item !== id;
                })
            );
        }
    };

    const selectedData = (id_role, id_permission) => {
        // if (confirm("Are you sure you want to verified this data?")) {
            Inertia.get(`/roles/pilih-permission/${id_role}/${id_permission}`);
        // }
    }
  
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah Roles</h2>}
        >
            <Head title="Roles" />
  
            {/* <div className="py-12"> */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <h1 className="text-2xl mb-5">Tambah Roles</h1>
  
                            {/* <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
                                    href={ route("roles.index") }
                                >
                                    Kembali
                                </Link>
                            </div> */}
  
                            <form name="createForm" onSubmit={handleSubmit}>
                                <div className="flex flex-col">
                                    <div className="mb-4">
                                        <label className="">Nama Role</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nama Role"
                                            name="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.name}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label className="">Nama Guard</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2"
                                            label="Nama Guard"
                                            name="guard_name"
                                            value={data.guard_name}
                                            onChange={(e) =>
                                                setData("guard_name", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.guard_name}
                                        </span>
                                    </div>

                                    <div className="mb-0">
                                        <label className="">Permission</label>
                                        {permission.map(({ id, name }) => (
                                        <div className="">
                                            <input type="checkbox" 
                                            name="permission[]" 
                                            id={`permission${id}`}
                                            value={id}
                                            onClick={ () => selectedData(data.id_role, id) }
                                            ></input> {name}
                                            
                                        </div>
                                        ))}
                                        {/* <select name="permission[]" multiple className="w-full px-4 py-2" onChange={(e) =>
                                                setData("permission", e.target.value)
                                            }>
                                            
                                            {permission.map(({ id, name }) => (
                                                <option value={id}>{name}</option>
                                            ))}
                                        </select> */}
                                        <span className="text-red-600">
                                            {errors.permission}
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
                                            href={ route("roles.index") }
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
