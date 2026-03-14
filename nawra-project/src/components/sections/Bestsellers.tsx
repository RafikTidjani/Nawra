// src/components/sections/Bestsellers.tsx
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';

interface BestsellersProps {
  products: Product[];
}

export default function Bestsellers({ products }: BestsellersProps) {
  return (
    <section id="bestsellers" className="section-padding bg-accent">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="section-header reveal">
          <span className="badge-gold mx-auto mb-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Bestsellers
          </span>
          <h2 className="section-title text-primary">
            Nos coiffeuses préférées
          </h2>
          <p className="section-subtitle text-text-secondary max-w-2xl mx-auto">
            Les modèles les plus appréciés par nos clientes
          </p>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, index) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group reveal card-light overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
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
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 reveal">
          <Link href="/collections" className="btn-primary inline-flex items-center gap-2">
            Voir toutes les coiffeuses
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
