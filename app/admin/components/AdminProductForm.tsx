// app/admin/components/AdminProductForm.tsx
'use client';

import { useActionState, useRef, useEffect, useState } from 'react';
import { createProduct } from '../actions/createProduct';
import Image from 'next/image';
import { useFormStatus } from 'react-dom';

const UPLOAD_PLACEHOLDER = "https://cdn-icons-png.flaticon.com/512/126/126477.png";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="w-full bg-green-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors shadow-md"
      disabled={pending}
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Processing...
        </span>
      ) : (
        'Create Product'
      )}
    </button>
  );
}

export default function AdminProductForm() {
  const [state, formAction] = useActionState(createProduct, { success: false, error: null });
  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null, null]);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      const timer = setTimeout(() => {
        setPreviews([null, null, null, null]);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [state?.success]);

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newPreviews = [...previews];
      newPreviews[index] = URL.createObjectURL(file);
      setPreviews(newPreviews);
    }
  };

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      {state?.error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {state.error}
        </div>
      )}
      
      {state?.success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Product created successfully! ✅
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Product Images (Max 4)
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((index) => (
            <label key={index} htmlFor={`image-${index}`} className="cursor-pointer">
              <input 
                type="file" 
                name="images"
                id={`image-${index}`}
                accept="image/*" 
                hidden
                onChange={(e) => handleFileChange(index, e)} 
              />
              <div className="relative w-full aspect-square border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 hover:border-green-400 transition-colors group">
                <Image 
                  src={previews[index] || UPLOAD_PLACEHOLDER} 
                  alt={`Preview ${index}`} 
                  fill 
                  className={previews[index] ? "object-cover" : "object-contain p-4 opacity-30 group-hover:opacity-50"} 
                />
                {!previews[index] && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Product Name</label>
          <input 
            type="text" 
            name="name" 
            required 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
            placeholder="Enter product name"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Price (SEK)</label>
          <input 
            type="number" 
            name="price" 
            required 
            min="0" 
            step="0.01"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Stripe Price ID</label>
        <input 
          type="text" 
          name="stripeId" 
          required 
          placeholder="price_1Q..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Description</label>
        <textarea 
          name="description" 
          required 
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none" 
          placeholder="Describe your product in detail..."
        />
      </div>

      <SubmitButton />
    </form>
  );
}