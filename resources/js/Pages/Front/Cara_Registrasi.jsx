// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FrontLayout from '@/Layouts/FrontLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, Link } from '@inertiajs/react';

export default function Registrasi() {
  
  return (
      <FrontLayout
          header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Cara Registrasi</h2>}
      >
          <Head title="Cara Registrasi" />

          
<div class="container my-24 mx-auto md:px-6">
  
  <section class="mb-32 text-center">
    <h2 class="mb-20 text-3xl font-bold">4 Cara mudah Registrasi SiPAUD</h2>

    <div class="grid lg:grid-cols-4 lg:gap-x-12">
      <div class="mb-12 lg:mb-0">
        <div
          class="block h-full rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
          <div class="flex justify-center">
            <div class="-mt-8 inline-block rounded-full bg-[hsl(204,30%,20%)] dark:bg-[hsl(204,23%,30%)] p-4 text-primary shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" class="h-7 w-7 text-white">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
              </svg>
            </div>
          </div>
          <div class="p-6">
            <h5 class="mb-4 text-lg font-semibold">Isi Form</h5>
            <p>
            Isi formulir registrasi.
            </p>
          </div>
        </div>
      </div>

      <div class="mb-12 lg:mb-0">
        <div
          class="block h-full rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
          <div class="flex justify-center">
            <div class="-mt-8 inline-block rounded-full bg-[hsl(204,30%,20%)] dark:bg-[hsl(204,23%,30%)] p-4 text-primary shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" class="h-7 w-7 text-white">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
          </div>
          <div class="p-6">
            <h5 class="mb-4 text-lg font-semibold">Konfirmasi Email</h5>
            <p>
            Klik tautan pada kotak masuk Email yang didaftarkan
            </p>
          </div>
        </div>
      </div>

      <div class="mb-12 lg:mb-0">
        <div
          class="block h-full rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
          <div class="flex justify-center">
            <div class="-mt-8 inline-block rounded-full bg-[hsl(204,30%,20%)] dark:bg-[hsl(204,23%,30%)] p-4 text-primary shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" class="h-7 w-7 text-white">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
          </div>
          <div class="p-6">
            <h5 class="mb-4 text-lg font-semibold">Verifikasi Admin</h5>
            <p>
            Admin SiPAUD akan meverifikasi data anda
            </p>
          </div>
        </div>
      </div>

      <div class="">
        <div
          class="block h-full rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
          <div class="flex justify-center">
            <div class="-mt-8 inline-block rounded-full bg-[hsl(204,30%,20%)] dark:bg-[hsl(204,23%,30%)] p-4 text-primary shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" class="h-7 w-7 text-white">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
            </div>
          </div>
          <div class="p-6">
            <h5 class="mb-4 text-lg font-semibold">Login</h5>
            <p>
            Setelah terverifikasi, login menggunakan akses yang dikirimkan ke Email
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>


      </FrontLayout>
  );
}