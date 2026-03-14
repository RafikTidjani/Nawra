// src/components/ProductCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
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
