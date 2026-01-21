// app/admin/actions/deleteProduct.ts
'use server';

import connectDB from '@/lib/db';
import Product from '@/models/Product';
// SECURITY FIX: Import auth verification for Server Actions
import { requireAuthAction } from '@/lib/auth';

export async function deleteProduct(productId: string) {
  // SECURITY FIX: Verify user is authenticated before allowing product deletion
  await requireAuthAction();
  
  await connectDB();
  await Product.findByIdAndDelete(productId);
  // No necesitas revalidatePath si usas router.refresh()
}