'use server';

import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  price: z.number().min(0, "El precio debe ser mayor a 0"),
  stripeId: z.string().min(1, "El Stripe Price ID es obligatorio"),
  images: z.array(z.string()).min(1, "Al menos una imagen es requerida"),
});

export async function createProduct(_prevState: unknown, formData: FormData) {
  try {
    await connectDB();

    // Recoge todos los archivos de los 4 inputs porque todos tienen name="images"
    const files = formData.getAll('images') as File[];
    const uploadedUrls: string[] = [];

    const uploadDir = path.join(process.cwd(), 'public/uploads');
    await mkdir(uploadDir, { recursive: true });

    for (const file of files) {
      // Solo procesamos archivos que existan y tengan tamaño (evita los inputs que se quedaron vacíos)
      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
        const filePath = path.join(uploadDir, fileName);
        
        await writeFile(filePath, buffer);
        uploadedUrls.push(`/uploads/${fileName}`);
      }
    }

    const validated = productSchema.parse({
      name: (formData.get('name') as string)?.trim(),
      description: (formData.get('description') as string)?.trim(),
      price: Number(formData.get('price')),
      stripeId: (formData.get('stripeId') as string)?.trim(),
      images: uploadedUrls,
    });

    await Product.create(validated);

    revalidatePath('/admin');
    revalidatePath('/'); 
    
    return { success: true, error: null };

  } catch (err: unknown) {
    console.error('Error creating product:', err);

    if (err instanceof z.ZodError) {
      return { 
        success: false, 
        error: err.issues[0]?.message || 'Error de validación en los datos' 
      };
    }

    if (err && typeof err === 'object' && 'code' in err) {
      const mongoError = err as { code: number };
      if (mongoError.code === 11000) {
        return { success: false, error: 'Este Stripe ID ya está registrado' };
      }
    }

    const message = err instanceof Error ? err.message : 'Error desconocido al crear el producto';
    return { success: false, error: message };
  }
}