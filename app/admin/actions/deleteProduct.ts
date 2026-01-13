// app/admin/actions/deleteProduct.ts
'use server';

import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function deleteProduct(productId: string) {
  await connectDB();
  await Product.findByIdAndDelete(productId);
  // No necesitas revalidatePath si usas router.refresh()
}