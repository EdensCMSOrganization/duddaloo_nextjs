// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useCartId } from "@/lib/cartUtils";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingBag, Menu, X } from "lucide-react";


export default function Navbar() {
  const cartId = useCartId();
  const [totalItems, setTotalItems] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

   const currentYear = new Date().getFullYear();

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

  // Cerrar menú al hacer click en un link
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // Prevenir scroll cuando el menú está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <nav className="border-b border-gray-200 shadow-xl relative">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          <Image
            src="/logoduddaloo.svg"
            alt="affars logo"
            width={120}
            height={120}
            priority
          />
        </Link>

        {/* Links de navegación - Ocultos en móvil, visibles en desktop */}
        <div className="hidden md:flex gap-4">
          <Link href="/" className="hover:text-gray-600 transition">Home</Link>
          <Link href="/products" className="hover:text-gray-600 transition">Shop</Link>
          <Link href="/about" className="hover:text-gray-600 transition">About</Link>
          <Link href="/contact" className="hover:text-gray-600 transition">Contact</Link>
        </div>

        {/* Contenedor para iconos de carrito y menú hamburguesa */}
        <div className="flex items-center gap-4">
          {/* Carrito - Siempre visible */}
          <Link href="/cart" className="relative">
            <ShoppingBag className="w-6 h-6 text-gray-700 hover:text-black transition" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Botón menú hamburguesa - Solo visible en móvil */}
          <button 
            className="md:hidden relative z-50 p-2 -mr-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <Menu 
                className={`
                  absolute top-0 left-0 w-6 h-6 text-gray-700 transition-all duration-300
                  ${isMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}
                `}
              />
              <X 
                className={`
                  absolute top-0 left-0 w-6 h-6 text-gray-700 transition-all duration-300
                  ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}
                `}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Fondo blur cuando el menú está abierto */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-md md:hidden z-40 transition-opacity duration-300"
          onClick={handleLinkClick}
        />
      )}

      {/* Menú móvil desplegable - Moderno */}
      <div className={`
        fixed top-0 right-0 h-full w-72 bg-white/95 backdrop-blur-lg shadow-2xl md:hidden z-50
        transform transition-all duration-500 ease-out
        ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}>
        {/* Header del menú con logo pequeño y X */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="w-16 h-16 relative">
            <Image
              src="/logoduddaloo.svg"
              alt="logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Links del menú */}
        <div className="flex flex-col p-6 space-y-2">
          <Link 
            href="/" 
            className="text-right text-xl py-4 px-6 hover:bg-gray-100 rounded-xl transition-all hover:scale-105"
            onClick={handleLinkClick}
          >
            Home
          </Link>
          <Link 
            href="/products" 
            className="text-right text-xl py-4 px-6 hover:bg-gray-100 rounded-xl transition-all hover:scale-105"
            onClick={handleLinkClick}
          >
            Shop
          </Link>
          <Link 
            href="/about" 
            className="text-right text-xl py-4 px-6 hover:bg-gray-100 rounded-xl transition-all hover:scale-105"
            onClick={handleLinkClick}
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className="text-right text-xl py-4 px-6 hover:bg-gray-100 rounded-xl transition-all hover:scale-105"
            onClick={handleLinkClick}
          >
            Contact
          </Link>
        </div>

      
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100">
          <p className="text-gray-400">
          &copy; {currentYear} Duddaloos AB.
        </p>
        </div>
      </div>
    </nav>
  );
}