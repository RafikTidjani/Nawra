// src/components/AddToCartButton.tsx
'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import type { Product } from '@/types';
import { getCrossSellProducts } from '@/lib/data';
import CrossSellPopup from './CrossSellPopup';

interface AddToCartButtonProps {
  product: Product;
  className?: string;
  showCrossSell?: boolean;
}

export default function AddToCartButton({
  product,
  className = '',
  showCrossSell = true
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);

  const handleClick = () => {
    setIsAdding(true);
    addToCart(product, 1);

    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);

      // Show cross-sell popup if enabled and has suggestions
      if (showCrossSell) {
        const suggestions = getCrossSellProducts(product.id);
        if (suggestions.length > 0) {
          setSuggestedProducts(suggestions);
          setShowPopup(true);
        }
      }

      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    }, 300);
  };

  const handleAddSuggested = (suggestedProduct: Product) => {
    addToCart(suggestedProduct, 1);
  };

  const isDisabled = product.stock_status === 'out_of_stock';

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isDisabled || isAdding}
        className={`
          relative w-full py-4 px-8 rounded-xl font-body font-medium text-base
          transition-all duration-300 flex items-center justify-center gap-2
          ${isDisabled
            ? 'bg-primary/10 text-primary/40 cursor-not-allowed'
            : isAdded
              ? 'bg-emerald-500 text-white'
              : 'bg-primary text-white hover:bg-primary/90 active:scale-[0.98]'
          }
          ${className}
        `}
      >
        {isAdding ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : isAdded ? (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Ajouté au panier
          </>
        ) : isDisabled ? (
          'Rupture de stock'
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Ajouter au panier
          </>
        )}
      </button>

      {/* Cross-sell popup */}
      <CrossSellPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        addedProduct={product}
        suggestedProducts={suggestedProducts}
        onAddToCart={handleAddSuggested}
      />
    </>
  );
}
