// src/components/admin/TabBaskets.tsx
'use client';

import { useState, useEffect } from 'react';
import { DEFAULT_BASKETS, DEFAULT_THEMES } from '@/lib/data';
import type { Basket, Theme } from '@/types';

const STORAGE_KEY = 'nawra-admin-auth';

export default function TabBaskets() {
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [themes] = useState<Record<string, Theme>>(DEFAULT_THEMES);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Basket>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isNewItem, setIsNewItem] = useState(false);

  const getAdminSecret = () => localStorage.getItem(STORAGE_KEY) || '';

  useEffect(() => {
    fetchBaskets();
  }, []);

  const fetchBaskets = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/baskets');
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setBaskets(data);
        } else {
          setBaskets(DEFAULT_BASKETS);
        }
      } else {
        setBaskets(DEFAULT_BASKETS);
      }
    } catch {
      setBaskets(DEFAULT_BASKETS);
    }
    setLoading(false);
  };

  const startEdit = (basket: Basket) => {
    setEditing(basket.id);
    setFormData({ ...basket });
    setIsNewItem(false);
  };

  const cancelEdit = () => {
    if (isNewItem && editing) {
      setBaskets(baskets.filter(b => b.id !== editing));
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
      const res = await fetch('/api/admin/baskets', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': getAdminSecret(),
        },
        body: JSON.stringify({
          id: editing,
          name: formData.name,
          theme: formData.theme || 'Dorée',
          size: formData.size || 'M',
          price: formData.price || 0,
          tag: formData.tag || null,
          products: formData.products || [],
          img: formData.img || null,
        }),
      });

      if (res.ok) {
        const saved = await res.json();
        setBaskets(baskets.map(b => b.id === editing ? saved : b));
      } else {
        setBaskets(baskets.map(b =>
          b.id === editing ? { ...b, ...formData } as Basket : b
        ));
      }
    } catch {
      setBaskets(baskets.map(b =>
        b.id === editing ? { ...b, ...formData } as Basket : b
      ));
    }
    setSaving(false);
    setEditing(null);
    setFormData({});
    setIsNewItem(false);
  };

  const addNew = () => {
    const newId = `b${Date.now()}`;
    const newBasket: Basket = {
      id: newId,
      name: 'Nouvelle corbeille',
      theme: 'Dorée',
      size: 'M',
      price: 199,
      products: [],
    };
    setBaskets([newBasket, ...baskets]);
    setEditing(newId);
    setFormData({ ...newBasket });
    setIsNewItem(true);
  };

  const deleteBasket = async (id: string) => {
    if (!confirm('Supprimer cette corbeille ?')) return;

    try {
      await fetch(`/api/admin/baskets?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-secret': getAdminSecret() },
      });
      setBaskets(baskets.filter(b => b.id !== id));
    } catch {
      setBaskets(baskets.filter(b => b.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
          <span className="font-cormorant text-dark/40 text-sm">Chargement des corbeilles...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-amiri text-dark text-2xl">Corbeilles prêtes</h2>
          <p className="font-cormorant text-dark/40 text-sm">{baskets.length} corbeille(s)</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchBaskets} className="btn-outline flex items-center gap-2">
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

      <div className="space-y-4">
        {baskets.map((basket) => (
          <div
            key={basket.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-dark/5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ease-spring"
          >
            {editing === basket.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <label className="block text-dark/50 text-xs font-cormorant mb-2 uppercase tracking-wider">Thème</label>
                    <select
                      className="select-styled w-full"
                      value={formData.theme || ''}
                      onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                    >
                      {Object.keys(themes).map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-dark/50 text-xs font-cormorant mb-2 uppercase tracking-wider">Taille</label>
                    <select
                      className="select-styled w-full"
                      value={formData.size || ''}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    >
                      <option value="S">Petite (S)</option>
                      <option value="M">Moyenne (M)</option>
                      <option value="L">Grande (L)</option>
                      <option value="XL">Royale (XL)</option>
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
                    <label className="block text-dark/50 text-xs font-cormorant mb-2 uppercase tracking-wider">Tag (optionnel)</label>
                    <input
                      type="text"
                      className="inp-light w-full"
                      value={formData.tag || ''}
                      onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                      placeholder="Bestseller, Nouveau..."
                    />
                  </div>
                  <div>
                    <label className="block text-dark/50 text-xs font-cormorant mb-2 uppercase tracking-wider">Image URL (optionnel)</label>
                    <input
                      type="url"
                      className="inp-light w-full"
                      value={formData.img || ''}
                      onChange={(e) => setFormData({ ...formData, img: e.target.value || undefined })}
                      placeholder="https://exemple.com/image.jpg"
                    />
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
                <div>
                  <h3 className="font-amiri text-dark text-lg">{basket.name}</h3>
                  <p className="font-cormorant text-dark/40 text-sm flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: themes[basket.theme]?.p || '#C9921A' }}
                    />
                    {basket.theme} · Taille {basket.size}
                    {basket.tag && (
                      <span className="badge-gold text-[10px]">{basket.tag}</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-amiri text-gold text-xl">{basket.price}€</span>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(basket)} className="btn-outline text-sm py-2 px-3">
                      Modifier
                    </button>
                    <button
                      onClick={() => deleteBasket(basket.id)}
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
