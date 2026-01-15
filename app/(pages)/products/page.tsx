import Navbar from '@/components/Nabvar';
import ProductCard from '@/components/ProductCard'
import connectDB from '@/lib/db';
import Product from '@/models/Product';

const ShopPage = async () => {
  await connectDB()
  const products = await Product.find({ inStock: true }).lean();
  return (
    <>
     <Navbar />
     <div className="h-screen max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold my-6">Products</h1>
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id.toString()}
                product={{
                  ...product,
                  _id: product._id.toString(),
                  createdAt: product.createdAt?.toString(),
                  updatedAt: product.updatedAt?.toString(),
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default ShopPage