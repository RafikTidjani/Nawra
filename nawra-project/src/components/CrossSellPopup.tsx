// src/components/CrossSellPopup.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';

interface CrossSellPopupProps {
  isOpen: boolean;
  onClose: () => void;
  addedProduct: Product;
  suggestedProducts: Product[];
  onAddToCart: (product: Product) => void;
}

export default function CrossSellPopup({
  isOpen,
  onClose,
  addedProduct,
  suggestedProducts,
  onAddToCart,
}: CrossSellPopupProps) {
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleAddToCart = useCallback((product: Product) => {
    onAddToCart(product);
    setAddedIds(prev => new Set(prev).add(product.id));
  }, [onAddToCart]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-primary/50 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full pointer-events-auto animate-scale-in overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 pb-4 border-b border-primary/5">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-primary/40 hover:text-primary transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Success message */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-body text-emerald-700 text-sm font-medium">
                  Ajouté au panier !
                </p>
                <p className="font-body text-text-secondary text-xs">
                  {addedProduct.name}
                </p>
              </div>
            </div>

            <h2 className="font-heading text-xl text-primary">
              Complète ton setup
            </h2>
            <p className="font-body text-text-secondary text-sm mt-1">
              Ces produits vont parfaitement avec ton choix
            </p>
          </div>

          {/* Suggested products */}
          <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto">
            {suggestedProducts.map((product) => {
              const isAdded = addedIds.has(product.id);
              return (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 rounded-xl border border-primary/5 hover:border-secondary/30 transition-colors"
                >
                  {/* Image */}
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="relative w-20 h-20 rounded-lg overflow-hidden bg-accent flex-shrink-0"
                  >
                    <Image
                      src={product.images[0] || '/images/placeholder.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={onClose}
                      className="font-body text-sm font-medium text-primary hover:text-secondary transition-colors line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <p className="font-body text-xs text-text-secondary mt-0.5 line-clamp-1">
                      {product.short_description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-baseline gap-2">
                        <span className="font-heading text-lg font-semibold text-secondary">
                          {product.price}€
                        </span>
                        {product.compare_at_price && (
                          <span className="font-body text-xs text-text-secondary line-through">
                            {product.compare_at_price}€
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={isAdded}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          isAdded
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-primary text-white hover:bg-primary/90'
                        }`}
                      >
                        {isAdded ? (
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Ajouté
                          </span>
                        ) : (
                          'Ajouter'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-6 pt-4 border-t border-primary/5 bg-accent/30">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 btn-outline text-sm py-3"
              >
                Continuer mes achats
              </button>
              <Link
                href="/checkout"
                onClick={onClose}
                className="flex-1 btn-secondary text-sm py-3 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Commander
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
