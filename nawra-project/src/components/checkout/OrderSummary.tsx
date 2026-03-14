// src/components/checkout/OrderSummary.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { CartItem } from '@/types';

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
}

export default function OrderSummary({ items, total }: OrderSummaryProps) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white rounded-2xl border border-primary/5 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-primary/10">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-primary">
            Récapitulatif
          </h2>
          <Link
            href="/cart"
            className="text-sm font-body text-secondary hover:text-secondary/80 transition-colors"
          >
            Modifier
          </Link>
        </div>
        <p className="font-body text-sm text-text-secondary mt-1">
          {itemCount} article{itemCount > 1 ? 's' : ''}
        </p>
      </div>

      {/* Items */}
      <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto">
        {items.map((item) => (
          <div key={item.product.id} className="flex gap-4">
            {/* Image */}
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-accent flex-shrink-0">
              <Image
                src={item.product.images[0] || '/images/placeholder.jpg'}
                alt={item.product.name}
                fill
                className="object-cover"
                sizes="64px"
              />
              {item.quantity > 1 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium">
                  {item.quantity}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-body text-sm font-medium text-primary truncate">
                {item.product.name}
              </h3>
              <p className="font-body text-xs text-text-secondary mt-0.5 line-clamp-1">
                {item.product.short_description}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="font-body text-xs text-text-secondary">
                  {item.quantity > 1 && `${item.quantity} × `}{item.product.price}€
                </span>
                <span className="font-heading text-sm font-semibold text-primary">
                  {item.product.price * item.quantity}€
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="p-6 bg-accent/30 border-t border-primary/5">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="font-body text-text-secondary">Sous-total</span>
            <span className="font-body text-primary">{total}€</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-body text-text-secondary">Livraison</span>
            <span className="font-body text-emerald-600 font-medium">Offerte</span>
          </div>
        </div>

        <div className="border-t border-primary/10 mt-4 pt-4">
          <div className="flex justify-between items-center">
            <span className="font-heading text-lg font-semibold text-primary">Total</span>
            <span className="font-heading text-2xl font-semibold text-secondary">{total}€</span>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="p-6 border-t border-primary/5 bg-white">
        <div className="space-y-3">
          {[
            { icon: '🚚', text: 'Livraison offerte en France métropolitaine' },
            { icon: '📦', text: 'Expédition sous 24-48h' },
            { icon: '↩️', text: 'Retours gratuits sous 30 jours' },
            { icon: '🛡️', text: 'Garantie 2 ans' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-text-secondary">
              <span>{item.icon}</span>
              <span className="font-body">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
