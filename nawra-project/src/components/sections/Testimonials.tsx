// src/components/sections/Testimonials.tsx
'use client';

import { useState, useEffect } from 'react';
import { ARABESQUE_BG } from '@/lib/data';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah M.',
    location: 'Paris 16ème',
    avatar: 'S',
    rating: 5,
    text: 'Ma belle-famille a été émerveillée ! La corbeille était absolument magnifique, avec un emballage digne des plus grandes maisons.',
    theme: 'Rose Gold',
    date: 'Il y a 2 jours',
  },
  {
    id: 2,
    name: 'Amira K.',
    location: 'Neuilly-sur-Seine',
    avatar: 'A',
    rating: 5,
    text: 'Service exceptionnel ! J\'ai pu personnaliser chaque détail. La livraison était ponctuelle et le résultat au-delà de mes attentes.',
    theme: 'Émeraude',
    date: 'Il y a 5 jours',
  },
  {
    id: 3,
    name: 'Leila B.',
    location: 'Boulogne',
    avatar: 'L',
    rating: 5,
    text: 'La qualité des produits est irréprochable. Tous les parfums sont authentiques. Ma fiancée était aux anges !',
    theme: 'Dorée',
    date: 'Il y a 1 semaine',
  },
  {
    id: 4,
    name: 'Nadia H.',
    location: 'Vincennes',
    avatar: 'N',
    rating: 5,
    text: 'Troisième commande chez VELORA pour ma famille. Toujours le même niveau d\'excellence. Merci !',
    theme: 'Bordeaux',
    date: 'Il y a 2 semaines',
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-scroll
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section-padding bg-dark relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: ARABESQUE_BG }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="section-header reveal">
          <div className="flex items-center justify-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-6 h-6 text-gold" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <h2 className="section-title text-cream">
            +200 clientes comblées
          </h2>
          <p className="section-subtitle text-cream/50">
            Note moyenne de 4.9/5 sur Google
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="relative">
          {/* Main testimonial */}
          <div className="max-w-3xl mx-auto">
            <div className="card-glass p-8 md:p-12 text-center">
              {/* Quote icon */}
              <div className="text-gold/30 text-6xl font-serif mb-6">"</div>

              {/* Text */}
              <p className="font-cormorant text-cream text-xl md:text-2xl leading-relaxed mb-8 italic">
                {TESTIMONIALS[activeIndex].text}
              </p>

              {/* Author */}
              <div className="flex items-center justify-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold/20 to-bordeaux/20 flex items-center justify-center text-gold text-xl font-medium">
                  {TESTIMONIALS[activeIndex].avatar}
                </div>
                <div className="text-left">
                  <div className="text-cream font-medium">
                    {TESTIMONIALS[activeIndex].name}
                  </div>
                  <div className="text-cream/50 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {TESTIMONIALS[activeIndex].location}
                  </div>
                </div>
              </div>

              {/* Theme badge */}
              <div className="mt-6">
                <span className="badge-gold">
                  Thème {TESTIMONIALS[activeIndex].theme}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation dots */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`
                  w-3 h-3 rounded-full transition-all duration-300
                  ${activeIndex === index
                    ? 'bg-gold scale-100'
                    : 'bg-white/20 scale-75 hover:bg-white/40'
                  }
                `}
              />
            ))}
          </div>

          {/* Navigation arrows */}
          <div className="hidden md:flex items-center justify-between absolute inset-y-0 -left-16 -right-16 pointer-events-none">
            <button
              onClick={() => setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-cream/60 hover:text-cream transition-colors pointer-events-auto"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length)}
              className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-cream/60 hover:text-cream transition-colors pointer-events-auto"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 reveal">
          {[
            { value: '200+', label: 'Corbeilles livrées' },
            { value: '4.9/5', label: 'Note moyenne' },
            { value: '48h', label: 'Délai livraison' },
            { value: '100%', label: 'Satisfaction' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-amiri text-gold text-4xl md:text-5xl mb-2">
                {stat.value}
              </div>
              <div className="text-cream/50 text-sm tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
