// src/components/sections/Hero.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';

// Tes 3 vidéos — place-les dans public/videos/hero/
const HERO_VIDEOS = [
  '/videos/hero/video-1.mp4',
  '/videos/hero/video-2.mp4',
  '/videos/hero/video-3.mp4',
];

export default function Hero() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const isChanging = useRef(false);

  // Change de vidéo quand la vidéo actuelle se termine
  const handleVideoEnd = useCallback(() => {
    if (isChanging.current) return; // Évite les doubles appels
    isChanging.current = true;

    setIsTransitioning(true);

    const nextIndex = (currentVideo + 1) % HERO_VIDEOS.length;

    setTimeout(() => {
      setCurrentVideo(nextIndex);
      setIsTransitioning(false);
      isChanging.current = false;
    }, 500);
  }, [currentVideo]);

  // Autoplay la nouvelle vidéo
  useEffect(() => {
    const video = videoRefs.current[currentVideo];
    if (video) {
      video.currentTime = 0; // Reset au début
      video.play().catch(() => {
        // Autoplay blocked, ignore
      });
    }
  }, [currentVideo]);

  return (
    <section className="relative min-h-screen flex flex-col bg-primary overflow-hidden">
      {/* Background videos */}
      <div className="absolute inset-0 pointer-events-none">
        {HERO_VIDEOS.map((src, index) => (
          <video
            key={src}
            ref={(el) => { videoRefs.current[index] = el; }}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              index === currentVideo && !isTransitioning ? 'opacity-80' : 'opacity-0'
            }`}
            src={src}
            muted
            playsInline
            onEnded={index === currentVideo ? handleVideoEnd : undefined}
          />
        ))}
        {/* Fallback gradient - très léger */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-primary/30" />
      </div>

      {/* Overlay gradient - léger */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-primary/30 pointer-events-none" />

      {/* Video indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {HERO_VIDEOS.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentVideo(index);
                setIsTransitioning(false);
              }, 300);
            }}
            className={`w-12 h-1 rounded-full transition-all duration-300 ${
              index === currentVideo
                ? 'bg-secondary'
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Vidéo ${index + 1}`}
          />
        ))}
      </div>

      {/* Trust bar */}
      <div className="relative z-10 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="ticker-wrap py-2.5">
          <div className="ticker-inner">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-10 px-4">
                {[
                  { icon: '✓', text: 'Livraison offerte en France' },
                  { icon: '★', text: '4.9/5 (500+ avis)' },
                  { icon: '🔒', text: 'Paiement sécurisé' },
                  { icon: '↩', text: 'Retours gratuits 30j' },
                ].map((item, j) => (
                  <span key={j} className="flex items-center gap-2 text-white/60 text-sm whitespace-nowrap font-body">
                    <span className="text-secondary">{item.icon}</span>
                    {item.text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="animate-fade-up mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/10 text-white/80 text-sm font-body">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              Nouvelle collection 2026
            </span>
          </div>

          {/* Logo */}
          <div className="animate-fade-up-1 mb-6">
            <Logo size="lg" variant="light" />
          </div>

          {/* Tagline */}
          <p className="font-body text-secondary text-sm md:text-base tracking-widest uppercase mb-6 animate-fade-up-2">
            Coiffeuses Premium
          </p>

          {/* Headline */}
          <h1 className="font-heading text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight mb-6 animate-fade-up-3 font-medium leading-tight">
            Crée ton coin beauté<br />
            <span className="text-secondary italic">de rêve</span>
          </h1>

          {/* Subheadline */}
          <p className="font-body text-white/70 text-lg md:text-xl mb-10 animate-fade-up-4 max-w-2xl mx-auto leading-relaxed">
            Des coiffeuses élégantes à partir de <span className="text-secondary font-semibold">129€</span>.
            <br className="hidden md:block" />
            Livraison offerte partout en France.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up-5">
            <Link
              href="/collections"
              className="btn-secondary text-base px-8 py-4"
            >
              Découvrir les coiffeuses
            </Link>
            <Link
              href="#bestsellers"
              className="btn-outline border-white/30 text-white hover:bg-white/10 hover:border-white/50 text-base px-8 py-4"
            >
              Voir les bestsellers
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-12 animate-fade-up-5">
            <div className="flex flex-col items-center gap-3">
              <div className="flex -space-x-2">
                {['bg-rose-300', 'bg-amber-200', 'bg-violet-300', 'bg-blue-200', 'bg-emerald-200'].map((color, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full ${color} border-2 border-primary flex items-center justify-center text-primary/60 text-xs font-semibold shadow-lg`}
                  >
                    {['E', 'L', 'M', 'S', 'A'][i]}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-secondary/30 border-2 border-secondary/50 flex items-center justify-center text-secondary text-xs font-semibold shadow-lg">
                  +99
                </div>
              </div>
              <p className="text-white/50 text-sm font-body">
                Rejoins <span className="text-secondary font-medium">+2000 clientes</span> satisfaites
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <a
          href="#brand-promise"
          className="group flex flex-col items-center gap-2 text-white/40 hover:text-white/70 transition-colors"
        >
          <span className="text-xs font-body tracking-widest uppercase">Découvrir</span>
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full bg-secondary/20 animate-ping pointer-events-none" />
            <div className="relative w-10 h-10 rounded-full bg-white/5 backdrop-blur border border-white/20 flex items-center justify-center group-hover:bg-white/10 group-hover:border-secondary/30 transition-all">
              <svg
                className="w-4 h-4 text-secondary animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
