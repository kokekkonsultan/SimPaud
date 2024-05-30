// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FrontLayout from '@/Layouts/FrontLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, Link } from '@inertiajs/react';

export default function Home() {
  
  return (
      <FrontLayout
          header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Home</h2>}
      >
          <Head title="Home" />

          <section class="container mx-auto px-6 p-10">
            <h2 class="text-4xl font-bold text-center text-gray-800 mb-8">
            SiPAUD
            </h2>
            <div class="flex items-center flex-wrap mb-20">
              <div class="w-full md:w-1/2">
                <img src="img/site/logo/sipendi-logo-2.png" />
              </div>
              <div class="w-full md:w-1/2">
                <h4 class="text-3xl text-gray-800 font-bold mb-3">Mudahkan Proses Penilaian Harian Peserta Didik Anda</h4>
                <p class="text-gray-600 mb-8">Dengan fitur penilaian harian berdasarkan Kurikulum Merdeka, input nilai harian peseta didik menjadi lebih mudah. Tersedia juga fitur untuk mencatat perkembangan Emosi dan Jasmani</p>
              </div>
            </div>

          </section>

      </FrontLayout>
  );
}