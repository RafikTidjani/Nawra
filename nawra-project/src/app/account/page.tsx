// src/app/account/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/providers/AuthProvider';
import { signOut, updateCustomerProfile, getCustomerOrders, CustomerOrder } from '@/lib/customer-auth';
import { useWishlist } from '@/hooks/useWishlist';
import Navbar from '@/components/sections/Navbar';

export default function AccountPage() {
  const router = useRouter();
  const { user, profile, loading, refreshProfile } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/account/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      getCustomerOrders().then(setOrders);
    }
  }, [user]);

  // Calculate member since
  const memberSince = useMemo(() => {
    if (!profile?.createdAt) return null;
    const date = new Date(profile.createdAt);
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }, [profile]);

  // Calculate total spent
  const totalSpent = useMemo(() => {
    return orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateCustomerProfile(formData);
      await refreshProfile();
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { text: string; color: string }> = {
      pending: { text: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
      paid: { text: 'Payée', color: 'bg-blue-100 text-blue-800' },
      preparing: { text: 'En préparation', color: 'bg-purple-100 text-purple-800' },
      shipped: { text: 'Expédiée', color: 'bg-indigo-100 text-indigo-800' },
      delivered: { text: 'Livrée', color: 'bg-emerald-100 text-emerald-800' },
      cancelled: { text: 'Annulée', color: 'bg-red-100 text-red-800' },
    };
    return labels[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-primary/10 rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-primary/10 rounded w-32 mx-auto"></div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header with personalized greeting */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-3xl font-semibold text-primary mb-1">
                {getGreeting()}, {profile?.firstName || 'toi'} !
              </h1>
              <p className="font-body text-primary/60">
                {memberSince && `Membre depuis ${memberSince}`}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg border border-primary/10 text-primary/60 hover:bg-primary/5 transition-colors text-sm"
            >
              Déconnexion
            </button>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-primary/10 p-5 text-center">
              <span className="block font-heading text-3xl text-secondary">{orders.length}</span>
              <span className="text-sm text-primary/60 font-body">Commande{orders.length > 1 ? 's' : ''}</span>
            </div>
            <div className="bg-white rounded-2xl border border-primary/10 p-5 text-center">
              <span className="block font-heading text-3xl text-secondary">{wishlistItems.length}</span>
              <span className="text-sm text-primary/60 font-body">Favori{wishlistItems.length > 1 ? 's' : ''}</span>
            </div>
            <div className="bg-white rounded-2xl border border-primary/10 p-5 text-center">
              <span className="block font-heading text-3xl text-secondary">{totalSpent.toFixed(0)}€</span>
              <span className="text-sm text-primary/60 font-body">Total dépensé</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1 space-y-2">
              <Link
                href="/account"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/10 text-primary font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Mon profil
              </Link>
              <Link
                href="/account/orders"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 text-primary/70 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Mes commandes
              </Link>
              <Link
                href="/account/wishlist"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 text-primary/70 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Mes favoris
              </Link>
              <Link
                href="/account/addresses"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 text-primary/70 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Mes adresses
              </Link>
            </div>

            {/* Main content */}
            <div className="md:col-span-2 space-y-6">
              {/* Favorites preview */}
              {wishlistItems.length > 0 && (
                <div className="bg-white rounded-2xl border border-primary/10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading text-lg font-semibold text-primary">
                      Mes favoris
                    </h2>
                    <Link href="/account/wishlist" className="text-sm text-secondary hover:underline">
                      Voir tout
                    </Link>
                  </div>
                  <div className="flex gap-3">
                    {wishlistItems.slice(0, 3).map((item) => (
                      <Link
                        key={item.id}
                        href={`/products/${item.product?.slug}`}
                        className="w-20 h-20 rounded-xl overflow-hidden bg-accent flex-shrink-0 hover:ring-2 hover:ring-secondary/50 transition-all"
                      >
                        {item.product?.images?.[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product?.name || ''}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary/20">
                            🪞
                          </div>
                        )}
                      </Link>
                    ))}
                    {wishlistItems.length > 3 && (
                      <Link
                        href="/account/wishlist"
                        className="w-20 h-20 rounded-xl bg-primary/5 flex items-center justify-center text-primary/40 hover:bg-primary/10 transition-colors"
                      >
                        +{wishlistItems.length - 3}
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Recent orders with last order highlight */}
              <div className="bg-white rounded-2xl border border-primary/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-lg font-semibold text-primary">
                    Commandes récentes
                  </h2>
                  <Link href="/account/orders" className="text-sm text-secondary hover:underline">
                    Voir tout
                  </Link>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/5 flex items-center justify-center">
                      <svg className="w-7 h-7 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <p className="text-primary/60 text-sm mb-3">Aucune commande pour le moment</p>
                    <Link
                      href="/collections"
                      className="inline-flex px-5 py-2.5 rounded-xl bg-secondary text-primary font-medium text-sm hover:bg-secondary/90"
                    >
                      Découvrir nos coiffeuses
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 3).map((order, index) => {
                      const status = getStatusLabel(order.status);
                      const isLatest = index === 0;
                      return (
                        <Link
                          key={order.id}
                          href={`/account/orders/${order.id}`}
                          className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                            isLatest
                              ? 'border-secondary/30 bg-secondary/5 hover:bg-secondary/10'
                              : 'border-primary/10 hover:border-secondary/30'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            {/* Order items preview */}
                            <div className="flex -space-x-2">
                              {order.items.slice(0, 2).map((item, i) => (
                                <div
                                  key={i}
                                  className="w-10 h-10 rounded-lg overflow-hidden bg-accent border-2 border-white"
                                >
                                  {item.productImage ? (
                                    <Image
                                      src={item.productImage}
                                      alt={item.productName}
                                      width={40}
                                      height={40}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-primary/20">
                                      🪞
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            <div>
                              <p className="font-semibold text-primary text-sm">#{order.orderNumber}</p>
                              <p className="text-xs text-primary/60">
                                {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary">{order.total.toFixed(2)}€</p>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                              {status.text}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Profile card */}
              <div className="bg-white rounded-2xl border border-primary/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-lg font-semibold text-primary">
                    Informations personnelles
                  </h2>
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="text-sm text-secondary hover:underline"
                    >
                      Modifier
                    </button>
                  )}
                </div>

                {editing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1">Prénom</label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-primary/10 focus:border-secondary outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1">Nom</label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50"
                      >
                        {saving ? 'Enregistrement...' : 'Enregistrer'}
                      </button>
                      <button
                        onClick={() => setEditing(false)}
                        className="px-6 py-2.5 rounded-lg border border-primary/10 text-primary/70 hover:bg-primary/5"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-primary/5">
                      <span className="text-primary/60 text-sm">Nom</span>
                      <span className="font-medium text-sm">{profile?.firstName} {profile?.lastName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-primary/5">
                      <span className="text-primary/60 text-sm">Email</span>
                      <span className="font-medium text-sm">{user.email}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-primary/60 text-sm">Téléphone</span>
                      <span className="font-medium text-sm">{profile?.phone || '—'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
