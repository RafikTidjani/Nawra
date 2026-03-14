// src/components/admin/TabBouquets.tsx
'use client';

import { useState, useEffect } from 'react';
import { BOUQUET_OPTIONS, DEFAULT_PRODUCTS } from '@/lib/data';

interface BouquetOption {
  id: string;
  name: string;
  description: string;
  video: string;
  color: string;
  price: number;
  flowers: string[];
  active?: boolean;
  sort_order?: number;
}

const STORAGE_KEY = 'velora-admin-auth';

export default function TabBouquets() {
  const [bouquets, setBouquets] = useState<BouquetOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<BouquetOption>>({});
  const [isNewItem, setIsNewItem] = useState(false);

  // Get available flowers from products
  const availableFlowers = DEFAULT_PRODUCTS
    .filter(p => p.cat === 'fleur')
    .map(p => p.name);

  // All unique flower names from all bouquets + available products
  const allFlowerOptions = [...new Set([
    ...availableFlowers,
    ...bouquets.flatMap(b => b.flowers),
    'Roses', 'Pivoines', 'Eucalyptus', 'Lys', 'Orchidées', 'Tulipes',
    'Renoncules', 'Gypsophile', 'Chrysanthèmes', 'Dahlias', 'Jasmin', 'Fougères'
  ])].sort();

  // Fetch bouquets from API
  useEffect(() => {
    fetchBouquets();
  }, []);

  const fetchBouquets = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/bouquets');
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setBouquets(data);
        } else {
          setBouquets(BOUQUET_OPTIONS.map(b => ({ ...b, flowers: [...b.flowers] })));
        }
      } else {
        setBouquets(BOUQUET_OPTIONS.map(b => ({ ...b, flowers: [...b.flowers] })));
      }
    } catch {
      setBouquets(BOUQUET_OPTIONS.map(b => ({ ...b, flowers: [...b.flowers] })));
    }
    setLoading(false);
  };

  const getAdminSecret = () => localStorage.getItem(STORAGE_KEY) || '';

  const startEdit = (bouquet: BouquetOption) => {
    setEditing(bouquet.id);
    setFormData({ ...bouquet });
    setIsNewItem(false);
  };

  const cancelEdit = () => {
    if (isNewItem && editing) {
      setBouquets(bouquets.filter(b => b.id !== editing));
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
      const res = await fetch('/api/admin/bouquets', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': getAdminSecret(),
        },
        body: JSON.stringify({
          id: isNewItem ? undefined : editing,
          name: formData.name,
          description: formData.description || '',
          video: formData.video || 'bouquet/bouquet-rose-gold',
          color: formData.color || '#D4789A',
          price: formData.price || 45,
          flowers: formData.flowers || [],
          active: true,
          sort_order: formData.sort_order || bouquets.length,
        }),
      });

      if (res.ok) {
        const savedBouquet = await res.json();
        setBouquets(bouquets.map(b =>
          b.id === editing ? savedBouquet : b
        ));
      } else {
        setBouquets(bouquets.map(b =>
          b.id === editing ? { ...b, ...formData } as BouquetOption : b
        ));
      }
    } catch {
      setBouquets(bouquets.map(b =>
        b.id === editing ? { ...b, ...formData } as BouquetOption : b
      ));
    }
    setSaving(false);
    setEditing(null);
    setFormData({});
    setIsNewItem(false);
  };

  const addNew = () => {
    const newId = `temp-${Date.now()}`;
    const newBouquet: BouquetOption = {
      id: newId,
      name: 'Nouveau bouquet',
      description: 'Description du bouquet',
      video: 'bouquet/bouquet-rose-gold',
      color: '#D4789A',
      price: 45,
      flowers: ['Roses'],
    };
    setBouquets([newBouquet, ...bouquets]);
    setEditing(newId);
    setFormData({ ...newBouquet });
    setIsNewItem(true);
  };

  const deleteBouquet = async (id: string) => {
    if (!confirm('Supprimer ce bouquet ?')) return;

    try {
      const res = await fetch(`/api/admin/bouquets?id=${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-secret': getAdminSecret(),
        },
      });

      if (res.ok) {
        setBouquets(bouquets.filter(b => b.id !== id));
      } else {
        setBouquets(bouquets.filter(b => b.id !== id));
      }
    } catch {
      setBouquets(bouquets.filter(b => b.id !== id));
    }
  };

  const toggleFlower = (flower: string) => {
    const current = formData.flowers || [];
    if (current.includes(flower)) {
      setFormData({ ...formData, flowers: current.filter(f => f !== flower) });
    } else {
      setFormData({ ...formData, flowers: [...current, flower] });
    }
  };

  const addCustomFlower = () => {
    const flower = prompt('Nom de la fleur à ajouter:');
    if (flower && flower.trim()) {
      const current = formData.flowers || [];
      if (!current.includes(flower.trim())) {
        setFormData({ ...formData, flowers: [...current, flower.trim()] });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
          <span className="font-cormorant text-dark/40 text-sm">Chargement des bouquets...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-amiri text-dark text-2xl">Bouquets</h2>
          <p className="font-cormorant text-dark/40 text-sm">
            Gérez les options de bouquets avec vidéos et fleurs associées
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchBouquets} className="btn-outline flex items-center gap-2">
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
        {bouquets.map((bouquet) => (
          <div
            key={bouquet.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-dark/5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ease-spring"
          >
            {editing === bouquet.id ? (
              <div className="space-y-6">
                {/* Basic info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-dark/50 text-xs font-cormorant mb-2 uppercase tracking-wider">Nom du bouquet</label>
                    <input
                      type="text"
                      className="inp-light w-full"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-dark/50 text-xs font-cormorant mb-2 uppercase tracking-wider">Prix de base (€)</label>
                    <input
                      type="number"
                      className="inp-light w-full"
                      value={formData.price || 0}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-dark/50 text-xs font-cormorant mb-2 uppercase tracking-wider">Description</label>
                  <input
                    type="text"
                    className="inp-light w-full"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-dark/50 text-xs font-cormorant mb-2 uppercase tracking-wider">Chemin vidéo (sans .mp4)</label>
                    <input
                      type="text"
                      className="inp-light w-full"
                      value={formData.video || ''}
                      onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                      placeholder="bouquet/bouquet-rose-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-dark/50 text-xs font-cormorant mb-2 uppercase tracking-wider">Couleur dominante</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.color || '#D4789A'}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-12 h-10 rounded-xl cursor-pointer border border-dark/10"
                      />
                      <input
                        type="text"
                        value={formData.color || ''}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        placeholder="#D4789A"
                        className="inp-light flex-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Flowers selection */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-dark/50 text-xs font-cormorant uppercase tracking-wider">Fleurs incluses</label>
                    <button
                      type="button"
                      onClick={addCustomFlower}
                      className="text-xs text-gold hover:text-gold/80 transition-colors"
                    >
                      + Ajouter une fleur personnalisée
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allFlowerOptions.map((flower) => (
                      <button
                        key={flower}
                        type="button"
                        onClick={() => toggleFlower(flower)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-200 ${
                          formData.flowers?.includes(flower)
                            ? 'bg-gold text-dark border-gold shadow-sm'
                            : 'bg-white text-dark/50 border-dark/10 hover:border-gold/30'
                        }`}
                      >
                        {flower}
                      </button>
                    ))}
                  </div>
                  {(formData.flowers?.length || 0) > 0 && (
                    <p className="mt-2 text-sm text-dark/40 font-cormorant">
                      {formData.flowers?.length} fleur(s) sélectionnée(s)
                    </p>
                  )}
                </div>

                {/* Preview */}
                <div className="p-4 bg-dark/[0.02] rounded-xl border border-dark/5">
                  <p className="text-xs text-dark/30 font-cormorant uppercase tracking-wider mb-2">Aperçu</p>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-5 h-5 rounded-full shadow-sm"
                      style={{ backgroundColor: formData.color }}
                    />
                    <div>
                      <span className="font-amiri text-dark">{formData.name}</span>
                      <span className="text-dark/20 mx-2">·</span>
                      <span className="text-gold font-amiri">{formData.price}€</span>
                    </div>
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
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  {/* Color indicator */}
                  <div
                    className="w-16 h-20 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl"
                    style={{ backgroundColor: bouquet.color + '15' }}
                  >
                    🌸
                  </div>
                  <div>
                    <h3 className="font-amiri text-dark text-lg">{bouquet.name}</h3>
                    <p className="font-cormorant text-dark/40 text-sm mb-2 line-clamp-1">
                      {bouquet.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {bouquet.flowers.map((flower, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-full text-xs border"
                          style={{
                            backgroundColor: bouquet.color + '10',
                            color: bouquet.color,
                            borderColor: bouquet.color + '20',
                          }}
                        >
                          {flower}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-amiri text-gold text-xl">{bouquet.price}€</span>
                    <p className="font-cormorant text-dark/30 text-xs">
                      {bouquet.video}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(bouquet)} className="btn-outline text-sm py-2 px-3">
                      Modifier
                    </button>
                    <button
                      onClick={() => deleteBouquet(bouquet.id)}
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
