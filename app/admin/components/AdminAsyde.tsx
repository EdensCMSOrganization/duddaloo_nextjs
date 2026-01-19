import Image from 'next/image'
import React from 'react'
import CreateProductForm from './CreateProductForm'
import Link from 'next/link'

function AdminAsyde() {
  return (
    <>
        <aside className="w-full md:w-1/3 lg:w-1/4 bg-[#F8F6F2] rounded-2xl border-r border-gray-200 min-h-screen p-6 sticky top-0 self-start my-6 shadow-2xl">
          <div className="mb-6">
             <Image
              src="/logo.svg" 
              alt="Logo cms"
              width={80} 
              height={80} // Alto en píxeles
              priority // Si es el logo principal, carga prioritariamente
            />
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">Manage your products</p>
          </div>
          
          <div className="bg-lineart-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6 border border-green-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Add New Product</h2>
            <CreateProductForm />
          </div>

          <div className="mt-4 mx-4">
            <Link
              href="/admin/media"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg w-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Manage Media
            </Link>
          </div>
        </aside>
    </>
  )
}

export default AdminAsyde