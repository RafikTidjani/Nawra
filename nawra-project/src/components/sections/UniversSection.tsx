// src/components/sections/UniversSection.tsx
import Link from 'next/link';

export default function UniversSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/lifestyle/ambiance.mp4"
          autoPlay
          loop
          muted
          playsInline
          poster="/images/ambiance-poster.jpg"
        />
        <div className="absolute inset-0 bg-primary/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="reveal">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/10 text-white/80 text-sm font-body mb-8">
            <span className="w-2 h-2 bg-secondary rounded-full" />
            L&apos;univers VELORA
          </span>
        </div>

        <h2 className="font-heading text-white text-4xl md:text-5xl lg:text-6xl mb-6 reveal font-medium">
          Crée ton coin beauté
          <br />
          <span className="text-secondary italic">à ton image</span>
        </h2>

        <p className="font-body text-white/70 text-lg md:text-xl mb-10 reveal max-w-2xl mx-auto leading-relaxed">
          Plus qu&apos;un meuble, ta coiffeuse est un espace rien qu&apos;à toi.
          Un moment de calme pour te préparer, te sentir belle, prendre soin de toi.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 reveal">
          <Link
            href="/collections"
            className="btn-secondary text-base px-8 py-4"
          >
            Trouver ma coiffeuse
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 reveal">
          {[
            { value: '2000+', label: 'Clientes satisfaites' },
            { value: '4.9/5', label: 'Note moyenne' },
            { value: '30j', label: 'Retours gratuits' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-heading text-3xl md:text-4xl text-secondary font-semibold mb-1">
                {stat.value}
              </div>
              <div className="font-body text-white/50 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
