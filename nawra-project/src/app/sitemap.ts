// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { PRODUCTS } from '@/lib/data';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://velorabeauty.fr';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/collections`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cgv`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/confidentialite`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  // Product pages
  let productSlugs = PRODUCTS.map(p => p.slug);

  if (supabase) {
    try {
      const { data } = await supabase
        .from('products')
        .select('slug')
        .eq('is_active', true);

      if (data?.length) {
        productSlugs = data.map((p: { slug: string }) => p.slug);
      }
    } catch {
      // Use fallback
    }
  }

  const productPages = productSlugs.map((slug) => ({
    url: `${BASE_URL}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}
