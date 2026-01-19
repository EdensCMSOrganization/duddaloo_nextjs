// app/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight} from 'lucide-react';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Nabvar';
import ValuesSection from '@/components/ValuesSection';


export default async function HomePage() {
  // Traer solo 4 productos desde MongoDB
  await connectDB();
  const products = await Product.find({ inStock: true })
    .limit(4)
    .lean();

  return (
    <div>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-gray-900 leading-tight">
                  Nurturing little hearts with kindness & creativity
                </h1>
                <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg">
                  Beautiful products designed to support emotional learning, spark imagination, 
                  and create meaningful moments for children and families.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link 
                    href="/shop"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-300 bg-purple-600 text-white hover:bg-purple-700 h-12 rounded-lg px-8 text-base"
                  >
                    Explore Shop
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link 
                    href="/about"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300 h-12 rounded-lg px-8 text-base"
                  >
                    Our Story
                  </Link>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative aspect-4/5 lg:aspect-square overflow-hidden rounded-2xl bg-gray-100">
                  <Image
                    src="/homebild.svg"
                    alt="Bolla illustration"
                    fill
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl font-medium text-gray-900">
                  Featured Products
                </h2>
                <p className="mt-3 text-gray-600">
                  Thoughtfully designed for little ones
                </p>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium hover:bg-gray-100 hover:text-gray-900 h-11 px-6 py-2 self-start sm:self-auto"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            {products.length === 0 ? (
              <p className="text-center text-gray-600">No products available.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </section>

        {/* Values Section */}
        <ValuesSection />

        {/* Newsletter Section */}
        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-gray-900">
                Join Our Family
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Subscribe to receive updates on new products, parenting tips, 
                and exclusive offers for our community.
              </p>
              <form className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  className="flex w-full border border-gray-300 bg-white py-2 text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent h-12 px-5 rounded-xl"
                  placeholder="Enter your email"
                  required
                />
                <button 
                  type="submit"
                  className="inline-flex items-center justify-center whitespace-nowrap font-medium bg-purple-600 text-white hover:bg-purple-700 h-12 rounded-lg px-8 text-base shrink-0"
                >
                  Subscribe
                </button>
              </form>
              <p className="mt-4 text-xs text-gray-500">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}