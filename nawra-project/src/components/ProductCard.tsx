// src/components/ProductCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { Product } from '@/types';
import { useAuth } from '@/components/providers/AuthProvider';

interface ProductCardProps {
  product: Product;
  isInWishlist?: boolean;
  onWishlistToggle?: (productId: string) => Promise<boolean>;
}

export default function ProductCard({ product, isInWishlist = false, onWishlistToggle }: ProductCardProps) {
  const { user } = useAuth();
  const [wishlisted, setWishlisted] = useState(isInWishlist);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || !onWishlistToggle) return;

    setWishlistLoading(true);
    const success = await onWishlistToggle(product.id);
    if (success) {
      setWishlisted(!wishlisted);
    }
    setWishlistLoading(false);
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group card-light overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-accent">
        <Image
          src={product.images[0] || '/images/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.stock_status === 'limited' && (
            <span className="badge-limited">Stock limité</span>
          )}
          {product.compare_at_price && (
            <span className="badge-gold">
              -{Math.round((1 - product.price / product.compare_at_price) * 100)}%
            </span>
          )}
        </div>

        {/* Wishlist button */}
        {user && onWishlistToggle && (
          <button
            onClick={handleWishlistClick}
            disabled={wishlistLoading}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors disabled:opacity-50 z-10"
            aria-label={wishlisted ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <svg
              className={`w-5 h-5 transition-colors ${wishlisted ? 'text-red-500 fill-red-500' : 'text-primary/40'}`}
              fill={wishlisted ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        )}

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-primary px-4 py-2 rounded-lg text-sm font-body font-medium">
            Voir le produit
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-heading text-lg text-primary font-medium mb-1 group-hover:text-secondary transition-colors">
          {product.name}
        </h3>
        <p className="font-body text-text-secondary text-sm mb-3 line-clamp-2">
          {product.short_description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-heading text-xl text-primary font-semibold">
            {product.price}€
          </span>
          {product.compare_at_price && (
            <span className="font-body text-sm text-text-secondary line-through">
              {product.compare_at_price}€
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
