// app/admin/components/PortalModal.tsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PortalModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void; // Optional close handler for backdrop clicks
  closeOnBackdropClick?: boolean; // Whether clicking backdrop closes modal
}

/**
 * PortalModal - Renders children in a React Portal at the document body level
 * This ensures the modal sits above all other content regardless of DOM hierarchy
 */
export default function PortalModal({
  children,
  isOpen,
  onClose,
  closeOnBackdropClick = true,
}: PortalModalProps) {
  const [mounted, setMounted] = useState(false);

  // Ensure component is only rendered on client-side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle backdrop clicks
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && onClose && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Don't render anything until mounted on client
  if (!mounted || !isOpen) return null;

  // Create portal at document.body level with high z-index
  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {children}
    </div>,
    document.body // Portal target - ensures modal is at top DOM level
  );
}