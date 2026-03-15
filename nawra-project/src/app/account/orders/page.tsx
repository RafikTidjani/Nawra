// src/app/account/orders/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { getCustomerOrders, CustomerOrder } from '@/lib/customer-auth';
import Navbar from '@/components/sections/Navbar';

export default function OrdersPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/account/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      getCustomerOrders()
        .then(setOrders)
        .finally(() => setLoadingOrders(false));
    }
  }, [user]);

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

  if (loading || !user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-primary/10 rounded w-48"></div>
              <div className="h-32 bg-primary/10 rounded"></div>
              <div className="h-32 bg-primary/10 rounded"></div>
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
            <h1 className="font-heading text-3xl font-semibold text-primary">
              Mes commandes
            </h1>
          </div>

          {loadingOrders ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-primary/10 rounded-2xl"></div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-primary/10">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/5 flex items-center justify-center">
                <svg className="w-10 h-10 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="font-heading text-xl font-semibold text-primary mb-2">
                Aucune commande
              </h2>
              <p className="text-primary/60 mb-6">
                Vous n'avez pas encore passé de commande
              </p>
              <Link
                href="/collections"
                className="inline-flex px-8 py-4 rounded-xl bg-secondary text-primary font-semibold hover:bg-secondary/90"
              >
                Découvrir nos coiffeuses
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const status = getStatusLabel(order.status);
                return (
                  <Link
                    key={order.id}
                    href={`/account/orders/${order.id}`}
                    className="block bg-white rounded-2xl border border-primary/10 p-6 hover:border-secondary/30 transition-colors"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-heading text-lg font-semibold text-primary">
                            #{order.orderNumber}
                          </h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            {status.text}
                          </span>
                        </div>
                        <p className="text-sm text-primary/60">
                          Commandé le {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <p className="font-heading text-2xl font-semibold text-primary">
                        {order.total.toFixed(2)}€
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {order.items.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/5"
                        >
                          {item.productImage && (
                            <div className="w-10 h-10 rounded bg-white overflow-hidden">
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-primary line-clamp-1">
                              {item.productName}
                            </p>
                            <p className="text-xs text-primary/60">
                              x{item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="flex items-center px-3 py-2 rounded-lg bg-primary/5 text-sm text-primary/60">
                          +{order.items.length - 3} autre{order.items.length - 3 > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>

                    {order.trackingNumber && (
                      <div className="mt-4 pt-4 border-t border-primary/5 flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-primary/60">Suivi :</span>
                        <span className="font-mono text-primary">{order.trackingNumber}</span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
