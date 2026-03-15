// src/types/index.ts
// Types partagés dans tout le projet VELORA

// Statut de stock
export type StockStatus = 'in_stock' | 'out_of_stock' | 'limited';

// Catégorie de produit
export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  sortOrder: number;
  isActive: boolean;
  productCount?: number; // Pour l'affichage dans l'admin
}

// Produit (coiffeuse)
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  compare_at_price?: number;
  images: string[];
  video?: string;
  category: string;
  tags: string[];
  stock_status: StockStatus;
  aliexpress_url?: string; // interne uniquement
  features: string[];
}

// Item dans le panier
export interface CartItem {
  product: Product;
  quantity: number;
}

// État du panier
export interface CartState {
  items: CartItem[];
  total: number;
}

// Client
export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  message?: string;
}

// Commande
export interface Order {
  id?: string;
  products: string[];  // ids des produits
  total: number;
  customer: OrderCustomer;
  status: 'pending' | 'paid' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  stripeSessionId?: string;
  stripePaymentIntent?: string;
  createdAt?: string;
  updatedAt?: string;
  // Legacy fields for configurator compatibility
  theme?: string;
  size?: string;
  deliveryDate?: string;
  productType?: string;
}

// Réponse API générique
export interface ApiResponse<T = void> {
  data?: T;
  error?: string;
}

// Pack/Bundle (pour le configurateur)
export interface Pack {
  id: string;
  name: string;
  description: string;
  products: string[]; // ids des produits inclus
  price: number;
  compare_at_price?: number;
  badge?: string;
}

// Avis client
export interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  date: string;
  verified: boolean;
  product_id?: string;
}

// ══════════════════════════════════════════════════════════════════════════════
// LEGACY TYPES - Backwards compatibility for old Nawra components
// These can be removed once all old components are updated/deleted
// ══════════════════════════════════════════════════════════════════════════════

// Type de création (legacy)
export type ProductType = 'bouquet' | 'panier' | 'cadeau';

// Legacy Product interface (for configurator)
export interface LegacyProduct {
  id: string;
  cat: string;
  brand: string;
  name: string;
  price: number;
  themes: string[];
  types?: string[];
  badge?: string;
  img?: string;
}

// Legacy Theme interface
export interface Theme {
  id?: string;
  name: string;
  p: string;   // couleur principale
  s: string;   // secondaire
  a: string;   // accent
  l: string;   // fond clair
}

// Legacy Size interface
export interface Size {
  id: string;
  label: string;
  sub: string;
  price: number;
  slots: number;
  popular?: boolean;
}

// Legacy Basket interface
export interface Basket {
  id: string;
  name: string;
  theme: string;
  size: string;
  price: number;
  tag?: string;
  products: string[];
  img?: string;
}

// État du configurateur (legacy)
export interface ConfigState {
  productType: ProductType;
  theme: string;
  size: string;
  items: string[];
  step: 1 | 2 | 3;
}
