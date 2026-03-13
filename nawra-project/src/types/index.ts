// src/types/index.ts
// Types partagés dans tout le projet Nawra

// Type de création
export type ProductType = 'bouquet' | 'panier' | 'cadeau';

export interface Theme {
  id?: string;
  name: string;
  p: string;   // couleur principale
  s: string;   // secondaire
  a: string;   // accent
  l: string;   // fond clair (configurateur step 1)
}

export interface Product {
  id: string;
  cat: 'parfum' | 'makeup' | 'soin' | 'bijou' | 'fleur' | 'chocolat' | 'accessoire';
  brand: string;
  name: string;
  price: number;
  themes: string[];   // noms des thèmes compatibles
  types?: ProductType[]; // types de création compatibles (bouquet, panier, cadeau)
  badge?: string;
  img?: string;
}

export interface Size {
  id: string;          // 'S' | 'M' | 'L' | 'XL'
  label: string;       // 'Petite' | 'Moyenne' etc.
  sub: string;         // '3 articles' etc.
  price: number;
  slots: number;       // nombre max d'articles
  popular?: boolean;
}

export interface Basket {
  id: string;
  name: string;
  theme: string;       // nom du thème
  size: string;        // id de la taille
  price: number;
  tag?: string;        // 'Bestseller', 'Nouveau'...
  products: string[];  // ids de produits inclus
  img?: string;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  message?: string;
}

export interface Order {
  id?: string;
  productType?: ProductType;
  theme: string;
  size: string;
  products: string[];  // ids
  total: number;
  customer: OrderCustomer;
  deliveryDate?: string;
  status: 'pending' | 'paid' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  stripeSessionId?: string;
  stripePaymentIntent?: string;
  createdAt?: string;
  updatedAt?: string;
}

// État du configurateur (client-side)
export interface ConfigState {
  productType: ProductType;
  theme: string;
  size: string;
  items: string[];   // ids produits sélectionnés
  step: 1 | 2 | 3;
}

// Réponse API générique
export interface ApiResponse<T = void> {
  data?: T;
  error?: string;
}
