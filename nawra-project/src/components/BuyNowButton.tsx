// src/components/BuyNowButton.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import type { Product } from '@/types';

interface BuyNowButtonProps {
  product: Product;
  className?: string;
}

export default function BuyNowButton({ product, className = '' }: BuyNowButtonProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = () => {
    if (product.stock_status === 'out_of_stock') return;

    setIsProcessing(true);
    addToCart(product, 1);

    // Redirect to checkout after a brief delay
    setTimeout(() => {
      router.push('/checkout');
    }, 100);
  };

  const isDisabled = product.stock_status === 'out_of_stock';

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled || isProcessing}
      className={`
        relative w-full py-4 px-8 rounded-xl font-body font-medium text-base
        transition-all duration-300 flex items-center justify-center gap-2
        border-2 border-secondary
        ${isDisabled
          ? 'bg-primary/5 text-primary/40 border-primary/20 cursor-not-allowed'
          : 'bg-secondary/10 text-primary hover:bg-secondary hover:text-primary active:scale-[0.98]'
        }
        ${className}
      `}
    >
      {isProcessing ? (
        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Acheter maintenant
        </>
      )}
    </button>
  );
}
