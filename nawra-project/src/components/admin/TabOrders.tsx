// src/components/admin/TabOrders.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

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
  shipping_address2: string | null;
  shipping_city: string;
  shipping_zip: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  status: string;
  customer_note: string | null;
  tracking_number?: string;
  tracking_carrier?: string;
  created_at: string;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  order_items?: OrderItem[];
}

type StatusFilter = 'all' | 'pending' | 'paid' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'En attente', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  paid: { label: 'Payée', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  preparing: { label: 'En préparation', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  shipped: { label: 'Expédiée', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
  delivered: { label: 'Livrée', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
  cancelled: { label: 'Annulée', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
};

const CARRIERS = [
  { id: 'colissimo', name: 'Colissimo', trackingUrl: 'https://www.laposte.fr/outils/suivre-vos-envois?code=' },
  { id: 'chronopost', name: 'Chronopost', trackingUrl: 'https://www.chronopost.fr/tracking-no-cms/suivi-page?liession=' },
  { id: 'mondial-relay', name: 'Mondial Relay', trackingUrl: 'https://www.mondialrelay.fr/suivi-de-colis/?numeroExpedition=' },
  { id: 'ups', name: 'UPS', trackingUrl: 'https://www.ups.com/track?tracknum=' },
  { id: 'dhl', name: 'DHL', trackingUrl: 'https://www.dhl.fr/fr/express/suivi.html?AWB=' },
  { id: 'other', name: 'Autre', trackingUrl: '' },
];

export default function TabOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [trackingInputs, setTrackingInputs] = useState<Record<string, { number: string; carrier: string }>>({});
  const [sendingTracking, setSendingTracking] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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

  const sendTrackingNotification = async (order: Order) => {
    const trackingData = trackingInputs[order.id];
    if (!trackingData?.number) {
      alert('Veuillez entrer un numéro de suivi');
      return;
    }

    setSendingTracking(order.id);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/tracking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingNumber: trackingData.number,
          carrier: trackingData.carrier || 'colissimo',
        }),
      });

      if (res.ok) {
        // Update local state
        setOrders(orders.map(o =>
          o.id === order.id
            ? { ...o, status: 'shipped', tracking_number: trackingData.number, tracking_carrier: trackingData.carrier }
            : o
        ));
        setTrackingInputs(prev => {
          const next = { ...prev };
          delete next[order.id];
          return next;
        });
        alert('Notification de suivi envoyée au client !');
      } else {
        const data = await res.json();
        alert(data.error || 'Erreur lors de l\'envoi');
      }
    } catch (err) {
      console.error('Error sending tracking:', err);
      alert('Erreur lors de l\'envoi de la notification');
    }
    setSendingTracking(null);
  };

  const getTrackingUrl = (carrier: string, trackingNumber: string): string => {
    const carrierConfig = CARRIERS.find(c => c.id === carrier);
    if (carrierConfig?.trackingUrl) {
      return `${carrierConfig.trackingUrl}${trackingNumber}`;
    }
    return '';
  };

  // Filter orders
  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(o => o.status === statusFilter);

  // Count by status
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-heading text-primary text-2xl">Commandes</h2>
          <p className="font-body text-primary/40 text-sm">{orders.length} commande(s) au total</p>
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

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-primary/5">
        {(['all', 'pending', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled'] as StatusFilter[]).map((status) => {
          const count = status === 'all' ? orders.length : (statusCounts[status] || 0);
          const isActive = statusFilter === status;
          const label = status === 'all' ? 'Toutes' : STATUS_CONFIG[status]?.label || status;

          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`
                px-4 py-2 rounded-lg text-sm font-body transition-all
                ${isActive
                  ? 'bg-primary text-white'
                  : 'bg-primary/5 text-primary/60 hover:bg-primary/10'
                }
              `}
            >
              {label}
              <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${isActive ? 'bg-white/20' : 'bg-primary/10'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-primary/[0.02] rounded-2xl border border-primary/5">
          <div className="text-5xl mb-4 opacity-30">📦</div>
          <p className="text-primary/40 font-body">
            {statusFilter === 'all'
              ? 'Aucune commande pour le moment.'
              : `Aucune commande "${STATUS_CONFIG[statusFilter]?.label}".`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const isExpanded = expandedOrder === order.id;
            const trackingInput = trackingInputs[order.id] || { number: '', carrier: 'colissimo' };

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
                        {order.tracking_number && (
                          <span className="px-2 py-0.5 text-xs font-body rounded-full bg-purple-50 border border-purple-200 text-purple-600">
                            Suivi: {order.tracking_number}
                          </span>
                        )}
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
                    {/* Order items */}
                    {order.order_items && order.order_items.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-body text-primary/40 text-xs uppercase tracking-wider mb-3">
                          Articles commandés
                        </h4>
                        <div className="space-y-3">
                          {order.order_items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                              {item.product_image && (
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-accent flex-shrink-0">
                                  <Image
                                    src={item.product_image}
                                    alt={item.product_name}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-body text-primary text-sm truncate">
                                  {item.product_name}
                                </p>
                                <p className="font-body text-primary/50 text-xs">
                                  {item.quantity} × {item.product_price}€
                                </p>
                              </div>
                              <span className="font-heading text-primary">
                                {item.total.toFixed(2)}€
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Address */}
                      <div>
                        <h4 className="font-body text-primary/40 text-xs uppercase tracking-wider mb-2">
                          Adresse de livraison
                        </h4>
                        <p className="font-body text-primary">
                          {order.shipping_first_name} {order.shipping_last_name}<br />
                          {order.shipping_address}
                          {order.shipping_address2 && <><br />{order.shipping_address2}</>}
                          <br />
                          {order.shipping_zip} {order.shipping_city}
                        </p>
                      </div>

                      {/* Customer note */}
                      {order.customer_note && (
                        <div>
                          <h4 className="font-body text-primary/40 text-xs uppercase tracking-wider mb-2">
                            Note du client
                          </h4>
                          <p className="font-body text-primary/70 italic">
                            &quot;{order.customer_note}&quot;
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Tracking section */}
                    {(order.status === 'paid' || order.status === 'preparing') && (
                      <div className="mt-6 pt-4 border-t border-primary/5">
                        <h4 className="font-body text-primary/40 text-xs uppercase tracking-wider mb-3">
                          Ajouter un suivi de colis
                        </h4>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <select
                            value={trackingInput.carrier}
                            onChange={(e) => setTrackingInputs(prev => ({
                              ...prev,
                              [order.id]: { ...trackingInput, carrier: e.target.value }
                            }))}
                            className="select-styled sm:w-40"
                          >
                            {CARRIERS.map(carrier => (
                              <option key={carrier.id} value={carrier.id}>
                                {carrier.name}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            placeholder="Numéro de suivi"
                            value={trackingInput.number}
                            onChange={(e) => setTrackingInputs(prev => ({
                              ...prev,
                              [order.id]: { ...trackingInput, number: e.target.value }
                            }))}
                            className="inp-light flex-1"
                          />
                          <button
                            onClick={() => sendTrackingNotification(order)}
                            disabled={sendingTracking === order.id || !trackingInput.number}
                            className="btn-primary !py-3 !px-6 whitespace-nowrap disabled:opacity-50"
                          >
                            {sendingTracking === order.id ? (
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              'Envoyer notification'
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Existing tracking info */}
                    {order.tracking_number && (
                      <div className="mt-6 pt-4 border-t border-primary/5">
                        <h4 className="font-body text-primary/40 text-xs uppercase tracking-wider mb-2">
                          Informations de suivi
                        </h4>
                        <div className="flex items-center gap-4">
                          <span className="font-body text-primary">
                            {order.tracking_carrier && CARRIERS.find(c => c.id === order.tracking_carrier)?.name}:{' '}
                            <strong>{order.tracking_number}</strong>
                          </span>
                          {order.tracking_carrier && order.tracking_carrier !== 'other' && (
                            <a
                              href={getTrackingUrl(order.tracking_carrier, order.tracking_number)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-secondary hover:underline text-sm font-body"
                            >
                              Suivre le colis →
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Status actions */}
                    <div className="mt-6 pt-4 border-t border-primary/5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <span className="font-body text-primary/40 text-xs uppercase tracking-wider">
                        Changer le statut :
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="select-styled"
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
