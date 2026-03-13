// src/components/configurator/StepSummary.tsx
'use client';

import { useState, FormEvent } from 'react';
import type { Product, Size, Theme, Order, OrderCustomer, ProductType } from '@/types';
const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  bouquet: 'Bouquet',
  panier: 'Panier de fiançailles',
  cadeau: 'Cadeau personnalisé',
};

interface StepSummaryProps {
  theme: string;
  themeData: Theme;
  size: string;
  sizeData: Size;
  selectedItems: string[];
  products: Product[];
  productType?: ProductType;
  onPrev: () => void;
}

export default function StepSummary({
  theme,
  themeData,
  size,
  sizeData,
  selectedItems,
  products,
  productType = 'panier',
  onPrev,
}: StepSummaryProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [customer, setCustomer] = useState<OrderCustomer>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    message: '',
  });

  const [deliveryDate, setDeliveryDate] = useState('');

  const selectedProducts = products.filter(p => selectedItems.includes(p.id));
  const productsTotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const total = sizeData.price + productsTotal;

  const handleInputChange = (field: keyof OrderCustomer) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCustomer(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!customer.name || !customer.email || !customer.phone || !customer.address || !customer.city || !customer.zip) {
      setError('Veuillez remplir tous les champs obligatoires.');
      setIsSubmitting(false);
      return;
    }

    const order: Order = {
      theme,
      size,
      products: selectedItems,
      total,
      customer,
      deliveryDate: deliveryDate || undefined,
      status: 'pending',
      productType,
    };

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Une erreur est survenue.');
        setIsSubmitting(false);
      }
    } catch {
      setError('Erreur de connexion. Veuillez réessayer.');
      setIsSubmitting(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="space-y-8">
      {/* Order summary — dark card */}
      <div className="card-dark p-6 md:p-8 relative overflow-hidden">
        {/* Decorative gradient */}
        <div
          className="absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: themeData.p }}
        />

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <span className="badge-gold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Récapitulatif
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'Type', value: PRODUCT_TYPE_LABELS[productType] },
              { label: 'Thème', value: theme, icon: <div className="w-3 h-3 rounded-full" style={{ backgroundColor: themeData.p }} /> },
              { label: 'Taille', value: sizeData.label },
              { label: 'Articles', value: `${selectedItems.length} produits` },
              { label: 'Total', value: `${total}€`, highlight: true },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/5">
                <span className="text-cream/40 text-xs block mb-1 font-cormorant tracking-wider uppercase">{item.label}</span>
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className={`font-amiri ${item.highlight ? 'text-gold text-xl' : 'text-cream'}`}>
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected products */}
      <div>
        <h4 className="text-dark/50 text-xs tracking-wider uppercase mb-4 flex items-center gap-2 font-cormorant font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Produits sélectionnés ({selectedProducts.length})
        </h4>
        <div className="space-y-1">
          {selectedProducts.map((product, index) => (
            <div
              key={product.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                index % 2 === 0 ? 'bg-dark/[0.02]' : 'bg-white'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-gold/5 flex items-center justify-center text-lg flex-shrink-0 border border-gold/10">
                {product.cat === 'parfum' ? '🧴' : product.cat === 'makeup' ? '💄' : product.cat === 'soin' ? '🌸' : product.cat === 'fleur' ? '🌹' : product.cat === 'chocolat' ? '🍫' : product.cat === 'bijou' ? '💎' : '👜'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-dark/40 text-[10px] tracking-wider uppercase font-cormorant">{product.brand}</p>
                <p className="font-amiri text-dark text-sm truncate">{product.name}</p>
              </div>
              <span className="font-amiri text-gold text-sm">{product.price}€</span>
            </div>
          ))}
        </div>
      </div>

      {/* Customer form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <h4 className="text-dark/50 text-xs tracking-wider uppercase flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Informations de livraison
        </h4>

        {/* Row 1: Name + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-dark/70 text-sm font-medium mb-2">
              Nom complet <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="Marie Dupont"
              value={customer.name}
              onChange={handleInputChange('name')}
              required
              className="w-full px-4 py-3.5 rounded-xl border border-dark/10 bg-white text-dark focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-dark/70 text-sm font-medium mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="marie@exemple.fr"
              value={customer.email}
              onChange={handleInputChange('email')}
              required
              className="w-full px-4 py-3.5 rounded-xl border border-dark/10 bg-white text-dark focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
            />
          </div>
        </div>

        {/* Row 2: Phone + Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-dark/70 text-sm font-medium mb-2">
              Téléphone <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="06 12 34 56 78"
              value={customer.phone}
              onChange={handleInputChange('phone')}
              required
              className="w-full px-4 py-3.5 rounded-xl border border-dark/10 bg-white text-dark focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-dark/70 text-sm font-medium mb-2">
              Date de livraison souhaitée
            </label>
            <input
              id="date"
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              min={minDate}
              className="w-full px-4 py-3.5 rounded-xl border border-dark/10 bg-white text-dark focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
            />
          </div>
        </div>

        {/* Row 3: Address (full width) */}
        <div>
          <label htmlFor="address" className="block text-dark/70 text-sm font-medium mb-2">
            Adresse <span className="text-red-500">*</span>
          </label>
          <input
            id="address"
            type="text"
            placeholder="123 rue de la Paix"
            value={customer.address}
            onChange={handleInputChange('address')}
            required
            className="w-full px-4 py-3.5 rounded-xl border border-dark/10 bg-white text-dark focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
          />
        </div>

        {/* Row 4: City + Zip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-dark/70 text-sm font-medium mb-2">
              Ville <span className="text-red-500">*</span>
            </label>
            <input
              id="city"
              type="text"
              placeholder="Paris"
              value={customer.city}
              onChange={handleInputChange('city')}
              required
              className="w-full px-4 py-3.5 rounded-xl border border-dark/10 bg-white text-dark focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
            />
          </div>
          <div>
            <label htmlFor="zip" className="block text-dark/70 text-sm font-medium mb-2">
              Code postal <span className="text-red-500">*</span>
            </label>
            <input
              id="zip"
              type="text"
              placeholder="75001"
              value={customer.zip}
              onChange={handleInputChange('zip')}
              required
              className="w-full px-4 py-3.5 rounded-xl border border-dark/10 bg-white text-dark focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
            />
          </div>
        </div>

        {/* Row 5: Message */}
        <div>
          <label htmlFor="message" className="block text-dark/70 text-sm font-medium mb-2">
            Message <span className="text-dark/40">(optionnel)</span>
          </label>
          <textarea
            id="message"
            rows={3}
            placeholder="Instructions spéciales, message pour le destinataire..."
            value={customer.message}
            onChange={handleInputChange('message')}
            className="w-full px-4 py-3.5 rounded-xl border border-dark/10 bg-white text-dark focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all resize-none"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 animate-fade-up">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-4 py-6">
          {[
            { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>, text: 'Paiement sécurisé' },
            { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>, text: 'Livraison 48h' },
            { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>, text: 'Produits authentiques' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-dark/[0.02] text-center">
              <span className="text-gold">{item.icon}</span>
              <span className="text-dark/50 text-xs font-cormorant">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="pt-6">
          <div className="divider-gold mb-6 w-full" />
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button type="button" onClick={onPrev} className="btn-outline flex items-center gap-2 group order-2 sm:order-1">
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Modifier
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn-gold flex items-center justify-center gap-3 w-full sm:w-auto order-1 sm:order-2 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Redirection...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Payer {total}€
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
