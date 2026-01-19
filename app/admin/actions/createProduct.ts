"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import Stripe from "stripe";

const productSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  price: z.number().min(0, "El precio debe ser mayor a 0"),
  images: z.array(z.string()).min(1, "Al menos una imagen es requerida"),
  inStock: z.boolean(), // Keep inStock validation for now
  stock: z.number().int().min(0, "El stock debe ser un número entero no negativo"),
});

export async function createProduct(_prevState: unknown, formData: FormData) {
  try {
    await connectDB();

    const files = formData.getAll("images") as File[];
    const uploadedUrls: string[] = [];

    const uploadDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = formData.get(`image-url-${i}`) as string;

      // Prioritize file upload if it exists
      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
        const filePath = path.join(uploadDir, fileName);

        await writeFile(filePath, buffer);
        uploadedUrls.push(`/uploads/${fileName}`);
      } else if (imageUrl) {
        // If no file, use the URL from media library
        uploadedUrls.push(imageUrl);
      }
    }

    // 1. Validamos los datos del formulario (ya sin stripeId)
    const validated = productSchema.parse({
      name: (formData.get("name") as string)?.trim(),
      description: (formData.get("description") as string)?.trim(),
      price: Number(formData.get("price")),
      images: uploadedUrls,
      inStock: formData.get("inStock") === "true", // Extract inStock
      stock: Number(formData.get("stock")), // Extract stock
    });

    // 2. Creamos el producto y el precio en Stripe automáticamente
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Falta la variable de entorno STRIPE_SECRET_KEY");
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const stripeProduct = await stripe.products.create({
      name: validated.name,
      description: validated.description,
    });

    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: Math.round(validated.price * 100), // Stripe usa centavos (öre)
      currency: "sek",
    });

    // 3. Guardamos en la base de datos con el ID generado por Stripe
    await Product.create({
      ...validated,
      stripeId: stripePrice.id,
      inStock: validated.stock > 0 ? true : false, // Re-evaluate inStock based on stock quantity
    });

    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true, error: null };
  } catch (err: unknown) {
    console.error("Error creating product:", err);

    if (err instanceof z.ZodError) {
      return {
        success: false,
        error: err.issues[0]?.message || "Error de validación en los datos",
      };
    }

    if (err && typeof err === "object" && "code" in err) {
      const mongoError = err as { code: number };
      if (mongoError.code === 11000) {
        return { success: false, error: "Este Stripe ID ya está registrado" };
      }
    }

    const message =
      err instanceof Error
        ? err.message
        : "Error desconocido al crear el producto";
    return { success: false, error: message };
  }
}
