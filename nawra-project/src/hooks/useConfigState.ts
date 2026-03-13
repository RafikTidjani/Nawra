// src/hooks/useConfigState.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ConfigState, ProductType } from '@/types';

const STORAGE_KEY = 'nawra-config';

const initialState: ConfigState = {
  productType: 'panier',
  theme: '',
  size: '',
  items: [],
  step: 1,
};

interface UseConfigStateOptions {
  initialTheme?: string;
  initialType?: ProductType;
}

export function useConfigState(options?: UseConfigStateOptions | string) {
  // Support both old API (string) and new API (options object)
  const opts: UseConfigStateOptions = typeof options === 'string'
    ? { initialTheme: options }
    : options || {};

  const [state, setState] = useState<ConfigState>(() => {
    return {
      ...initialState,
      theme: opts.initialTheme || '',
      productType: opts.initialType || 'panier',
    };
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ConfigState;
        const urlType = opts.initialType || 'panier';
        const savedType = parsed.productType || 'panier';

        // If product type changed (user picked a different scenario), reset everything
        if (urlType !== savedType) {
          setState({
            ...initialState,
            productType: urlType,
            theme: opts.initialTheme || '',
          });
        } else {
          // Same type — restore saved progress
          setState({
            ...parsed,
            productType: urlType,
            theme: opts.initialTheme || parsed.theme || '',
          });
        }
      } else {
        setState(prev => ({
          ...prev,
          theme: opts.initialTheme || prev.theme,
          productType: opts.initialType || prev.productType,
        }));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [opts.initialTheme, opts.initialType]);

  // Save to localStorage on state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore localStorage errors
    }
  }, [state]);

  const setProductType = useCallback((productType: ProductType) => {
    setState(prev => ({ ...prev, productType, items: [] })); // Reset items when changing type
  }, []);

  const setTheme = useCallback((theme: string) => {
    setState(prev => ({ ...prev, theme }));
  }, []);

  const setSize = useCallback((size: string) => {
    setState(prev => ({ ...prev, size }));
  }, []);

  const toggleItem = useCallback((productId: string, maxSlots: number) => {
    setState(prev => {
      const exists = prev.items.includes(productId);
      if (exists) {
        return { ...prev, items: prev.items.filter(id => id !== productId) };
      }
      // Check if we can add more
      if (prev.items.length >= maxSlots) {
        return prev;
      }
      return { ...prev, items: [...prev.items, productId] };
    });
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => {
      if (prev.step >= 3) return prev;
      return { ...prev, step: (prev.step + 1) as 1 | 2 | 3 };
    });
  }, []);

  const prevStep = useCallback(() => {
    setState(prev => {
      if (prev.step <= 1) return prev;
      return { ...prev, step: (prev.step - 1) as 1 | 2 | 3 };
    });
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  const goToStep = useCallback((step: 1 | 2 | 3) => {
    setState(prev => ({ ...prev, step }));
  }, []);

  return {
    state,
    setProductType,
    setTheme,
    setSize,
    toggleItem,
    nextStep,
    prevStep,
    goToStep,
    reset,
  };
}
