// src/components/sections/FooterVelora.tsx
import Link from 'next/link';
import Logo from '@/components/ui/Logo';

export default function FooterVelora() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Logo size="md" variant="light" />
            </Link>
            <p className="font-body text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              Des coiffeuses élégantes à prix accessible.
              Qualité premium, livraison offerte en France.
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-white/40 text-sm">4.9/5 (500+ avis)</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-body text-white text-sm tracking-wider uppercase mb-6 font-medium">
              Navigation
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Accueil' },
                { href: '/collections', label: 'Nos coiffeuses' },
                { href: '/#reviews', label: 'Avis clients' },
                { href: '/#faq', label: 'FAQ' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-white/50 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-body text-white text-sm tracking-wider uppercase mb-6 font-medium">
              Contact
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:contact@velorabeauty.fr"
                  className="flex items-center gap-3 text-white/50 hover:text-white transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-body text-sm">contact@velorabeauty.fr</span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/velorabeauty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/50 hover:text-white transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <span className="font-body text-sm">@velorabeauty</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/40">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="font-body text-sm">France métropolitaine</span>
              </li>
            </ul>
          </div>

          {/* Payment & Trust */}
          <div>
            <h3 className="font-body text-white text-sm tracking-wider uppercase mb-6 font-medium">
              Paiement sécurisé
            </h3>

            {/* Payment methods */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['Visa', 'MC', 'Amex', 'Klarna'].map((method) => (
                <div
                  key={method}
                  className="px-3 py-2 rounded-lg bg-white/5 text-white/40 text-xs font-medium"
                >
                  {method}
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                SSL 256-bit
              </div>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Garantie 2 ans
              </div>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7h4.05a1 1 0 01.95.68l1.5 4.5a1 1 0 01.05.32v2a1 1 0 01-1 1h-.05a2.5 2.5 0 01-4.9 0H14a1 1 0 01-1-1V8a1 1 0 011-1z" />
                </svg>
                Livraison offerte
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-white/30 text-sm">
              © {currentYear} VELORA. Tous droits réservés.
            </p>

            <div className="flex items-center gap-6">
              <Link href="/mentions-legales" className="text-white/30 hover:text-white/60 text-sm transition-colors">
                Mentions légales
              </Link>
              <Link href="/cgv" className="text-white/30 hover:text-white/60 text-sm transition-colors">
                CGV
              </Link>
              <Link href="/confidentialite" className="text-white/30 hover:text-white/60 text-sm transition-colors">
                Confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
