import React, { Fragment } from 'react'
import { Link as NavLink } from '@inertiajs/react';
// import { NavLink } from "react-router-dom"
import { Link } from "react-scroll"
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { PlusIcon } from '@heroicons/react/20/solid'
import { motion } from "framer-motion"
// import { Carousel } from "flowbite-react";
import Hero from './Hero'
import Fitur from './Fitur'
import Tentang from './Tentang'
// import Testimonial from './Testimonial'
import CaraRegistrasi from './CaraRegistrasi'
import Kontak from './Kontak'

const user = {
    name: 'Tom Cook',
    email: 'tom@example.com',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  }
  const navigation = [
    { name: 'Dashboard', href: '#', current: true },
    { name: 'Team', href: '#', current: false },
    { name: 'Projects', href: '#', current: false },
    { name: 'Calendar', href: '#', current: false },
  ]
  const userNavigation = [
    { name: 'Your Profile', href: '#' },
    { name: 'Settings', href: '#' },
    { name: 'Sign out', href: '#' },
  ]
  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

const Home = () => {
  return (
    <>
        <Disclosure as="nav" className="bg-sipaud-blue-800 fixed w-full top-0 left-0 z-10">
      {({ open }) => (
        <>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-12 w-auto"
                    // src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    src="/img/site/logo-sipendi.png"
                    alt="Your Company"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}


                  </div>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex items-center">


                    <Link 
                    to="home"
                    smooth spy
                    className="rounded-md bg-transparent px-3 py-2 text-base font-medium text-white hover:text-yellow-400 font-livic hover:cursor-pointer"
                    >
                      Home
                    </Link>
                    <Link
                      to="tentang-simpaud"
                      smooth spy
                      className="rounded-md px-3 py-2 text-base font-medium text-white hover:bg-transparent hover:text-yellow-400 font-livic hover:cursor-pointer"
                    >
                      Tentang SimPaud
                    </Link>
                    <Link
                      to="fitur"
                      smooth spy
                      className="rounded-md px-6 py-2 text-base font-medium text-white hover:bg-transparent hover:text-yellow-400 font-livic hover:cursor-pointer"
                    >
                      Fitur
                    </Link>
                    {/* <Link
                      to="testimonial"
                      className="rounded-md px-6 py-2 text-base font-medium text-white hover:bg-transparent hover:text-yellow-400 font-livic hover:cursor-pointer"
                      smooth spy
                    >
                      Testimonial
                    </Link> */}
                    <Link
                      to="cara-registrasi"
                      smooth spy
                      className="rounded-md px-6 py-2 text-base font-medium text-white hover:bg-transparent hover:text-yellow-400 font-livic hover:cursor-pointer"
                    >
                      Registrasi
                    </Link>
                    <Link
                      to="kontak"
                      smooth spy
                      className="rounded-md px-6 py-2 text-base font-medium text-white hover:bg-transparent hover:text-yellow-400 font-livic hover:cursor-pointer"
                    >
                      Kontak
                    </Link>
                    <NavLink
                      href="/login"
                      className="rounded-md px-6 py-2 text-base font-medium text-white hover:bg-transparent hover:text-yellow-400 font-livic"
                    >
                      LOGIN
                    </NavLink>

                    <NavLink
                      href='/registrasi'
                      type="button"
                      className="rounded-md bg-red-400 px-3 py-2 text-base font-medium text-white shadow-sm hover:bg-[#5A6268] hover:text-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 font-livic"
                    >
                        Daftar Sekarang
                    </NavLink>

                  {/* <button
                    type="button"
                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button> */}

                  {/* Profile dropdown */}
                  {/* <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Your Profile
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Settings
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Sign out
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu> */}
                </div>
              </div>
              <div className="-mr-2 flex sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
              
              <Link
                to="home"
                smooth spy
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white font-livic hover:cursor-pointer"
              >
                Home
              </Link>
              <Link
                to="tentang-simpaud"
                smooth spy
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white font-livic hover:cursor-pointer"
              >
                Tentang SimPaud
              </Link>
              <Link
                to="fitur"
                smooth spy
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white font-livic hover:cursor-pointer"
              >
                Fitur
              </Link>
              {/* <Link
                to="testimonial"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white font-livic hover:cursor-pointer"
                smooth spy
              >
                Testimonial
              </Link> */}
              <Link
                to="cara-registrasi"
                smooth spy
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white font-livic hover:cursor-pointer"
              >
                Registrasi
              </Link>
              <Link
                to="kontak"
                smooth spy
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white font-livic hover:cursor-pointer"
              >
                Kontak
              </Link>
              <NavLink
                href="/login"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white font-livic"
              >
                LOGIN
              </NavLink>
              <NavLink
                href="/registrasi"
                className="block rounded-md bg-red-400 px-3 py-2 text-base font-medium text-white shadow-sm hover:bg-[#5A6268] hover:text-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 font-livic"
              >
                Daftar Sekarang
              </NavLink>
            </div>
            
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>

    <Hero/>
    <Tentang/>
    <Fitur/>
    {/* <Testimonial/> */}
    <CaraRegistrasi/>
    <Kontak/>

    <footer
    className='w-full bg-sipaud-blue-900 font-livic text-sm text-white text-center p-10'
    >
      ©2024 SimPaud
    </footer>
    
    </>
  )
}

export default Home