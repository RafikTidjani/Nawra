// src/app/configure/page.tsx
import { supabase } from '@/lib/supabase';
import { DEFAULT_THEMES, DEFAULT_SIZES, DEFAULT_PRODUCTS } from '@/lib/data';
import type { Theme, Size, Product, ProductType } from '@/types';
import ConfiguratorClient from './ConfiguratorClient';

async function getThemes(): Promise<Record<string, Theme>> {
  if (!supabase) return DEFAULT_THEMES;
  try {
    const { data, error } = await supabase.from('themes').select('*');
    if (error || !data?.length) return DEFAULT_THEMES;

    const themes: Record<string, Theme> = {};
    data.forEach((t) => {
      themes[t.name] = {
        id: t.id,
        name: t.name,
        p: t.p || t.primary_color,
        s: t.s || t.secondary_color,
        a: t.a || t.accent_color,
        l: t.l || t.light_color,
      };
    });
    return themes;
  } catch {
    return DEFAULT_THEMES;
  }
}

async function getSizes(): Promise<Size[]> {
  if (!supabase) return DEFAULT_SIZES;
  try {
    const { data, error } = await supabase
      .from('sizes')
      .select('*')
      .order('price', { ascending: true });

    if (error || !data?.length) return DEFAULT_SIZES;

    return data.map((s) => ({
      id: s.id,
      label: s.label,
      sub: s.sub,
      price: s.price,
      slots: s.slots,
      popular: s.popular,
    }));
  } catch {
    return DEFAULT_SIZES;
  }
}

async function getProducts(): Promise<Product[]> {
  if (!supabase) return DEFAULT_PRODUCTS;
  try {
    const { data, error } = await supabase.from('products').select('*');

    if (error || !data?.length) return DEFAULT_PRODUCTS;

    return data.map((p) => ({
      id: p.id,
      cat: p.cat || p.category,
      brand: p.brand,
      name: p.name,
      price: p.price,
      themes: p.themes || [],
      types: p.types || [],
      badge: p.badge,
      img: p.img,
    }));
  } catch {
    return DEFAULT_PRODUCTS;
  }
}

interface PageProps {
  searchParams: Promise<{ theme?: string; type?: string; cancelled?: string }>;
}

export default async function ConfigurePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [themes, sizes, products] = await Promise.all([
    getThemes(),
    getSizes(),
    getProducts(),
  ]);

  // Validate product type
  const validTypes: ProductType[] = ['bouquet', 'panier', 'cadeau'];
  const initialType = validTypes.includes(params.type as ProductType)
    ? (params.type as ProductType)
    : 'panier';

  return (
    <ConfiguratorClient
      themes={themes}
      sizes={sizes}
      products={products}
      initialTheme={params.theme}
      initialType={initialType}
      cancelled={params.cancelled === '1'}
    />
  );
}
