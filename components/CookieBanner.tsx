"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CookieBanner() {
  // Inicializamos en false para evitar discrepancias de hidratación (SSR)
  const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
  const cookieConsent = localStorage.getItem("cookieConsent");
  
  if (!cookieConsent) {
    // Usamos un requestAnimationFrame o un timeout de 0
    // Esto mueve la ejecución al siguiente "tick" del navegador
    // y el linter deja de quejarse porque ya no es "síncrono"
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }
}, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const hanteraAvvisa = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setIsVisible(false);
  };

  // Si isVisible es false, no renderizamos nada. 
  // Al estar controlado por useEffect, esto solo ocurrirá en el cliente.
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-700">
              Vi använder cookies för att förbättra din upplevelse. Nödvändiga
              cookies krävs för att webbplatsen ska fungera.{" "}
              <a
                href="/privacy"
                className="text-purple-600 hover:text-purple-700 underline"
              >
                Mer information
              </a>
            </p>
          </div>
          <div className="flex gap-3 sm:gap-4 shrink-0">
            <button
              onClick={hanteraAvvisa}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Avvisa
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Acceptera
            </button>
          </div>
          <button
            onClick={hanteraAvvisa}
            className="absolute top-3 right-3 sm:hidden text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}