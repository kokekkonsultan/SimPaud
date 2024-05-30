// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect } from 'react';
import FrontLayout from '@/Layouts/FrontLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Konfirmasi({ status, message }) {
  
  return (
      <FrontLayout
          header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Konfirmasi</h2>}
      >
          <Head title="Konfirmasi" />

          
          <div class="container my-24 mx-auto md:px-6">
  <section class="mb-32">
    <div class="flex flex-wrap">
      <div class="mb-10 w-full shrink-0 grow-0 basis-auto md:mb-0 md:w-6/12 md:px-3 lg:px-6">
        <h2 class="mb-6 text-3xl font-bold">Konfirmasi { status }</h2>
        <img src="/img/site/logo/sipendi-logo-2.png" className="w-3/4" alt="Sipendi logo" />
      </div>
      <div class="mb-12 w-full shrink-0 grow-0 basis-auto md:mb-0 md:w-6/12 md:px-3 lg:px-6">
      { message }
      </div>
    </div>
  </section>
</div>


      </FrontLayout>
  );
}