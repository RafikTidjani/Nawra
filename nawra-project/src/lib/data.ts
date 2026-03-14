// src/lib/data.ts
// Données produits VELORA

import type { Product, Review } from '@/types';

// ── COULEURS ─────────────────────────────────────────────────────────────────
export const COLORS = {
  primary: '#1A1A1A',
  secondary: '#C9A84C',
  accent: '#F5F0E8',
  background: '#FAFAF8',
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
} as const;

// ── TRANSITIONS ──────────────────────────────────────────────────────────────
export const SPRING = 'cubic-bezier(0.16, 1, 0.3, 1)';

// ── PRODUITS (COIFFEUSES) ────────────────────────────────────────────────────
export const PRODUCTS: Product[] = [
  {
    id: 'hollywood-led',
    name: 'Coiffeuse Hollywood LED',
    slug: 'coiffeuse-hollywood-led',
    description: `La coiffeuse Hollywood LED est l'accessoire ultime pour créer votre coin beauté de rêve. Inspirée des loges des stars, elle dispose d'un miroir bordé de lumières LED ajustables qui offrent un éclairage parfait pour votre maquillage.

Le design élégant en blanc laqué s'intègre parfaitement dans tous les intérieurs. Les tiroirs spacieux permettent de ranger tous vos accessoires beauté. Le tabouret rembourré assorti est inclus pour un confort optimal.

Caractéristiques :
- Miroir avec 12 ampoules LED
- 3 modes d'éclairage (chaud, neutre, froid)
- Intensité réglable par variateur tactile
- 2 grands tiroirs + 1 tiroir central
- Tabouret assorti inclus`,
    short_description: 'Miroir LED 12 ampoules, 3 modes d\'éclairage, tabouret inclus',
    price: 189,
    compare_at_price: 249,
    images: [
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&q=80',
      'https://images.unsplash.com/photo-1595428773960-5bea2c885c3a?w=800&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
    ],
    video: undefined,
    category: 'coiffeuse-led',
    tags: ['led', 'hollywood', 'miroir lumineux', 'bestseller'],
    stock_status: 'limited',
    features: [
      'Miroir avec 12 ampoules LED',
      '3 modes d\'éclairage ajustables',
      'Variateur tactile intégré',
      '3 tiroirs de rangement',
      'Tabouret rembourré inclus',
      'Dimensions : 80 x 40 x 140 cm',
    ],
  },
  {
    id: 'scandinave-bois',
    name: 'Coiffeuse Scandinave Bois',
    slug: 'coiffeuse-scandinave-bois',
    description: `La coiffeuse Scandinave en bois naturel apporte une touche de chaleur et d'authenticité à votre chambre. Son design minimaliste et épuré, typique du style nordique, s'harmonise avec tous les décors.

Fabriquée en bois de pin massif avec des pieds en bois de hêtre, cette coiffeuse allie solidité et esthétique. Le miroir rond pivotant permet d'ajuster l'angle selon vos besoins.

Caractéristiques :
- Bois de pin massif certifié FSC
- Miroir rond pivotant Ø 45cm
- 2 tiroirs avec poignées en cuir végétal
- Pieds en bois de hêtre
- Finition mate naturelle`,
    short_description: 'Bois massif, miroir pivotant, design minimaliste nordique',
    price: 159,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
    ],
    video: undefined,
    category: 'coiffeuse-bois',
    tags: ['bois', 'scandinave', 'naturel', 'minimaliste'],
    stock_status: 'in_stock',
    features: [
      'Bois de pin massif certifié FSC',
      'Miroir rond pivotant Ø 45cm',
      '2 tiroirs avec poignées cuir végétal',
      'Pieds en bois de hêtre',
      'Finition mate naturelle',
      'Dimensions : 100 x 45 x 130 cm',
    ],
  },
  {
    id: 'signature-velora',
    name: 'Coiffeuse VELORA Signature',
    slug: 'coiffeuse-velora-signature',
    description: `Notre modèle signature, la coiffeuse VELORA combine le meilleur de nos collections : un miroir LED intelligent avec un design élégant et moderne.

Le grand miroir triptyque avec éclairage LED périmétrique offre une vision à 180° parfaite pour le maquillage. La finition blanc brillant avec détails dorés apporte une touche de luxe accessible.

Caractéristiques :
- Miroir triptyque LED avec variateur
- Finition blanc brillant + accents dorés
- 5 tiroirs dont 1 tiroir à bijoux velours
- Prises USB intégrées pour charger vos appareils
- Tabouret capitonné velours inclus`,
    short_description: 'Miroir triptyque LED, finition dorée, 5 tiroirs, prises USB',
    price: 239,
    compare_at_price: 299,
    images: [
      'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
      'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&q=80',
    ],
    video: undefined,
    category: 'coiffeuse-led',
    tags: ['signature', 'led', 'luxe', 'bestseller', 'triptyque'],
    stock_status: 'limited',
    features: [
      'Miroir triptyque LED périmétrique',
      'Variateur d\'intensité tactile',
      '5 tiroirs dont 1 à bijoux velours',
      'Prises USB intégrées (x2)',
      'Tabouret capitonné velours inclus',
      'Dimensions : 120 x 45 x 145 cm',
    ],
  },
  {
    id: 'compact-rose',
    name: 'Coiffeuse Compact Rose',
    slug: 'coiffeuse-compact-rose',
    description: `La coiffeuse Compact Rose est parfaite pour les espaces réduits. Son format compact n'enlève rien à son charme : le rose poudré et les lignes courbes créent une ambiance douce et féminine.

Idéale pour les petites chambres, studios ou coins dressing, elle offre un espace de rangement optimisé avec un miroir rabattable qui cache un compartiment secret.

Caractéristiques :
- Design compact gain de place
- Miroir rabattable avec rangement intégré
- Finition rose poudré mat
- 2 tiroirs avec poignées dorées
- Pieds en métal doré brossé`,
    short_description: 'Format compact, miroir rabattable, finition rose poudré',
    price: 129,
    images: [
      'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
      'https://images.unsplash.com/photo-1609799517182-23a4655e3418?w=800&q=80',
    ],
    video: undefined,
    category: 'coiffeuse-compact',
    tags: ['compact', 'rose', 'petit espace', 'féminin'],
    stock_status: 'in_stock',
    features: [
      'Format compact gain de place',
      'Miroir rabattable avec rangement secret',
      'Finition rose poudré mat',
      '2 tiroirs avec poignées dorées',
      'Pieds en métal doré brossé',
      'Dimensions : 60 x 40 x 75 cm',
    ],
  },
];

// ── VIDÉOS BACKGROUND (Hero) ─────────────────────────────────────────────────
export const VIDEOS = [
  { id: 1, file: 'background/hero-velora', label: 'Ambiance beauté', color: '#C9A84C' },
] as const;

// ── AVIS CLIENTS ─────────────────────────────────────────────────────────────
export const REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Marie L.',
    rating: 5,
    content: 'J\'adore ma coiffeuse Hollywood ! L\'éclairage LED est parfait pour le maquillage. Livraison rapide et emballage soigné. Je recommande à 100% !',
    date: '2026-02-15',
    verified: true,
    product_id: 'hollywood-led',
  },
  {
    id: '2',
    author: 'Camille D.',
    rating: 5,
    content: 'La Signature est magnifique ! Le miroir triptyque change tout pour se maquiller. Les finitions sont vraiment premium pour ce prix.',
    date: '2026-02-10',
    verified: true,
    product_id: 'signature-velora',
  },
  {
    id: '3',
    author: 'Sarah M.',
    rating: 5,
    content: 'Parfait pour mon petit appartement ! La Compact Rose est trop mignonne et super pratique. Le miroir rabattable c\'est génial.',
    date: '2026-01-28',
    verified: true,
    product_id: 'compact-rose',
  },
];

// ── FAQs ─────────────────────────────────────────────────────────────────────
export const FAQS = [
  {
    q: 'Quels sont les délais de livraison ?',
    a: 'Livraison offerte en 5 à 7 jours ouvrés partout en France métropolitaine. Vous recevrez un email avec le numéro de suivi dès l\'expédition.',
  },
  {
    q: 'Comment retourner un produit ?',
    a: 'Vous disposez de 30 jours pour retourner votre coiffeuse si elle ne vous convient pas. Contactez-nous par email et nous organiserons le retour gratuitement.',
  },
  {
    q: 'Les coiffeuses sont-elles livrées montées ?',
    a: 'Les coiffeuses sont livrées en kit avec une notice de montage détaillée. Le montage prend environ 30 à 45 minutes. Si vous avez des difficultés, notre service client vous accompagne par téléphone.',
  },
  {
    q: 'Quelle est la garantie ?',
    a: 'Toutes nos coiffeuses sont garanties 2 ans contre les défauts de fabrication. Les LED sont garanties 1 an.',
  },
  {
    q: 'Puis-je payer en plusieurs fois ?',
    a: 'Oui ! Nous proposons le paiement en 3x sans frais à partir de 150€ d\'achat via notre partenaire Klarna.',
  },
  {
    q: 'D\'où proviennent vos coiffeuses ?',
    a: 'Nous travaillons avec des fabricants sélectionnés pour leur savoir-faire. Chaque coiffeuse passe un contrôle qualité rigoureux avant expédition.',
  },
];

// ── CROSS-SELL SUGGESTIONS ───────────────────────────────────────────────────
// Map product IDs to suggested product IDs for cross-selling
export const CROSS_SELL_SUGGESTIONS: Record<string, string[]> = {
  'hollywood-led': ['signature-velora', 'compact-rose'],
  'scandinave-bois': ['compact-rose', 'hollywood-led'],
  'signature-velora': ['hollywood-led', 'scandinave-bois'],
  'compact-rose': ['scandinave-bois', 'signature-velora'],
};

export function getCrossSellProducts(productId: string): Product[] {
  const suggestedIds = CROSS_SELL_SUGGESTIONS[productId] || [];
  return suggestedIds
    .map(id => PRODUCTS.find(p => p.id === id))
    .filter((p): p is Product => p !== undefined);
}

// Get related products (excluding the current one)
export function getRelatedProducts(productId: string, limit = 3): Product[] {
  return PRODUCTS
    .filter(p => p.id !== productId)
    .slice(0, limit);
}

// ── HELPERS ──────────────────────────────────────────────────────────────────
export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find(p => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}

export function getBestsellers(): Product[] {
  return PRODUCTS.filter(p => p.tags.includes('bestseller'));
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter(p => p.category === category);
}

// ══════════════════════════════════════════════════════════════════════════════
// LEGACY EXPORTS - Backwards compatibility for old components
// These can be removed once all old Nawra components are updated/deleted
// ══════════════════════════════════════════════════════════════════════════════

// Legacy arabesque pattern (now unused - keeping for compatibility)
export const ARABESQUE_BG = '';

// Legacy themes (for old configurator)
export const DEFAULT_THEMES: Record<string, { name: string; p: string; s: string; a: string; l: string }> = {};
export const THEMES_PANIER: Record<string, { name: string; p: string; s: string; a: string; l: string }> = {};
export const THEMES_BOUQUET: Record<string, { name: string; p: string; s: string; a: string; l: string }> = {};
export const THEMES_CADEAU: Record<string, { name: string; p: string; s: string; a: string; l: string }> = {};

// Legacy sizes (for old configurator)
export const DEFAULT_SIZES: Array<{ id: string; label: string; sub: string; price: number; slots: number; popular?: boolean }> = [];
export const SIZES_PANIER: Array<{ id: string; label: string; sub: string; price: number; slots: number; popular?: boolean }> = [];
export const SIZES_BOUQUET: Array<{ id: string; label: string; sub: string; price: number; slots: number; popular?: boolean }> = [];
export const SIZES_CADEAU: Array<{ id: string; label: string; sub: string; price: number; slots: number; popular?: boolean }> = [];

// Legacy products (for old configurator)
export const DEFAULT_PRODUCTS: Array<{ id: string; cat: string; brand: string; name: string; price: number; themes: string[]; types?: string[]; badge?: string; img?: string }> = [];
export const DEFAULT_BASKETS: Array<{ id: string; name: string; theme: string; size: string; price: number; tag?: string; products: string[]; img?: string }> = [];
export const BOUQUET_OPTIONS: readonly { id: string; name: string; description: string; video: string; color: string; price: number; flowers: string[] }[] = [];

// Legacy helpers
export function getThemeColor(themes: Record<string, unknown>, name: string): { name: string; p: string; s: string; a: string; l: string } {
  return { name: '', p: '', s: '', a: '', l: '' };
}

export function getSlotsForSize(sizes: Array<{ id: string; slots: number }>, sizeId: string): number {
  return sizes.find(s => s.id === sizeId)?.slots || 5;
}

export function getThemesForType(type: 'bouquet' | 'panier' | 'cadeau'): Record<string, { name: string; p: string; s: string; a: string; l: string }> {
  return {};
}

export function getSizesForType(type: 'bouquet' | 'panier' | 'cadeau'): Array<{ id: string; label: string; sub: string; price: number; slots: number; popular?: boolean }> {
  return [];
}

export const PRODUCT_TYPE_CONFIG = {
  bouquet: { title: '', subtitle: '', icon: '', categories: [] as string[], stepTitles: { 1: 'Étape 1', 2: 'Étape 2', 3: 'Étape 3' }, emptyMessage: '' },
  panier: { title: '', subtitle: '', icon: '', categories: [] as string[], stepTitles: { 1: 'Étape 1', 2: 'Étape 2', 3: 'Étape 3' }, emptyMessage: '' },
  cadeau: { title: '', subtitle: '', icon: '', categories: [] as string[], stepTitles: { 1: 'Étape 1', 2: 'Étape 2', 3: 'Étape 3' }, emptyMessage: '' },
};
