// src/components/sections/Hero.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

// Vidéos hero — place-les dans public/videos/hero/
const HERO_VIDEOS = [
  '/videos/hero/video-1.mp4',
  '/videos/hero/video-2.mp4',
  '/videos/hero/video-3.mp4',
];

export default function Hero() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const isChanging = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleVideoEnd = useCallback(() => {
    if (isChanging.current) return;
    isChanging.current = true;
    setIsTransitioning(true);
    const nextIndex = (currentVideo + 1) % HERO_VIDEOS.length;
    setTimeout(() => {
      setCurrentVideo(nextIndex);
      setIsTransitioning(false);
      isChanging.current = false;
    }, 500);
  }, [currentVideo]);

  useEffect(() => {
    const video = videoRefs.current[currentVideo];
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }, [currentVideo]);

  return (
    <section className="relative h-screen min-h-[700px] max-h-[1100px] w-full overflow-hidden">
      {/* Background videos */}
      <div className="absolute inset-0">
        {HERO_VIDEOS.map((src, index) => (
          <video
            key={src}
            ref={(el) => { videoRefs.current[index] = el; }}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              index === currentVideo && !isTransitioning ? 'opacity-100' : 'opacity-0'
            }`}
            src={src}
            muted
            playsInline
            onEnded={index === currentVideo ? handleVideoEnd : undefined}
          />
        ))}

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/50 to-primary/60" />

        {/* Colored glows - Zara aesthetic */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-violet-500/8 rounded-full blur-[80px] pointer-events-none" />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-primary/90 to-transparent pointer-events-none" />
      </div>

      {/* Trust bar - top */}
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

      {/* Main content - Bottom left positioned like Zara/etail.me */}
      <div className="relative z-10 flex h-full items-end pb-24 sm:pb-32 lg:pb-36">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
          <div
            className={`max-w-2xl space-y-6 transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '0.3s' }}
          >
            {/* Badge */}
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/15 text-white/90 text-sm font-body">
                <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                Nouvelle collection 2026
              </span>
            </div>

            {/* Bold headline */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-semibold text-white leading-[1.05] tracking-tight"
              style={{ letterSpacing: '-0.02em' }}
            >
              Crée ton coin beauté
              <br />
              <span className="text-secondary italic">de rêve</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-white/70 max-w-lg leading-relaxed font-body">
              Coiffeuses élégantes à partir de <span className="text-secondary font-semibold">129€</span>.
              Livraison offerte partout en France.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 pt-2">
              <Link
                href="/collections"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-secondary px-7 py-4 text-sm font-semibold text-primary shadow-xl hover:shadow-2xl hover:shadow-secondary/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                Découvrir les coiffeuses
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              <Link
                href="#bestsellers"
                className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm px-7 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/20 hover:border-white/40"
              >
                Voir les bestsellers
              </Link>
            </div>

            {/* Trust text */}
            <p className="text-xs text-white/40 pt-1 font-body">
              Paiement sécurisé · Livraison offerte · Satisfait ou remboursé
            </p>
          </div>
        </div>
      </div>

      {/* Stats bar - Bottom right like BeautyTime */}
      <div
        className={`absolute bottom-6 right-6 sm:right-8 lg:right-12 z-20 hidden md:block transition-all duration-700 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
        style={{ transitionDelay: '0.8s' }}
      >
        <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl px-6 py-4 shadow-2xl">
          {[
            { value: '+2000', label: 'Clientes satisfaites' },
            { value: '4.9★', label: 'Note moyenne' },
            { value: '14j', label: 'Retours gratuits' },
          ].map((stat, idx) => (
            <div key={stat.label} className="flex items-center gap-4">
              {idx > 0 && <div className="h-8 w-px bg-white/20" />}
              <div className="text-center">
                <p className="text-2xl font-heading font-bold text-white">{stat.value}</p>
                <p className="text-[11px] text-white/60 whitespace-nowrap font-body">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video indicators - Bottom center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:hidden">
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
            className={`w-10 h-1 rounded-full transition-all duration-300 ${
              index === currentVideo
                ? 'bg-secondary'
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Vidéo ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator - hidden on mobile */}
      <div
        className={`absolute bottom-8 left-8 lg:left-12 z-20 hidden md:block transition-all duration-700 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: '1s' }}
      >
        <a
          href="#brand-promise"
          className="group flex items-center gap-3 text-white/50 hover:text-white/80 transition-colors"
        >
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full bg-secondary/20 animate-ping pointer-events-none" />
            <div className="relative w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center group-hover:bg-white/15 group-hover:border-secondary/30 transition-all">
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
          <span className="text-xs font-body tracking-widest uppercase">Découvrir</span>
        </a>
      </div>
    </section>
  );
}
