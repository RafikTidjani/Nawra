// src/components/admin/TabOrders.tsx
'use client';

import { useState, useEffect } from 'react';

interface OrderItem {
  id: string;
  product_name: string;
  product_price: number;
  product_image: string | null;
  quantity: number;
  total: number;
}

interface Order {
  id: string;
  order_number: string;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_email: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_zip: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  status: string;
  customer_note: string | null;
  created_at: string;
  paid_at: string | null;
  shipped_at: string | null;
  items?: OrderItem[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'En attente', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  paid: { label: 'Payée', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  preparing: { label: 'En préparation', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  shipped: { label: 'Expédiée', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
  delivered: { label: 'Livrée', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
  cancelled: { label: 'Annulée', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
};

export default function TabOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
    setLoading(false);
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });

      if (res.ok) {
        setOrders(orders.map(o =>
          o.id === orderId ? { ...o, status: newStatus } : o
        ));
      }
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
          <span className="font-body text-primary/40 text-sm">Chargement des commandes...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading text-primary text-2xl">Commandes</h2>
          <p className="font-body text-primary/40 text-sm">{orders.length} commande(s)</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 border border-primary/10 rounded-xl text-primary/60 hover:text-primary hover:border-primary/20 transition-colors text-sm font-body"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualiser
        </button>
      </div>

      {/* Empty state */}
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-primary/[0.02] rounded-2xl border border-primary/5">
          <div className="text-5xl mb-4 opacity-30">📦</div>
          <p className="text-primary/40 font-body">Aucune commande pour le moment.</p>
          <p className="text-primary/30 font-body text-sm mt-1">
            Les commandes apparaîtront ici après un achat.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const isExpanded = expandedOrder === order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm border border-primary/5 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order header */}
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-body text-secondary font-medium">
                          {order.order_number}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-body rounded-full border ${statusConfig.bg} ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      <h3 className="font-heading text-primary text-lg">
                        {order.shipping_first_name} {order.shipping_last_name}
                      </h3>
                      <p className="font-body text-primary/50 text-sm">
                        {order.shipping_email} · {order.shipping_phone}
                      </p>
                      <p className="font-body text-primary/30 text-xs mt-1">
                        {new Date(order.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-heading text-secondary text-2xl">
                        {order.total.toFixed(2)}€
                      </span>
                      <div className="flex items-center gap-1 text-primary/30 mt-1">
                        <svg
                          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <span className="text-xs font-body">Détails</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-primary/5 p-6 bg-primary/[0.01]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Adresse */}
                      <div>
                        <h4 className="font-body text-primary/40 text-xs uppercase tracking-wider mb-2">
                          Adresse de livraison
                        </h4>
                        <p className="font-body text-primary">
                          {order.shipping_first_name} {order.shipping_last_name}<br />
                          {order.shipping_address}<br />
                          {order.shipping_zip} {order.shipping_city}
                        </p>
                      </div>

                      {/* Note client */}
                      {order.customer_note && (
                        <div>
                          <h4 className="font-body text-primary/40 text-xs uppercase tracking-wider mb-2">
                            Note du client
                          </h4>
                          <p className="font-body text-primary/70 italic">
                            "{order.customer_note}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-6 pt-4 border-t border-primary/5 flex items-center gap-4">
                      <span className="font-body text-primary/40 text-xs uppercase tracking-wider">
                        Changer le statut :
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="px-3 py-2 bg-white border border-primary/10 rounded-lg text-sm font-body text-primary focus:outline-none focus:border-secondary/50"
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
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
