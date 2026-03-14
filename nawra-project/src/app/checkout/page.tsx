// src/app/checkout/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import Navbar from '@/components/sections/Navbar';
import FooterVelora from '@/components/sections/FooterVelora';
import CheckoutForm, { type CheckoutFormData } from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, isLoaded, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to cart if empty
  useEffect(() => {
    if (isLoaded && cart.items.length === 0) {
      router.push('/cart');
    }
  }, [isLoaded, cart.items.length, router]);

  const handleSubmit = async (formData: CheckoutFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare order items for API
      const orderItems = cart.items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productPrice: item.product.price,
        productImage: item.product.images[0] || null,
        quantity: item.quantity,
      }));

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            address2: formData.address2,
            city: formData.city,
            zip: formData.zip,
            note: formData.note,
          },
          items: orderItems,
          total: cart.total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      if (data.url) {
        // Clear cart before redirecting to Stripe
        clearCart();
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (!isLoaded) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-20">
          <div className="flex items-center justify-center py-32">
            <div className="w-10 h-10 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
          </div>
        </main>
        <FooterVelora />
      </>
    );
  }

  // Empty cart (should redirect, but show fallback)
  if (cart.items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-20">
          <div className="max-w-4xl mx-auto px-6 py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="font-heading text-2xl text-primary mb-4">Ton panier est vide</h1>
            <Link href="/collections" className="btn-primary inline-flex">
              Voir les coiffeuses
            </Link>
          </div>
        </main>
        <FooterVelora />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background pt-20">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm font-body text-text-secondary mb-8">
            <Link href="/cart" className="hover:text-primary transition-colors">
              Panier
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-primary font-medium">Checkout</span>
          </nav>

          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-primary mb-8">
            Finaliser la commande
          </h1>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-body">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-primary/5 p-6 md:p-8">
                <CheckoutForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-24">
                <OrderSummary items={cart.items} total={cart.total} />
              </div>
            </div>
          </div>

          {/* Security badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 py-8 border-t border-primary/5">
            <div className="flex items-center gap-2 text-text-secondary">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-sm font-body">Paiement sécurisé SSL</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 1.87 0 3.713.759 4.83 1.357l.713-4.373c-1.244-.553-3.022-1.057-5.305-1.057-2.172 0-3.923.56-5.04 1.61-1.21 1.13-1.84 2.688-1.84 4.607 0 3.465 2.607 4.932 5.305 5.98 2.172.805 2.765 1.426 2.765 2.409 0 .935-.738 1.305-2.198 1.305-1.87 0-4.356-.874-5.895-1.876L4.3 20.034c1.514.934 3.923 1.61 6.554 1.61 2.283 0 4.14-.553 5.34-1.61 1.3-1.13 1.957-2.805 1.957-4.881 0-3.465-2.607-4.932-4.175-6.003z"/>
              </svg>
              <span className="text-sm font-body">Powered by Stripe</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm font-body">Données protégées</span>
            </div>
          </div>
        </div>
      </main>

      <FooterVelora />
    </>
  );
}
