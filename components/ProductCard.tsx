// components/ProductCard.tsx
"use client";

import { useCartId } from "@/lib/cartUtils";
import Image from "next/image";
import { useState } from "react";

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
  };
}) {
  const cartId = useCartId();
  const [loading, setLoading] = useState(false);

  const addToCart = async () => {
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

  return (
    <div className="border rounded p-4 flex flex-col">
      {product.images[0] && (
        <Image
          src={product.images[0]}
          alt={product.name}
          width={300}
          height={192}
          className="w-full h-48 object-cover rounded mb-3"
        />
      )}
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-gray-600 text-sm line-clamp-2">
        {product.description}
      </p>
      <p className="mt-2 font-bold">{product.price} SEK</p>
      <button
        onClick={addToCart}
        disabled={!product.inStock || loading}
        className={`mt-2 py-2 rounded ${
          product.inStock
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {loading
          ? "Adding..."
          : product.inStock
          ? "Add to cart"
          : "Out of stock"}
      </button>
    </div>
  );
}
