// src/components/admin/TabSuppliers.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';

interface Supplier {
  id: string;
  code: string;
  name: string;
  api_endpoint?: string;
  status: 'active' | 'inactive' | 'testing';
  config: Record<string, unknown>;
  last_synced_at?: string;
  created_at: string;
}

interface SupplierProduct {
  supplierId: string;
  supplierProductId: string;
  name: string;
  price: number;
  currency: string;
  images: string[];
}

const STATUS_CONFIG = {
  active: { label: 'Actif', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  inactive: { label: 'Inactif', color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200' },
  testing: { label: 'En test', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
};

export default function TabSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SupplierProduct[]>([]);
  const [searching, setSearching] = useState(false);

  const [migrationNeeded, setMigrationNeeded] = useState(false);

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/suppliers');
      if (res.ok) {
        const data = await res.json();
        setSuppliers(data.suppliers || []);
        setMigrationNeeded(false);
      } else if (res.status === 500) {
        // Table might not exist
        setMigrationNeeded(true);
      }
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setMigrationNeeded(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const testConnection = async (supplierId: string) => {
    setTestingConnection(supplierId);
    try {
      const res = await fetch(`/api/admin/suppliers/${supplierId}/test`, {
        method: 'POST',
      });
      const data = await res.json();
      alert(data.message || (data.success ? 'Connexion réussie' : 'Échec de la connexion'));
    } catch (err) {
      console.error('Error testing connection:', err);
      alert('Erreur lors du test de connexion');
    }
    setTestingConnection(null);
  };

  const updateSupplierStatus = async (supplierId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/suppliers/${supplierId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setSuppliers(suppliers.map(s =>
          s.id === supplierId ? { ...s, status: status as Supplier['status'] } : s
        ));
      }
    } catch (err) {
      console.error('Error updating supplier:', err);
    }
  };

  const searchProducts = async () => {
    if (!selectedSupplier || !searchQuery.trim()) return;

    setSearching(true);
    try {
      const res = await fetch(`/api/admin/supplier-products/search?supplierId=${selectedSupplier.id}&query=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.products || []);
      }
    } catch (err) {
      console.error('Error searching products:', err);
    }
    setSearching(false);
  };

  const importProduct = async (product: SupplierProduct) => {
    try {
      const res = await fetch('/api/admin/supplier-products/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierId: selectedSupplier?.id,
          supplierProductId: product.supplierProductId,
          name: product.name,
          price: product.price,
          images: product.images,
        }),
      });

      if (res.ok) {
        alert(`Produit "${product.name}" importé avec succès !`);
        // Remove from search results
        setSearchResults(searchResults.filter(p => p.supplierProductId !== product.supplierProductId));
      } else {
        const data = await res.json();
        alert(data.error || 'Erreur lors de l\'import');
      }
    } catch (err) {
      console.error('Error importing product:', err);
      alert('Erreur lors de l\'import');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
          <span className="font-body text-primary/40 text-sm">Chargement des fournisseurs...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading text-primary text-2xl">Fournisseurs</h2>
          <p className="font-body text-primary/40 text-sm">{suppliers.length} fournisseur(s) configuré(s)</p>
        </div>
        <button
          onClick={fetchSuppliers}
          className="flex items-center gap-2 px-4 py-2 border border-primary/10 rounded-xl text-primary/60 hover:text-primary hover:border-primary/20 transition-colors text-sm font-body"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualiser
        </button>
      </div>

      {/* Suppliers list */}
      {!migrationNeeded && <div className="space-y-4 mb-8">
        {suppliers.map((supplier) => {
          const statusConfig = STATUS_CONFIG[supplier.status] || STATUS_CONFIG.inactive;

          return (
            <div
              key={supplier.id}
              className="bg-white rounded-2xl shadow-sm border border-primary/5 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-heading text-primary text-lg">{supplier.name}</h3>
                      <span className={`px-2 py-0.5 text-xs font-body rounded-full border ${statusConfig.bg} ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                    <p className="font-body text-primary/50 text-sm">
                      Code : <span className="font-mono">{supplier.code}</span>
                    </p>
                    {supplier.api_endpoint && (
                      <p className="font-body text-primary/30 text-xs mt-1 font-mono">
                        {supplier.api_endpoint}
                      </p>
                    )}
                    {supplier.last_synced_at && (
                      <p className="font-body text-primary/30 text-xs mt-1">
                        Dernière sync : {new Date(supplier.last_synced_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={supplier.status}
                      onChange={(e) => updateSupplierStatus(supplier.id, e.target.value)}
                      className="select-styled text-sm"
                    >
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                      <option value="testing">En test</option>
                    </select>

                    {supplier.code !== 'manual' && (
                      <button
                        onClick={() => testConnection(supplier.id)}
                        disabled={testingConnection === supplier.id}
                        className="px-4 py-2 border border-primary/10 rounded-lg text-primary/60 hover:text-primary hover:border-primary/20 transition-colors text-sm font-body disabled:opacity-50"
                      >
                        {testingConnection === supplier.id ? (
                          <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                        ) : (
                          'Tester'
                        )}
                      </button>
                    )}

                    {supplier.code !== 'manual' && (
                      <button
                        onClick={() => setSelectedSupplier(selectedSupplier?.id === supplier.id ? null : supplier)}
                        className={`px-4 py-2 rounded-lg text-sm font-body transition-colors ${
                          selectedSupplier?.id === supplier.id
                            ? 'bg-secondary text-primary'
                            : 'bg-primary text-white hover:bg-primary/90'
                        }`}
                      >
                        {selectedSupplier?.id === supplier.id ? 'Fermer' : 'Catalogue'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Catalog search (expanded) */}
              {selectedSupplier?.id === supplier.id && (
                <div className="border-t border-primary/5 p-6 bg-primary/[0.01]">
                  <h4 className="font-body text-primary/40 text-xs uppercase tracking-wider mb-4">
                    Rechercher dans le catalogue
                  </h4>

                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      placeholder="Rechercher un produit..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && searchProducts()}
                      className="inp-light flex-1"
                    />
                    <button
                      onClick={searchProducts}
                      disabled={searching || !searchQuery.trim()}
                      className="btn-primary !py-3 !px-6 disabled:opacity-50"
                    >
                      {searching ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        'Rechercher'
                      )}
                    </button>
                  </div>

                  {/* Search results */}
                  {searchResults.length > 0 && (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {searchResults.map((product) => (
                        <div
                          key={product.supplierProductId}
                          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-primary/5"
                        >
                          {product.images[0] && (
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-accent flex-shrink-0">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h5 className="font-body text-primary text-sm font-medium truncate">
                              {product.name}
                            </h5>
                            <p className="font-body text-primary/50 text-xs">
                              ID : {product.supplierProductId}
                            </p>
                            <p className="font-heading text-secondary text-lg">
                              {product.price} {product.currency}
                            </p>
                          </div>
                          <button
                            onClick={() => importProduct(product)}
                            className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-body hover:bg-emerald-600 transition-colors"
                          >
                            Importer
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.length === 0 && searchQuery && !searching && (
                    <p className="text-center text-primary/40 font-body text-sm py-4">
                      Aucun résultat pour &quot;{searchQuery}&quot;
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>}

      {/* Migration needed */}
      {migrationNeeded && (
        <div className="text-center py-16 bg-amber-50 rounded-2xl border border-amber-200">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-amber-800 font-heading text-xl mb-2">Migration requise</h3>
          <p className="text-amber-700 font-body mb-4">
            La table des fournisseurs n&apos;existe pas encore.
          </p>
          <div className="max-w-lg mx-auto text-left bg-white rounded-xl p-4 border border-amber-200">
            <p className="text-amber-800 font-body text-sm mb-2">
              Pour activer les fournisseurs :
            </p>
            <ol className="text-amber-700 font-body text-sm space-y-1 list-decimal list-inside">
              <li>Va sur <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-amber-600 underline">Supabase Dashboard</a></li>
              <li>Ouvre le SQL Editor</li>
              <li>Copie-colle le contenu de <code className="bg-amber-100 px-1 rounded">supabase/migrations/002_suppliers.sql</code></li>
              <li>Clique sur &quot;Run&quot;</li>
              <li>Reviens ici et actualise</li>
            </ol>
          </div>
          <button
            onClick={fetchSuppliers}
            className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg font-body text-sm hover:bg-amber-700 transition-colors"
          >
            J&apos;ai fait la migration, actualiser
          </button>
        </div>
      )}

      {/* Empty state */}
      {!migrationNeeded && suppliers.length === 0 && (
        <div className="text-center py-16 bg-primary/[0.02] rounded-2xl border border-primary/5">
          <div className="text-5xl mb-4 opacity-30">🏭</div>
          <p className="text-primary/40 font-body">Aucun fournisseur configuré.</p>
          <p className="text-primary/30 font-body text-sm mt-1">
            Exécutez la migration 002_suppliers.sql pour ajouter les fournisseurs par défaut.
          </p>
        </div>
      )}

      {/* Help text */}
      <div className="mt-8 p-4 bg-accent/50 rounded-xl">
        <h4 className="font-body text-primary/60 text-sm font-medium mb-2">Configuration CJ Dropshipping</h4>
        <p className="font-body text-primary/40 text-xs leading-relaxed">
          Pour activer CJ Dropshipping, ajoutez les variables d&apos;environnement suivantes :
        </p>
        <pre className="mt-2 p-3 bg-white rounded-lg text-xs font-mono text-primary/60">
          CJ_EMAIL=votre-email-cj{'\n'}
          CJ_PASSWORD=votre-mot-de-passe
        </pre>
      </div>
    </div>
  );
}
