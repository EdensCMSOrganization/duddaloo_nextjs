'use client';

import { useActionState, useRef, useEffect, useState } from 'react';
import { createProduct } from '../actions/createProduct';
import Image from 'next/image';
import { useFormStatus } from 'react-dom';

// Icono de placeholder cuando no hay imagen
const UPLOAD_PLACEHOLDER = "https://cdn-icons-png.flaticon.com/512/126/126477.png";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
      disabled={pending}
    >
      {pending ? 'Procesando...' : 'Crear Producto'}
    </button>
  );
}

export default function AdminProductForm() {
  const [state, formAction] = useActionState(createProduct, { success: false, error: null });
  // Inicializamos con 4 slots vacíos
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
    <form ref={formRef} action={formAction} className="max-w-2xl mx-auto space-y-6 p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-bold border-b pb-2">Nuevo Producto</h2>
      
      {state?.error && <p className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{state.error}</p>}
      {state?.success && <p className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">¡Guardado correctamente! ✅</p>}

      {/* SECCIÓN DE 4 IMÁGENES INDEPENDIENTES */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">Imágenes del Producto (Máximo 4)</label>
        <div className="flex flex-wrap gap-4 mt-2">
          {[0, 1, 2, 3].map((index) => (
            <label key={index} htmlFor={`image-${index}`} className="cursor-pointer">
              <input 
                type="file" 
                name="images" // Mismo nombre para que el servidor reciba un array
                id={`image-${index}`}
                accept="image/*" 
                hidden
                onChange={(e) => handleFileChange(index, e)} 
              />
              <div className="relative w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 hover:border-blue-400 transition-colors flex items-center justify-center">
                <Image 
                  src={previews[index] || UPLOAD_PLACEHOLDER} 
                  alt={`Preview ${index}`} 
                  fill 
                  className={previews[index] ? "object-cover" : "object-contain p-6 opacity-30"} 
                />
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold">Nombre</label>
          <input type="text" name="name" required className="w-full p-2 border rounded-md" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold">Precio (SEK)</label>
          <input type="number" name="price" required min="0" className="w-full p-2 border rounded-md" />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold">Stripe Price ID</label>
        <input type="text" name="stripeId" required placeholder="price_1Q..." className="w-full p-2 border rounded-md" />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold">Descripción</label>
        <textarea name="description" required rows={3} className="w-full p-2 border rounded-md" />
      </div>

      <SubmitButton />
    </form>
  );
}