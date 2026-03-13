// src/components/admin/TabThemes.tsx
'use client';

import { useState, useEffect } from 'react';
import { DEFAULT_THEMES } from '@/lib/data';
import type { Theme } from '@/types';

interface ThemeRow extends Theme {
  id?: string;
  product_type?: string;
}

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  panier: 'Panier',
  bouquet: 'Bouquet',
  cadeau: 'Cadeau',
};

const STORAGE_KEY = 'nawra-admin-auth';

export default function TabThemes() {
  const [themes, setThemes] = useState<ThemeRow[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ThemeRow>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isNewItem, setIsNewItem] = useState(false);

  const getAdminSecret = () => localStorage.getItem(STORAGE_KEY) || '';

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/themes');
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setThemes(data);
        } else {
          // Convert default themes to array format
          const arr = Object.entries(DEFAULT_THEMES).map(([name, t]) => ({
            ...t,
            name,
            product_type: 'panier',
          }));
          setThemes(arr);
        }
      } else {
        const arr = Object.entries(DEFAULT_THEMES).map(([name, t]) => ({
          ...t,
          name,
          product_type: 'panier',
        }));
        setThemes(arr);
      }
    } catch {
      const arr = Object.entries(DEFAULT_THEMES).map(([name, t]) => ({
        ...t,
        name,
        product_type: 'panier',
      }));
      setThemes(arr);
    }
    setLoading(false);
  };

  const startEdit = (theme: ThemeRow) => {
    setEditing(theme.id || theme.name);
    setFormData({ ...theme });
    setIsNewItem(false);
  };

  const cancelEdit = () => {
    if (isNewItem && editing) {
      setThemes(themes.filter(t => (t.id || t.name) !== editing));
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
      const res = await fetch('/api/admin/themes', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': getAdminSecret(),
        },
        body: JSON.stringify({
          id: isNewItem ? undefined : formData.id,
          name: formData.name,
          product_type: formData.product_type || 'panier',
          p: formData.p,
          s: formData.s,
          a: formData.a,
          l: formData.l,
        }),
      });

      if (res.ok) {
        const saved = await res.json();
        setThemes(themes.map(t =>
          (t.id || t.name) === editing ? saved : t
        ));
      } else {
        setThemes(themes.map(t =>
          (t.id || t.name) === editing ? { ...t, ...formData } as ThemeRow : t
        ));
      }
    } catch {
      setThemes(themes.map(t =>
        (t.id || t.name) === editing ? { ...t, ...formData } as ThemeRow : t
      ));
    }
    setSaving(false);
    setEditing(null);
    setFormData({});
    setIsNewItem(false);
  };

  const addNew = () => {
    const tempId = `temp-${Date.now()}`;
    const newTheme: ThemeRow = {
      id: tempId,
      name: 'Nouveau thème',
      product_type: 'panier',
      p: '#8B1A2F',
      s: '#C9404A',
      a: '#C9921A',
      l: '#fdf0f2',
    };
    setThemes([newTheme, ...themes]);
    setEditing(tempId);
    setFormData({ ...newTheme });
    setIsNewItem(true);
  };

  const deleteTheme = async (theme: ThemeRow) => {
    if (themes.length <= 1) {
      alert('Vous devez garder au moins un thème.');
      return;
    }
    if (!confirm('Supprimer ce thème ?')) return;

    const themeKey = theme.id || theme.name;
    try {
      if (theme.id) {
        await fetch(`/api/admin/themes?id=${theme.id}`, {
          method: 'DELETE',
          headers: { 'x-admin-secret': getAdminSecret() },
        });
      }
      setThemes(themes.filter(t => (t.id || t.name) !== themeKey));
    } catch {
      setThemes(themes.filter(t => (t.id || t.name) !== themeKey));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
          <span className="font-cormorant text-dark/40 text-sm">Chargement des thèmes...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-amiri text-dark text-2xl">Thèmes</h2>
          <p className="font-cormorant text-dark/40 text-sm">{themes.length} thème(s)</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchThemes} className="btn-outline flex items-center gap-2">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {themes.map((theme) => {
          const key = theme.id || theme.name;
          return (
            <div
              key={key}
              className="bg-white rounded-2xl p-6 shadow-sm border border-dark/5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ease-spring"
            >
              {editing === key ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-dark/50 text-xs font-cormorant mb-2 uppercase tracking-wider">Nom du thème</label>
                      <input
                        type="text"
                        className="inp-light w-full"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-dark/50 text-xs font-cormorant mb-2 uppercase tracking-wider">Type de produit</label>
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
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-dark/50 text-xs font-cormorant mb-2 uppercase tracking-wider">Principale</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={formData.p || '#000000'}
                          onChange={(e) => setFormData({ ...formData, p: e.target.value })}
                          className="w-10 h-10 rounded-xl cursor-pointer border border-dark/10"
                        />
                        <input
                          type="text"
                          value={formData.p || ''}
                          onChange={(e) => setFormData({ ...formData, p: e.target.value })}
                          className="inp-light flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-dark/50 text-xs font-cormorant mb-2 uppercase tracking-wider">Secondaire</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={formData.s || '#000000'}
                          onChange={(e) => setFormData({ ...formData, s: e.target.value })}
                          className="w-10 h-10 rounded-xl cursor-pointer border border-dark/10"
                        />
                        <input
                          type="text"
                          value={formData.s || ''}
                          onChange={(e) => setFormData({ ...formData, s: e.target.value })}
                          className="inp-light flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-dark/50 text-xs font-cormorant mb-2 uppercase tracking-wider">Accent</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={formData.a || '#000000'}
                          onChange={(e) => setFormData({ ...formData, a: e.target.value })}
                          className="w-10 h-10 rounded-xl cursor-pointer border border-dark/10"
                        />
                        <input
                          type="text"
                          value={formData.a || ''}
                          onChange={(e) => setFormData({ ...formData, a: e.target.value })}
                          className="inp-light flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-dark/50 text-xs font-cormorant mb-2 uppercase tracking-wider">Fond clair</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={formData.l || '#ffffff'}
                          onChange={(e) => setFormData({ ...formData, l: e.target.value })}
                          className="w-10 h-10 rounded-xl cursor-pointer border border-dark/10"
                        />
                        <input
                          type="text"
                          value={formData.l || ''}
                          onChange={(e) => setFormData({ ...formData, l: e.target.value })}
                          className="inp-light flex-1"
                        />
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
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-amiri text-dark text-xl">{theme.name}</h3>
                      {theme.product_type && (
                        <span className="text-xs text-dark/30 font-cormorant">
                          {PRODUCT_TYPE_LABELS[theme.product_type] || theme.product_type}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(theme)} className="btn-outline text-sm py-2 px-3">
                        Modifier
                      </button>
                      <button
                        onClick={() => deleteTheme(theme)}
                        className="px-3 py-2 rounded-xl text-sm bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>

                  {/* Color preview */}
                  <div
                    className="rounded-xl p-5 mb-4 relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${theme.l} 0%, ${theme.p}12 100%)`,
                    }}
                  >
                    <div
                      className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 blur-xl"
                      style={{ backgroundColor: theme.p }}
                    />
                    <div className="flex gap-3 items-center justify-center relative">
                      <div
                        className="w-14 h-14 rounded-full shadow-md border-2 border-white/50"
                        style={{ backgroundColor: theme.p }}
                        title="Principal"
                      />
                      <div
                        className="w-11 h-11 rounded-full shadow-md border-2 border-white/50"
                        style={{ backgroundColor: theme.s }}
                        title="Secondaire"
                      />
                      <div
                        className="w-9 h-9 rounded-full shadow-md border-2 border-white/50"
                        style={{ backgroundColor: theme.a }}
                        title="Accent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="text-center">
                      <div className="w-full h-5 rounded-lg mb-1 shadow-inner" style={{ backgroundColor: theme.p }} />
                      <span className="text-dark/30 font-cormorant">Principal</span>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-5 rounded-lg mb-1 shadow-inner" style={{ backgroundColor: theme.s }} />
                      <span className="text-dark/30 font-cormorant">Secondaire</span>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-5 rounded-lg mb-1 shadow-inner" style={{ backgroundColor: theme.a }} />
                      <span className="text-dark/30 font-cormorant">Accent</span>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-5 rounded-lg mb-1 border border-dark/10 shadow-inner" style={{ backgroundColor: theme.l }} />
                      <span className="text-dark/30 font-cormorant">Fond</span>
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
