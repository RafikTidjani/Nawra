// src/components/sections/Footer.tsx
import Link from 'next/link';
import { ARABESQUE_BG } from '@/lib/data';
import Logo from '@/components/ui/Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-dark2 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{ backgroundImage: ARABESQUE_BG }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark2 via-dark2/95 to-dark2/90" />

      {/* Top border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="relative">
        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Brand column */}
            <div className="lg:col-span-1">
              <Link href="/" className="inline-block mb-6">
                <Logo size="md" />
              </Link>
              <p className="font-cormorant text-cream/50 text-sm leading-relaxed mb-6 max-w-xs">
                Bouquets, paniers de fiançailles, cadeaux personnalisés.
                Créations sur mesure composées avec les plus grandes marques de luxe.
              </p>

              {/* Social proof mini */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-cream/40 text-xs">4.9/5 (200+ avis)</span>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="font-cormorant text-cream text-sm tracking-widest uppercase mb-6 font-medium">
                Navigation
              </h3>
              <ul className="space-y-3">
                {[
                  { href: '/', label: 'Accueil' },
                  { href: '/configure', label: 'Créer ma corbeille' },
                  { href: '/#catalogue', label: 'Collections' },
                  { href: '/#faq', label: 'Questions fréquentes' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="nav-lnk">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-cormorant text-cream text-sm tracking-widest uppercase mb-6 font-medium">
                Contact
              </h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="https://wa.me/33600000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-cream/60 hover:text-gold transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors">
                      <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <span className="font-cormorant text-sm">WhatsApp</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:contact@velorabeauty.fr"
                    className="flex items-center gap-3 text-cream/60 hover:text-gold transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                      <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="font-cormorant text-sm">contact@velorabeauty.fr</span>
                  </a>
                </li>
                <li className="flex items-center gap-3 text-cream/40">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="font-cormorant text-sm">Paris & Île-de-France</span>
                </li>
              </ul>
            </div>

            {/* Trust & Payment */}
            <div>
              <h3 className="font-cormorant text-cream text-sm tracking-widest uppercase mb-6 font-medium">
                Paiement sécurisé
              </h3>

              {/* Payment methods */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['Visa', 'MC', 'Amex', 'Apple'].map((method) => (
                  <div
                    key={method}
                    className="px-3 py-2 rounded-lg bg-white/5 text-cream/40 text-xs font-medium"
                  >
                    {method}
                  </div>
                ))}
              </div>

              {/* Trust badges */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-cream/50 text-sm">
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  SSL 256-bit
                </div>
                <div className="flex items-center gap-2 text-cream/50 text-sm">
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  100% Authentique
                </div>
                <div className="flex items-center gap-2 text-cream/50 text-sm">
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7h4.05a1 1 0 01.95.68l1.5 4.5a1 1 0 01.05.32v2a1 1 0 01-1 1h-.05a2.5 2.5 0 01-4.9 0H14a1 1 0 01-1-1V8a1 1 0 011-1z" />
                  </svg>
                  Livraison assurée
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="font-cormorant text-cream/30 text-sm tracking-wide">
                © {currentYear} VELORA. Tous droits réservés.
              </p>

              <div className="flex items-center gap-6">
                <Link href="/mentions-legales" className="text-cream/30 hover:text-cream/60 text-sm transition-colors">
                  Mentions légales
                </Link>
                <Link href="/cgv" className="text-cream/30 hover:text-cream/60 text-sm transition-colors">
                  CGV
                </Link>
                <Link href="/confidentialite" className="text-cream/30 hover:text-cream/60 text-sm transition-colors">
                  Confidentialité
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
