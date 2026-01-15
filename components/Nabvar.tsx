// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useCartId } from "@/lib/cartUtils";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";


export default function Navbar() {
  const cartId = useCartId();
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (!cartId) return;
    const fetchCart = async () => {
      const res = await fetch(`/api/cart?cartId=${cartId}`);
      if (res.ok) {
        const data = await res.json();
        setTotalItems(data.totalItems || 0);
      }
    };

    fetchCart();

    // Escuchar el evento personalizado para actualizar el contador
    const handleCartUpdate = () => fetchCart();
    window.addEventListener("cart-updated", handleCartUpdate);

    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, [cartId]);

  return (
      <nav className="border-b border-gray-200 shadow-xl">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          
          <Link href="/" className="text-xl font-bold">
            <Image
              src="/logoduddaloo.svg"
              alt="affars logo"
              width={120}
              height={120}
              priority
            />
          </Link>

          <div className="flex gap-4">
            <Link href="/">Home</Link>
            <Link href="/products">Shop</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>

          <Link href="/cart" className="relative">
            <ShoppingBag className="w-6 h-6 text-gray-700 hover:text-black transition" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>


        </div>
      </nav>


  );
}
