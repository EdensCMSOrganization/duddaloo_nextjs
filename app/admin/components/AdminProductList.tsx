// app/admin/components/AdminProductList.tsx
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import DeleteProductButton from './DeleteProductButton';
import EditProductForm from './EditProductForm';

export default async function AdminProductList() {
  await connectDB();
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();

  if (products.length === 0) {
    return <p>Inga produkter än.</p>;
  }

  const plainProducts = products.map(doc => ({
    ...doc,
    _id: doc._id.toString(),
    createdAt: doc.createdAt?.toString(),
    updatedAt: doc.updatedAt?.toString(),
    stock: (doc as any).stock,
  }));

  return (
    <div className="space-y-6">
      {plainProducts.map((product) => (
        <div key={product._id} className="border rounded p-4 bg-white relative">
          {/* Lägg till ett overlay när formuläret är öppet */}
          <div className="details-overlay">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                <p className="mt-1 text-sm">
                  {product.price} SEK • Lager: {product.stock} • {product.inStock ? 'I lager' : 'Slut i lager'}
                </p>
              </div>
              <div className="flex gap-2">
                <DeleteProductButton productId={product._id} />
              </div>
            </div>

            <div className="mt-4">
              <details className="group">
                <summary className="cursor-pointer text-blue-600 hover:underline">
                  Redigera produkt
                </summary>
                <div className="mt-4 relative">
                  <EditProductForm product={product} />
                </div>
              </details>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
