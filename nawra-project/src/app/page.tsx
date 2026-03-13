// src/app/page.tsx
import { supabase } from '@/lib/supabase';
import { DEFAULT_THEMES, DEFAULT_BASKETS } from '@/lib/data';
import type { Theme, Basket } from '@/types';

import Navbar from '@/components/sections/Navbar';
import Hero from '@/components/sections/Hero';
import ExperiencesSection from '@/components/sections/ExperiencesSection';
import BouquetShowcase from '@/components/sections/BouquetShowcase';
import PanierShowcase from '@/components/sections/PanierShowcase';
import CadeauShowcase from '@/components/sections/CadeauShowcase';
import BasketCatalogue from '@/components/sections/BasketCatalogue';
import VideoSection from '@/components/sections/VideoSection';
import Testimonials from '@/components/sections/Testimonials';
import SplitEmail from '@/components/sections/SplitEmail';
import FaqSection from '@/components/sections/FaqSection';
import Footer from '@/components/sections/Footer';

async function getThemes(): Promise<Record<string, Theme>> {
  try {
    if (!supabase) return DEFAULT_THEMES;

    const { data, error } = await supabase
      .from('themes')
      .select('*');

    if (error || !data?.length) {
      return DEFAULT_THEMES;
    }

    const themes: Record<string, Theme> = {};
    data.forEach((t) => {
      themes[t.name] = {
        id: t.id,
        name: t.name,
        p: t.primary_color,
        s: t.secondary_color,
        a: t.accent_color,
        l: t.light_color,
      };
    });
    return themes;
  } catch {
    return DEFAULT_THEMES;
  }
}

async function getBaskets(): Promise<Basket[]> {
  try {
    if (!supabase) return DEFAULT_BASKETS;

    const { data, error } = await supabase
      .from('baskets')
      .select('*')
      .limit(4);

    if (error || !data?.length) {
      return DEFAULT_BASKETS;
    }

    return data.map((b) => ({
      id: b.id,
      name: b.name,
      theme: b.theme,
      size: b.size,
      price: b.price,
      tag: b.tag,
      products: b.products || [],
      img: b.img,
    }));
  } catch {
    return DEFAULT_BASKETS;
  }
}

export default async function HomePage() {
  const [themes, baskets] = await Promise.all([
    getThemes(),
    getBaskets(),
  ]);

  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <ExperiencesSection />
      <BouquetShowcase />
      <PanierShowcase />
      <CadeauShowcase />
      <BasketCatalogue baskets={baskets} themes={themes} />
      <VideoSection />
      <Testimonials />
      <SplitEmail />
      <FaqSection />
      <Footer />
    </main>
  );
}
