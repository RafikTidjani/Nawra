// src/app/order/success/page.tsx
import Link from 'next/link';
import { stripe } from '@/lib/stripe';
import Navbar from '@/components/sections/Navbar';
import FooterVelora from '@/components/sections/FooterVelora';
import GuestAccountCreation from '@/components/GuestAccountCreation';

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

async function getSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });
    return session;
  } catch {
    return null;
  }
}

export default async function OrderSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-20">
          <div className="max-w-2xl mx-auto px-6 py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="font-heading text-3xl text-primary mb-4">
              Session invalide
            </h1>
            <p className="font-body text-text-secondary mb-8">
              Aucune session de paiement trouvée.
            </p>
            <Link href="/" className="btn-primary inline-flex">
              Retour à l&apos;accueil
            </Link>
          </div>
        </main>
        <FooterVelora />
      </>
    );
  }

  const session = await getSession(sessionId);

  if (!session || session.payment_status !== 'paid') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-20">
          <div className="max-w-2xl mx-auto px-6 py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="font-heading text-3xl text-primary mb-4">
              Paiement non confirmé
            </h1>
            <p className="font-body text-text-secondary mb-8">
              Le paiement n&apos;a pas pu être confirmé. Veuillez réessayer.
            </p>
            <Link href="/checkout" className="btn-primary inline-flex">
              Réessayer
            </Link>
          </div>
        </main>
        <FooterVelora />
      </>
    );
  }

  const metadata = session.metadata || {};
  const lineItems = session.line_items?.data || [];
  const totalAmount = (session.amount_total || 0) / 100;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background pt-20">
        <div className="max-w-2xl mx-auto px-6 py-16">
          {/* Success icon */}
          <div className="text-center mb-10">
            <div className="relative w-24 h-24 mx-auto mb-8">
              {/* Outer glow */}
              <div
                className="absolute inset-0 rounded-full animate-glow"
                style={{ boxShadow: '0 0 30px rgba(212, 165, 154, 0.3)' }}
              />
              {/* Circle */}
              <svg className="w-24 h-24" viewBox="0 0 96 96">
                <circle
                  cx="48" cy="48" r="44"
                  fill="none"
                  stroke="rgba(212, 165, 154, 0.2)"
                  strokeWidth="2"
                />
                <circle
                  cx="48" cy="48" r="44"
                  fill="none"
                  stroke="#D4A59A"
                  strokeWidth="2.5"
                  className="animate-circle-grow"
                  strokeLinecap="round"
                />
                {/* Checkmark */}
                <path
                  d="M30 48 L42 60 L66 36"
                  fill="none"
                  stroke="#D4A59A"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-check-draw"
                />
              </svg>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl text-primary mb-4">
              Commande confirmée !
            </h1>
            <p className="font-body text-text-secondary text-lg max-w-md mx-auto">
              Merci pour ta commande. Tu recevras un email de confirmation sous peu.
            </p>
          </div>

          {/* Order details card */}
          <div className="bg-white rounded-2xl border border-primary/5 shadow-sm overflow-hidden mb-6">
            <div className="p-6 border-b border-primary/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="font-heading text-xl text-primary">Détails de ta commande</h2>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Items */}
              {lineItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-primary/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-body text-primary">
                      {item.description}
                    </span>
                    {(item.quantity || 1) > 1 && (
                      <span className="text-xs text-text-secondary">× {item.quantity}</span>
                    )}
                  </div>
                  <span className="font-heading text-primary">
                    {((item.amount_total || 0) / 100).toFixed(0)}€
                  </span>
                </div>
              ))}

              {/* Total */}
              <div className="pt-4 border-t border-primary/10">
                <div className="flex justify-between items-center">
                  <span className="font-heading text-lg text-primary">Total payé</span>
                  <span className="font-heading text-2xl text-secondary">{totalAmount}€</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery info */}
          <div className="bg-accent/50 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="font-heading text-lg text-primary">Livraison à</h3>
            </div>
            <p className="font-body text-text-secondary leading-relaxed pl-8">
              {metadata.customerFirstName} {metadata.customerLastName}<br />
              {metadata.customerAddress}
              {metadata.customerAddress2 && <><br />{metadata.customerAddress2}</>}
              <br />
              {metadata.customerZip} {metadata.customerCity}
            </p>
          </div>

          {/* Guest account creation */}
          <div className="mb-8">
            <GuestAccountCreation
              email={session.customer_email || ''}
              firstName={metadata.customerFirstName}
              lastName={metadata.customerLastName}
            />
          </div>

          {/* Next steps */}
          <div className="text-center space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="font-body text-emerald-700 text-sm">
                Un email de confirmation a été envoyé à{' '}
                <span className="font-medium">{session.customer_email}</span>
              </p>
            </div>

            <p className="font-body text-text-secondary text-sm">
              Tu recevras un email avec ton numéro de suivi dès que ta commande sera expédiée.
              <br />
              Livraison estimée sous <strong>5 à 7 jours ouvrés</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/" className="btn-primary inline-flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Retour à l&apos;accueil
              </Link>
              <Link href="/collections" className="btn-outline inline-flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      </main>

      <FooterVelora />
    </>
  );
}
