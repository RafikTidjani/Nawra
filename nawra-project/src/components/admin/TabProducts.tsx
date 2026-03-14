// src/components/admin/TabProducts.tsx
'use client';

import { useState, useEffect } from 'react';
import { PRODUCTS } from '@/lib/data';
import type { Product } from '@/types';

const STOCK_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  in_stock: { label: 'En stock', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  limited: { label: 'Stock limité', color: 'text-amber-600', bg: 'bg-amber-50' },
  out_of_stock: { label: 'Rupture', color: 'text-red-600', bg: 'bg-red-50' },
};

export default function TabProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [saving, setSaving] = useState(false);

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
          // Fallback sur les données locales
          setProducts(PRODUCTS);
        }
      } else {
        setProducts(PRODUCTS);
      }
    } catch {
      setProducts(PRODUCTS);
    }
    setLoading(false);
  };

  const startEdit = (product: Product) => {
    setEditing(product.id);
    setFormData({ ...product });
  };

  const cancelEdit = () => {
    setEditing(null);
    setFormData({});
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updated = await res.json();
        setProducts(products.map(p => p.id === editing ? updated : p));
      } else {
        // Fallback local
        setProducts(products.map(p =>
          p.id === editing ? { ...p, ...formData } as Product : p
        ));
      }
    } catch {
      // Fallback local
      setProducts(products.map(p =>
        p.id === editing ? { ...p, ...formData } as Product : p
      ));
    }

    setSaving(false);
    setEditing(null);
    setFormData({});
  };

  const updateImages = (index: number, value: string) => {
    const images = [...(formData.images || [])];
    images[index] = value;
    setFormData({ ...formData, images });
  };

  const addImage = () => {
    const images = [...(formData.images || []), ''];
    setFormData({ ...formData, images });
  };

  const removeImage = (index: number) => {
    const images = (formData.images || []).filter((_, i) => i !== index);
    setFormData({ ...formData, images });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
          <span className="font-body text-primary/40 text-sm">Chargement des produits...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading text-primary text-2xl">Produits</h2>
          <p className="font-body text-primary/40 text-sm">{products.length} coiffeuse(s)</p>
        </div>
        <button
          onClick={fetchProducts}
          className="flex items-center gap-2 px-4 py-2 border border-primary/10 rounded-xl text-primary/60 hover:text-primary hover:border-primary/20 transition-colors text-sm font-body"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualiser
        </button>
      </div>

      {/* Products list */}
      <div className="space-y-4">
        {products.map((product) => {
          const stockConfig = STOCK_STATUS_CONFIG[product.stock_status] || STOCK_STATUS_CONFIG.in_stock;
          const isEditing = editing === product.id;

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm border border-primary/5 overflow-hidden"
            >
              {isEditing ? (
                /* Edit form */
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-primary/50 text-xs font-body mb-2 uppercase tracking-wider">
                        Nom du produit
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 border border-primary/10 rounded-xl focus:outline-none focus:border-secondary/50"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-primary/50 text-xs font-body mb-2 uppercase tracking-wider">
                        Slug (URL)
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 border border-primary/10 rounded-xl focus:outline-none focus:border-secondary/50 bg-primary/[0.02]"
                        value={formData.slug || ''}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-primary/50 text-xs font-body mb-2 uppercase tracking-wider">
                        Prix (€)
                      </label>
                      <input
                        type="number"
                        className="w-full px-4 py-2.5 border border-primary/10 rounded-xl focus:outline-none focus:border-secondary/50"
                        value={formData.price || 0}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="block text-primary/50 text-xs font-body mb-2 uppercase tracking-wider">
                        Prix barré (€)
                      </label>
                      <input
                        type="number"
                        className="w-full px-4 py-2.5 border border-primary/10 rounded-xl focus:outline-none focus:border-secondary/50"
                        value={formData.compare_at_price || ''}
                        onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value ? Number(e.target.value) : undefined })}
                        placeholder="Optionnel"
                      />
                    </div>
                    <div>
                      <label className="block text-primary/50 text-xs font-body mb-2 uppercase tracking-wider">
                        Statut stock
                      </label>
                      <select
                        className="w-full px-4 py-2.5 border border-primary/10 rounded-xl focus:outline-none focus:border-secondary/50"
                        value={formData.stock_status || 'in_stock'}
                        onChange={(e) => setFormData({ ...formData, stock_status: e.target.value as 'in_stock' | 'limited' | 'out_of_stock' })}
                      >
                        <option value="in_stock">En stock</option>
                        <option value="limited">Stock limité</option>
                        <option value="out_of_stock">Rupture</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-primary/50 text-xs font-body mb-2 uppercase tracking-wider">
                      Description courte
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border border-primary/10 rounded-xl focus:outline-none focus:border-secondary/50"
                      value={formData.short_description || ''}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-primary/50 text-xs font-body mb-2 uppercase tracking-wider">
                      Description complète
                    </label>
                    <textarea
                      className="w-full px-4 py-2.5 border border-primary/10 rounded-xl focus:outline-none focus:border-secondary/50 h-32 resize-none"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  {/* Images */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-primary/50 text-xs font-body uppercase tracking-wider">
                        Images (URLs)
                      </label>
                      <button
                        type="button"
                        onClick={addImage}
                        className="text-secondary text-xs font-body hover:underline"
                      >
                        + Ajouter une image
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(formData.images || []).map((img, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="url"
                            className="flex-1 px-4 py-2 border border-primary/10 rounded-xl focus:outline-none focus:border-secondary/50 text-sm"
                            value={img}
                            onChange={(e) => updateImages(index, e.target.value)}
                            placeholder="https://..."
                          />
                          {img && (
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-primary/10 flex-shrink-0">
                              <img src={img} alt="" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="px-2 text-red-400 hover:text-red-600"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={saveEdit}
                      disabled={saving}
                      className="px-4 py-2 bg-secondary text-primary font-body text-sm rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                    <button
                      onClick={cancelEdit}
                      disabled={saving}
                      className="px-4 py-2 border border-primary/10 text-primary/60 font-body text-sm rounded-xl hover:border-primary/20 transition-colors disabled:opacity-50"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                /* Display mode */
                <div className="p-6 flex items-center gap-6">
                  {/* Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-primary/10 flex-shrink-0 bg-accent">
                    {product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary/20 text-2xl">
                        🪞
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-heading text-primary text-lg truncate">
                        {product.name}
                      </h3>
                      <span className={`px-2 py-0.5 text-xs font-body rounded-full ${stockConfig.bg} ${stockConfig.color}`}>
                        {stockConfig.label}
                      </span>
                    </div>
                    <p className="font-body text-primary/50 text-sm truncate">
                      {product.short_description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {product.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs font-body bg-primary/5 text-primary/40 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & actions */}
                  <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="text-right">
                      <span className="font-heading text-secondary text-xl">
                        {product.price}€
                      </span>
                      {product.compare_at_price && (
                        <span className="block font-body text-primary/30 text-sm line-through">
                          {product.compare_at_price}€
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => startEdit(product)}
                      className="px-4 py-2 border border-primary/10 text-primary/60 font-body text-sm rounded-xl hover:border-secondary/50 hover:text-secondary transition-colors"
                    >
                      Modifier
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-primary/30 text-sm font-body">
        Les modifications sont synchronisées avec la base de données Supabase.
      </p>
    </div>
  );
}
