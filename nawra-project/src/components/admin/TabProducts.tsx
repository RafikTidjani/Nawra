// src/components/admin/TabProducts.tsx
'use client';

import { useState, useEffect } from 'react';
import { DEFAULT_PRODUCTS, DEFAULT_THEMES } from '@/lib/data';
import type { Product, Theme } from '@/types';

type Category = 'parfum' | 'makeup' | 'soin' | 'bijou' | 'fleur' | 'chocolat' | 'accessoire';

const CATEGORY_LABELS: Record<Category, string> = {
  parfum: 'Parfums',
  makeup: 'Maquillage',
  soin: 'Soins',
  bijou: 'Bijoux',
  fleur: 'Fleurs',
  chocolat: 'Chocolats',
  accessoire: 'Accessoires',
};

const CATEGORY_EMOJIS: Record<Category, string> = {
  parfum: '🧴',
  makeup: '💄',
  soin: '🌿',
  bijou: '💎',
  fleur: '🌹',
  chocolat: '🍫',
  accessoire: '👜',
};

const STORAGE_KEY = 'nawra-admin-auth';

export default function TabProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [themes] = useState<Record<string, Theme>>(DEFAULT_THEMES);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [filterCat, setFilterCat] = useState<Category | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isNewItem, setIsNewItem] = useState(false);

  const getAdminSecret = () => localStorage.getItem(STORAGE_KEY) || '';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(DEFAULT_PRODUCTS);
        }
      } else {
        setProducts(DEFAULT_PRODUCTS);
      }
    } catch {
      setProducts(DEFAULT_PRODUCTS);
    }
    setLoading(false);
  };

  const filtered = filterCat === 'all'
    ? products
    : products.filter(p => p.cat === filterCat);

  const startEdit = (product: Product) => {
    setEditing(product.id);
    setFormData({ ...product });
    setIsNewItem(false);
  };

  const cancelEdit = () => {
    if (isNewItem && editing) {
      setProducts(products.filter(p => p.id !== editing));
    }
    setEditing(null);
    setFormData({});
    setIsNewItem(false);
  };

  const saveEdit = async () => {
    if (!editing || !formData.name) return;

    setSaving(true);
    try {
      const method = isNewItem ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/products', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': getAdminSecret(),
        },
        body: JSON.stringify({
          id: editing,
          cat: formData.cat || 'parfum',
          brand: formData.brand || '',
          name: formData.name,
          price: formData.price || 0,
          themes: formData.themes || [],
          types: formData.types || ['panier'],
          badge: formData.badge || null,
          img: formData.img || null,
        }),
      });

      if (res.ok) {
        const saved = await res.json();
        setProducts(products.map(p => p.id === editing ? saved : p));
      } else {
        // Fallback local
        setProducts(products.map(p =>
          p.id === editing ? { ...p, ...formData } as Product : p
        ));
      }
    } catch {
      setProducts(products.map(p =>
        p.id === editing ? { ...p, ...formData } as Product : p
      ));
    }
    setSaving(false);
    setEditing(null);
    setFormData({});
    setIsNewItem(false);
  };

  const addNew = () => {
    const newId = `p${Date.now()}`;
    const newProduct: Product = {
      id: newId,
      cat: 'parfum',
      brand: 'Marque',
      name: 'Nouveau produit',
      price: 50,
      themes: ['Dorée'],
    };
    setProducts([newProduct, ...products]);
    setEditing(newId);
    setFormData({ ...newProduct });
    setIsNewItem(true);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return;

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-secret': getAdminSecret() },
      });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const toggleTheme = (themeName: string) => {
    const current = formData.themes || [];
    if (current.includes(themeName)) {
      setFormData({ ...formData, themes: current.filter(t => t !== themeName) });
    } else {
      setFormData({ ...formData, themes: [...current, themeName] });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
          <span className="font-cormorant text-dark/40 text-sm">Chargement des produits...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-amiri text-dark text-2xl">Produits</h2>
          <p className="font-cormorant text-dark/40 text-sm">{products.length} produit(s)</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchProducts} className="btn-outline flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualiser
          </button>
          <button onClick={addNew} disabled={editing !== null} className="btn-gold flex items-center gap-2 disabled:opacity-40">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilterCat('all')}
          className={`
            px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200
            ${filterCat === 'all'
              ? 'bg-dark text-cream shadow-md'
              : 'bg-white text-dark/50 border border-dark/5 hover:border-gold/20'
            }
          `}
        >
          Tous ({products.length})
        </button>
        {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => {
          const count = products.filter(p => p.cat === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`
                flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200
                ${filterCat === cat
                  ? 'bg-dark text-cream shadow-md'
                  : 'bg-white text-dark/50 border border-dark/5 hover:border-gold/20'
                }
              `}
            >
              <span>{CATEGORY_EMOJIS[cat]}</span>
              {CATEGORY_LABELS[cat]}
              <span className={`text-xs ${filterCat === cat ? 'text-gold' : 'text-dark/30'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-dark/5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ease-spring"
          >
            {editing === product.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-dark/50 text-xs font-cormorant mb-2 uppercase tracking-wider">Marque</label>
                    <input
                      type="text"
                      className="inp-light w-full"
                      value={formData.brand || ''}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-dark/50 text-xs font-cormorant mb-2 uppercase tracking-wider">Nom</label>
                    <input
                      type="text"
                      className="inp-light w-full"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-dark/50 text-xs font-cormorant mb-2 uppercase tracking-wider">Catégorie</label>
                    <select
                      className="select-styled w-full"
                      value={formData.cat || 'parfum'}
                      onChange={(e) => setFormData({ ...formData, cat: e.target.value as Category })}
                    >
                      {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
                        <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-dark/50 text-xs font-cormorant mb-2 uppercase tracking-wider">Prix (€)</label>
                    <input
                      type="number"
                      className="inp-light w-full"
                      value={formData.price || 0}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-dark/50 text-xs font-cormorant mb-2 uppercase tracking-wider">Badge (optionnel)</label>
                    <input
                      type="text"
                      className="inp-light w-full"
                      value={formData.badge || ''}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="Bestseller, Luxe..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-dark/50 text-xs font-cormorant mb-2 uppercase tracking-wider">Image URL (optionnel)</label>
                  <div className="flex gap-3 items-start">
                    <input
                      type="url"
                      className="inp-light w-full"
                      value={formData.img || ''}
                      onChange={(e) => setFormData({ ...formData, img: e.target.value || undefined })}
                      placeholder="https://exemple.com/image.jpg"
                    />
                    {formData.img && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-dark/10 flex-shrink-0">
                        <img src={formData.img} alt="Aperçu" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-dark/50 text-xs font-cormorant mb-2 uppercase tracking-wider">Thèmes compatibles</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(themes).map(([themeName, themeData]) => (
                      <button
                        key={themeName}
                        type="button"
                        onClick={() => toggleTheme(themeName)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all duration-200 ${
                          formData.themes?.includes(themeName)
                            ? 'bg-gold text-dark border-gold shadow-sm'
                            : 'bg-white text-dark/50 border-dark/10 hover:border-gold/30'
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: themeData.p }}
                        />
                        {themeName}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button onClick={saveEdit} disabled={saving} className="btn-gold flex items-center gap-2 disabled:opacity-40">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                  <button onClick={cancelEdit} disabled={saving} className="btn-outline disabled:opacity-40">
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-dark/[0.02] border border-dark/5 flex items-center justify-center text-xl flex-shrink-0 overflow-hidden">
                    {product.img ? (
                      <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      CATEGORY_EMOJIS[product.cat as Category] || '🎁'
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-cormorant text-dark/40 text-xs uppercase tracking-wider">
                        {product.brand}
                      </span>
                      {product.badge && (
                        <span className="badge-gold text-[10px]">{product.badge}</span>
                      )}
                    </div>
                    <h3 className="font-amiri text-dark text-lg">{product.name}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.themes.map((t) => (
                        <span
                          key={t}
                          className="flex items-center gap-1 text-[10px] text-dark/30 px-1.5 py-0.5 rounded-full bg-dark/[0.03]"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: themes[t]?.p || '#999' }}
                          />
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-amiri text-gold text-xl">{product.price}€</span>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(product)} className="btn-outline text-sm py-2 px-3">
                      Modifier
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="px-3 py-2 rounded-xl text-sm bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="mt-6 text-dark/30 text-sm font-cormorant">
        Les modifications sont synchronisées avec Supabase.
      </p>
    </div>
  );
}
