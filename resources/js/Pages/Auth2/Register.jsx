import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>






                <div className="mt-4 mb-4">
                    <label className="">Status Sekolah</label>
                    <select name="status_sekolah" className="w-full px-4 py-2" onChange={(e) =>
                            setData("status_sekolah", e.target.value)
                        }>
                        <option value="">-Pilih Status Sekolah-</option>
                        <option value="1">Negeri</option>
                        <option value="2">Swasta</option>
                    </select>
                    <span className="text-red-600">
                        {errors.status_sekolah}
                    </span>
                </div>
                <div className="mb-4">
                    <label className="">NPSN</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2"
                        label="NPSN"
                        name="npsn"
                        value={data.npsn}
                        onChange={(e) =>
                            setData("npsn", e.target.value)
                        }
                    />
                    <span className="text-red-600">
                        {errors.npsn}
                    </span>
                </div>


                <div className="mb-4">
                    <label className="">Alamat</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2"
                        label="Alamat"
                        name="alamat"
                        value={data.alamat}
                        onChange={(e) =>
                            setData("alamat", e.target.value)
                        }
                    />
                    <span className="text-red-600">
                        {errors.alamat}
                    </span>
                </div>
                
                <div className="mb-4">
                    <label className="">Nomer Telpon</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2"
                        label="Nomer Telpon"
                        name="no_telpon"
                        value={data.no_telpon}
                        onChange={(e) =>
                            setData("no_telpon", e.target.value)
                        }
                    />
                    <span className="text-red-600">
                        {errors.no_telpon}
                    </span>
                </div>
                <div className="mb-4">
                    <label className="">SK Pendirian Sekolah</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2"
                        label="SK Pendirian Sekolah"
                        name="sk_pendirian_sekolah"
                        value={data.sk_pendirian_sekolah}
                        onChange={(e) =>
                            setData("sk_pendirian_sekolah", e.target.value)
                        }
                    />
                    <span className="text-red-600">
                        {errors.sk_pendirian_sekolah}
                    </span>
                </div>






                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />

                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link
                        href={route('login')}
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
