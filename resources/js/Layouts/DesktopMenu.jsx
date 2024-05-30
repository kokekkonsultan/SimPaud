import React from 'react'
import { Fragment, useState } from 'react'
import sipaudLogo from '../assets/logo-sipaud.png'

import { Link } from '@inertiajs/react';
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const DesktopMenu = ({user, navigation}) => {

    const [openMenu, setOpenMenu] = useState(false)

    const aktif = () => {
        setOpenMenu(true)
      }

      const nonAktif = () => {
        setOpenMenu(false)
      }

  return (
    <>
         {/* Static sidebar for desktop */}
         <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-chesna-blue-500 px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <img
                className="h-12 w-auto"
                src={sipaudLogo}
                alt="Your Company"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">

                  <li>
                    <Link
                        href='/dashboard'
                        className='text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                    >
                    <HomeIcon
                        className='text-indigo-200 group-hover:text-white h-6 w-6 shrink-0'
                    />
                        Dashboard
                    </Link>
                    </li>



                    { ((user.role_id == 3) || (user.role_id == 4) || (user.role_id == 6)) ?
                    <div className="w-full">
                        <div className="mx-auto w-full max-w-md bg-transparent">
                            <Disclosure>
                            {({ open }) => (
                                <>
                                <Disclosure.Button
                                    className="flex w-full justify-between rounded-lg px-2 py-2 text-left text-sm font-medium text-indigo-200 hover:bg-chesna-blue-300 focus:outline-none focus-visible:ring focus-visible:ring-gray-200/75 mt-2">
                                    <CalendarIcon
                                        className='text-indigo-200 group-hover:text-white h-6 w-6 shrink-0'
                                        aria-hidden="true"
                                    />
                                    <span className="w-full px-3 text-sm font-semibold">
                                    Penilaian
                                    </span>


                                    <ChevronUpIcon
                                    className={`${
                                        open ? 'rotate-180 transform' : ''
                                    } h-5 w-5 text-indigo-200`}
                                    />

                                </Disclosure.Button>
                                <Disclosure.Panel className="px-4 pb-2 pt-2 text-sm text-gray-100">
                                    <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                    <Link href='/indikator-penilaian-harian'>
                                    <span>
                                    Indikator Penilaian Harian
                                    </span>
                                    </Link>
                                    </li>
                                    <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                    <Link href='/penilaian-harian'>
                                    <span>
                                    Penilaian Harian
                                    </span>
                                    </Link>
                                    </li>
                                    
                                </Disclosure.Panel>
                                </>
                                )}
                            </Disclosure>
                        </div>
                    </div> : "" }

                    { ((user.role_id == 3) || (user.role_id == 4) || (user.role_id == 5) || (user.role_id == 6)) ?
                    <li>
                    <Link
                        href='/jasmani-kesehatan'
                        className='text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                    >
                    <ChartPieIcon
                        className='text-indigo-200 group-hover:text-white h-6 w-6 shrink-0'
                    />
                        Jasmani Kesehatan
                    </Link>
                    </li> : "" }

                    { ((user.role_id == 3) || (user.role_id == 4) || (user.role_id == 5) || (user.role_id == 6)) ?
                    <div className="w-full">
                        <div className="mx-auto w-full max-w-md bg-transparent">
                            <Disclosure>
                            {({ open }) => (
                                <>
                                <Disclosure.Button className="flex w-full justify-between rounded-lg px-2 py-2 text-left text-sm font-medium text-indigo-200 hover:bg-chesna-blue-300 focus:outline-none focus-visible:ring focus-visible:ring-gray-200/75 mt-2">
                                    <DocumentDuplicateIcon
                                        className='text-indigo-200 group-hover:text-white h-6 w-6 shrink-0'
                                        aria-hidden="true"
                                    />
                                    <span className="w-full px-3 text-sm font-semibold">
                                    Laporan
                                    </span>


                                    <ChevronUpIcon
                                    className={`${
                                        open ? 'rotate-180 transform' : ''
                                    } h-5 w-5 text-indigo-200`}
                                    />

                                </Disclosure.Button>
                                <Disclosure.Panel className="px-4 pb-2 pt-2 text-sm text-gray-100">
                                    <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                    <Link href='/laporan-harian'>
                                    <span>
                                    Laporan Harian
                                    </span>
                                    </Link>
                                    </li>
                                    <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                    <Link href='/laporan-mingguan'>
                                    <span>
                                    Laporan Mingguan
                                    </span>
                                    </Link>
                                    </li>
                                    <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                    <Link href='/laporan-bulanan'>
                                    <span>
                                    Laporan Bulanan
                                    </span>
                                    </Link>
                                    </li>
                                </Disclosure.Panel>
                                </>
                            )}
                            </Disclosure>

                        </div>
                    </div> : "" }


                    { (user.role_id == 2) ?
                    <div className="w-full">
                        <div className="mx-auto w-full max-w-md bg-transparent">
                            <Disclosure>
                            {({ open }) => (
                                <>
                                <Disclosure.Button
                                    className="flex w-full justify-between rounded-lg px-2 py-2 text-left text-sm font-medium text-indigo-200 hover:bg-chesna-blue-300 focus:outline-none focus-visible:ring focus-visible:ring-gray-200/75 mt-2">
                                    <FolderIcon
                                        className='text-indigo-200 group-hover:text-white h-6 w-6 shrink-0'
                                        aria-hidden="true"
                                    />
                                    <span className="w-full px-3 text-sm font-semibold">
                                    Master Data
                                    </span>


                                    <ChevronUpIcon
                                    className={`${
                                        open ? 'rotate-180 transform' : ''
                                    } h-5 w-5 text-indigo-200`}
                                    />

                                </Disclosure.Button>
                                <Disclosure.Panel className="px-4 pb-2 pt-2 text-sm text-gray-100">
                                    
                                    <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                    <Link href='/sekolah'>
                                    <span>
                                    Data Sekolah
                                    </span>
                                    </Link>
                                    </li>
                                    <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                      <Link href='/dimensi'>
                                      <span>
                                      Dimensi
                                      </span>
                                      </Link>
                                    </li>
                                    <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                      <Link href='/elemen'>
                                      <span>
                                      Elemen
                                      </span>
                                      </Link>
                                    </li>
                                    <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                      <Link href='/roles'>
                                      <span>
                                      Roles
                                      </span>
                                      </Link>
                                    </li>
                                </Disclosure.Panel>
                                </>
                                )}
                            </Disclosure>

                        </div>
                    </div> : "" }

                    { ((user.role_id == 3) || (user.role_id == 6)) ?
                    <div className="w-full">
                        <div className="mx-auto w-full max-w-md bg-transparent">
                            <Disclosure>
                            {({ open }) => (
                                <>
                                <Disclosure.Button
                                    className="flex w-full justify-between rounded-lg px-2 py-2 text-left text-sm font-medium text-indigo-200 hover:bg-chesna-blue-300 focus:outline-none focus-visible:ring focus-visible:ring-gray-200/75 mt-2">
                                    <FolderIcon
                                        className='text-indigo-200 group-hover:text-white h-6 w-6 shrink-0'
                                        aria-hidden="true"
                                    />
                                    <span className="w-full px-3 text-sm font-semibold">
                                    Master Data
                                    </span>


                                    <ChevronUpIcon
                                    className={`${
                                        open ? 'rotate-180 transform' : ''
                                    } h-5 w-5 text-indigo-200`}
                                    />

                                </Disclosure.Button>
                                <Disclosure.Panel className="px-4 pb-2 pt-2 text-sm text-gray-100">
                                    <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                      <Link href='/guru'>
                                      <span>
                                      Data Guru
                                      </span>
                                      </Link>
                                    </li>
                                    <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                    <Link href='/siswa'>
                                    <span>
                                    Data Peserta Didik
                                    </span>
                                    </Link>
                                    </li>
                                    
                                    <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                      <Link href='/kelompok'>
                                      <span>
                                      Kelompok dan Siswa
                                      </span>
                                      </Link>
                                    </li>
                                    <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                      <Link href='/guru-pengampu'>
                                      <span>
                                      Guru Pengampu
                                      </span>
                                      </Link>
                                    </li>
                                    <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                      <Link href='/indikator'>
                                      <span>
                                      Indikator
                                      </span>
                                      </Link>
                                    </li>
                                </Disclosure.Panel>
                                </>
                                )}
                            </Disclosure>

                        </div>
                    </div> : "" }

                    
                    { (user.role_id == 4) ?
                    <div className="w-full">
                        <div className="mx-auto w-full max-w-md bg-transparent">
                            <Disclosure>
                            {({ open }) => (
                                <>
                                <Disclosure.Button
                                    className="flex w-full justify-between rounded-lg px-2 py-2 text-left text-sm font-medium text-indigo-200 hover:bg-chesna-blue-300 focus:outline-none focus-visible:ring focus-visible:ring-gray-200/75 mt-2">
                                    <FolderIcon
                                        className='text-indigo-200 group-hover:text-white h-6 w-6 shrink-0'
                                        aria-hidden="true"
                                    />
                                    <span className="w-full px-3 text-sm font-semibold">
                                    Master Data
                                    </span>


                                    <ChevronUpIcon
                                    className={`${
                                        open ? 'rotate-180 transform' : ''
                                    } h-5 w-5 text-indigo-200`}
                                    />

                                </Disclosure.Button>
                                <Disclosure.Panel className="px-4 pb-2 pt-2 text-sm text-gray-100">
                                    <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                      <Link href='/kelompok'>
                                      <span>
                                      Kelompok dan Siswa
                                      </span>
                                      </Link>
                                    </li>
                                </Disclosure.Panel>
                                </>
                                )}
                            </Disclosure>

                        </div>
                    </div> : "" }


                    { ((user.role_id == 2) || (user.role_id == 3) || (user.role_id == 6)) ?
                    <div className="w-full">
                        <div className="mx-auto w-full max-w-md bg-transparent">
                            <Disclosure>
                            {({ open }) => (
                                <>
                                <Disclosure.Button
                                    className="flex w-full justify-between rounded-lg px-2 py-2 text-left text-sm font-medium text-indigo-200 hover:bg-chesna-blue-300 focus:outline-none focus-visible:ring focus-visible:ring-gray-200/75 mt-2">
                                    <UsersIcon
                                        className='text-indigo-200 group-hover:text-white h-6 w-6 shrink-0'
                                        aria-hidden="true"
                                    />
                                    <span className="w-full px-3 text-sm font-semibold">
                                    Verifikasi dan Validasi
                                    </span>


                                    <ChevronUpIcon
                                    className={`${
                                        open ? 'rotate-180 transform' : ''
                                    } h-5 w-5 text-indigo-200`}
                                    />

                                </Disclosure.Button>
                                <Disclosure.Panel className="px-4 pb-2 pt-2 text-sm text-gray-100">
                                  { (user.role_id == 2) ?
                                    <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                      <Link href='/verval-sekolah'>
                                      <span>
                                      Verval Sekolah
                                      </span>
                                      </Link>
                                    </li>
                                    :
                                    <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                      <Link href='/verval-siswa'>
                                      <span>
                                      Verval Siswa
                                      </span>
                                      </Link>
                                    </li>
                                    }
                                </Disclosure.Panel>
                                </>
                                )}
                            </Disclosure>

                        </div>
                    </div> : "" }


                    { ((user.role_id == 3) || (user.role_id == 6)) ?
                    <div className="w-full">
                        <div className="mx-auto w-full max-w-md bg-transparent">
                            <Disclosure>
                            {({ open }) => (
                                <>
                                <Disclosure.Button
                                    className="flex w-full justify-between rounded-lg px-2 py-2 text-left text-sm font-medium text-indigo-200 hover:bg-chesna-blue-300 focus:outline-none focus-visible:ring focus-visible:ring-gray-200/75 mt-2">
                                    <BellIcon
                                        className='text-indigo-200 group-hover:text-white h-6 w-6 shrink-0'
                                        aria-hidden="true"
                                    />
                                    <span className="w-full px-3 text-sm font-semibold">
                                    Pengaturan
                                    </span>


                                    <ChevronUpIcon
                                    className={`${
                                        open ? 'rotate-180 transform' : ''
                                    } h-5 w-5 text-indigo-200`}
                                    />

                                </Disclosure.Button>
                                <Disclosure.Panel className="px-4 pb-2 pt-2 text-sm text-gray-100">
                                    <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                      <Link href='/profil-sekolah'>
                                      <span>
                                      Profil Sekolah
                                      </span>
                                      </Link>
                                    </li>
                                    <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                      <Link href='/kepala-sekolah'>
                                      <span>
                                      Kepala Sekolah
                                      </span>
                                      </Link>
                                    </li>
                                    <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                      <Link href='/pendaftaran'>
                                      <span>
                                      Pendaftaran
                                      </span>
                                      </Link>
                                    </li>
                                    
                                    <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                      <Link href='/link-pendaftaran'>
                                      <span>
                                      Link Pendaftaran
                                      </span>
                                      </Link>
                                    </li>
                                </Disclosure.Panel>
                                </>
                                )}
                            </Disclosure>

                        </div>
                    </div> : ""} 


                    { ((user.role_id == 3) || (user.role_id == 6)) ?
                    <div className="w-full">
                        <div className="mx-auto w-full max-w-md bg-transparent">
                            <Disclosure>
                            {({ open }) => (
                                <>
                                <Disclosure.Button
                                    className="flex w-full justify-between rounded-lg px-2 py-2 text-left text-sm font-medium text-indigo-200 hover:bg-chesna-blue-300 focus:outline-none focus-visible:ring focus-visible:ring-gray-200/75 mt-2">
                                    <DocumentDuplicateIcon
                                        className='text-indigo-200 group-hover:text-white h-6 w-6 shrink-0'
                                        aria-hidden="true"
                                    />
                                    <span className="w-full px-3 text-sm font-semibold">
                                    E-Rapor
                                    </span>


                                    <ChevronUpIcon
                                    className={`${
                                        open ? 'rotate-180 transform' : ''
                                    } h-5 w-5 text-indigo-200`}
                                    />

                                </Disclosure.Button>
                                <Disclosure.Panel className="px-4 pb-2 pt-2 text-sm text-gray-100">
                                    <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                      <Link href='/rapor-siswa'>
                                      <span>
                                      Rapor Siswa
                                      </span>
                                      </Link>
                                    </li>
                                    <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                      <Link href='/setting-rapor-siswa'>
                                      <span>
                                      Setting Rapor Siswa
                                      </span>
                                      </Link>
                                    </li>
                                    <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                      <Link href='/sttb'>
                                      <span>
                                      STTB
                                      </span>
                                      </Link>
                                    </li>
                                    <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                      <Link href='/setting-sttb'>
                                      <span>
                                      Setting STTB
                                      </span>
                                      </Link>
                                    </li>
                                </Disclosure.Panel>
                                </>
                                )}
                            </Disclosure>

                        </div>
                    </div> : ""}

                    { (user.role_id == 4) ?
                    <div className="w-full">
                        <div className="mx-auto w-full max-w-md bg-transparent">
                            <Disclosure>
                            {({ open }) => (
                                <>
                                <Disclosure.Button
                                    className="flex w-full justify-between rounded-lg px-2 py-2 text-left text-sm font-medium text-indigo-200 hover:bg-chesna-blue-300 focus:outline-none focus-visible:ring focus-visible:ring-gray-200/75 mt-2">
                                    <DocumentDuplicateIcon
                                        className='text-indigo-200 group-hover:text-white h-6 w-6 shrink-0'
                                        aria-hidden="true"
                                    />
                                    <span className="w-full px-3 text-sm font-semibold">
                                    E-Rapor
                                    </span>


                                    <ChevronUpIcon
                                    className={`${
                                        open ? 'rotate-180 transform' : ''
                                    } h-5 w-5 text-indigo-200`}
                                    />

                                </Disclosure.Button>
                                <Disclosure.Panel className="px-4 pb-2 pt-2 text-sm text-gray-100">
                                    <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                      <Link href='/rapor-siswa'>
                                      <span>
                                      Rapor Siswa
                                      </span>
                                      </Link>
                                    </li>
                                    <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                      <Link href='/sttb'>
                                      <span>
                                      STTB
                                      </span>
                                      </Link>
                                    </li>
                                </Disclosure.Panel>
                                </>
                                )}
                            </Disclosure>

                        </div>
                    </div> : ""}

                    { (user.role_id == 5) ?
                    <div className="w-full">
                        <div className="mx-auto w-full max-w-md bg-transparent">
                            <Disclosure>
                            {({ open }) => (
                                <>
                                <Disclosure.Button
                                    className="flex w-full justify-between rounded-lg px-2 py-2 text-left text-sm font-medium text-indigo-200 hover:bg-chesna-blue-300 focus:outline-none focus-visible:ring focus-visible:ring-gray-200/75 mt-2">
                                    <FolderIcon
                                        className='text-indigo-200 group-hover:text-white h-6 w-6 shrink-0'
                                        aria-hidden="true"
                                    />
                                    <span className="w-full px-3 text-sm font-semibold">
                                    E-Rapor
                                    </span>


                                    <ChevronUpIcon
                                    className={`${
                                        open ? 'rotate-180 transform' : ''
                                    } h-5 w-5 text-indigo-200`}
                                    />

                                </Disclosure.Button>
                                <Disclosure.Panel className="px-4 pb-2 pt-2 text-sm text-gray-100">
                                    <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                      <Link href='/rapor-siswa'>
                                      <span>
                                      Rapor Siswa
                                      </span>
                                      </Link>
                                    </li>
                                    {/* <li
                                     className="text-indigo-200 hover:text-white hover:bg-chesna-blue-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-8"
                                    >
                                      <Link href='/sttb'>
                                      <span>
                                      STTB
                                      </span>
                                      </Link>
                                    </li> */}
                                </Disclosure.Panel>
                                </>
                                )}
                            </Disclosure>

                        </div>
                    </div> : ""}



{/* 
                    {navigation.map((item) => (
                    (item.role_id == user.role_id) ?
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-chesna-blue-200 text-white'
                              : 'text-indigo-200 hover:text-white hover:bg-chesna-blue-300',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current ? 'text-white' : 'text-indigo-200 group-hover:text-white',
                              'h-6 w-6 shrink-0'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    : ""
                    ))} */}
                  </ul>
                </li>


                {/* <li className="mt-auto">
                  <a
                    href="#"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white"
                  >
                    <Cog6ToothIcon
                      className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
                      aria-hidden="true"
                    />
                    Settings
                  </a>
                </li> */}
              </ul>
            </nav>
          </div>
        </div>
    </>
  )
}

export default DesktopMenu
