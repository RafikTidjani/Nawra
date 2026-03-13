// src/components/sections/CadeauShowcase.tsx
import Link from 'next/link';

const FEATURES = [
  'Coffrets chocolats artisanaux et confiseries de luxe',
  'Bougies parfumées, diffuseurs et accessoires bien-être',
  'Paniers gourmands avec thé, miel et douceurs orientales',
  'Carte message calligraphiée et emballage cadeau premium',
];

const OCCASIONS = [
  'Naissances', 'Eid', 'Anniversaires',
  'Pendaison de crémaillère', 'Remerciements', 'Fêtes',
];

export default function CadeauShowcase() {
  return (
    <section className="py-20 md:py-32 bg-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Video — left */}
          <div className="reveal-left relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
              <video
                className="absolute inset-0 w-full h-full object-cover"
                src="/videos/bouquet/bouquet-emeraude.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              {/* Badge */}
              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-dark text-sm font-medium shadow-lg">
                  100% personnalisable
                </span>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-100 rounded-full -z-10" />
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-purple-50 rounded-full -z-10" />
          </div>

          {/* Content — right */}
          <div>
            <div className="reveal">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-600 text-sm mb-6">
                <span className="text-lg">✨</span>
                L'art du cadeau
              </span>
            </div>

            <h2 className="reveal font-amiri text-4xl md:text-5xl text-dark mb-6 leading-tight">
              Cadeaux personnalisés<br />
              <span className="text-purple-500">pour chaque moment</span>
            </h2>

            <p className="reveal font-cormorant text-dark/70 text-lg md:text-xl leading-relaxed mb-8">
              Parce que chaque occasion mérite un cadeau à la hauteur, nous créons des coffrets
              uniques qui reflètent votre attention. Chocolats fins, bougies parfumées,
              accessoires de luxe... composez le cadeau parfait.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {FEATURES.map((feature, i) => (
                <div key={i} className={`reveal flex items-start gap-3 reveal-delay-${i + 1}`}>
                  <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="font-cormorant text-dark/70 text-base">{feature}</span>
                </div>
              ))}
            </div>

            {/* Occasions */}
            <div className="reveal mb-10">
              <p className="font-cormorant text-dark/50 text-sm uppercase tracking-wider mb-3">
                Occasions idéales
              </p>
              <div className="flex flex-wrap gap-2">
                {OCCASIONS.map((occasion, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-white rounded-full text-dark/70 text-sm border border-dark/5 shadow-sm"
                  >
                    {occasion}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="reveal">
              <Link
                href="/configure?type=cadeau"
                className="btn-gold inline-flex items-center gap-3"
              >
                <span>Créer mon coffret</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
