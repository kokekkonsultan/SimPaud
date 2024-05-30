// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FrontLayout from '@/Layouts/FrontLayout';
import { Inertia } from "@inertiajs/inertia";
import { Head, Link } from '@inertiajs/react';

export default function Tentang() {
  
  return (
      <FrontLayout
          header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tentang Kurikulum Merdeka</h2>}
      >
          <Head title="Tentang Kurikulum Merdeka" />

          <div class="container my-24 mx-auto md:px-6">
  <section class="mb-32">
    <h2 class="mb-16 text-center text-2xl font-bold">Tentang Kurikulum Merdeka</h2>

    <div class="mb-16 flex flex-wrap">
      <div class="mb-6 w-full shrink-0 grow-0 basis-auto lg:mb-0 lg:w-6/12 lg:pr-6">
        <div
          class="ripple relative overflow-hidden rounded-lg bg-cover bg-[50%] bg-no-repeat shadow-lg dark:shadow-black/20"
          data-te-ripple-init data-te-ripple-color="light">
          <img src="https://mdbcdn.b-cdn.net/img/new/standard/city/028.jpg" class="w-full" alt="Louvre" />
          <a href="#!">
            <div
              class="absolute top-0 right-0 bottom-0 left-0 h-full w-full overflow-hidden bg-[hsl(0,0%,98.4%,0.2)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100">
            </div>
          </a>
        </div>
      </div>

      <div class="w-full shrink-0 grow-0 basis-auto lg:w-6/12 lg:pl-6">
        <h3 class="mb-4 text-2xl font-bold">Kurikulum Merdeka</h3>
        {/* <div class="mb-4 flex items-center text-sm font-medium text-danger dark:text-danger-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
            stroke="currentColor" class="mr-2 h-5 w-5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
          </svg>
          Travels
        </div> */}
        {/* <p class="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
          Published <u>14.01.2022</u> by
          <a href="#!">Lisa McCartney</a>
        </p> */}
        <p class="mb-6 text-neutral-500 dark:text-neutral-300">
        Kurikulum Merdeka adalah kurikulum dengan pembelajaran intrakurikuler yang beragam di mana konten akan lebih optimal agar peserta didik memiliki cukup waktu untuk mendalami konsep dan menguatkan kompetensi. Guru memiliki keleluasaan untuk memilih berbagai perangkat ajar sehingga pembelajaran dapat disesuaikan dengan kebutuhan belajar dan minat peserta didik.
<br /><br />
Kurikulum Merdeka memberikan keleluasaan kepada pendidik untuk menciptakan pembelajaran berkualitas yang sesuai dengan kebutuhan dan lingkungan belajar peserta didik.
        </p>
      </div>
    </div>

  </section>
</div>


      </FrontLayout>
  );
}