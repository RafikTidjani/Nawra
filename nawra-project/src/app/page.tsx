// src/app/page.tsx
import { supabase } from '@/lib/supabase';
import { PRODUCTS } from '@/lib/data';
import type { Product } from '@/types';

import Navbar from '@/components/sections/Navbar';
import Hero from '@/components/sections/Hero';
import BrandPromise from '@/components/sections/BrandPromise';
import Bestsellers from '@/components/sections/Bestsellers';
import UniversSection from '@/components/sections/UniversSection';
import ReviewsSection from '@/components/sections/ReviewsSection';
import FooterVelora from '@/components/sections/FooterVelora';

async function getProducts(): Promise<Product[]> {
  if (!supabase) return PRODUCTS;

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error || !data?.length) {
      return PRODUCTS;
    }

    return data as Product[];
  } catch {
    return PRODUCTS;
  }
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <BrandPromise />
      <Bestsellers products={products} />
      <UniversSection />
      <ReviewsSection />
      <FooterVelora />
    </main>
  );
}
