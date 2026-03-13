// src/components/sections/ThemesGrid.tsx
// Premium theme selection with hover effects
import Link from 'next/link';
import type { Theme } from '@/types';

interface ThemesGridProps {
  themes: Record<string, Theme>;
}

export default function ThemesGrid({ themes }: ThemesGridProps) {
  const themeList = Object.values(themes);

  return (
    <section className="section-padding bg-cream relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="section-header reveal">
          <div className="divider-ornament mb-8">
            <span className="text-gold text-2xl">✦</span>
          </div>
          <h2 className="section-title text-dark">
            Choisissez votre univers
          </h2>
          <p className="section-subtitle text-dark/60 max-w-2xl mx-auto">
            Cinq palettes chromatiques inspirées de l'élégance orientale,
            pour une corbeille qui vous ressemble
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-6 reveal">
          {themeList.map((theme, index) => (
            <Link
              key={theme.name}
              href={`/configure?theme=${encodeURIComponent(theme.name)}`}
              className="group animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative">
                {/* Card */}
                <div
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-500 ease-spring group-hover:scale-[1.02]"
                  style={{ backgroundColor: theme.l }}
                >
                  {/* Gradient layers */}
                  <div
                    className="absolute inset-0 opacity-50 transition-opacity duration-500 group-hover:opacity-70"
                    style={{
                      background: `linear-gradient(160deg, ${theme.p}30 0%, ${theme.s}40 50%, ${theme.a}20 100%)`,
                    }}
                  />

                  {/* Floating orbs */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* Main orb */}
                      <div
                        className="w-20 h-20 rounded-full shadow-2xl transition-all duration-500 group-hover:scale-110"
                        style={{
                          backgroundColor: theme.p,
                          boxShadow: `0 20px 60px ${theme.p}60`
                        }}
                      />
                      {/* Secondary orb */}
                      <div
                        className="absolute -top-3 -right-3 w-10 h-10 rounded-full shadow-lg transition-all duration-500 delay-75 group-hover:scale-110 group-hover:-translate-y-1"
                        style={{ backgroundColor: theme.s }}
                      />
                      {/* Accent orb */}
                      <div
                        className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full shadow-lg transition-all duration-500 delay-150 group-hover:scale-110"
                        style={{ backgroundColor: theme.a }}
                      />
                    </div>
                  </div>

                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 animate-shimmer" />
                  </div>

                  {/* Bottom gradient */}
                  <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-dark/70 via-dark/30 to-transparent" />

                  {/* Theme name */}
                  <div className="absolute bottom-0 inset-x-0 p-5 text-center">
                    <h3 className="font-cormorant text-cream text-lg md:text-xl tracking-wide font-medium">
                      {theme.name}
                    </h3>
                  </div>

                  {/* Hover arrow */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                {/* Shadow */}
                <div
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4/5 h-6 rounded-full blur-xl opacity-30 transition-opacity duration-500 group-hover:opacity-50"
                  style={{ backgroundColor: theme.p }}
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Link href="/configure" className="inline-flex items-center gap-2 text-dark/60 hover:text-gold transition-colors group">
            <span className="font-cormorant text-lg tracking-wide">Découvrir toutes les options</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
