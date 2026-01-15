// app/shop/[id]/page.tsx
import Navbar from "@/components/Nabvar";
import ProductDetail from "@/components/ProductDetail";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { notFound } from "next/navigation";

async function getProduct(id: string) {
  console.log("🔍 Buscando producto con ID:", id);
  
  try {
    await connectDB();
    const product = await Product.findById(id).lean();
    
    if (!product) {
      console.log("❌ Producto NO encontrado");
      return null;
    }
    
    console.log("✅ Producto ENCONTRADO:", product.name);
    
    return {
      ...product,
      _id: product._id.toString(),
      createdAt: product.createdAt?.toString(),
      updatedAt: product.updatedAt?.toString(),
    };
  } catch (error) {
    console.error("💥 Error en getProduct:", error);
    return null;
  }
}

// CORREGIDO: Usar await antes de params
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  // Desempaquetar la Promise
  const { id } = await params;
  console.log("📱 generateMetadata - ID:", id);
  
  const product = await getProduct(id);
  
  if (!product) {
    return {
      title: "Product Not Found - Duddaloo",
    };
  }
  
  return {
    title: `${product.name} - Duddaloo`,
    description: product.description || "Beautiful product for children",
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

// CORREGIDO: La página principal también necesita await params
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  console.log("🚀 ProductPage ejecutándose");
  
  // Desempaquetar la Promise
  const { id } = await params;
  console.log("📋 ID recibido:", id);
  
  const product = await getProduct(id);
  
  if (!product) {
    console.log("📛 Mostrando página 404");
    notFound();
  }

  console.log("🎉 Renderizando ProductDetail con:", product.name);
  
  return (
    <>
      <Navbar />
      <ProductDetail product={product} />
    </>
  );
}