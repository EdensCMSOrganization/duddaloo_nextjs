'use client';

import { useActionState, useEffect, useState } from 'react';
import { updateProduct } from '../actions/updateProduct';
import Image from 'next/image';
import { useFormStatus } from 'react-dom';

const UPLOAD_PLACEHOLDER = "https://cdn-icons-png.flaticon.com/512/126/126477.png";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      disabled={pending}
    >
      {pending ? 'Saving...' : 'Update Product'}
    </button>
  );
}

export default function EditProductForm({
  product,
}: {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    stripeId: string;
    images?: string[];
    inStock: boolean;
  };
}) {
  const [state, formAction] = useActionState(updateProduct, { success: false, error: null });

  // State to preview existing or new images
  const [previews, setPreviews] = useState<(string | null)[]>(() => {
    const existing = product.images || [];
    return [existing[0] || null, existing[1] || null, existing[2] || null, existing[3] || null];
  });

  useEffect(() => {
    if (state?.success) {
      alert('Product updated ✅');
    }
  }, [state]);

  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newPreviews = [...previews];
      newPreviews[index] = URL.createObjectURL(file);
      setPreviews(newPreviews);
    }
  };

  return (
    <form action={formAction} className="space-y-4 p-4 border rounded bg-gray-50">
      <input type="hidden" name="id" value={product._id} />

      {state?.error && <p className="text-red-500 bg-red-50 p-2 rounded text-sm">{state.error}</p>}

      {/* SECTION FOR 4 IMAGES (Same as in AddProduct) */}
      <div>
        <label className="block text-sm font-semibold mb-2">Images (Max 4)</label>
        <div className="flex flex-wrap gap-3">
          {[0, 1, 2, 3].map((index) => (
            <label key={index} htmlFor={`edit-img-${product._id}-${index}`} className="cursor-pointer">
              <input
                type="file"
                name="images"
                id={`edit-img-${product._id}-${index}`}
                accept="image/*"
                hidden
                onChange={(e) => handleImageChange(index, e)}
              />
              <div className="relative w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-white hover:border-blue-400">
                <Image
                  src={previews[index] || UPLOAD_PLACEHOLDER}
                  alt="Preview"
                  fill
                  className={previews[index] ? "object-cover" : "object-contain p-4 opacity-20"}
                />
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input type="text" name="name" defaultValue={product.name} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Price (SEK)</label>
          <input type="number" name="price" defaultValue={product.price} required className="w-full p-2 border rounded" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Stripe Price ID</label>
        <input type="text" name="stripeId" defaultValue={product.stripeId} required className="w-full p-2 border rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea name="description" defaultValue={product.description} required rows={3} className="w-full p-2 border rounded" />
      </div>

      <div className="flex items-center gap-2 py-2">
        <input
          type="checkbox"
          name="inStock"
          defaultChecked={product.inStock}
          value="true"
          id={`stock-${product._id}`}
        />
        <label htmlFor={`stock-${product._id}`} className="text-sm font-medium">In Stock</label>
      </div>

      <SubmitButton />
    </form>
  );
}
