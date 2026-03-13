// src/components/configurator/StepTheme.tsx
'use client';

import type { Theme, Size, ProductType } from '@/types';
import { PRODUCT_TYPE_CONFIG } from '@/lib/data';

const TYPE_LABELS = {
  bouquet: {
    themeTitle: 'Choisissez votre style',
    sizeTitle: 'Choisissez votre format',
    nextButton: 'Choisir les fleurs',
  },
  panier: {
    themeTitle: 'Choisissez votre thème',
    sizeTitle: 'Choisissez votre taille',
    nextButton: 'Choisir les produits',
  },
  cadeau: {
    themeTitle: 'Choisissez votre ambiance',
    sizeTitle: 'Choisissez votre format',
    nextButton: 'Choisir les articles',
  },
};

interface StepThemeProps {
  themes: Record<string, Theme>;
  sizes: Size[];
  selectedTheme: string;
  selectedSize: string;
  onThemeSelect: (theme: string) => void;
  onSizeSelect: (size: string) => void;
  onNext: () => void;
  productType?: ProductType;
}

export default function StepTheme({
  themes,
  sizes,
  selectedTheme,
  selectedSize,
  onThemeSelect,
  onSizeSelect,
  onNext,
  productType = 'panier',
}: StepThemeProps) {
  const themeList = Object.values(themes);
  const canProceed = selectedTheme && selectedSize;
  const labels = TYPE_LABELS[productType];
  const typeConfig = PRODUCT_TYPE_CONFIG[productType];

  return (
    <div className="space-y-12">
      {/* Theme selection */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <span className="badge-gold">
            <span className="text-base">{typeConfig.icon}</span>
            {labels.themeTitle}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {themeList.map((theme, index) => {
            const isSelected = selectedTheme === theme.name;

            return (
              <button
                key={theme.name}
                onClick={() => onThemeSelect(theme.name)}
                className={`
                  group relative rounded-2xl overflow-hidden transition-all duration-300 ease-spring animate-fade-up
                  ${isSelected
                    ? 'ring-2 ring-gold ring-offset-2 ring-offset-white scale-[1.03] shadow-lg'
                    : 'hover:scale-[1.02] hover:shadow-lg'
                  }
                `}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div
                  className="aspect-square p-4 flex flex-col items-center justify-center gap-3 relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${theme.p}20 0%, ${theme.l} 50%, ${theme.s}20 100%)` }}
                >
                  {/* Decorative gradient overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle at 50% 30%, ${theme.p}30 0%, transparent 70%)` }}
                  />

                  {/* Color dots */}
                  <div className="relative flex items-center gap-2">
                    <div
                      className="w-10 h-10 rounded-full shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
                      style={{ backgroundColor: theme.p, boxShadow: `0 4px 15px ${theme.p}50` }}
                    />
                    <div
                      className="w-7 h-7 rounded-full shadow-lg transition-all duration-300 group-hover:scale-110 delay-75"
                      style={{ backgroundColor: theme.s, boxShadow: `0 4px 15px ${theme.s}50` }}
                    />
                    <div
                      className="w-5 h-5 rounded-full shadow-lg transition-all duration-300 group-hover:scale-110 delay-100"
                      style={{ backgroundColor: theme.a || theme.p }}
                    />
                  </div>

                  {/* Name */}
                  <span className="relative font-cormorant text-dark/80 text-sm tracking-wide text-center font-medium">
                    {theme.name}
                  </span>
                </div>

                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-7 h-7 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                    <svg className="w-4 h-4 text-dark" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size selection */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <span className="badge-gold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            {labels.sizeTitle}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sizes.map((size, index) => {
            const isSelected = selectedSize === size.id;

            return (
              <button
                key={size.id}
                onClick={() => onSizeSelect(size.id)}
                className={`
                  group relative p-6 rounded-2xl text-left transition-all duration-300 ease-spring animate-fade-up
                  ${isSelected
                    ? 'bg-gold/5 ring-2 ring-gold shadow-lg shadow-gold/10'
                    : 'bg-dark/[0.02] hover:bg-dark/[0.04] border border-dark/5 hover:border-gold/20 hover:shadow-md'
                  }
                `}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                {/* Popular badge */}
                {size.popular && (
                  <span className="absolute -top-2.5 left-4 badge-premium shadow-lg">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Populaire
                  </span>
                )}

                {/* Size info */}
                <div className="mb-4">
                  <div className="font-amiri text-3xl text-dark mb-1 group-hover:text-gold transition-colors">
                    {size.label}
                  </div>
                  <div className="text-dark/50 text-sm flex items-center gap-1 font-cormorant">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    {size.sub}
                  </div>
                </div>

                {/* Slots visual */}
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: size.slots }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${isSelected ? 'bg-gold shadow-[0_0_4px_rgba(201,146,26,0.4)]' : 'bg-dark/10'}`}
                    />
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1">
                  <span className="font-amiri text-gold text-2xl">{size.price}</span>
                  <span className="text-gold/60 text-sm">€</span>
                </div>

                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-7 h-7 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center animate-scale-in">
                    <svg className="w-4 h-4 text-dark" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Next button */}
      <div className="flex justify-end pt-6">
        <div className="divider-gold mb-6 w-full" />
      </div>
      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`btn-gold flex items-center gap-3 group ${!canProceed ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          <span>{labels.nextButton}</span>
          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
