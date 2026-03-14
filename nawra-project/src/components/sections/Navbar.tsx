// src/components/sections/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    const onResize = () => setMobileOpen(false);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <>
      {/* Floating centered navbar */}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <nav
          className={`
            pointer-events-auto flex w-full max-w-4xl items-center justify-between
            rounded-full border px-5 py-2.5 transition-all duration-500
            ${scrolled
              ? 'border-primary/10 bg-white/90 backdrop-blur-lg shadow-lg shadow-primary/5'
              : 'border-white/20 bg-white/10 backdrop-blur-sm'
            }
          `}
          style={{
            animation: 'fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {/* Logo */}
          <Link href="/" className="shrink-0 hover:opacity-80 transition-opacity">
            <Logo
              size="sm"
              variant={scrolled ? 'dark' : 'light'}
            />
          </Link>

          {/* Center links (desktop) */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { href: '/collections', label: 'Collections' },
              { href: '/#bestsellers', label: 'Bestsellers' },
              { href: '/#reviews', label: 'Avis' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-4 py-2 text-sm font-medium rounded-full transition-colors
                  ${scrolled
                    ? 'text-primary/70 hover:text-primary hover:bg-primary/5'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/collections"
              className={`
                hidden sm:inline-flex rounded-full px-5 py-2.5 text-sm font-semibold
                transition-all duration-300 shadow-lg
                ${scrolled
                  ? 'bg-primary text-white hover:bg-primary/90 hover:shadow-primary/20'
                  : 'bg-secondary text-primary hover:shadow-secondary/30'
                }
              `}
            >
              Voir les coiffeuses
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`
                md:hidden flex h-9 w-9 items-center justify-center rounded-full transition-colors
                ${scrolled
                  ? 'text-primary hover:bg-primary/5'
                  : 'text-white hover:bg-white/10'
                }
              `}
              aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div
            className="pointer-events-auto absolute left-4 right-4 top-20 rounded-2xl border border-primary/10 bg-white/95 backdrop-blur-lg shadow-xl md:hidden overflow-hidden"
            style={{
              animation: 'fadeInUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            <div className="flex flex-col gap-1 p-4">
              {[
                { href: '/collections', label: 'Collections' },
                { href: '/#bestsellers', label: 'Bestsellers' },
                { href: '/#reviews', label: 'Avis clients' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-primary/80 transition-colors hover:bg-primary/5 hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}

              <div className="my-2 h-px bg-primary/10" />

              <Link
                href="/collections"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-primary text-center shadow-md transition-all hover:shadow-lg"
              >
                Voir les coiffeuses
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}
