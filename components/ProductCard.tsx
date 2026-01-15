// components/ProductCard.tsx
"use client";

import { useCartId } from "@/lib/cartUtils";
import Image from "next/image";
import { useState } from "react";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import Link from "next/link";

export default function ProductCard({
  product,
}: {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    inStock: boolean;
    category?: string;
  };
}) {
  const cartId = useCartId();
  const [loading, setLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Evitar que el link se active
    e.stopPropagation(); // Detener propagación del evento
    
    if (!cartId || !product.inStock) return;
    setLoading(true);
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, productId: product._id, quantity: 1 }),
      });
      // Disparar evento para actualizar el Navbar
      window.dispatchEvent(new Event("cart-updated"));
      alert("✅ Added to cart");
    } catch (error) {
      alert("Error adding to cart");
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Link href={`/shop/${product._id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-gray-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Badge de categoría */}
        {product.category && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-white/90 backdrop-blur-sm text-gray-700">
              {product.category}
            </span>
          </div>
        )}
        
        {/* Badge de stock */}
        {!product.inStock && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600">
              Out of stock
            </span>
          </div>
        )}
        
        {/* Botones de acción */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={toggleWishlist}
            className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white hover:shadow-md transition-all"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} 
              size={16}
            />
          </button>
          <button
            className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white hover:shadow-md transition-all"
            aria-label="Quick view"
          >
            <Eye className="h-4 w-4 text-gray-600" size={16} />
          </button>
        </div>
        
        {/* Imagen del producto */}
        <div className="relative aspect-[4/5] overflow-hidden">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        
        {/* Información del producto */}
        <div className="p-5">
          <div className="mb-2">
            <h3 className="font-serif text-lg font-medium text-gray-800 group-hover:text-purple-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2 min-h-[40px]">
              {product.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div>
              <span className="font-bold text-xl text-gray-900">
                {product.price} SEK
              </span>
            </div>
            
            <button
              onClick={addToCart}
              disabled={!product.inStock || loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                product.inStock
                  ? "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-md active:scale-95"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              } ${loading ? "opacity-70" : ""}`}
              aria-label={product.inStock ? "Add to cart" : "Out of stock"}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Adding...</span>
                </>
              ) : product.inStock ? (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  <span className="text-sm">Add to cart</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  <span className="text-sm">Out of stock</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}