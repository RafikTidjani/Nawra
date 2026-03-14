// src/components/sections/BasketCatalogue.tsx
// Premium product cards with hover reveal
import Link from 'next/link';
import type { Basket, Theme } from '@/types';
import { ARABESQUE_BG } from '@/lib/data';

interface BasketCatalogueProps {
  baskets: Basket[];
  themes: Record<string, Theme>;
}

export default function BasketCatalogue({ baskets, themes }: BasketCatalogueProps) {
  return (
    <section id="catalogue" className="section-padding bg-dark2 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{ backgroundImage: ARABESQUE_BG }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-dark2 via-transparent to-dark2" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="section-header reveal">
          <div className="badge-gold mx-auto mb-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Collections signatures
          </div>
          <h2 className="section-title text-cream">
            Prêtes à offrir
          </h2>
          <p className="section-subtitle text-cream/50 max-w-2xl mx-auto">
            Nos compositions les plus demandées, assemblées avec soin et livrées en 48h
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 reveal">
          {baskets.map((basket, index) => {
            const theme = themes[basket.theme];
            const bgColor = theme?.l || '#FAF3E8';
            const primaryColor = theme?.p || '#C9A84C';

            return (
              <div
                key={basket.id}
                className="group animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-dark overflow-hidden h-full flex flex-col">
                  {/* Image area */}
                  <div
                    className="relative aspect-square overflow-hidden"
                    style={{ backgroundColor: bgColor }}
                  >
                    {/* Gradient overlay */}
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        background: `radial-gradient(circle at 50% 30%, ${primaryColor}40 0%, transparent 70%)`,
                      }}
                    />

                    {/* Decorative orb */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-32 h-32 rounded-full opacity-30 blur-xl transition-transform duration-700 group-hover:scale-150"
                        style={{ backgroundColor: primaryColor }}
                      />
                    </div>

                    {/* Tag */}
                    {basket.tag && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md ${
                          basket.tag === 'Bestseller'
                            ? 'bg-gold/20 text-gold border border-gold/30'
                            : basket.tag === 'Nouveau'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-white/10 text-white/80 border border-white/20'
                        }`}>
                          {basket.tag === 'Bestseller' && (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          )}
                          {basket.tag}
                        </span>
                      </div>
                    )}

                    {/* Quick view button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link
                        href={`/configure?basket=${basket.id}`}
                        className="bg-white/95 backdrop-blur text-dark px-6 py-3 rounded-full text-sm font-medium shadow-xl hover:bg-white transition-colors"
                      >
                        Personnaliser
                      </Link>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Theme indicator */}
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: primaryColor }}
                      />
                      <span className="text-cream/40 text-xs tracking-wider uppercase">
                        {basket.theme} · {basket.size}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="font-amiri text-cream text-xl md:text-2xl mb-3 group-hover:text-gold transition-colors">
                      {basket.name}
                    </h3>

                    {/* Features */}
                    <div className="flex items-center gap-3 text-cream/50 text-xs mb-4">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        {basket.products.length} produits
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Livraison 48h
                      </span>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Price & CTA */}
                    <div className="flex items-end justify-between pt-4 border-t border-white/10">
                      <div>
                        <span className="text-cream/40 text-xs block mb-1">À partir de</span>
                        <span className="font-amiri text-gold text-3xl">{basket.price}€</span>
                      </div>
                      <Link
                        href={`/configure?basket=${basket.id}`}
                        className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors group/btn"
                      >
                        <span className="text-sm font-medium">Voir</span>
                        <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom section */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
            <div className="text-cream/60 text-sm">
              Vous ne trouvez pas votre bonheur ?
            </div>
            <Link href="/configure" className="btn-gold">
              Créer ma corbeille sur mesure
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
