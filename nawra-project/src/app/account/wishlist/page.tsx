// src/app/account/wishlist/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/providers/AuthProvider';
import { useWishlist } from '@/hooks/useWishlist';
import Navbar from '@/components/sections/Navbar';

export default function WishlistPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, loading: wishlistLoading, removeFromWishlist } = useWishlist();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/account/login');
    }
  }, [user, authLoading, router]);

  const handleRemove = async (productId: string) => {
    await removeFromWishlist(productId);
  };

  if (authLoading || wishlistLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-primary/10 rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-primary/10 rounded w-32 mx-auto"></div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="font-heading text-3xl font-semibold text-primary mb-1">
                Mes Favoris
              </h1>
              <p className="font-body text-primary/60">
                {items.length} produit{items.length > 1 ? 's' : ''} dans votre liste
              </p>
            </div>
            <Link
              href="/account"
              className="px-4 py-2 rounded-lg border border-primary/10 text-primary/60 hover:bg-primary/5 transition-colors text-sm"
            >
              Retour au compte
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1 space-y-2">
              <Link
                href="/account"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 text-primary/70 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Mon profil
              </Link>
              <Link
                href="/account/orders"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 text-primary/70 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Mes commandes
              </Link>
              <Link
                href="/account/wishlist"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/10 text-primary font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Mes favoris
              </Link>
              <Link
                href="/account/addresses"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 text-primary/70 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Mes adresses
              </Link>
            </div>

            {/* Main content */}
            <div className="md:col-span-2">
              {items.length === 0 ? (
                <div className="bg-white rounded-2xl border border-primary/10 p-10 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/5 flex items-center justify-center">
                    <svg className="w-10 h-10 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-primary mb-2">
                    Votre liste de favoris est vide
                  </h3>
                  <p className="font-body text-primary/60 mb-6">
                    Explorez notre collection et ajoutez vos coiffeuses préférées !
                  </p>
                  <Link
                    href="/collections"
                    className="inline-flex px-6 py-3 rounded-xl bg-secondary text-primary font-semibold hover:bg-secondary/90 transition-colors"
                  >
                    Découvrir nos coiffeuses
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-primary/10 p-4 flex items-center gap-4"
                    >
                      {/* Product image */}
                      <Link
                        href={`/products/${item.product?.slug}`}
                        className="w-24 h-24 rounded-xl overflow-hidden bg-accent flex-shrink-0"
                      >
                        {item.product?.images?.[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product?.name || 'Produit'}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl text-primary/20">
                            🪞
                          </div>
                        )}
                      </Link>

                      {/* Product info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.product?.slug}`}
                          className="font-heading text-lg text-primary hover:text-secondary transition-colors"
                        >
                          {item.product?.name || 'Produit'}
                        </Link>
                        <p className="font-body text-primary/50 text-sm truncate mt-1">
                          {item.product?.short_description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-heading text-xl text-secondary">
                            {item.product?.price}€
                          </span>
                          {item.product?.compare_at_price && (
                            <span className="font-body text-sm text-primary/40 line-through">
                              {item.product.compare_at_price}€
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <Link
                          href={`/products/${item.product?.slug}`}
                          className="px-4 py-2 bg-secondary text-primary text-sm font-medium rounded-lg hover:bg-secondary/90 transition-colors"
                        >
                          Voir
                        </Link>
                        <button
                          onClick={() => handleRemove(item.productId)}
                          className="px-4 py-2 border border-red-200 text-red-400 text-sm rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          Retirer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
