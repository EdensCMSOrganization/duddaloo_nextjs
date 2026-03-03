"use client";

import { useCartId } from "@/lib/cartUtils";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import Link from "next/link";
import Toast from "./Toast";
import ErrorModal from "./ErrorModal";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  inStock: boolean;
  stock?: number;
  category?: string;
  rabatt?: boolean;
  discountPercentage?: number;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const cartId = useCartId();
  const [loading, setLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Cargar categorías al montar el componente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Buscar el nombre de la categoría cuando tenemos el ID
  useEffect(() => {
    if (product.category && categories.length > 0) {
      const foundCategory = categories.find(c => c._id === product.category);
      if (foundCategory) {
        setCategoryName(foundCategory.name);
      }
    }
  }, [product.category, categories]);

  const discountedPrice =
    product.rabatt && product.discountPercentage
      ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
      : null;

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!cartId || !product.inStock) return;
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, productId: product._id, quantity: 1 }),
      });
      if (res.ok) {
        window.dispatchEvent(new Event("cart-updated"));
        setToast({ message: `${product.name} added to cart`, type: "success" });
      } else {
        const data = await res.json();
        setErrorMessage(data.error || "Error adding to cart");
      }
    } catch {
      setToast({ message: "Error adding to cart", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    setToast({
      message: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      type: "info",
    });
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {errorMessage && (
        <ErrorModal
          isOpen={!!errorMessage}
          onClose={() => setErrorMessage(null)}
          title="Lagervarning"
          message={errorMessage}
        />
      )}
      <Link href={`/shop/${product._id}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl bg-gray-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          {/* Kampanj - siempre visible si hay rabatt */}
          {product.rabatt && product.discountPercentage && (
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-red-500 text-white shadow-lg">
                🏷️ Kampany -{product.discountPercentage}%
              </span>
            </div>
          )}

          {/* Categoría - solo si existe y NO hay kampanj */}
          {categoryName && !product.rabatt && (
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-white/90 backdrop-blur-sm text-gray-700">
                {categoryName}
              </span>
            </div>
          )}

          {!product.inStock && (
            <div className="absolute top-3 right-3 z-10">
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600">
                Out of stock
              </span>
            </div>
          )}

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

          <div className="relative aspect-4/5 overflow-hidden">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-fit transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>

          <div className="p-5">
            <div className="mb-2">
              <h3 className="font-serif text-lg font-medium text-gray-800 group-hover:text-purple-600 transition-colors line-clamp-1">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2 min-h-10">
                {product.description}
              </p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div>
                {discountedPrice ? (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xl text-red-600">
                      {discountedPrice} SEK
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {product.price} SEK
                    </span>
                  </div>
                ) : (
                  <span className="font-bold text-xl text-gray-900">
                    {product.price} SEK
                  </span>
                )}
                {product.inStock && typeof product.stock === "number" && (
                  <p className="text-xs text-gray-500 mt-1">
                    {product.stock} kvar
                  </p>
                )}
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
    </>
  );
}