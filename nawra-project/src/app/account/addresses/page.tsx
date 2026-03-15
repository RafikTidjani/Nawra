// src/app/account/addresses/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { getCustomerAddresses, addAddress, deleteAddress, CustomerAddress } from '@/lib/customer-auth';
import Navbar from '@/components/sections/Navbar';

export default function AddressesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    label: 'Domicile',
    firstName: '',
    lastName: '',
    address: '',
    address2: '',
    city: '',
    zip: '',
    country: 'France',
    phone: '',
    isDefault: false,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/account/login');
    }
  }, [user, loading, router]);

  const loadAddresses = async () => {
    const data = await getCustomerAddresses();
    setAddresses(data);
    setLoadingAddresses(false);
  };

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addAddress(formData);
      await loadAddresses();
      setShowForm(false);
      setFormData({
        label: 'Domicile',
        firstName: '',
        lastName: '',
        address: '',
        address2: '',
        city: '',
        zip: '',
        country: 'France',
        phone: '',
        isDefault: false,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette adresse ?')) return;
    try {
      await deleteAddress(id);
      await loadAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-primary/10 rounded w-48"></div>
              <div className="h-32 bg-primary/10 rounded-2xl"></div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/account"
              className="inline-flex items-center gap-2 text-sm text-primary/60 hover:text-primary mb-4 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour au compte
            </Link>
            <div className="flex items-center justify-between">
              <h1 className="font-heading text-3xl font-semibold text-primary">
                Mes adresses
              </h1>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter une adresse
                </button>
              )}
            </div>
          </div>

          {/* Add address form */}
          {showForm && (
            <div className="bg-white rounded-2xl border border-primary/10 p-6 mb-6">
              <h2 className="font-heading text-lg font-semibold text-primary mb-6">
                Nouvelle adresse
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    Nom de l'adresse
                  </label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-primary/10 focus:border-secondary outline-none"
                    placeholder="Domicile, Bureau..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">Prénom *</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-primary/10 focus:border-secondary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">Nom *</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-primary/10 focus:border-secondary outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-1">Adresse *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-primary/10 focus:border-secondary outline-none"
                    placeholder="Numéro et nom de rue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    Complément d'adresse
                  </label>
                  <input
                    type="text"
                    value={formData.address2}
                    onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-primary/10 focus:border-secondary outline-none"
                    placeholder="Appartement, étage..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">Code postal *</label>
                    <input
                      type="text"
                      required
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-primary/10 focus:border-secondary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">Ville *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-primary/10 focus:border-secondary outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-primary/10 focus:border-secondary outline-none"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded border-primary/20 text-secondary focus:ring-secondary"
                  />
                  <span className="text-sm text-primary">Définir comme adresse par défaut</span>
                </label>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50"
                  >
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2.5 rounded-lg border border-primary/10 text-primary/70 hover:bg-primary/5"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Addresses list */}
          {loadingAddresses ? (
            <div className="animate-pulse space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-primary/10 rounded-2xl"></div>
              ))}
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-primary/10">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/5 flex items-center justify-center">
                <svg className="w-10 h-10 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <h2 className="font-heading text-xl font-semibold text-primary mb-2">
                Aucune adresse enregistrée
              </h2>
              <p className="text-primary/60 mb-6">
                Ajoutez une adresse pour accélérer vos prochaines commandes
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-white rounded-2xl border border-primary/10 p-6 relative"
                >
                  {addr.isDefault && (
                    <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                      Par défaut
                    </span>
                  )}
                  <h3 className="font-semibold text-primary mb-3">{addr.label}</h3>
                  <div className="text-sm text-primary/70 space-y-1 mb-4">
                    <p>{addr.firstName} {addr.lastName}</p>
                    <p>{addr.address}</p>
                    {addr.address2 && <p>{addr.address2}</p>}
                    <p>{addr.zip} {addr.city}</p>
                    <p>{addr.country}</p>
                    {addr.phone && <p className="pt-1">{addr.phone}</p>}
                  </div>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
