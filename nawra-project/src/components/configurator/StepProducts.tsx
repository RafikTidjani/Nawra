// src/components/configurator/StepProducts.tsx
'use client';

import { useState, useMemo } from 'react';
import type { LegacyProduct, ProductType } from '@/types';
import { PRODUCT_TYPE_CONFIG } from '@/lib/data';

type Category = 'all' | 'parfum' | 'makeup' | 'soin' | 'bijou' | 'fleur' | 'chocolat' | 'accessoire';

interface StepProductsProps {
  products: LegacyProduct[];
  selectedTheme: string;
  selectedItems: string[];
  maxSlots: number;
  onToggleItem: (productId: string, maxSlots: number) => void;
  onNext: () => void;
  onPrev: () => void;
  productType?: ProductType;
}

// Labels par catégorie
const CATEGORY_INFO: Record<Category, { label: string; emoji: string }> = {
  all: { label: 'Tous', emoji: '✨' },
  parfum: { label: 'Parfums', emoji: '🧴' },
  makeup: { label: 'Maquillage', emoji: '💄' },
  soin: { label: 'Soins', emoji: '🌿' },
  bijou: { label: 'Bijoux', emoji: '💎' },
  fleur: { label: 'Fleurs', emoji: '🌹' },
  chocolat: { label: 'Chocolats', emoji: '🍫' },
  accessoire: { label: 'Accessoires', emoji: '👜' },
};

// Labels par type de produit
const TYPE_LABELS = {
  bouquet: {
    title: 'Composez votre bouquet',
    subtitle: 'fleurs',
    emptyText: 'Aucune fleur disponible pour ce style.',
    item: 'fleur',
    items: 'fleurs',
  },
  panier: {
    title: 'Composez votre corbeille',
    subtitle: 'articles',
    emptyText: 'Aucun produit disponible pour ce thème.',
    item: 'article',
    items: 'articles',
  },
  cadeau: {
    title: 'Composez votre coffret',
    subtitle: 'articles',
    emptyText: 'Aucun article disponible pour cette ambiance.',
    item: 'article',
    items: 'articles',
  },
};

export default function StepProducts({
  products,
  selectedTheme,
  selectedItems,
  maxSlots,
  onToggleItem,
  onNext,
  onPrev,
  productType = 'panier',
}: StepProductsProps) {
  const [category, setCategory] = useState<Category>('all');

  const typeConfig = PRODUCT_TYPE_CONFIG[productType];
  const labels = TYPE_LABELS[productType];

  // Get available categories for this product type
  const availableCategories = useMemo(() => {
    const cats = new Set<Category>(['all']);
    const allowedCats = typeConfig.categories as readonly string[];
    products.forEach(p => {
      const themeMatch = productType === 'bouquet' || p.themes.includes(selectedTheme);
      if (themeMatch && allowedCats.includes(p.cat)) {
        cats.add(p.cat as Category);
      }
    });
    return Array.from(cats);
  }, [products, selectedTheme, typeConfig.categories, productType]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // For bouquets, show all flowers (theme = bouquet id, not a product theme name)
      const themeMatch = productType === 'bouquet' || p.themes.includes(selectedTheme);
      const categoryMatch = category === 'all' || p.cat === category;
      return themeMatch && categoryMatch;
    });
  }, [products, selectedTheme, category, productType]);

  const remainingSlots = maxSlots - selectedItems.length;
  const canProceed = selectedItems.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="badge-gold mb-3 inline-flex">
            <span className="text-base">{typeConfig.icon}</span>
            {labels.title}
          </span>
          <p className="text-dark/60 text-sm font-cormorant">
            Sélectionnez jusqu&apos;à{' '}
            <span className="font-medium text-dark">{maxSlots} {labels.items}</span>
            {' '}pour votre {productType === 'bouquet' ? 'style' : 'thème'} <span className="text-gold font-medium">{selectedTheme}</span>
          </p>
        </div>

        {/* Slots indicator */}
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-dark/5 bg-white shadow-sm">
          <div className="flex gap-1.5">
            {Array.from({ length: maxSlots }).map((_, i) => (
              <div
                key={i}
                className={`
                  w-3.5 h-3.5 rounded-full transition-all duration-300
                  ${i < selectedItems.length
                    ? 'bg-gold shadow-[0_0_6px_rgba(201,146,26,0.4)]'
                    : 'bg-dark/8 border border-dark/10'
                  }
                  ${i === selectedItems.length - 1 && selectedItems.length > 0 ? 'animate-scale-in' : ''}
                `}
              />
            ))}
          </div>
          <span className="font-amiri text-dark text-sm">
            {selectedItems.length}<span className="text-dark/30">/{maxSlots}</span>
          </span>
        </div>
      </div>

      {/* Category filters - only show if more than 1 category */}
      {availableCategories.length > 2 && (
        <div className="flex flex-wrap gap-2">
          {availableCategories.map((cat) => {
            const info = CATEGORY_INFO[cat];
            const count = cat === 'all'
              ? products.filter(p => p.themes.includes(selectedTheme)).length
              : products.filter(p => p.themes.includes(selectedTheme) && p.cat === cat).length;
            const isActive = category === cat;

            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`
                  relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                  ${isActive
                    ? 'bg-dark text-cream shadow-lg shadow-dark/20'
                    : 'bg-white text-dark/60 hover:text-dark border border-dark/5 hover:border-gold/20 hover:shadow-sm'
                  }
                `}
              >
                {isActive && <div className="absolute inset-0 border-gradient rounded-full" />}
                <span className="relative">{info.emoji}</span>
                <span className="relative">{info.label}</span>
                <span className={`relative text-xs ${isActive ? 'text-gold' : 'text-dark/30'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Products grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => {
          const isSelected = selectedItems.includes(product.id);
          const isDisabled = !isSelected && remainingSlots === 0;
          const catInfo = CATEGORY_INFO[product.cat as Category];

          return (
            <button
              key={product.id}
              onClick={() => !isDisabled && onToggleItem(product.id, maxSlots)}
              disabled={isDisabled}
              className={`
                group relative p-4 rounded-2xl text-left transition-all duration-300 ease-spring
                ${isSelected
                  ? 'bg-gold/5 ring-2 ring-gold shadow-lg shadow-gold/10 -translate-y-1'
                  : isDisabled
                    ? 'bg-dark/[0.02] opacity-40 cursor-not-allowed'
                    : 'bg-white border border-dark/5 hover:border-gold/20 hover:shadow-lg hover:-translate-y-1'
                }
              `}
            >
              {/* Badge */}
              {product.badge && !isSelected && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="badge-gold text-[10px]">{product.badge}</span>
                </div>
              )}

              {/* Selected checkmark */}
              {isSelected && (
                <div className="absolute top-3 right-3 z-10 w-6 h-6 bg-gold rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                  <svg className="w-4 h-4 text-dark" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Product image / emoji fallback */}
              <div className={`
                aspect-square mb-4 rounded-lg overflow-hidden
                transition-all duration-300
                ${isSelected ? 'bg-gold/10' : 'bg-dark/[0.02] group-hover:bg-dark/[0.04]'}
              `}>
                {product.img ? (
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    {catInfo?.emoji || '✨'}
                  </div>
                )}
              </div>

              {/* Product info */}
              <div className="text-dark/40 text-xs tracking-wider uppercase mb-1">
                {product.brand}
              </div>
              <div className={`font-amiri text-lg mb-3 line-clamp-2 transition-colors ${isSelected ? 'text-dark' : 'text-dark/80 group-hover:text-dark'}`}>
                {product.name}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-amiri text-gold text-xl">{product.price}</span>
                <span className="text-gold/60 text-sm">€</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16 px-6 rounded-xl bg-dark/[0.02]">
          <div className="text-4xl mb-4">{typeConfig.icon}</div>
          <p className="text-dark/60 text-lg">{labels.emptyText}</p>
          {category !== 'all' && (
            <button
              onClick={() => setCategory('all')}
              className="mt-4 text-gold hover:underline text-sm"
            >
              Voir tous les {labels.items}
            </button>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="pt-6">
        <div className="divider-gold mb-6 w-full" />
        <div className="flex justify-between">
          <button onClick={onPrev} className="btn-outline flex items-center gap-2 group">
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Retour
          </button>
          <button
            onClick={onNext}
            disabled={!canProceed}
            className={`btn-gold flex items-center gap-3 group ${!canProceed ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <span>Finaliser</span>
            <span className="opacity-60 text-xs">({selectedItems.length}/{maxSlots})</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
