import React from 'react'
import LogOutLink from '@/Components/LogOutLink'
import sipaudLogo from '../assets/logo-sipaud.png'

import { Fragment, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
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
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: false, role_id: 3 },
  { name: 'Sekolah', href: '/sekolah', icon: UsersIcon, current: false, role_id: 2 },
  { name: 'Guru', href: '/guru', icon: FolderIcon, current: false, role_id: 3 },
  { name: 'Siswa', href: '/siswa', icon: CalendarIcon, current: false, role_id: 3 },
  { name: 'Kelompok', href: '/kelompok', icon: DocumentDuplicateIcon, current: false, role_id: 3 },
  { name: 'Dimensi', href: '/dimensi', icon: ChartPieIcon, current: false, role_id: 2 },
  { name: 'Elemen', href: '/elemen', icon: FolderIcon, current: false, role_id: 2 },
  { name: 'Indikator', href: '/indikator', icon: DocumentDuplicateIcon, current: false, role_id: 3 },
  { name: 'Guru Pengampu', href: '/guru-pengampu', icon: CalendarIcon, current: false, role_id: 4 },
  { name: 'Kepala Sekolah', href: '/kepala-sekolah', icon: UsersIcon, current: false, role_id: 3 },
  { name: 'Jasmani Kesehatan', href: '/jasmani-kesehatan', icon: ChartPieIcon, current: false, role_id: 4 },
  { name: 'Penilaian Harian', href: '/penilaian-harian', icon: FolderIcon, current: false, role_id: 4 },
  { name: 'Laporan Harian', href: '/laporan-harian', icon: DocumentDuplicateIcon, current: false, role_id: 4 },
  { name: 'Roles', href: '/roles', icon: UsersIcon, current: false, role_id: 2 },
]

const MobileMenu = () => {
  return (
    <>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-chesna-blue-500 px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="h-8 w-auto"
                        src={sipaudLogo}
                        alt="Your Company"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                            (user.role_id == item.role_id) ?
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className={classNames(
                                    item.current
                                      ? 'bg-indigo-700 text-white'
                                      : 'text-indigo-200 hover:text-white hover:bg-indigo-700',
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
                              </li> : ""

                            ))}
                          </ul>
                        </li>
                        {/* <li>
                          <div className="text-xs font-semibold leading-6 text-indigo-200">Your teams</div>
                          <ul role="list" className="-mx-2 mt-2 space-y-1">
                            {teams.map((team) => (
                              <li key={team.name}>
                                <a
                                  href={team.href}
                                  className={classNames(
                                    team.current
                                      ? 'bg-indigo-700 text-white'
                                      : 'text-indigo-200 hover:text-white hover:bg-indigo-700',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                  )}
                                >
                                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">
                                    {team.initial}
                                  </span>
                                  <span className="truncate">{team.name}</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </li> */}
                        <li className="mt-auto">
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
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
    </>
  )
}

export default MobileMenu
