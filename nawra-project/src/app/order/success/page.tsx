// src/app/order/success/page.tsx
import Link from 'next/link';
import { stripe } from '@/lib/stripe';
import { ARABESQUE_BG } from '@/lib/data';
import Logo from '@/components/ui/Logo';

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
      <div className="min-h-screen bg-dark flex items-center justify-center px-6"
        style={{ backgroundImage: ARABESQUE_BG }}
      >
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="font-amiri text-cream text-3xl mb-4">
            Session invalide
          </h1>
          <p className="font-cormorant text-cream/50 mb-8">
            Aucune session de paiement trouvée.
          </p>
          <Link href="/" className="btn-gold inline-flex">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  const session = await getSession(sessionId);

  if (!session || session.payment_status !== 'paid') {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-6"
        style={{ backgroundImage: ARABESQUE_BG }}
      >
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="font-amiri text-cream text-3xl mb-4">
            Paiement non confirmé
          </h1>
          <p className="font-cormorant text-cream/50 mb-8">
            Le paiement n&apos;a pas pu être confirmé. Veuillez réessayer.
          </p>
          <Link href="/configure" className="btn-gold inline-flex">
            Réessayer
          </Link>
        </div>
      </div>
    );
  }

  const metadata = session.metadata || {};

  return (
    <div className="min-h-screen bg-dark relative">
      {/* Grain overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")' }}
      />

      {/* Header */}
      <header
        className="bg-gradient-to-r from-dark via-dark2 to-dark py-6 px-6 border-b border-white/5"
        style={{ backgroundImage: ARABESQUE_BG }}
      >
        <div className="max-w-4xl mx-auto flex justify-center">
          <Link href="/">
            <Logo size="sm" />
          </Link>
        </div>
      </header>

      {/* Success content */}
      <div className="relative max-w-2xl mx-auto px-6 py-16">
        {/* Success icon - animated gold circle with checkmark */}
        <div className="text-center mb-10">
          <div className="relative w-24 h-24 mx-auto mb-8">
            {/* Outer glow */}
            <div className="absolute inset-0 rounded-full animate-glow"
              style={{ boxShadow: '0 0 30px rgba(201, 146, 26, 0.3)' }}
            />
            {/* Circle */}
            <svg className="w-24 h-24" viewBox="0 0 96 96">
              <circle
                cx="48" cy="48" r="44"
                fill="none"
                stroke="rgba(201, 146, 26, 0.2)"
                strokeWidth="2"
              />
              <circle
                cx="48" cy="48" r="44"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="2.5"
                className="animate-circle-grow"
                strokeLinecap="round"
              />
              {/* Checkmark */}
              <path
                d="M30 48 L42 60 L66 36"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-check-draw"
              />
            </svg>
          </div>
          <h1 className="font-amiri text-cream text-4xl md:text-5xl mb-4">
            Commande confirmée !
          </h1>
          <p className="font-cormorant text-cream/50 text-lg max-w-md mx-auto">
            Merci pour votre commande. Vous recevrez un email de confirmation sous peu.
          </p>
        </div>

        {/* Order details - card-dark style */}
        <div className="card-dark p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="font-amiri text-cream text-xl">Détails de votre commande</h2>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="font-cormorant text-cream/40">Thème</span>
              <span className="font-amiri text-cream">{metadata.theme || '–'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="font-cormorant text-cream/40">Taille</span>
              <span className="font-amiri text-cream">{metadata.size || '–'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="font-cormorant text-cream/40">Produits</span>
              <span className="font-amiri text-cream">
                {metadata.products?.split(',').length || 0} articles
              </span>
            </div>
            {metadata.deliveryDate && (
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="font-cormorant text-cream/40">Livraison souhaitée</span>
                <span className="font-amiri text-cream">
                  {new Date(metadata.deliveryDate).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
            <div className="divider-gold my-2" />
            <div className="flex justify-between items-center pt-2">
              <span className="font-cormorant text-cream font-medium text-base">Total payé</span>
              <span className="font-amiri text-gold text-2xl">
                {(session.amount_total || 0) / 100}€
              </span>
            </div>
          </div>
        </div>

        {/* Delivery info - card-glass */}
        <div className="card-glass p-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="font-amiri text-cream text-lg">Livraison à</h3>
          </div>
          <p className="font-cormorant text-cream/60 leading-relaxed pl-8">
            {metadata.customerName}<br />
            {metadata.customerAddress}
          </p>
        </div>

        {/* Next steps */}
        <div className="text-center space-y-6">
          <p className="font-cormorant text-cream/40 text-sm leading-relaxed">
            Un email de confirmation a été envoyé à{' '}
            <span className="text-gold">{session.customer_email}</span>.
            <br />
            Nous vous contacterons pour confirmer la date de livraison.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link href="/" className="btn-gold inline-flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Retour à l&apos;accueil
            </Link>
            <a
              href="https://wa.me/33600000000"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline inline-flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
