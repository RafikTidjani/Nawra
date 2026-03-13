// src/components/admin/TabSizes.tsx
'use client';

import { useState, useEffect } from 'react';
import { SIZES_PANIER, SIZES_BOUQUET, SIZES_CADEAU } from '@/lib/data';
import type { Size } from '@/types';

interface SizeRow extends Size {
  product_type?: string;
}

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  panier: 'Panier',
  bouquet: 'Bouquet',
  cadeau: 'Cadeau',
};

const STORAGE_KEY = 'nawra-admin-auth';

export default function TabSizes() {
  const [sizes, setSizes] = useState<SizeRow[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<SizeRow>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isNewItem, setIsNewItem] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const getAdminSecret = () => localStorage.getItem(STORAGE_KEY) || '';

  useEffect(() => {
    fetchSizes();
  }, []);

  const fetchSizes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/sizes');
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setSizes(data);
        } else {
          // Fallback: combine all default sizes with product_type
          const defaults: SizeRow[] = [
            ...SIZES_PANIER.map(s => ({ ...s, product_type: 'panier' })),
            ...SIZES_BOUQUET.map(s => ({ ...s, product_type: 'bouquet' })),
            ...SIZES_CADEAU.map(s => ({ ...s, product_type: 'cadeau' })),
          ];
          setSizes(defaults);
        }
      } else {
        const defaults: SizeRow[] = [
          ...SIZES_PANIER.map(s => ({ ...s, product_type: 'panier' })),
          ...SIZES_BOUQUET.map(s => ({ ...s, product_type: 'bouquet' })),
          ...SIZES_CADEAU.map(s => ({ ...s, product_type: 'cadeau' })),
        ];
        setSizes(defaults);
      }
    } catch {
      const defaults: SizeRow[] = [
        ...SIZES_PANIER.map(s => ({ ...s, product_type: 'panier' })),
        ...SIZES_BOUQUET.map(s => ({ ...s, product_type: 'bouquet' })),
        ...SIZES_CADEAU.map(s => ({ ...s, product_type: 'cadeau' })),
      ];
      setSizes(defaults);
    }
    setLoading(false);
  };

  const filtered = filterType === 'all'
    ? sizes
    : sizes.filter(s => s.product_type === filterType);

  const sizeKey = (s: SizeRow) => `${s.id}-${s.product_type}`;

  const startEdit = (size: SizeRow) => {
    setEditing(sizeKey(size));
    setFormData({ ...size });
    setIsNewItem(false);
  };

  const cancelEdit = () => {
    if (isNewItem && editing) {
      setSizes(sizes.filter(s => sizeKey(s) !== editing));
    }
    setEditing(null);
    setFormData({});
    setIsNewItem(false);
  };

  const saveEdit = async () => {
    if (!editing || !formData.label) return;

    setSaving(true);
    try {
      const method = isNewItem ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/sizes', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': getAdminSecret(),
        },
        body: JSON.stringify({
          id: formData.id,
          product_type: formData.product_type || 'panier',
          label: formData.label,
          sub: formData.sub || '',
          price: formData.price || 0,
          slots: formData.slots || 3,
          popular: formData.popular || false,
        }),
      });

      if (res.ok) {
        const saved = await res.json();
        setSizes(sizes.map(s => sizeKey(s) === editing ? saved : s));
      } else {
        setSizes(sizes.map(s =>
          sizeKey(s) === editing ? { ...s, ...formData } as SizeRow : s
        ));
      }
    } catch {
      setSizes(sizes.map(s =>
        sizeKey(s) === editing ? { ...s, ...formData } as SizeRow : s
      ));
    }
    setSaving(false);
    setEditing(null);
    setFormData({});
    setIsNewItem(false);
  };

  const addNew = () => {
    const newId = `sz${Date.now()}`;
    const newSize: SizeRow = {
      id: newId,
      product_type: filterType === 'all' ? 'panier' : filterType,
      label: 'Nouvelle taille',
      sub: '0 articles',
      price: 0,
      slots: 3,
    };
    setSizes([newSize, ...sizes]);
    setEditing(sizeKey(newSize));
    setFormData({ ...newSize });
    setIsNewItem(true);
  };

  const deleteSize = async (size: SizeRow) => {
    if (sizes.length <= 1) {
      alert('Vous devez garder au moins une taille.');
      return;
    }
    if (!confirm('Supprimer cette taille ?')) return;

    const key = sizeKey(size);
    try {
      await fetch(`/api/admin/sizes?id=${size.id}&product_type=${size.product_type}`, {
        method: 'DELETE',
        headers: { 'x-admin-secret': getAdminSecret() },
      });
      setSizes(sizes.filter(s => sizeKey(s) !== key));
    } catch {
      setSizes(sizes.filter(s => sizeKey(s) !== key));
    }
  };

  const togglePopular = async (size: SizeRow) => {
    const updated = sizes.map(s => ({
      ...s,
      popular: sizeKey(s) === sizeKey(size) ? !s.popular : (s.product_type === size.product_type ? false : s.popular),
    }));
    setSizes(updated);

    // Save to backend
    try {
      await fetch('/api/admin/sizes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': getAdminSecret(),
        },
        body: JSON.stringify({
          id: size.id,
          product_type: size.product_type,
          label: size.label,
          sub: size.sub,
          price: size.price,
          slots: size.slots,
          popular: !size.popular,
        }),
      });
    } catch {
      // Already updated locally
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
          <span className="font-cormorant text-dark/40 text-sm">Chargement des tailles...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-amiri text-dark text-2xl">Tailles</h2>
          <p className="font-cormorant text-dark/40 text-sm">{sizes.length} taille(s)</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchSizes} className="btn-outline flex items-center gap-2">
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

      {/* Filter by product type */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'panier', 'bouquet', 'cadeau'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`
              px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200
              ${filterType === type
                ? 'bg-dark text-cream shadow-md'
                : 'bg-white text-dark/50 border border-dark/5 hover:border-gold/20'
              }
            `}
          >
            {type === 'all' ? `Tous (${sizes.length})` : `${PRODUCT_TYPE_LABELS[type]} (${sizes.filter(s => s.product_type === type).length})`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((size) => {
          const key = sizeKey(size);
          return (
            <div
              key={key}
              className={`
                bg-white rounded-2xl p-6 shadow-sm border transition-all duration-300 ease-spring
                hover:shadow-lg hover:-translate-y-0.5
                ${size.popular
                  ? 'border-gold/30 ring-1 ring-gold/20 shadow-gold/5'
                  : 'border-dark/5'
                }
              `}
            >
              {editing === key ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-dark/50 text-xs font-cormorant mb-2 uppercase tracking-wider">ID</label>
                    <input
                      type="text"
                      className="inp-light w-full"
                      value={formData.id || ''}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      placeholder="S, M, L, XL..."
                    />
                  </div>
                  <div>
                    <label className="block text-dark/50 text-xs font-cormorant mb-2 uppercase tracking-wider">Type</label>
                    <select
                      className="select-styled w-full"
                      value={formData.product_type || 'panier'}
                      onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
                    >
                      <option value="panier">Panier</option>
                      <option value="bouquet">Bouquet</option>
                      <option value="cadeau">Cadeau</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-dark/50 text-xs font-cormorant mb-2 uppercase tracking-wider">Label</label>
                    <input
                      type="text"
                      className="inp-light w-full"
                      value={formData.label || ''}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      placeholder="Petite, Moyenne..."
                    />
                  </div>
                  <div>
                    <label className="block text-dark/50 text-xs font-cormorant mb-2 uppercase tracking-wider">Sous-titre</label>
                    <input
                      type="text"
                      className="inp-light w-full"
                      value={formData.sub || ''}
                      onChange={(e) => setFormData({ ...formData, sub: e.target.value })}
                      placeholder="3 articles"
                    />
                  </div>
                  <div>
                    <label className="block text-dark/50 text-xs font-cormorant mb-2 uppercase tracking-wider">Prix base (€)</label>
                    <input
                      type="number"
                      className="inp-light w-full"
                      value={formData.price || 0}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-dark/50 text-xs font-cormorant mb-2 uppercase tracking-wider">Nombre de slots</label>
                    <input
                      type="number"
                      className="inp-light w-full"
                      value={formData.slots || 3}
                      onChange={(e) => setFormData({ ...formData, slots: Number(e.target.value) })}
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={saveEdit} disabled={saving} className="btn-gold flex items-center gap-2 w-full justify-center disabled:opacity-40">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                    <button onClick={cancelEdit} disabled={saving} className="btn-outline w-full justify-center disabled:opacity-40">
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {size.popular && (
                    <span className="badge-premium mb-3 inline-flex">
                      Populaire
                    </span>
                  )}
                  <div className="font-amiri text-3xl text-dark mb-1">{size.label}</div>
                  <div className="font-cormorant text-dark/40 text-sm mb-1">{size.sub}</div>
                  <div className="font-cormorant text-dark/25 text-xs mb-3">
                    {size.product_type && (
                      <span className="text-gold/60">{PRODUCT_TYPE_LABELS[size.product_type]}</span>
                    )}
                    {' · '}ID: {size.id} · {size.slots} slots
                  </div>

                  {/* Visual slot dots */}
                  <div className="flex gap-1.5 mb-4">
                    {Array.from({ length: size.slots }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2.5 h-2.5 rounded-full bg-gold/30"
                      />
                    ))}
                  </div>

                  <div className="font-amiri text-gold text-2xl mb-5">{size.price}€</div>

                  <div className="flex flex-col gap-2">
                    <button onClick={() => startEdit(size)} className="btn-outline w-full justify-center text-sm">
                      Modifier
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => togglePopular(size)}
                        className={`
                          flex-1 px-3 py-2.5 rounded-xl text-xs transition-all duration-200 font-medium
                          ${size.popular
                            ? 'bg-gold/10 text-gold border border-gold/20'
                            : 'bg-dark/[0.02] text-dark/40 border border-dark/5 hover:border-gold/20 hover:text-gold'
                          }
                        `}
                      >
                        {size.popular ? '★ Populaire' : '☆ Populaire'}
                      </button>
                      <button
                        onClick={() => deleteSize(size)}
                        className="px-3 py-2.5 rounded-xl text-xs bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-dark/30 text-sm font-cormorant">
        Les modifications sont synchronisées avec Supabase.
      </p>
    </div>
  );
}
