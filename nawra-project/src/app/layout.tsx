// src/app/layout.tsx
import type { Metadata } from 'next';
import { Amiri, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import WhatsAppButton from '@/components/WhatsAppButton';

const amiri = Amiri({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'arabic'],
  variable: '--font-amiri',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nawra — Corbeilles de fiançailles sur mesure',
  description: 'Composez votre corbeille de fiançailles unique avec les plus grandes marques. Livraison Paris & Île-de-France.',
  keywords: ['corbeille fiançailles', 'corbeille mariage', 'cadeaux fiançailles', 'personnalisé', 'Paris'],
  openGraph: {
    title: 'Nawra — Corbeilles de fiançailles sur mesure',
    description: 'Composez votre corbeille unique avec Dior, Chanel, YSL...',
    url: 'https://nawra.fr',
    siteName: 'Nawra',
    locale: 'fr_FR',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${amiri.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <body className="font-cormorant bg-cream text-dark antialiased" suppressHydrationWarning>
        {children}
        <WhatsAppButton />
        <div className="grain-overlay" />
      </body>
    </html>
  );
}
