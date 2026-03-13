// src/components/configurator/StepBouquetSelect.tsx
'use client';

import { useState } from 'react';
import type { Size } from '@/types';

interface BouquetOption {
  id: string;
  name: string;
  description: string;
  video: string;
  color: string;
  price: number;
  flowers: string[];
}

interface StepBouquetSelectProps {
  bouquets: BouquetOption[];
  sizes: Size[];
  selectedBouquet: string;
  selectedSize: string;
  onBouquetSelect: (bouquetId: string) => void;
  onSizeSelect: (size: string) => void;
  onNext: () => void;
}

export default function StepBouquetSelect({
  bouquets,
  sizes,
  selectedBouquet,
  selectedSize,
  onBouquetSelect,
  onSizeSelect,
  onNext,
}: StepBouquetSelectProps) {
  const [hoveredBouquet, setHoveredBouquet] = useState<string | null>(null);
  const canProceed = selectedBouquet && selectedSize;
  const selectedBouquetData = bouquets.find(b => b.id === selectedBouquet);

  // Get poster image path from video path
  const getImagePath = (videoPath: string) => {
    const filename = videoPath.split('/').pop();
    return `/images/${filename}-poster.jpg`;
  };

  return (
    <div className="space-y-12">
      {/* Bouquet selection */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <span className="badge-gold">
            <span className="text-base">🌸</span>
            Choisissez votre bouquet
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bouquets.map((bouquet) => {
            const isSelected = selectedBouquet === bouquet.id;
            const isHovered = hoveredBouquet === bouquet.id;

            return (
              <button
                key={bouquet.id}
                onClick={() => onBouquetSelect(bouquet.id)}
                onMouseEnter={() => setHoveredBouquet(bouquet.id)}
                onMouseLeave={() => setHoveredBouquet(null)}
                className={`
                  group relative rounded-2xl overflow-hidden aspect-[3/4] text-left
                  transition-all duration-500 ease-out
                  ${isSelected
                    ? 'ring-4 ring-gold ring-offset-2 ring-offset-white scale-[1.02] shadow-2xl'
                    : 'hover:scale-[1.02] hover:shadow-xl'
                  }
                `}
              >
                {/* Image background with color fallback */}
                <div className="absolute inset-0" style={{ backgroundColor: bouquet.color + '30' }}>
                  <img
                    src={getImagePath(bouquet.video)}
                    alt={bouquet.name}
                    className={`
                      absolute inset-0 w-full h-full object-cover
                      transition-transform duration-700 ease-out
                      ${isHovered || isSelected ? 'scale-110' : 'scale-100'}
                    `}
                  />
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4 z-20 w-10 h-10 bg-gold rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                    <svg className="w-6 h-6 text-dark" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-6 z-10">
                  {/* Name */}
                  <h4 className="font-amiri text-white text-2xl mb-2">{bouquet.name}</h4>

                  {/* Description */}
                  <p className="font-cormorant text-white/70 text-sm mb-3 line-clamp-2">
                    {bouquet.description}
                  </p>

                  {/* Flowers tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {bouquet.flowers.slice(0, 3).map((flower, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-xs border border-white/10"
                      >
                        {flower}
                      </span>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <span className="font-amiri text-gold text-xl">
                      À partir de {bouquet.price}€
                    </span>
                    <span className={`
                      text-white/60 text-sm transition-all duration-300
                      ${isHovered || isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}
                    `}>
                      Sélectionner →
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Add more bouquets hint */}
        <div className="mt-6 text-center">
          <p className="font-cormorant text-dark/40 text-sm">
            Plus de bouquets disponibles prochainement...
          </p>
        </div>
      </div>

      {/* Size selection - only show when bouquet is selected */}
      {selectedBouquet && (
        <div className="animate-fade-up">
          <div className="flex items-center gap-3 mb-6">
            <span className="badge-gold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Choisissez la taille
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sizes.map((size) => {
              const isSelected = selectedSize === size.id;

              return (
                <button
                  key={size.id}
                  onClick={() => onSizeSelect(size.id)}
                  className={`
                    group relative p-6 rounded-xl text-left transition-all duration-300 ease-spring
                    ${isSelected
                      ? 'bg-gold/5 ring-2 ring-gold'
                      : 'bg-dark/[0.02] hover:bg-dark/[0.04] border border-transparent hover:border-dark/10'
                    }
                  `}
                >
                  {/* Popular badge */}
                  {size.popular && (
                    <span className="absolute -top-2.5 left-4 badge-premium shadow-lg">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      Populaire
                    </span>
                  )}

                  {/* Size info */}
                  <div className="mb-4">
                    <div className="font-amiri text-2xl text-dark mb-1 group-hover:text-rose-600 transition-colors">
                      {size.label}
                    </div>
                    <div className="text-dark/50 text-sm flex items-center gap-1">
                      <span>🌹</span>
                      {size.sub}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1">
                    <span className="font-amiri text-gold text-2xl">{size.price}</span>
                    <span className="text-gold/60 text-sm">€</span>
                  </div>

                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-gold rounded-full flex items-center justify-center animate-scale-in">
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
      )}

      {/* Selected bouquet summary */}
      {selectedBouquetData && selectedSize && (
        <div
          className="animate-fade-up p-6 rounded-2xl border"
          style={{
            background: `linear-gradient(135deg, ${selectedBouquetData.color}10 0%, ${selectedBouquetData.color}05 100%)`,
            borderColor: `${selectedBouquetData.color}20`,
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0"
              style={{ backgroundColor: selectedBouquetData.color + '20' }}
            >
              <img
                src={getImagePath(selectedBouquetData.video)}
                alt={selectedBouquetData.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-amiri text-dark text-lg">{selectedBouquetData.name}</h4>
              <p className="font-cormorant text-dark/50 text-sm">
                {sizes.find(s => s.id === selectedSize)?.label} · {sizes.find(s => s.id === selectedSize)?.sub}
              </p>
            </div>
            <div className="text-right">
              <span className="font-amiri text-gold text-2xl">
                {(selectedBouquetData.price + (sizes.find(s => s.id === selectedSize)?.price || 0))}€
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Next button */}
      <div className="pt-6">
        <div className="divider-gold mb-6 w-full" />
        <div className="flex justify-end">
          <button
            onClick={onNext}
            disabled={!canProceed}
            className={`btn-gold flex items-center gap-3 group ${!canProceed ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <span>Personnaliser</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
