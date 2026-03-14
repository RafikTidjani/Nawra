// src/components/sections/BrandPromise.tsx

const promises = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Qualité Premium',
    description: 'Des matériaux soigneusement sélectionnés et un contrôle qualité rigoureux sur chaque pièce.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
    title: 'Livraison Offerte',
    description: 'Livraison gratuite partout en France métropolitaine sous 5 à 7 jours ouvrés.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: 'Retours 30 Jours',
    description: 'Pas satisfaite ? Retourne ta coiffeuse gratuitement sous 30 jours.',
  },
];

export default function BrandPromise() {
  return (
    <section id="brand-promise" className="section-padding bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {promises.map((promise, index) => (
            <div
              key={index}
              className="text-center group reveal"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent text-secondary mb-6 group-hover:scale-110 transition-transform duration-300">
                {promise.icon}
              </div>

              {/* Title */}
              <h3 className="font-heading text-xl md:text-2xl text-primary mb-3 font-semibold">
                {promise.title}
              </h3>

              {/* Description */}
              <p className="font-body text-text-secondary text-sm md:text-base leading-relaxed max-w-xs mx-auto">
                {promise.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-16 pt-12 border-t border-primary/5">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {[
              { icon: '🔒', text: 'Paiement sécurisé' },
              { icon: '✓', text: 'Garantie 2 ans' },
              { icon: '🇫🇷', text: 'Service client français' },
            ].map((badge, index) => (
              <div key={index} className="flex items-center gap-2 text-text-secondary">
                <span className="text-xl">{badge.icon}</span>
                <span className="font-body text-sm">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
