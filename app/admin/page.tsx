// app/admin/page.tsx

import { getAuthUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminProductForm from './components/AdminProductForm';
import AdminProductList from './components/AdminProductList';
import Link from 'next/link';
import Image from 'next/image';

export default async function AdminPage() {
  const user = getAuthUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">  
      <div className="flex">
        {/* Sidebar para el formulario */}
        <aside className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 min-h-screen p-6 sticky top-0 self-start">
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
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6 border border-green-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Add New Product</h2>
            <AdminProductForm />
          </div>

          {/* Stats o información adicional */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
            <h3 className="font-semibold text-gray-800 mb-2">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Products</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">In Stock</span>
                <span className="font-medium">8</span>
              </div>
            </div>
          </div>

          {/* Botón de acción principal */}
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg w-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </Link>
          </div>
        </aside>

        {/* Contenido principal - Lista de productos */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
                <p className="text-gray-600">View and manage all products</p>
              </div>
              <button className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Export List
              </button>
            </div>
          </div>

          {/* Tarjeta contenedora para la lista */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Existing Products</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select className="border rounded-lg px-3 py-1 text-sm">
                  <option>Newest First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>
            
            <div className="relative">
              <AdminProductList />
            </div>
          </div>

          {/* Información adicional en el área principal */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
              <h4 className="font-semibold text-gray-800 mb-2">Tips</h4>
              <p className="text-sm text-gray-600">Add clear product images and detailed descriptions for better conversion.</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-100">
              <h4 className="font-semibold text-gray-800 mb-2">Reminder</h4>
              <p className="text-sm text-gray-600">Update stock status regularly to avoid overselling.</p>
            </div>
            {/* <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
              <h4 className="font-semibold text-gray-800 mb-2">Support</h4>
              <p className="text-sm text-gray-600">Need help? Contact our support team anytime.</p>
            </div> */}
          </div>
        </main>
      </div>
    </div>
  );
}