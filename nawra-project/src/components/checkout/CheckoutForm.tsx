// src/components/checkout/CheckoutForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { getCustomerAddresses, CustomerAddress } from '@/lib/customer-auth';

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  address2: string;
  city: string;
  zip: string;
  note: string;
}

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  isSubmitting: boolean;
}

const STORAGE_KEY = 'velora_checkout_info';

export default function CheckoutForm({ onSubmit, isSubmitting }: CheckoutFormProps) {
  const { user, profile } = useAuth();
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    address2: '',
    city: '',
    zip: '',
    note: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});

  // Load saved info for guests or profile for logged-in users
  useEffect(() => {
    if (user && profile) {
      // Pre-fill from profile
      setFormData(prev => ({
        ...prev,
        firstName: profile.firstName || prev.firstName,
        lastName: profile.lastName || prev.lastName,
        email: user.email || prev.email,
        phone: profile.phone || prev.phone,
      }));

      // Load saved addresses
      getCustomerAddresses().then(addrs => {
        setAddresses(addrs);
        // Auto-select default address
        const defaultAddr = addrs.find(a => a.isDefault);
        if (defaultAddr) {
          applyAddress(defaultAddr);
          setSelectedAddressId(defaultAddr.id);
        }
      });
    } else {
      // Guest: try to load from localStorage
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setFormData(prev => ({ ...prev, ...parsed }));
          setRememberMe(true);
        }
      } catch {
        // Ignore
      }
    }
  }, [user, profile]);

  const applyAddress = (addr: CustomerAddress) => {
    setFormData(prev => ({
      ...prev,
      firstName: addr.firstName || prev.firstName,
      lastName: addr.lastName || prev.lastName,
      address: addr.address,
      address2: addr.address2 || '',
      city: addr.city,
      zip: addr.zip,
      phone: addr.phone || prev.phone,
    }));
  };

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    if (addressId === '') return;

    const addr = addresses.find(a => a.id === addressId);
    if (addr) {
      applyAddress(addr);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    } else if (!/^(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'L\'adresse est requise';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'La ville est requise';
    }
    if (!formData.zip.trim()) {
      newErrors.zip = 'Le code postal est requis';
    } else if (!/^\d{5}$/.test(formData.zip)) {
      newErrors.zip = 'Code postal invalide (5 chiffres)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof CheckoutFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Save for guest users if remember me is checked
      if (!user && rememberMe) {
        try {
          const toSave = { ...formData };
          delete (toSave as Record<string, unknown>).note; // Don't save note
          localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
        } catch {
          // Ignore
        }
      }
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Address selector for logged-in users */}
      {user && addresses.length > 0 && (
        <div className="bg-accent/50 rounded-xl p-4 mb-2">
          <label className="block text-sm font-body text-primary font-medium mb-2">
            Utiliser une adresse enregistrée
          </label>
          <select
            value={selectedAddressId}
            onChange={(e) => handleAddressSelect(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-primary/10 bg-white text-sm font-body text-primary focus:border-secondary outline-none cursor-pointer"
          >
            <option value="">Entrer une nouvelle adresse</option>
            {addresses.map(addr => (
              <option key={addr.id} value={addr.id}>
                {addr.label} — {addr.address}, {addr.zip} {addr.city}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Contact info */}
      <div>
        <h3 className="font-heading text-lg font-semibold text-primary mb-4">
          Informations de contact
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-body text-text-secondary mb-1.5">
                Prénom *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`inp-light w-full ${errors.firstName ? 'border-red-500 focus:border-red-500' : ''}`}
                placeholder="Marie"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-body text-text-secondary mb-1.5">
                Nom *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`inp-light w-full ${errors.lastName ? 'border-red-500 focus:border-red-500' : ''}`}
                placeholder="Dupont"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-body text-text-secondary mb-1.5">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`inp-light w-full ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
              placeholder="marie@exemple.fr"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-body text-text-secondary mb-1.5">
              Téléphone *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`inp-light w-full ${errors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
              placeholder="06 12 34 56 78"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Shipping address */}
      <div>
        <h3 className="font-heading text-lg font-semibold text-primary mb-4">
          Adresse de livraison
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="address" className="block text-sm font-body text-text-secondary mb-1.5">
              Adresse *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`inp-light w-full ${errors.address ? 'border-red-500 focus:border-red-500' : ''}`}
              placeholder="123 rue de Paris"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          <div>
            <label htmlFor="address2" className="block text-sm font-body text-text-secondary mb-1.5">
              Complément d'adresse
            </label>
            <input
              type="text"
              id="address2"
              name="address2"
              value={formData.address2}
              onChange={handleChange}
              className="inp-light w-full"
              placeholder="Appartement, bâtiment, étage..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="zip" className="block text-sm font-body text-text-secondary mb-1.5">
                Code postal *
              </label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                maxLength={5}
                className={`inp-light w-full ${errors.zip ? 'border-red-500 focus:border-red-500' : ''}`}
                placeholder="75001"
              />
              {errors.zip && (
                <p className="text-red-500 text-xs mt-1">{errors.zip}</p>
              )}
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-body text-text-secondary mb-1.5">
                Ville *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`inp-light w-full ${errors.city ? 'border-red-500 focus:border-red-500' : ''}`}
                placeholder="Paris"
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Note */}
      <div>
        <label htmlFor="note" className="block text-sm font-body text-text-secondary mb-1.5">
          Note pour la livraison (optionnel)
        </label>
        <textarea
          id="note"
          name="note"
          value={formData.note}
          onChange={handleChange}
          rows={3}
          className="inp-light w-full resize-none"
          placeholder="Instructions particulières pour la livraison..."
        />
      </div>

      {/* Remember me for guests */}
      {!user && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-primary/20 text-secondary focus:ring-secondary/50"
          />
          <label htmlFor="rememberMe" className="text-sm font-body text-primary/70">
            Se souvenir de mes informations pour la prochaine fois
          </label>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-secondary w-full flex items-center justify-center gap-3 !py-5 text-base"
      >
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Payer par carte
          </>
        )}
      </button>

      <p className="text-center text-xs text-text-secondary">
        Paiement 100% sécurisé par Stripe
      </p>
    </form>
  );
}
