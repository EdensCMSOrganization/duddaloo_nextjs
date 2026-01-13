'use server';

import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Definimos la interfaz para el objeto de actualización
interface UpdatePayload {
  name: string;
  description: string;
  price: number;
  stripeId: string;
  inStock: boolean;
  images?: string[]; // La propiedad imágenes es opcional aquí
}

const productUpdateSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(0),
  stripeId: z.string().min(1),
  inStock: z.boolean(),
});

export async function updateProduct(prevState: unknown, formData: FormData) {
  try {
    await connectDB();

    const id = formData.get('id') as string;
    const files = formData.getAll('images') as File[];
    
    const uploadedUrls: string[] = [];
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    await mkdir(uploadDir, { recursive: true });

    for (const file of files) {
      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        uploadedUrls.push(`/uploads/${fileName}`);
      }
    }

    // 2. Validar datos con Zod
    const validated = productUpdateSchema.parse({
      id: id,
      name: (formData.get('name') as string)?.trim(),
      description: (formData.get('description') as string)?.trim(),
      price: Number(formData.get('price')),
      stripeId: (formData.get('stripeId') as string)?.trim(),
      inStock: formData.get('inStock') === 'true',
    });

    // 3. Crear el payload usando la interfaz definida arriba
    // Extraemos el 'id' para no enviarlo dentro del cuerpo del update
    const { id: _, ...rest } = validated;
    const updatePayload: UpdatePayload = {
      ...rest,
    };

    // Solo añadimos imágenes si hay nuevas subidas
    if (uploadedUrls.length > 0) {
      updatePayload.images = uploadedUrls;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatePayload, { new: true });

    if (!updatedProduct) return { success: false, error: 'Producto no encontrado' };

    revalidatePath('/admin');
    return { success: true, error: null };

  } catch (err: unknown) {
    console.error('Error:', err);
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0].message };
    }
    return { success: false, error: 'Error al actualizar' };
  }
}