// src/components/sections/PanierShowcase.tsx
import Link from 'next/link';

const FEATURES = [
  'Corbeilles complètes avec parfums, bijoux et maquillage de luxe',
  'Paniers thématiques adaptés à chaque tradition familiale',
  'Sélection des plus grandes marques : Dior, Chanel, YSL, Lancôme',
  'Emballage somptueux avec rubans dorés et papier de soie',
];

const OCCASIONS = [
  'Fiançailles (Khotba)', 'Mariages', 'Demande en mariage',
  'Anniversaires de mariage', 'Célébrations familiales',
];

const BRANDS = ['Dior', 'Chanel', 'YSL', 'Lancôme', 'Cartier', 'Guerlain'];

export default function PanierShowcase() {
  return (
    <section className="py-20 md:py-32 bg-dark relative overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #C9A84C 0.5px, transparent 0)`,
          backgroundSize: '60px 60px',
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content — left */}
          <div className="order-2 lg:order-1">
            <div className="reveal">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold text-sm mb-6 border border-gold/20">
                <span className="text-lg">🎁</span>
                La tradition sublimée
              </span>
            </div>

            <h2 className="reveal font-amiri text-4xl md:text-5xl text-cream mb-6 leading-tight">
              Paniers de fiançailles<br />
              <span className="text-gold">sur mesure</span>
            </h2>

            <p className="reveal font-cormorant text-cream/70 text-lg md:text-xl leading-relaxed mb-8">
              La Khotba est un moment sacré. Nos corbeilles de fiançailles sont composées
              avec soin pour honorer cette tradition avec les produits les plus prestigieux.
              Chaque détail compte, chaque marque est soigneusement sélectionnée.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {FEATURES.map((feature, i) => (
                <div key={i} className={`reveal flex items-start gap-3 reveal-delay-${i + 1}`}>
                  <span className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="font-cormorant text-cream/70 text-base">{feature}</span>
                </div>
              ))}
            </div>

            {/* Brands */}
            <div className="reveal mb-6">
              <p className="font-cormorant text-cream/40 text-sm uppercase tracking-wider mb-3">
                Nos marques
              </p>
              <div className="flex flex-wrap items-center gap-4">
                {BRANDS.map((brand, i) => (
                  <span
                    key={i}
                    className="font-cormorant text-cream/30 text-sm tracking-widest uppercase hover:text-gold transition-colors"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>

            {/* Occasions */}
            <div className="reveal mb-10">
              <p className="font-cormorant text-cream/40 text-sm uppercase tracking-wider mb-3">
                Occasions idéales
              </p>
              <div className="flex flex-wrap gap-2">
                {OCCASIONS.map((occasion, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-white/5 rounded-full text-cream/70 text-sm border border-white/10"
                  >
                    {occasion}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="reveal">
              <Link
                href="/configure?type=panier"
                className="btn-gold inline-flex items-center gap-3"
              >
                <span>Composer mon panier</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Video — right */}
          <div className="reveal-right order-1 lg:order-2 relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
              <video
                className="absolute inset-0 w-full h-full object-cover"
                src="/videos/bouquet/bouquet-doree.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              {/* Badge */}
              <div className="absolute top-6 right-6">
                <span className="px-4 py-2 bg-gold text-dark text-sm font-medium rounded-full shadow-lg">
                  Populaire
                </span>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gold/10 rounded-full -z-10" />
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-gold/5 rounded-full -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
