// src/app/collections/page.tsx
import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { PRODUCTS } from '@/lib/data';
import type { Product } from '@/types';
import Navbar from '@/components/sections/Navbar';
import FooterVelora from '@/components/sections/FooterVelora';
import ProductCard from '@/components/ProductCard';

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

export default async function CollectionsPage() {
  const products = await getProducts();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl md:text-5xl font-semibold text-primary mb-4">
              Nos Coiffeuses
            </h1>
            <p className="font-body text-text-secondary text-lg max-w-2xl mx-auto">
              Des coiffeuses élégantes pour créer ton coin beauté de rêve.
              Livraison offerte partout en France.
            </p>
          </div>

          {/* Filters / Sort (simplified) */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-primary/10">
            <p className="font-body text-text-secondary">
              {products.length} produit{products.length > 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-4">
              <span className="font-body text-sm text-text-secondary">Trier par :</span>
              <select className="font-body text-sm text-primary bg-transparent border-none outline-none cursor-pointer">
                <option value="featured">En vedette</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </div>
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Trust section */}
          <div className="mt-20 p-8 bg-accent rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                {
                  icon: '🚚',
                  title: 'Livraison Offerte',
                  description: 'Partout en France métropolitaine',
                },
                {
                  icon: '↩️',
                  title: 'Retours Gratuits',
                  description: '30 jours pour changer d\'avis',
                },
                {
                  icon: '🔒',
                  title: 'Paiement Sécurisé',
                  description: 'CB, Visa, Mastercard, Klarna',
                },
              ].map((item, index) => (
                <div key={index}>
                  <span className="text-3xl mb-3 block">{item.icon}</span>
                  <h3 className="font-heading text-lg font-semibold text-primary mb-1">
                    {item.title}
                  </h3>
                  <p className="font-body text-text-secondary text-sm">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <FooterVelora />
    </>
  );
}
