// src/hooks/useWishlist.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import type { Product } from '@/types';

interface WishlistItem {
  id: string;
  productId: string;
  createdAt: string;
  product: Product;
}

interface UseWishlistReturn {
  items: WishlistItem[];
  productIds: string[];
  loading: boolean;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<boolean>;
  toggleWishlist: (productId: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

export function useWishlist(): UseWishlistReturn {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const productIds = items.map(item => item.productId);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/wishlist');
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = useCallback((productId: string) => {
    return productIds.includes(productId);
  }, [productIds]);

  const addToWishlist = useCallback(async (productId: string): Promise<boolean> => {
    if (!user) {
      return false;
    }

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (res.ok) {
        await fetchWishlist();
        return true;
      }
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
    return false;
  }, [user, fetchWishlist]);

  const removeFromWishlist = useCallback(async (productId: string): Promise<boolean> => {
    if (!user) {
      return false;
    }

    try {
      const res = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setItems(prev => prev.filter(item => item.productId !== productId));
        return true;
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
    return false;
  }, [user]);

  const toggleWishlist = useCallback(async (productId: string): Promise<boolean> => {
    if (isInWishlist(productId)) {
      return removeFromWishlist(productId);
    } else {
      return addToWishlist(productId);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  return {
    items,
    productIds,
    loading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    refresh: fetchWishlist,
  };
}

export default useWishlist;
