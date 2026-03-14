// src/app/products/[slug]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { getProductBySlug, PRODUCTS, REVIEWS } from '@/lib/data';
import type { Product } from '@/types';
import Navbar from '@/components/sections/Navbar';
import FooterVelora from '@/components/sections/FooterVelora';
import ProductGallery from '@/components/ProductGallery';
import AddToCartButton from '@/components/AddToCartButton';
import ProductCard from '@/components/ProductCard';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Fetch product from Supabase or fallback to local
async function getProduct(slug: string): Promise<Product | null> {
  if (!supabase) {
    return getProductBySlug(slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      // Fallback to local data
      return getProductBySlug(slug) || null;
    }

    return data as Product;
  } catch {
    return getProductBySlug(slug) || null;
  }
}

// Fetch all products for related products
async function getAllProducts(): Promise<Product[]> {
  if (!supabase) return PRODUCTS;

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true);

    if (error || !data?.length) return PRODUCTS;
    return data as Product[];
  } catch {
    return PRODUCTS;
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Produit non trouvé — VELORA',
    };
  }

  return {
    title: `${product.name} — VELORA`,
    description: `${product.short_description} Livraison offerte en France.`,
    openGraph: {
      title: `${product.name} — VELORA`,
      description: product.short_description,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export async function generateStaticParams() {
  // For static generation, use local data
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    getProduct(slug),
    getAllProducts(),
  ]);

  if (!product) {
    notFound();
  }

  // Get related products (same category, excluding current)
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // Get reviews for this product (from local data for now)
  const productReviews = REVIEWS.filter((r) => r.product_id === product.id);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm font-body text-text-secondary">
              <li>
                <a href="/" className="hover:text-primary transition-colors">Accueil</a>
              </li>
              <li>/</li>
              <li>
                <a href="/collections" className="hover:text-primary transition-colors">Collections</a>
              </li>
              <li>/</li>
              <li className="text-primary">{product.name}</li>
            </ol>
          </nav>

          {/* Product details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Gallery */}
            <div>
              <ProductGallery images={product.images} productName={product.name} />
            </div>

            {/* Info */}
            <div>
              {/* Badges */}
              <div className="flex items-center gap-2 mb-4">
                {product.stock_status === 'limited' && (
                  <span className="badge-limited">Stock limité</span>
                )}
                {product.compare_at_price && (
                  <span className="badge-gold">
                    -{Math.round((1 - product.price / product.compare_at_price) * 100)}%
                  </span>
                )}
              </div>

              {/* Name */}
              <h1 className="font-heading text-3xl md:text-4xl font-semibold text-primary mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="font-heading text-3xl text-primary font-semibold">
                  {product.price}€
                </span>
                {product.compare_at_price && (
                  <span className="font-body text-xl text-text-secondary line-through">
                    {product.compare_at_price}€
                  </span>
                )}
              </div>

              {/* Short description */}
              <p className="font-body text-text-secondary text-lg leading-relaxed mb-8">
                {product.short_description}
              </p>

              {/* Add to cart */}
              <div className="mb-8">
                <AddToCartButton product={product} />
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: '🚚', text: 'Livraison offerte' },
                  { icon: '↩️', text: 'Retours gratuits 30j' },
                  { icon: '🔒', text: 'Paiement sécurisé' },
                  { icon: '📦', text: 'Garantie 2 ans' },
                ].map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-text-secondary text-sm"
                  >
                    <span>{badge.icon}</span>
                    <span className="font-body">{badge.text}</span>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="border-t border-primary/10 pt-8">
                <h3 className="font-heading text-lg font-semibold text-primary mb-4">
                  Caractéristiques
                </h3>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-body text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Collapsible: Description */}
              <details className="border-t border-primary/10 pt-6 mt-6 group">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-heading text-lg font-semibold text-primary">Description</span>
                  <svg className="w-5 h-5 text-primary transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-4 font-body text-text-secondary leading-relaxed whitespace-pre-line">
                  {product.description}
                </div>
              </details>

              {/* Collapsible: Livraison */}
              <details className="border-t border-primary/10 pt-6 mt-6 group">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-heading text-lg font-semibold text-primary">Livraison & Retours</span>
                  <svg className="w-5 h-5 text-primary transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-4 font-body text-text-secondary leading-relaxed space-y-3">
                  <p>🚚 <strong>Livraison offerte</strong> partout en France métropolitaine</p>
                  <p>📦 Expédition sous 24-48h</p>
                  <p>🕐 Délai de livraison : 5 à 7 jours ouvrés</p>
                  <p>↩️ <strong>Retours gratuits</strong> sous 30 jours</p>
                </div>
              </details>
            </div>
          </div>

          {/* Reviews */}
          {productReviews.length > 0 && (
            <section className="mt-20 pt-12 border-t border-primary/10">
              <h2 className="font-heading text-2xl font-semibold text-primary mb-8">
                Avis clients
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {productReviews.map((review) => (
                  <div key={review.id} className="card-light p-6">
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'text-secondary' : 'text-primary/10'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="font-body text-text-secondary text-sm mb-4">
                      &ldquo;{review.content}&rdquo;
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-body text-primary font-medium text-sm">{review.author}</span>
                      {review.verified && (
                        <span className="flex items-center gap-1 text-emerald-500 text-xs">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Vérifié
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <section className="mt-20 pt-12 border-t border-primary/10">
              <h2 className="font-heading text-2xl font-semibold text-primary mb-8">
                Vous aimerez aussi
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <FooterVelora />
    </>
  );
}
