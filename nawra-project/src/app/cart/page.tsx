// src/app/cart/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import Navbar from '@/components/sections/Navbar';
import FooterVelora from '@/components/sections/FooterVelora';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, isLoaded, clearCart } = useCart();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-primary mb-8">
            Mon panier
          </h1>

          {!isLoaded ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
            </div>
          ) : cart.items.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="font-heading text-2xl text-primary mb-2">Ton panier est vide</h2>
              <p className="font-body text-text-secondary mb-6">
                Découvre nos coiffeuses pour créer ton coin beauté de rêve.
              </p>
              <Link href="/collections" className="btn-primary inline-flex">
                Voir les coiffeuses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-4 bg-white rounded-2xl border border-primary/5"
                  >
                    {/* Image */}
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-accent flex-shrink-0"
                    >
                      <Image
                        src={item.product.images[0] || '/images/placeholder.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="font-heading text-lg font-medium text-primary hover:text-secondary transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="font-body text-sm text-text-secondary mt-1 line-clamp-1">
                        {item.product.short_description}
                      </p>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-primary hover:bg-accent/80 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="font-body text-base w-10 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-primary hover:bg-accent/80 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                            </svg>
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-heading text-xl font-semibold text-primary">
                          {item.product.price * item.quantity}€
                        </span>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-primary/40 hover:text-red-500 transition-colors self-start"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}

                {/* Clear cart */}
                <button
                  onClick={clearCart}
                  className="text-sm text-text-secondary hover:text-red-500 transition-colors"
                >
                  Vider le panier
                </button>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-primary/5 p-6 sticky top-24">
                  <h2 className="font-heading text-xl font-semibold text-primary mb-6">
                    Récapitulatif
                  </h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="font-body text-text-secondary">Sous-total</span>
                      <span className="font-body text-primary">{cart.total}€</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-body text-text-secondary">Livraison</span>
                      <span className="font-body text-emerald-600">Offerte</span>
                    </div>
                  </div>

                  <div className="border-t border-primary/10 pt-4 mb-6">
                    <div className="flex justify-between">
                      <span className="font-heading text-lg font-semibold text-primary">Total</span>
                      <span className="font-heading text-2xl font-semibold text-primary">{cart.total}€</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="btn-secondary w-full flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Commander
                  </Link>

                  <p className="text-center text-xs text-text-secondary mt-4">
                    Paiement 100% sécurisé par Stripe
                  </p>

                  {/* Trust badges */}
                  <div className="mt-6 pt-6 border-t border-primary/10 space-y-2">
                    {[
                      '✓ Livraison offerte en France',
                      '✓ Retours gratuits sous 30 jours',
                      '✓ Garantie 2 ans',
                    ].map((text, i) => (
                      <p key={i} className="text-xs text-text-secondary">
                        {text}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <FooterVelora />
    </>
  );
}
