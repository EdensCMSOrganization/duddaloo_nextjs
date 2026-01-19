// app/admin/page.tsx

import { getAuthUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminProductList from './components/AdminProductList';
import Link from 'next/link';
import AdminAsyde from './components/AdminAsyde';

export default async function AdminPage() {
  const user = getAuthUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">  
      <div className="flex">
        {/* Sidebar para el formulario */}
         <AdminAsyde />

        {/* Contenido principal - Lista de productos */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
                <p className="text-gray-600">View and manage all products</p>
              </div>
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
            </div>
          </div>

          {/* Tarjeta contenedora para la lista */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Existing Products</h3>
            </div>
            
            <div className="relative z-10">
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
          </div>
        </main>
      </div>
    </div>
  );
}