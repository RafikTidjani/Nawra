// src/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Logo, { LogoMark } from '@/components/ui/Logo';
import TabProducts from '@/components/admin/TabProducts';
import TabOrders from '@/components/admin/TabOrders';
import TabSuppliers from '@/components/admin/TabSuppliers';
import TabCategories from '@/components/admin/TabCategories';

type Tab = 'orders' | 'products' | 'categories' | 'suppliers';

interface AdminUser {
  id: string;
  email: string;
  name: string;
}

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
    id: 'products',
    label: 'Produits',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    id: 'categories',
    label: 'Catégories',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    id: 'suppliers',
    label: 'Fournisseurs',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>('orders');

  // Vérifier la session au chargement
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/verify');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          setAdmin(data.admin);
        }
      }
    } catch {
      // Non connecté
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setAdmin(data.admin);
        setEmail('');
        setPassword('');
      } else {
        setError(data.error || 'Erreur de connexion');
      }
    } catch {
      setError('Erreur de connexion au serveur');
    }

    setLoginLoading(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // Ignore
    }
    setIsAuthenticated(false);
    setAdmin(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
          <span className="font-body text-white/40 text-sm">Chargement...</span>
        </div>
      </div>
    );
  }

  // Formulaire de connexion
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-10">
            <LogoMark size={64} />
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="font-heading text-white text-2xl mb-2 text-center">
              Administration
            </h2>
            <p className="font-body text-white/40 text-sm text-center mb-8">
              Connectez-vous pour accéder au panneau
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-white/40 text-xs font-body mb-2 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="admin@velorabeauty.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-secondary/50 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-white/40 text-xs font-body mb-2 uppercase tracking-wider">
                  Mot de passe
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-secondary/50 transition-colors"
                  required
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
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 bg-secondary text-primary font-body font-medium rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loginLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>

            <p className="text-white/20 text-xs text-center mt-6 font-body">
              Compte par défaut : admin@velorabeauty.fr
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard admin
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary py-4 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" variant="light" />
            <div className="h-5 w-px bg-white/10" />
            <span className="px-2 py-1 bg-secondary/20 text-secondary text-xs font-body rounded-lg">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-4">
            {admin && (
              <span className="text-white/60 text-sm font-body hidden sm:block">
                {admin.name || admin.email}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 font-body text-white/50 hover:text-white text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-primary/10 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-none py-1">
            {TAB_CONFIG.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-body tracking-wider
                  transition-all duration-200 whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'bg-secondary/10 text-secondary border border-secondary/20'
                    : 'text-primary/40 hover:text-primary/70 hover:bg-primary/[0.03] border border-transparent'
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
        {activeTab === 'orders' && <TabOrders />}
        {activeTab === 'products' && <TabProducts />}
        {activeTab === 'categories' && <TabCategories />}
        {activeTab === 'suppliers' && <TabSuppliers />}
      </div>
    </div>
  );
}
