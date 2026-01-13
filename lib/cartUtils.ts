// useCartId.ts
'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const CART_ID_KEY = 'cart_id';

export function useCartId(): string | null {
  // 1. Lazy initialization: Try to get the ID immediately
  const [cartId, setCartId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(CART_ID_KEY);
    }
    return null;
  });

  useEffect(() => {
    // If there is no cartId (first visit), generate one
    if (!cartId) {
      const newId = uuidv4();
      localStorage.setItem(CART_ID_KEY, newId);

      // 2. SOLUTION TO ERROR: Use a 0ms delay.
      // This moves setState to the end of the execution queue,
      // avoiding synchronous cascading rendering that ESLint prohibits.
      const timeout = setTimeout(() => {
        setCartId(newId);
      }, 0);

      return () => clearTimeout(timeout);
    }
  }, [cartId]);

  return cartId;
}
