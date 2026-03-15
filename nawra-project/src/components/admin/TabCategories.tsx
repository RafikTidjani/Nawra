// src/components/admin/TabCategories.tsx
'use client';

import { useState, useEffect } from 'react';
import type { Category } from '@/types';

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

const DEFAULT_COLORS = [
  '#D4A59A', // Dusty rose
  '#C8A97E', // Gold
  '#F5E6E0', // Blush
  '#E8D5C4', // Warm beige
  '#B8A9C9', // Lavender
  '#A7C4BC', // Sage
];

const EMOJI_ICONS = ['💡', '🪵', '✨', '💎', '🌸', '🎀', '💄', '🪞', '👑', '🌙'];

export default function TabCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    icon: '✨',
    color: '#D4A59A',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
    setLoading(false);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const openCreateModal = () => {
    setEditing(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon: '✨',
      color: '#D4A59A',
    });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (category: Category) => {
    setEditing(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || '✨',
      color: category.color || '#D4A59A',
    });
    setError('');
    setShowModal(true);
  };

  const handleNameChange = (value: string) => {
    setFormData({
      ...formData,
      name: value,
      slug: editing ? formData.slug : generateSlug(value),
    });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.slug.trim()) {
      setError('Le nom et le slug sont requis');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const url = editing
        ? `/api/admin/categories/${editing.id}`
        : '/api/admin/categories';

      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue');
        setSaving(false);
        return;
      }

      if (editing) {
        setCategories(categories.map(c => c.id === editing.id ? data : c));
      } else {
        setCategories([...categories, data]);
      }

      setShowModal(false);
    } catch (err) {
      setError('Erreur de connexion');
      console.error(err);
    }

    setSaving(false);
  };

  const handleDelete = async (category: Category) => {
    if (category.productCount && category.productCount > 0) {
      alert(`Impossible de supprimer: ${category.productCount} produit(s) utilisent cette catégorie`);
      return;
    }

    if (!confirm(`Supprimer la catégorie "${category.name}" ?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setCategories(categories.filter(c => c.id !== category.id));
      } else {
        const data = await res.json();
        alert(data.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur de connexion');
    }
  };

  const moveCategory = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= categories.length) return;

    const newCategories = [...categories];
    [newCategories[index], newCategories[newIndex]] = [newCategories[newIndex], newCategories[index]];
    setCategories(newCategories);

    // Sauvegarder le nouvel ordre
    try {
      await fetch('/api/admin/categories/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: newCategories.map(c => c.id) }),
      });
    } catch (err) {
      console.error('Failed to save order:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
          <span className="font-body text-primary/40 text-sm">Chargement des catégories...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading text-primary text-2xl">Catégories</h2>
          <p className="font-body text-primary/40 text-sm">{categories.length} catégorie(s)</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-primary rounded-xl hover:bg-secondary/90 transition-colors text-sm font-body font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle catégorie
        </button>
      </div>

      {/* Categories list */}
      <div className="space-y-3">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className="bg-white rounded-2xl shadow-sm border border-primary/5 p-5 flex items-center gap-4"
          >
            {/* Icon & Color indicator */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: category.color || '#F5E6E0' }}
            >
              {category.icon || '✨'}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-primary text-lg">{category.name}</h3>
                <span className="text-xs text-primary/30 font-mono">{category.slug}</span>
              </div>
              {category.description && (
                <p className="font-body text-primary/50 text-sm truncate">{category.description}</p>
              )}
            </div>

            {/* Product count */}
            <div className="flex-shrink-0 text-center">
              <span className="text-2xl font-heading text-secondary">{category.productCount || 0}</span>
              <p className="text-xs text-primary/40 font-body">produit(s)</p>
            </div>

            {/* Reorder buttons */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => moveCategory(index, 'up')}
                disabled={index === 0}
                className="p-1 text-primary/30 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={() => moveCategory(index, 'down')}
                disabled={index === categories.length - 1}
                className="p-1 text-primary/30 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => openEditModal(category)}
                className="px-3 py-1.5 border border-primary/10 text-primary/60 rounded-lg hover:border-secondary/50 hover:text-secondary transition-colors text-sm"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(category)}
                disabled={(category.productCount ?? 0) > 0}
                className="px-3 py-1.5 border border-red-200 text-red-400 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-primary/5">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/5 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <p className="text-primary/40 font-body">Aucune catégorie créée</p>
            <button
              onClick={openCreateModal}
              className="mt-4 px-4 py-2 bg-secondary text-primary rounded-xl hover:bg-secondary/90 transition-colors text-sm font-body"
            >
              Créer une catégorie
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="font-heading text-xl text-primary mb-6">
              {editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </h3>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-primary/50 text-xs font-body mb-2 uppercase tracking-wider">
                  Nom *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-primary/10 rounded-xl focus:outline-none focus:border-secondary/50"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Coiffeuses LED"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-primary/50 text-xs font-body mb-2 uppercase tracking-wider">
                  Slug (URL) *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-primary/10 rounded-xl focus:outline-none focus:border-secondary/50 font-mono text-sm"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="coiffeuse-led"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-primary/50 text-xs font-body mb-2 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-2.5 border border-primary/10 rounded-xl focus:outline-none focus:border-secondary/50 resize-none h-20"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description de la catégorie..."
                />
              </div>

              {/* Icon picker */}
              <div>
                <label className="block text-primary/50 text-xs font-body mb-2 uppercase tracking-wider">
                  Icône
                </label>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl border-2 transition-colors ${
                        formData.icon === icon
                          ? 'border-secondary bg-secondary/10'
                          : 'border-primary/10 hover:border-primary/20'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color picker */}
              <div>
                <label className="block text-primary/50 text-xs font-body mb-2 uppercase tracking-wider">
                  Couleur
                </label>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        formData.color === color
                          ? 'border-primary scale-110'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                  {error}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 px-4 py-2.5 bg-secondary text-primary font-body font-medium rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-50"
              >
                {saving ? 'Enregistrement...' : (editing ? 'Enregistrer' : 'Créer')}
              </button>
              <button
                onClick={() => setShowModal(false)}
                disabled={saving}
                className="px-4 py-2.5 border border-primary/10 text-primary/60 font-body rounded-xl hover:border-primary/20 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
