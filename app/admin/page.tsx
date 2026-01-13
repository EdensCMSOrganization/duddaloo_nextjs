// app/admin/page.tsx

import { getAuthUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminProductForm from './components/AdminProductForm';
import AdminProductList from './components/AdminProductList';

export default async function AdminPage() {
  const user = getAuthUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard - Products</h1>

      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
        <AdminProductForm />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Existing Products</h2>
        <AdminProductList />
      </div>
    </div>
  );
}
