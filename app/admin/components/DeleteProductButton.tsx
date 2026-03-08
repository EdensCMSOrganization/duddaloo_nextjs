// app/admin/components/DeleteProductButton.tsx
'use client';

import { deleteProduct } from '../actions/deleteProduct';
import { useRouter } from 'next/navigation';

export default function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('Delete this product?')) {
      await deleteProduct(productId);
      router.refresh(); // refreshes the Server Component data
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
    >
      Radera
    </button>
  );
}
