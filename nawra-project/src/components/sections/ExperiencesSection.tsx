// src/components/sections/ExperiencesSection.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { VIDEOS } from '@/lib/data';

const EXPERIENCES = [
  {
    id: 'bouquet',
    title: 'Bouquets',
    subtitle: 'Compositions florales',
    description: 'Des arrangements uniques avec les plus belles fleurs de saison. Roses, pivoines, lys... pour sublimer vos moments.',
    icon: '🌸',
    video: 'bouquet/bouquet-rose-gold',
    color: '#E91E63',
    gradient: 'from-rose-500/80 to-pink-600/80',
    features: ['Fleurs fraîches', 'Livraison 24h', 'Sur mesure'],
    price: 'À partir de 35€',
    href: '/configure?type=bouquet',
  },
  {
    id: 'panier',
    title: 'Paniers',
    subtitle: 'Corbeilles de fiançailles',
    description: 'La tradition sublimée. Parfums, bijoux, maquillage des plus grandes marques pour célébrer vos fiançailles.',
    icon: '🎁',
    video: 'bouquet/bouquet-doree',
    color: '#C9A84C',
    gradient: 'from-amber-500/80 to-yellow-600/80',
    features: ['Produits luxe', 'Personnalisable', 'Marques prestige'],
    price: 'À partir de 49€',
    href: '/configure?type=panier',
    popular: true,
  },
  {
    id: 'cadeau',
    title: 'Cadeaux',
    subtitle: 'Coffrets personnalisés',
    description: 'Chocolats, bougies, accessoires... Créez un coffret unique pour toutes les occasions spéciales.',
    icon: '✨',
    video: 'bouquet/bouquet-emeraude',
    color: '#7C3AED',
    gradient: 'from-purple-500/80 to-indigo-600/80',
    features: ['100% unique', 'Emballage luxe', 'Carte message'],
    price: 'À partir de 45€',
    href: '/configure?type=cadeau',
  },
];

export default function ExperiencesSection() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section id="experiences" className="py-20 md:py-32 bg-cream relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #1A1A1A 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark/5 text-dark/60 text-sm mb-6">
            <span className="w-1.5 h-1.5 bg-gold rounded-full" />
            Nos créations
          </span>
          <h2 className="font-amiri text-4xl md:text-5xl text-dark mb-4">
            Choisissez votre expérience
          </h2>
          <p className="font-cormorant text-dark/60 text-lg max-w-2xl mx-auto">
            Trois univers, une même passion : créer des moments inoubliables avec des produits d'exception.
          </p>
        </div>

        {/* Experience cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {EXPERIENCES.map((exp) => {
            const isHovered = hoveredCard === exp.id;

            return (
              <Link
                key={exp.id}
                href={exp.href}
                onMouseEnter={() => setHoveredCard(exp.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] md:aspect-[2/3] lg:aspect-[3/4]"
              >
                {/* Video background */}
                <div className="absolute inset-0">
                  <video
                    className={`
                      absolute inset-0 w-full h-full object-cover
                      transition-transform duration-700 ease-out
                      ${isHovered ? 'scale-110' : 'scale-100'}
                    `}
                    src={`/videos/${exp.video}.mp4`}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>

                {/* Gradient overlay */}
                <div className={`
                  absolute inset-0 bg-gradient-to-t ${exp.gradient}
                  opacity-60 group-hover:opacity-70 transition-opacity duration-500
                `} />

                {/* Dark overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Popular badge */}
                {exp.popular && (
                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-3 py-1.5 bg-gold text-dark text-xs font-medium rounded-full shadow-lg">
                      Populaire
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                  {/* Icon */}
                  <div className={`
                    w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20
                    flex items-center justify-center text-3xl mb-4
                    transition-all duration-500
                    ${isHovered ? 'scale-110 bg-white/20' : ''}
                  `}>
                    {exp.icon}
                  </div>

                  {/* Title */}
                  <h3 className="font-amiri text-white text-3xl mb-1">
                    {exp.title}
                  </h3>
                  <p className="font-cormorant text-white/70 text-sm tracking-wider uppercase mb-3">
                    {exp.subtitle}
                  </p>

                  {/* Description */}
                  <p className={`
                    font-cormorant text-white/80 text-sm leading-relaxed mb-4
                    transition-all duration-500 overflow-hidden
                    ${isHovered ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0 md:max-h-24 md:opacity-100'}
                  `}>
                    {exp.description}
                  </p>

                  {/* Features */}
                  <div className={`
                    flex flex-wrap gap-2 mb-4
                    transition-all duration-500
                    ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 md:opacity-100 md:translate-y-0'}
                  `}>
                    {exp.features.map((feature, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded text-white/80 text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <span className="font-amiri text-white text-lg">
                      {exp.price}
                    </span>
                    <span className={`
                      flex items-center gap-2 text-white font-medium text-sm
                      transition-all duration-300
                      ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-70'}
                    `}>
                      Créer
                      <svg
                        className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Hover ring effect */}
                <div className={`
                  absolute inset-0 rounded-2xl border-2 border-white/0
                  transition-all duration-500
                  ${isHovered ? 'border-white/30' : ''}
                `} />
              </Link>
            );
          })}
        </div>

        {/* Bottom text */}
        <div className="text-center mt-12">
          <p className="font-cormorant text-dark/50 text-sm">
            Tous nos produits sont 100% authentiques et livrés dans un emballage cadeau luxueux.
          </p>
        </div>
      </div>
    </section>
  );
}
