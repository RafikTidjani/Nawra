// src/app/account/orders/[id]/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { getCustomerOrder, CustomerOrder } from '@/lib/customer-auth';
import Navbar from '@/components/sections/Navbar';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading } = useAuth();
  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/account/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && params.id) {
      getCustomerOrder(params.id as string)
        .then(setOrder)
        .finally(() => setLoadingOrder(false));
    }
  }, [user, params.id]);

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { text: string; color: string }> = {
      pending: { text: 'En attente de paiement', color: 'bg-yellow-100 text-yellow-800' },
      paid: { text: 'Payée', color: 'bg-blue-100 text-blue-800' },
      preparing: { text: 'En préparation', color: 'bg-purple-100 text-purple-800' },
      shipped: { text: 'Expédiée', color: 'bg-indigo-100 text-indigo-800' },
      delivered: { text: 'Livrée', color: 'bg-emerald-100 text-emerald-800' },
      cancelled: { text: 'Annulée', color: 'bg-red-100 text-red-800' },
    };
    return labels[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
  };

  const handlePrintInvoice = () => {
    const printContent = invoiceRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Facture ${order?.orderNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: system-ui, sans-serif; padding: 40px; color: #3D3228; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .logo { font-size: 24px; font-weight: 700; letter-spacing: 0.2em; }
            .invoice-title { font-size: 12px; color: #666; margin-top: 4px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
            .info-section h3 { font-size: 12px; color: #666; margin-bottom: 8px; text-transform: uppercase; }
            .info-section p { font-size: 14px; line-height: 1.6; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { text-align: left; padding: 12px 0; border-bottom: 2px solid #3D3228; font-size: 12px; text-transform: uppercase; color: #666; }
            td { padding: 16px 0; border-bottom: 1px solid #eee; font-size: 14px; }
            .text-right { text-align: right; }
            .totals { margin-left: auto; width: 250px; }
            .totals-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
            .totals-row.total { font-weight: 700; font-size: 18px; border-top: 2px solid #3D3228; padding-top: 16px; margin-top: 8px; }
            .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; text-align: center; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading || loadingOrder) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-primary/10 rounded w-48"></div>
              <div className="h-64 bg-primary/10 rounded-2xl"></div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="font-heading text-2xl font-semibold text-primary mb-4">
              Commande introuvable
            </h1>
            <Link href="/account/orders" className="text-secondary hover:underline">
              Retour aux commandes
            </Link>
          </div>
        </main>
      </>
    );
  }

  const status = getStatusLabel(order.status);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-2 text-sm text-primary/60 hover:text-primary mb-4 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour aux commandes
            </Link>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="font-heading text-3xl font-semibold text-primary">
                    #{order.orderNumber}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                    {status.text}
                  </span>
                </div>
                <p className="text-primary/60">
                  Commandé le {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <button
                onClick={handlePrintInvoice}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-primary/10 text-primary hover:bg-primary/5 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Imprimer la facture
              </button>
            </div>
          </div>

          {/* Order timeline */}
          {order.status !== 'cancelled' && order.status !== 'pending' && (
            <div className="bg-white rounded-2xl border border-primary/10 p-6 mb-6">
              <h2 className="font-heading text-lg font-semibold text-primary mb-6">Suivi</h2>
              <div className="flex items-center justify-between relative">
                <div className="absolute top-3 left-0 right-0 h-0.5 bg-primary/10"></div>
                {['paid', 'preparing', 'shipped', 'delivered'].map((step, i) => {
                  const steps = ['paid', 'preparing', 'shipped', 'delivered'];
                  const currentIndex = steps.indexOf(order.status);
                  const isActive = i <= currentIndex;
                  const labels = ['Payée', 'Préparation', 'Expédiée', 'Livrée'];
                  return (
                    <div key={step} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isActive ? 'bg-emerald-500' : 'bg-primary/10'
                        }`}
                      >
                        {isActive && (
                          <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className={`mt-2 text-xs ${isActive ? 'text-primary font-medium' : 'text-primary/40'}`}>
                        {labels[i]}
                      </span>
                    </div>
                  );
                })}
              </div>

              {order.trackingNumber && (
                <div className="mt-6 p-4 rounded-xl bg-primary/5 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-primary/60 mb-1">Numéro de suivi</p>
                    <p className="font-mono font-semibold text-primary">{order.trackingNumber}</p>
                  </div>
                  <a
                    href={`https://www.google.com/search?q=${order.trackingCarrier}+${order.trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90"
                  >
                    Suivre le colis
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Invoice content (hidden, used for printing) */}
          <div ref={invoiceRef} className="hidden">
            <div className="header">
              <div>
                <div className="logo">VELORA</div>
                <div className="invoice-title">Facture #{order.orderNumber}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p>Date : {new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                <p>Statut : {status.text}</p>
              </div>
            </div>

            <div className="info-grid">
              <div className="info-section">
                <h3>Facturation</h3>
                <p>
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                  {order.shippingAddress.email}<br />
                  {order.shippingAddress.phone}
                </p>
              </div>
              <div className="info-section">
                <h3>Livraison</h3>
                <p>
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                  {order.shippingAddress.address}<br />
                  {order.shippingAddress.address2 && <>{order.shippingAddress.address2}<br /></>}
                  {order.shippingAddress.zip} {order.shippingAddress.city}<br />
                  {order.shippingAddress.country}
                </p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Produit</th>
                  <th className="text-right">Prix unitaire</th>
                  <th className="text-right">Qté</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.productName}</td>
                    <td className="text-right">{item.productPrice.toFixed(2)}€</td>
                    <td className="text-right">{item.quantity}</td>
                    <td className="text-right">{item.total.toFixed(2)}€</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="totals">
              <div className="totals-row">
                <span>Sous-total</span>
                <span>{order.subtotal.toFixed(2)}€</span>
              </div>
              <div className="totals-row">
                <span>Livraison</span>
                <span>{order.shippingCost === 0 ? 'Offerte' : `${order.shippingCost.toFixed(2)}€`}</span>
              </div>
              <div className="totals-row total">
                <span>Total TTC</span>
                <span>{order.total.toFixed(2)}€</span>
              </div>
            </div>

            <div className="footer">
              <p>VELORA — Coiffeuses premium</p>
              <p>contact@velorabeauty.fr | velorabeauty.fr</p>
            </div>
          </div>

          {/* Visible order details */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Products */}
            <div className="md:col-span-2 bg-white rounded-2xl border border-primary/10 p-6">
              <h2 className="font-heading text-lg font-semibold text-primary mb-6">Produits</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    {item.productImage && (
                      <div className="w-20 h-20 rounded-xl bg-accent overflow-hidden shrink-0">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary">{item.productName}</h3>
                      <p className="text-sm text-primary/60">
                        {item.productPrice.toFixed(2)}€ × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-primary">
                      {item.total.toFixed(2)}€
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-primary/10 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-primary/60">Sous-total</span>
                  <span>{order.subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary/60">Livraison</span>
                  <span>{order.shippingCost === 0 ? 'Offerte' : `${order.shippingCost.toFixed(2)}€`}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2">
                  <span>Total</span>
                  <span>{order.total.toFixed(2)}€</span>
                </div>
              </div>
            </div>

            {/* Shipping address */}
            <div className="bg-white rounded-2xl border border-primary/10 p-6 h-fit">
              <h2 className="font-heading text-lg font-semibold text-primary mb-4">Adresse de livraison</h2>
              <div className="text-sm text-primary/80 space-y-1">
                <p className="font-medium text-primary">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address}</p>
                {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                <p>{order.shippingAddress.zip} {order.shippingAddress.city}</p>
                <p>{order.shippingAddress.country}</p>
                <p className="pt-2">{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.email}</p>
              </div>
            </div>
          </div>

          {/* Help */}
          <div className="mt-8 p-6 bg-accent rounded-2xl text-center">
            <h3 className="font-heading text-lg font-semibold text-primary mb-2">
              Besoin d'aide ?
            </h3>
            <p className="text-sm text-primary/60 mb-4">
              Une question sur votre commande ? Contactez-nous.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contacter le support
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
