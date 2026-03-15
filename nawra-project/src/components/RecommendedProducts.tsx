// src/components/RecommendedProducts.tsx
'use client';

import { useMemo } from 'react';
import type { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { useWishlist } from '@/hooks/useWishlist';
import { getRecommendations } from '@/lib/recommendations';

interface RecommendedProductsProps {
  title?: string;
  subtitle?: string;
  allProducts: Product[];
  currentProduct?: Product;
  cartProductIds?: string[];
  purchasedCategories?: string[];
  limit?: number;
  className?: string;
}

export default function RecommendedProducts({
  title = 'Vous aimerez aussi',
  subtitle,
  allProducts,
  currentProduct,
  cartProductIds = [],
  purchasedCategories = [],
  limit = 4,
  className = '',
}: RecommendedProductsProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();

  const recommendations = useMemo(() => {
    return getRecommendations(
      {
        currentProduct,
        cartProductIds,
        purchasedCategories,
      },
      allProducts,
      { limit }
    );
  }, [currentProduct, cartProductIds, purchasedCategories, allProducts, limit]);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className={className}>
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-semibold text-primary">
          {title}
        </h2>
        {subtitle && (
          <p className="font-body text-text-secondary mt-1">
            {subtitle}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isInWishlist={isInWishlist(product.id)}
            onWishlistToggle={toggleWishlist}
          />
        ))}
      </div>
    </section>
  );
}
