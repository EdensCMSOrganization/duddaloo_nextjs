import connectDB from '@/lib/db';
import Product from '@/models/Product';
import DeleteProductButton from './DeleteProductButton';
import EditProductForm from './EditProductForm';

export default async function AdminProductList() {
  await connectDB();
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();

  if (products.length === 0) {
    return <p>No products yet.</p>;
  }

  // Convert MongoDB documents to plain objects (POJO)
  const plainProducts = products.map(doc => ({
    ...doc,
    _id: doc._id.toString(),
    // Ensure dates and complex types are strings
    createdAt: doc.createdAt?.toString(),
    updatedAt: doc.updatedAt?.toString(),
  }));

  return (
    <div className="space-y-6">
    
      {plainProducts.map((product) => (
        <div key={product._id} className="border rounded p-4 ">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
              <p className="mt-1 text-sm">
                {product.price} SEK • {product.inStock ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>
            <div className="flex gap-2">
              <DeleteProductButton productId={product._id} />
            </div>
          </div>

          <div className="mt-4">
            <details className="group">
              <summary className="cursor-pointer text-blue-600 hover:underline">
                Edit product
              </summary>
              <div className="mt-4">
                <EditProductForm product={product} />
              </div>
            </details>
          </div>
        </div>
      ))}
    </div>
  );
}
