// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FrontLayout from '@/Layouts/FrontLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, Link } from '@inertiajs/react';

export default function Testimonial() {
  
  return (
      <FrontLayout
          header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Testimonial</h2>}
      >
          <Head title="Testimonial" />

          <div class="container my-24 mx-auto md:px-6">
  
  <section class="mb-32 text-center">
    <h2 class="mb-12 text-3xl font-bold">Testimonials</h2>

    <div class="grid gap-x-6 md:grid-cols-3 xl:gap-x-12">
      <div class="mb-6 lg:mb-0">
        <div
          class="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
          
          <div class="p-6">
            <h5 class="mb-2 text-lg font-bold">Halley Frank</h5>
            <h6 class="mb-4 font-medium text-primary dark:text-primary-400">
              Marketing Specialist
            </h6>
            <ul class="mb-6 flex justify-center">
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" class="w-5 text-warning">
                  <path fill="currentColor"
                    d="m233 976 65-281L80 506l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
                </svg>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" class="w-5 text-warning">
                  <path fill="currentColor"
                    d="m233 976 65-281L80 506l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
                </svg>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" class="w-5 text-warning">
                  <path fill="currentColor"
                    d="m233 976 65-281L80 506l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
                </svg>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" class="w-5 text-warning">
                  <path fill="currentColor"
                    d="m233 976 65-281L80 506l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
                </svg>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" class="w-5 text-warning">
                  <path fill="currentColor"
                    d="m480 757 157 95-42-178 138-120-182-16-71-168v387ZM233 976l65-281L80 506l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
                </svg>
              </li>
            </ul>
            <p>
              At vero eos et accusamus et iusto odio dignissimos ducimus qui
              blanditiis praesentium accusamus voluptatum deleniti atque
              corrupti.
            </p>
          </div>
        </div>
      </div>

      <div class="mb-6 lg:mb-0">
        <div
          class="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
          <div class="p-6">
            <h5 class="mb-2 text-lg font-bold">John Doe</h5>
            <h6 class="mb-4 font-medium text-primary dark:text-primary-400">
              Web Developer
            </h6>
            <ul class="mb-6 flex justify-center">
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" class="w-5 text-warning">
                  <path fill="currentColor"
                    d="m233 976 65-281L80 506l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
                </svg>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" class="w-5 text-warning">
                  <path fill="currentColor"
                    d="m233 976 65-281L80 506l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
                </svg>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" class="w-5 text-warning">
                  <path fill="currentColor"
                    d="m233 976 65-281L80 506l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
                </svg>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" class="w-5 text-warning">
                  <path fill="currentColor"
                    d="m233 976 65-281L80 506l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
                </svg>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" class="w-5 text-warning">
                  <path fill="currentColor"
                    d="m233 976 65-281L80 506l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
                </svg>
              </li>
            </ul>
            <p>
              Ut pretium ultricies dignissim. Sed sit amet mi eget urna
              placerat vulputate. Ut vulputate est non quam dignissim
              elementum. Donec a ullamcorper diam.
            </p>
          </div>
        </div>
      </div>
      

      <div class="">
        <div
          class="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
          
          <div class="p-6">
            <h5 class="mb-2 text-lg font-bold">Lisa Trey</h5>
            <h6 class="mb-4 font-medium text-primary dark:text-primary-400">
              Public Relations
            </h6>
            <ul class="mb-6 flex justify-center">
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" class="w-5 text-warning">
                  <path fill="currentColor"
                    d="m233 976 65-281L80 506l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
                </svg>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" class="w-5 text-warning">
                  <path fill="currentColor"
                    d="m233 976 65-281L80 506l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
                </svg>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" class="w-5 text-warning">
                  <path fill="currentColor"
                    d="m233 976 65-281L80 506l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
                </svg>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" class="w-5 text-warning">
                  <path fill="currentColor"
                    d="m233 976 65-281L80 506l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
                </svg>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" class="w-5 text-warning">
                  <path fill="currentColor"
                    d="m323 851 157-94 157 95-42-178 138-120-182-16-71-168-71 167-182 16 138 120-42 178Zm-90 125 65-281L80 506l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-355Z" />
                </svg>
              </li>
            </ul>
            <p>
              Enim ad minima veniam, quis nostrum exercitationem ullam
              corporis suscipit laboriosam, nisi ut aliquid commodi quis
              nostrum minima.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  
</div>

          {/* “Si Pendi sangat bermanfaat bagi pendidik. Dengan adanya Si Pendi, ini sangat membantu pendidik dalam penyimpanan dokumen tentang perkembangan anak. Good Luck PP Jateng. You Are is The Best!”<br />
Army<br />
BP PAUD DIKMAS RIAU<br /><br />


“Alhamdulillah dengan model SiPendi Online sangat memudahkan dan membantu guru memasukkan serta merekap penilaian. Waktu yang dibutuhkan relatif efisien dan fleksible dibandingkan dengan tehnik penilaian manual. Dengan modul penilaian SiPendi, hasil nilai langsung terlihat dan ini sangat memudahkan guru dalam merekap dan membuat narasi penilaian akhir semester. Dan tentu saja ini juga memudahkan Kepala Sekolah dalam melakukan supervisi.”<br />
KB & TKAT Bintangku<br />
Surakarta<br /><br />

“Terima kasih, saya merasa SIPENDI ini sangat berguna untuk TK dan PAUD, dengan sistem seperti ini, pencatatan penilaian jadi terpusat dan sama rata (tidak mengganti-ganti lay out penilaian jika suatu saat dibutuhkan oleh diknas atau akreditasi mengingat sekolah SPK banyak yang mempunyai layout penilaian sendiri). Juga saya sangat berterima kasih berkat SIPENDI, kita ikut berpartisipasi dalam eco-green life style.”<br />
The Independent School Batam<br />
The Independent School Batam<br /><br />


“Saya mengucapkan banyak terima kasih atas pembelajaran aplikasi penilaian Si Pendi, bertambah pengetahuan dalam pengisian nilai harian dan menjadi lebih cepat dalam membuat laporan.”<br />
Montessori School<br />
Jakarta Montessori School<br /><br />

“SIPENDI sangat membantu dalam penilaian anak-anak dengan perkembangannya.”<br />
New Zealand School<br />
Jl. Kemang Selatan 1/1A Jakarta<br /><br />

“Dengan adanya SIPENDI mempermudah guru untuk membuat penilaian terhadap anak. Dapat memotivasi guru meningkatkan penggunaan tentang IPTEK. Terima kasih kepada Bapak Waluyo yang telah mensosialisakan SIPENDI dengan baik.”<br />
Sekolah Kallista<br />
Jl. Engku Putri Komp. Costarica */}


      </FrontLayout>
  );
}