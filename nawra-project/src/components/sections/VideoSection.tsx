// src/components/sections/VideoSection.tsx
'use client';

import { useState } from 'react';
import { BOUQUET_OPTIONS } from '@/lib/data';

export default function VideoSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentBouquet = BOUQUET_OPTIONS[activeIndex];

  return (
    <section className="section-padding bg-cream relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-bordeaux/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="section-header reveal">
          <span className="badge-gold mx-auto mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Aperçu 360°
          </span>
          <h2 className="section-title text-dark">
            Découvrez nos créations
          </h2>
          <p className="section-subtitle text-dark/60 max-w-2xl mx-auto">
            Chaque bouquet est une oeuvre d&apos;art, assemblée à la main avec passion
          </p>
        </div>

        {/* Main video display */}
        <div className="relative mb-8 reveal-scale">
          {/* Featured video */}
          <div className="relative max-w-md mx-auto">
            <div
              className="relative aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl animate-glow"
              style={{ boxShadow: `0 25px 80px ${currentBouquet.color}40` }}
            >
              <video
                key={activeIndex}
                className="absolute inset-0 w-full h-full object-cover"
                src={`/videos/${currentBouquet.video}.mp4`}
                autoPlay
                loop
                muted
                playsInline
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />

              {/* Label */}
              <div className="absolute bottom-0 inset-x-0 p-6">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full animate-pulse"
                    style={{ backgroundColor: currentBouquet.color }}
                  />
                  <span className="font-cormorant text-cream text-xl tracking-wide">
                    {currentBouquet.name}
                  </span>
                </div>
                <p className="text-cream/60 text-sm mt-2">
                  {currentBouquet.flowers.join(' · ')}
                </p>
              </div>

              {/* Play indicator */}
              <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-white text-xs">En direct</span>
              </div>
            </div>

            {/* Decorative frame */}
            <div className="absolute -inset-4 border border-gold/10 rounded-[2rem] pointer-events-none" />
          </div>
        </div>

        {/* Thumbnail selector */}
        <div className="flex items-center justify-center gap-4 md:gap-6">
          {BOUQUET_OPTIONS.map((bouquet, index) => (
            <button
              key={bouquet.id}
              onClick={() => setActiveIndex(index)}
              className={`
                relative group transition-all duration-500 ease-spring
                ${activeIndex === index
                  ? 'scale-100'
                  : 'scale-90 opacity-60 hover:opacity-80 hover:scale-95'
                }
              `}
            >
              {/* Thumbnail */}
              <div
                className={`
                  relative w-20 h-28 md:w-24 md:h-32 rounded-xl overflow-hidden
                  transition-all duration-300
                  ${activeIndex === index ? 'ring-2 ring-gold ring-offset-4 ring-offset-cream' : ''}
                `}
              >
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  src={`/videos/${bouquet.video}.mp4`}
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-dark/30" />

                {/* Color indicator */}
                <div
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full"
                  style={{ backgroundColor: bouquet.color }}
                />
              </div>

              {/* Active indicator */}
              {activeIndex === index && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                  <div className="w-2 h-2 bg-gold rounded-full" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-dark/40">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">Assemblage artisanal</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">Emballage premium</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">Personnalisation totale</span>
          </div>
        </div>
      </div>
    </section>
  );
}
