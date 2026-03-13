// src/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { ARABESQUE_BG } from '@/lib/data';
import Logo, { LogoMark } from '@/components/ui/Logo';
import TabBaskets from '@/components/admin/TabBaskets';
import TabBouquets from '@/components/admin/TabBouquets';
import TabProducts from '@/components/admin/TabProducts';
import TabThemes from '@/components/admin/TabThemes';
import TabSizes from '@/components/admin/TabSizes';

type Tab = 'orders' | 'baskets' | 'bouquets' | 'products' | 'themes' | 'sizes';

interface Order {
  id: string;
  theme: string;
  size: string;
  total: number;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string;
  customer_zip: string;
  created_at: string;
}

const STORAGE_KEY = 'nawra-admin-auth';

const TAB_CONFIG: { id: Tab; label: string; icon: JSX.Element }[] = [
  {
    id: 'orders',
    label: 'Commandes',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    id: 'baskets',
    label: 'Corbeilles',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    id: 'bouquets',
    label: 'Bouquets',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    id: 'products',
    label: 'Produits',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    id: 'themes',
    label: 'Thèmes',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  {
    id: 'sizes',
    label: 'Tailles',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
      </svg>
    ),
  },
];

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  paid: 'Payée',
  preparing: 'En préparation',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Fetch orders when authenticated
  useEffect(() => {
    if (isAuthenticated && activeTab === 'orders') {
      fetchOrders();
    }
  }, [isAuthenticated, activeTab]);

  const handleLogin = async () => {
    setError('');
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        localStorage.setItem(STORAGE_KEY, password);
        setIsAuthenticated(true);
      } else {
        setError('Mot de passe incorrect');
      }
    } catch {
      setError('Erreur de connexion');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
    setPassword('');
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const savedPassword = localStorage.getItem(STORAGE_KEY);
      const res = await fetch('/api/admin/orders', {
        headers: { 'x-admin-secret': savedPassword || '' },
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch {
      console.error('Error fetching orders');
    }
    setOrdersLoading(false);
  };

  const updateOrderStatus = async (id: string, status: string) => {
    const savedPassword = localStorage.getItem(STORAGE_KEY);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': savedPassword || '',
        },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
      }
    } catch {
      console.error('Error updating order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
          <span className="font-cormorant text-cream/40 text-sm">Chargement...</span>
        </div>
      </div>
    );
  }

  // Login form
  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen bg-dark flex items-center justify-center px-6"
        style={{ backgroundImage: ARABESQUE_BG }}
      >
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-10">
            <LogoMark size={64} />
          </div>
          <div className="card-glass p-8">
            <h2 className="font-amiri text-cream text-2xl mb-2 text-center">
              Administration
            </h2>
            <p className="font-cormorant text-cream/40 text-sm text-center mb-8">
              Connectez-vous pour accéder au panneau
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-cream/40 text-xs font-cormorant mb-2 uppercase tracking-wider">
                  Mot de passe
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="inp-dark w-full"
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}
              <button
                onClick={handleLogin}
                className="btn-gold w-full justify-center"
              >
                Connexion
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header
        className="bg-gradient-to-r from-dark via-dark2 to-dark py-4 px-6 border-b border-white/5"
        style={{ backgroundImage: ARABESQUE_BG }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div className="h-5 w-px bg-cream/10" />
            <span className="badge-gold text-xs">Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 font-cormorant text-cream/50 hover:text-cream text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-dark/10 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-none py-1">
            {TAB_CONFIG.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-cormorant tracking-wider
                  transition-all duration-200 whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'bg-gold/10 text-gold border border-gold/20'
                    : 'text-dark/40 hover:text-dark/70 hover:bg-dark/[0.03] border border-transparent'
                  }
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'orders' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-amiri text-dark text-2xl">Commandes</h2>
                <p className="font-cormorant text-dark/40 text-sm">{orders.length} commande(s)</p>
              </div>
              <button onClick={fetchOrders} className="btn-outline flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualiser
              </button>
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
                  <span className="font-cormorant text-dark/40 text-sm">Chargement...</span>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 bg-dark/[0.02] rounded-2xl">
                <div className="text-4xl mb-3 opacity-30">📦</div>
                <p className="text-dark/40 font-cormorant">Aucune commande pour le moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-dark/5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ease-spring"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <span className="font-cormorant text-dark/30 text-xs">
                          {new Date(order.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                        <h3 className="font-amiri text-dark text-lg">
                          {order.customer_name}
                        </h3>
                        <p className="font-cormorant text-dark/50 text-sm">
                          {order.customer_email} · {order.customer_phone}
                        </p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        <span className={`badge-status-${order.status}`}>
                          {STATUS_LABELS[order.status] || order.status}
                        </span>
                        <span className="font-amiri text-gold text-xl">
                          {order.total}€
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4 p-4 bg-dark/[0.02] rounded-xl">
                      <div>
                        <span className="font-cormorant text-dark/30 block text-xs uppercase tracking-wider">Thème</span>
                        <span className="font-amiri text-dark">{order.theme}</span>
                      </div>
                      <div>
                        <span className="font-cormorant text-dark/30 block text-xs uppercase tracking-wider">Taille</span>
                        <span className="font-amiri text-dark">{order.size}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="font-cormorant text-dark/30 block text-xs uppercase tracking-wider">Adresse</span>
                        <span className="font-amiri text-dark">
                          {order.customer_address}, {order.customer_zip} {order.customer_city}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-cormorant text-dark/30 text-xs uppercase tracking-wider">Statut</span>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="select-styled flex-1 max-w-xs"
                      >
                        <option value="pending">En attente</option>
                        <option value="paid">Payée</option>
                        <option value="preparing">En préparation</option>
                        <option value="shipped">Expédiée</option>
                        <option value="delivered">Livrée</option>
                        <option value="cancelled">Annulée</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'baskets' && <TabBaskets />}
        {activeTab === 'bouquets' && <TabBouquets />}
        {activeTab === 'products' && <TabProducts />}
        {activeTab === 'themes' && <TabThemes />}
        {activeTab === 'sizes' && <TabSizes />}
      </div>
    </div>
  );
}
