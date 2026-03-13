// src/components/sections/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { ARABESQUE_BG } from '@/lib/data';

export default function Navbar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show navbar once user scrolls past ~80% of viewport height
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 inset-x-0 z-50 border-b transition-all duration-500 ease-spring
        ${visible
          ? 'translate-y-0 opacity-100 border-white/5 pointer-events-auto'
          : '-translate-y-full opacity-0 border-transparent pointer-events-none'
        }
      `}
      style={{
        backgroundImage: `${ARABESQUE_BG}, linear-gradient(to right, #0D0608, #1A0A00, #0D0608)`,
      }}
    >
      <div className="backdrop-blur-md bg-dark/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Logo size="sm" />
            </Link>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#experiences" className="font-cormorant text-cream/50 hover:text-cream text-sm tracking-wide transition-colors">
                Créations
              </a>
              <a href="#catalogue" className="font-cormorant text-cream/50 hover:text-cream text-sm tracking-wide transition-colors">
                Catalogue
              </a>
              <a href="#faq" className="font-cormorant text-cream/50 hover:text-cream text-sm tracking-wide transition-colors">
                FAQ
              </a>
            </nav>

            {/* CTA */}
            <Link
              href="/configure"
              className="btn-gold text-xs px-4 py-2"
            >
              Composer
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
