// src/components/checkout/CheckoutForm.tsx
'use client';

import { useState } from 'react';

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

export default function CheckoutForm({ onSubmit, isSubmitting }: CheckoutFormProps) {
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
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
