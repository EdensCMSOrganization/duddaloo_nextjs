"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import Stripe from "stripe";

// Definimos la interfaz para el objeto de actualización
interface UpdatePayload {
  name: string;
  description: string;
  price: number;
  stripeId?: string; // stripeId might change if price changes, so it can be optional in payload
  inStock: boolean;
  stock: number; // Add stock to UpdatePayload
  images?: string[]; // La propiedad imágenes es opcional aquí
}

const productUpdateSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(0),
  inStock: z.boolean(),
  stock: z.number().int().min(0, "El stock debe ser un número entero no negativo"), // Add stock to schema
});

export async function updateProduct(prevState: unknown, formData: FormData) {
  try {
    await connectDB();

    const id = formData.get("id") as string;
    const files = formData.getAll("images") as File[];

    const uploadedUrls: string[] = [];
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });

    for (const file of files) {
      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        uploadedUrls.push(`/uploads/${fileName}`);
      }
    }

    // 2. Validar datos con Zod
    const validated = productUpdateSchema.parse({
      id: id,
      name: (formData.get("name") as string)?.trim(),
      description: (formData.get("description") as string)?.trim(),
      price: Number(formData.get("price")),
      inStock: formData.get("inStock") === "true",
      stock: Number(formData.get("stock")), // Extract stock from formData
    });

    // 3. Crear el payload usando la interfaz definida arriba
    // Extraemos el 'id' para no enviarlo dentro del cuerpo del update
    const { id: _, ...rest } = validated;
    const updatePayload: UpdatePayload = {
      ...rest,
      inStock: validated.stock > 0 ? true : false, // Derive inStock from stock
    };

    // 4. Lógica de Stripe para actualizaciones
    const currentProduct = await Product.findById(id);

    if (currentProduct) {
      // Si el precio ha cambiado, necesitamos crear un nuevo precio en Stripe
      if (currentProduct.price !== validated.price) {
        // Primero intentamos obtener el producto de Stripe asociado a este precio
        // (Asumiendo que stripeId en tu DB es el Price ID, ej: price_123...)
        if (!process.env.STRIPE_SECRET_KEY) {
          throw new Error("Falta la variable de entorno STRIPE_SECRET_KEY");
        }
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        try {
          const oldPrice = await stripe.prices.retrieve(
            currentProduct.stripeId
          );

          // Creamos el nuevo precio asociado al mismo producto de Stripe
          const newPrice = await stripe.prices.create({
            product: oldPrice.product as string,
            unit_amount: Math.round(validated.price * 100),
            currency: "sek",
          });

          // Actualizamos el stripeId en nuestra base de datos
          updatePayload.stripeId = newPrice.id;
        } catch (stripeError) {
          console.error("Error actualizando precio en Stripe:", stripeError);
          // Si falla Stripe, podrías decidir abortar o continuar solo con la DB.
          // Por seguridad, aquí solo logueamos el error.
        }
      } else {
        // Si el precio no cambia, mantenemos el ID existente
        updatePayload.stripeId = currentProduct.stripeId;
      }
    }

    // Solo añadimos imágenes si hay nuevas subidas
    if (uploadedUrls.length > 0) {
      updatePayload.images = uploadedUrls;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatePayload, {
      new: true,
    });

    if (!updatedProduct)
      return { success: false, error: "Producto no encontrado" };

    revalidatePath("/admin");
    return { success: true, error: null };
  } catch (err: unknown) {
    console.error("Error:", err);
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0].message };
    }
    return { success: false, error: "Error al actualizar" };
  }
}
