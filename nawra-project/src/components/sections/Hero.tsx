// src/components/sections/Hero.tsx
import { ARABESQUE_BG, VIDEOS } from '@/lib/data';
import Logo from '@/components/ui/Logo';

// Total cycle = VIDEOS.length * 5s = 20s
const SLIDE_DURATION = 5;
const TOTAL_DURATION = VIDEOS.length * SLIDE_DURATION;

// Build CSS keyframes for each video
function buildVideoCSS() {
  // Each video: fade in, stay, fade out, stay hidden
  // For 4 videos over 20s: each gets 25% of the cycle
  const pct = 100 / VIDEOS.length; // 25%
  const fadePct = 5; // 5% fade duration

  return VIDEOS.map((_, i) => {
    const start = i * pct;
    const fadeInEnd = start + fadePct;
    const holdEnd = start + pct - fadePct;
    const fadeOutEnd = start + pct;

    return `
      @keyframes heroVideo${i} {
        0% { opacity: 0; }
        ${start}% { opacity: 0; }
        ${fadeInEnd}% { opacity: 1; }
        ${holdEnd}% { opacity: 1; }
        ${fadeOutEnd}% { opacity: 0; }
        100% { opacity: 0; }
      }
    `;
  }).join('\n');
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col bg-dark overflow-hidden">
      {/* CSS animations for videos */}
      <style dangerouslySetInnerHTML={{ __html: `
        ${buildVideoCSS()}
        ${VIDEOS.map((_, i) => `
          .hero-video-${i} {
            animation: heroVideo${i} ${TOTAL_DURATION}s infinite;
          }
        `).join('\n')}
      `}} />

      {/* Background videos */}
      <div className="absolute inset-0 pointer-events-none">
        {VIDEOS.map((video, index) => (
          <div
            key={video.id}
            className={`absolute inset-0 hero-video-${index}`}
            style={{ opacity: index === 0 ? 1 : 0 }}
          >
            <video
              className="absolute inset-0 w-full h-full object-cover scale-105"
              src={`/videos/${video.file}.mp4`}
              autoPlay
              loop
              muted
              playsInline
            />
            <div
              className="absolute inset-0 mix-blend-multiply opacity-30"
              style={{ backgroundColor: video.color }}
            />
          </div>
        ))}
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-dark/50 pointer-events-none" />
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: ARABESQUE_BG }} />
      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-dark/40 pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Trust bar */}
      <div className="relative z-10 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="ticker-wrap py-2">
          <div className="ticker-inner">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 px-4">
                {[
                  { icon: '✓', text: 'Livraison 48h Paris & IDF' },
                  { icon: '★', text: '4.9/5 (200+ avis)' },
                  { icon: '🔒', text: 'Paiement sécurisé' },
                  { icon: '✓', text: 'Produits 100% authentiques' },
                ].map((item, j) => (
                  <span key={j} className="flex items-center gap-2 text-cream/50 text-xs whitespace-nowrap">
                    <span className="text-gold text-sm">{item.icon}</span>
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
          <div className="animate-fade-up mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur border border-white/10 text-cream/70 text-xs">
              <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
              Nouvelle collection 2026
            </span>
          </div>

          <div className="animate-fade-up-1 mb-8 flex justify-center">
            <Logo size="lg" />
          </div>

          <h1 className="font-cormorant text-cream text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide mb-6 animate-fade-up-2 font-light leading-tight">
            Créations sur mesure<br />
            pour vos <span className="text-gold italic">moments précieux</span>
          </h1>

          <p className="font-cormorant text-cream/70 text-lg md:text-xl mb-10 animate-fade-up-3 max-w-2xl mx-auto leading-relaxed">
            Bouquets floraux, paniers de fiançailles, cadeaux personnalisés.
            <br className="hidden md:block" />
            Composez avec les plus grandes marques de luxe.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-10 animate-fade-up-4">
            {['Dior', 'Chanel', 'YSL', 'Lancôme', 'Cartier'].map((brand, i) => (
              <span
                key={i}
                className="font-cormorant text-cream/30 text-sm md:text-base tracking-widest uppercase hover:text-cream/50 transition-colors"
              >
                {brand}
              </span>
            ))}
          </div>

          <div className="animate-fade-up-5">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center -space-x-2">
                {['bg-rose-300', 'bg-amber-300', 'bg-emerald-300', 'bg-blue-300', 'bg-purple-300'].map((color, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full ${color} border-2 border-dark flex items-center justify-center text-dark/60 text-xs font-semibold shadow-lg`}
                  >
                    {['S', 'A', 'M', 'L', 'N'][i]}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-gold/30 border-2 border-gold/50 flex items-center justify-center text-gold text-xs font-semibold shadow-lg">
                  +99
                </div>
              </div>
              <p className="text-cream/50 text-sm">
                Rejoignez <span className="text-gold font-medium">+500 familles</span> ce mois-ci
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator — simple <a> tag, no JS needed */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
        <a
          href="#experiences"
          className="group flex flex-col items-center gap-2 text-cream/40 hover:text-cream/70 transition-colors"
        >
          <span className="text-xs font-cormorant tracking-widest uppercase">Découvrir</span>
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full bg-gold/20 animate-ping pointer-events-none" />
            <div className="relative w-10 h-10 rounded-full bg-white/5 backdrop-blur border border-white/20 flex items-center justify-center group-hover:bg-white/10 group-hover:border-gold/30 transition-all">
              <svg
                className="w-4 h-4 text-gold animate-bounce"
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
