// src/hooks/useCart.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Product, CartItem, CartState } from '@/types';

const CART_STORAGE_KEY = 'velora-cart';

function getInitialCart(): CartState {
  if (typeof window === 'undefined') {
    return { items: [], total: 0 };
  }
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading cart from localStorage:', e);
  }
  return { items: [], total: 0 };
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export function useCart() {
  const [cart, setCart] = useState<CartState>({ items: [], total: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const initialCart = getInitialCart();
    setCart(initialCart);
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.items.findIndex(
        (item) => item.product.id === product.id
      );

      let newItems: CartItem[];

      if (existingIndex >= 0) {
        // Update quantity if product already in cart
        newItems = prev.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new product
        newItems = [...prev.items, { product, quantity }];
      }

      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => {
      const newItems = prev.items.filter(
        (item) => item.product.id !== productId
      );
      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) => {
      const newItems = prev.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart({ items: [], total: 0 });
  }, []);

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    isLoaded,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
  };
}
