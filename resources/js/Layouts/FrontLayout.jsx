import React, { Fragment } from 'react'
import { Link, Head } from '@inertiajs/react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { PlusIcon } from '@heroicons/react/20/solid'



  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

const FrontLayout = ({header, children}) => {
  return (
    <>
    <Head title="SimPaud" />

    <Disclosure as="nav" className="bg-blue-900">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-12 w-auto"
                    // src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    src="/img/site/logo/logo-sipendi.png"
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


                    <Link href="/" className="rounded-md bg-transparent px-3 py-2 text-sm font-medium text-white hover:text-yellow-400">
                      Home
                    </Link>
                    <Link
                      href="/tentang-kurikulum-merdeka"
                      className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-transparent hover:text-yellow-400"
                    >
                      Tentang Kurikulum Merdeka
                    </Link>
                    <Link
                      href="/fitur"
                      className="rounded-md px-6 py-2 text-sm font-medium text-white hover:bg-transparent hover:text-yellow-400"
                    >
                      Fitur
                    </Link>
                    <Link
                      href="/testimonial"
                      className="rounded-md px-6 py-2 text-sm font-medium text-white hover:bg-transparent hover:text-yellow-400"
                    >
                      Testimonial
                    </Link>
                    <Link
                      href="/cara-registrasi"
                      className="rounded-md px-6 py-2 text-sm font-medium text-white hover:bg-transparent hover:text-yellow-400"
                    >
                      Registrasi
                    </Link>
                    <Link
                      href="/kontak"
                      className="rounded-md px-6 py-2 text-sm font-medium text-white hover:bg-transparent hover:text-yellow-400"
                    >
                      Kontak
                    </Link>
                    <Link
                      href="/login"
                      className="rounded-md px-6 py-2 text-sm font-medium text-white hover:bg-transparent hover:text-yellow-400"
                    >
                      LOGIN
                    </Link>

                    <Link
                        href="/registrasi"
                        className="rounded-md bg-red-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Daftar Sekarang
                    </Link>

                    {/* <button
                        type="button"
                        className="rounded-md bg-red-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Daftar Sekarang
                    </button> */}


                </div>
              </div>
              
            </div>
          </div>
          
          
          
        </>
      )}
    </Disclosure>
    <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
    </>
  )
}

export default FrontLayout
