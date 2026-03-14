// src/components/sections/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show navbar once user scrolls past ~50% of viewport height
      setVisible(window.scrollY > window.innerHeight * 0.5);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 inset-x-0 z-50 border-b transition-all duration-500 ease-spring
        ${visible
          ? 'translate-y-0 opacity-100 border-primary/5 pointer-events-auto bg-background/80 backdrop-blur-lg'
          : '-translate-y-full opacity-0 border-transparent pointer-events-none'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo size="sm" variant="dark" />
          </Link>

          {/* Nav links (desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/collections" className="nav-lnk">
              Collections
            </Link>
            <Link href="/#bestsellers" className="nav-lnk">
              Bestsellers
            </Link>
            <Link href="/#reviews" className="nav-lnk">
              Avis clients
            </Link>
          </nav>

          {/* CTA + Cart */}
          <div className="flex items-center gap-4">
            <Link
              href="/collections"
              className="btn-primary text-xs px-5 py-2.5 hidden sm:inline-flex"
            >
              Voir les coiffeuses
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-primary"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-primary/5">
          <nav className="flex flex-col p-4 gap-4">
            <Link
              href="/collections"
              className="nav-lnk"
              onClick={() => setMobileOpen(false)}
            >
              Collections
            </Link>
            <Link
              href="/#bestsellers"
              className="nav-lnk"
              onClick={() => setMobileOpen(false)}
            >
              Bestsellers
            </Link>
            <Link
              href="/#reviews"
              className="nav-lnk"
              onClick={() => setMobileOpen(false)}
            >
              Avis clients
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
