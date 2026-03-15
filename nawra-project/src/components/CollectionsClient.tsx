// src/components/CollectionsClient.tsx
'use client';

import { useState, useMemo } from 'react';
import type { Product, Category } from '@/types';
import ProductCard from '@/components/ProductCard';
import { useWishlist } from '@/hooks/useWishlist';

interface CollectionsClientProps {
  products: Product[];
  categories?: Category[];
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name';
type PriceRange = 'all' | 'under-150' | '150-200' | 'over-200';

export default function CollectionsClient({ products, categories: propCategories }: CollectionsClientProps) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('featured');
  const [priceRange, setPriceRange] = useState<PriceRange>('all');
  const [category, setCategory] = useState<string>('all');
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Fallback labels for legacy categories
  const categoryLabels: Record<string, string> = {
    'coiffeuse-led': 'Coiffeuses LED',
    'coiffeuse-bois': 'Coiffeuses Bois',
    'coiffeuse-compact': 'Coiffeuses Compactes',
  };

  // Use prop categories or derive from products
  const categoryList = useMemo(() => {
    if (propCategories && propCategories.length > 0) {
      return propCategories;
    }
    // Fallback: derive from products
    const cats = new Set(products.map(p => p.category));
    return Array.from(cats).map(slug => ({
      id: slug,
      slug,
      name: categoryLabels[slug] || slug,
      icon: undefined as string | undefined,
      sortOrder: 0,
      isActive: true,
    }));
  }, [products, propCategories]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags?.some(t => t.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (category !== 'all') {
      result = result.filter(p => p.category === category);
    }

    // Price filter
    if (priceRange !== 'all') {
      result = result.filter(p => {
        if (priceRange === 'under-150') return p.price < 150;
        if (priceRange === '150-200') return p.price >= 150 && p.price <= 200;
        if (priceRange === 'over-200') return p.price > 200;
        return true;
      });
    }

    // Sort
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep original order (featured)
        break;
    }

    return result;
  }, [products, search, sort, priceRange, category]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="font-heading text-4xl md:text-5xl font-semibold text-primary mb-4">
          Nos Coiffeuses
        </h1>
        <p className="font-body text-text-secondary text-lg max-w-2xl mx-auto">
          Des coiffeuses élégantes pour créer ton coin beauté de rêve.
          Livraison offerte partout en France.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-10">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une coiffeuse..."
            className="w-full pl-12 pr-4 py-3.5 rounded-full border border-primary/10 bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all font-body"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-primary/10">
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 rounded-full border border-primary/10 bg-white text-sm font-body text-primary focus:border-secondary outline-none cursor-pointer"
          >
            <option value="all">Toutes les catégories</option>
            {categoryList.map(cat => (
              <option key={cat.slug} value={cat.slug}>
                {cat.icon ? `${cat.icon} ` : ''}{cat.name}
              </option>
            ))}
          </select>

          {/* Price Filter */}
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value as PriceRange)}
            className="px-4 py-2 rounded-full border border-primary/10 bg-white text-sm font-body text-primary focus:border-secondary outline-none cursor-pointer"
          >
            <option value="all">Tous les prix</option>
            <option value="under-150">Moins de 150€</option>
            <option value="150-200">150€ - 200€</option>
            <option value="over-200">Plus de 200€</option>
          </select>

          {/* Active filters badges */}
          {(category !== 'all' || priceRange !== 'all' || search) && (
            <button
              onClick={() => {
                setCategory('all');
                setPriceRange('all');
                setSearch('');
              }}
              className="px-3 py-1.5 rounded-full bg-primary/5 text-sm font-body text-primary/70 hover:bg-primary/10 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Effacer les filtres
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="font-body text-sm text-text-secondary">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="px-4 py-2 rounded-full border border-primary/10 bg-white text-sm font-body text-primary focus:border-secondary outline-none cursor-pointer"
          >
            <option value="featured">En vedette</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="name">Nom A-Z</option>
          </select>
        </div>
      </div>

      {/* Products grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isInWishlist={isInWishlist(product.id)}
              onWishlistToggle={toggleWishlist}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/5 flex items-center justify-center">
            <svg className="w-10 h-10 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="font-heading text-xl font-semibold text-primary mb-2">
            Aucun produit trouvé
          </h3>
          <p className="font-body text-text-secondary mb-6">
            Essayez de modifier vos critères de recherche
          </p>
          <button
            onClick={() => {
              setCategory('all');
              setPriceRange('all');
              setSearch('');
            }}
            className="px-6 py-3 rounded-full bg-secondary text-primary font-semibold hover:bg-secondary/90 transition-colors"
          >
            Voir tous les produits
          </button>
        </div>
      )}

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
  );
}
