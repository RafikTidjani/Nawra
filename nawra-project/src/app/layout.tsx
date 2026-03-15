// src/app/layout.tsx
import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';
import WhatsAppButton from '@/components/WhatsAppButton';
import Analytics from '@/components/Analytics';
import { AuthProvider } from '@/components/providers/AuthProvider';

const cormorant = Cormorant_Garamond({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VELORA — Coiffeuses premium à prix accessible | Livraison France',
  description: 'Découvrez nos coiffeuses élégantes livrées en France à partir de 159€. Qualité premium, livraison offerte, retours 30 jours.',
  keywords: ['coiffeuse', 'meuble beauté', 'vanity', 'miroir LED', 'chambre', 'France'],
  openGraph: {
    title: 'VELORA — Coiffeuses premium à prix accessible',
    description: 'Découvrez nos coiffeuses élégantes livrées en France à partir de 159€. Qualité premium, livraison offerte, retours 30 jours.',
    url: 'https://velorabeauty.fr',
    siteName: 'VELORA',
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: '/og-image.jpg' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="font-body bg-background text-text antialiased" suppressHydrationWarning>
        <AuthProvider>
          <Analytics />
          {children}
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  );
}
