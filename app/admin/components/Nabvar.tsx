// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useCartId } from "@/lib/cartUtils";
import { useEffect, useState } from "react";
import Image from "next/image";

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
    <nav className="flex justify-between items-center p-4 border-b">
      <Link href="/" className="text-xl font-bold">
         <Image
          src="/logo.svg" 
          alt="Logo cms"
          width={80} 
          height={80} // Alto en píxeles
          priority // Si es el logo principal, carga prioritariamente
        />
      </Link>
      <Link href="/cart" className="relative">
        🛒 Cart
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </Link>
    </nav>
  );
}
