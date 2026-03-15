// src/app/collections/page.tsx
import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { PRODUCTS } from '@/lib/data';
import type { Product, Category } from '@/types';
import Navbar from '@/components/sections/Navbar';
import FooterVelora from '@/components/sections/FooterVelora';
import CollectionsClient from '@/components/CollectionsClient';

export const metadata: Metadata = {
  title: 'Nos Coiffeuses — VELORA',
  description: 'Découvrez notre collection de coiffeuses élégantes à partir de 129€. Livraison offerte en France.',
};

async function getProducts(): Promise<Product[]> {
  if (!supabase) return PRODUCTS;

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error || !data?.length) {
      console.log('[collections] Fallback to local data');
      return PRODUCTS;
    }

    return data as Product[];
  } catch {
    return PRODUCTS;
  }
}

async function getCategories(): Promise<Category[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error || !data?.length) {
      return [];
    }

    return data.map(cat => ({
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      description: cat.description,
      icon: cat.icon,
      color: cat.color,
      sortOrder: cat.sort_order,
      isActive: cat.is_active,
    }));
  } catch {
    return [];
  }
}

export default async function CollectionsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-20">
        <CollectionsClient products={products} categories={categories} />
      </main>
      <FooterVelora />
    </>
  );
}
