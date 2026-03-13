// src/lib/data.ts
// Données par défaut (fallback si Supabase pas encore configuré)
// Pattern arabesque SVG partagé dans tout le projet

import type { Theme, Product, Basket, Size } from '@/types';

// ── ARABESQUE SVG ────────────────────────────────────────────────────────────
const ARABESQUE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><g fill='none' stroke='rgba(201,146,26,0.07)' stroke-width='0.5'><path d='M40 0 L80 40 L40 80 L0 40 Z'/><circle cx='40' cy='40' r='20'/><path d='M40 20 L60 40 L40 60 L20 40 Z'/><circle cx='40' cy='40' r='6'/><path d='M0 0 L20 20 M80 0 L60 20 M0 80 L20 60 M80 80 L60 60'/></g></svg>`;
export const ARABESQUE_BG = `url("data:image/svg+xml,${encodeURIComponent(ARABESQUE_SVG)}")`;

// ── COULEURS ─────────────────────────────────────────────────────────────────
export const COLORS = {
  dark:       '#0D0608',
  dark2:      '#1A0A00',
  cream:      '#FAF3E8',
  gold:       '#C9921A',
  goldLight:  '#F5C842',
  bordeaux:   '#8B1A2F',
  border:     'rgba(201,146,26,0.12)',
} as const;

// ── TRANSITIONS ──────────────────────────────────────────────────────────────
export const SPRING = 'cubic-bezier(0.16, 1, 0.3, 1)';

// ── THÈMES PAR TYPE ──────────────────────────────────────────────────────────

// Thèmes pour les PANIERS (fiançailles)
export const THEMES_PANIER: Record<string, Theme> = {
  'Rose Gold': { name:'Rose Gold', p:'#D4789A', s:'#E8A89C', a:'#C9921A', l:'#fdf0f4' },
  'Émeraude':  { name:'Émeraude',  p:'#1A6B4A', s:'#2D9E6B', a:'#C9921A', l:'#eef7f2' },
  'Bordeaux':  { name:'Bordeaux',  p:'#8B1A2F', s:'#C9404A', a:'#C9921A', l:'#fdf0f2' },
  'Saphir':    { name:'Saphir',    p:'#1B4B8C', s:'#2E6BB5', a:'#C9921A', l:'#eef3fc' },
  'Dorée':     { name:'Dorée',     p:'#C9921A', s:'#E8B84B', a:'#8B1A2F', l:'#fdf6e3' },
};

// Thèmes pour les BOUQUETS
export const THEMES_BOUQUET: Record<string, Theme> = {
  'Romantique':  { name:'Romantique',  p:'#E91E63', s:'#F48FB1', a:'#880E4F', l:'#fce4ec' },
  'Champêtre':   { name:'Champêtre',   p:'#8BC34A', s:'#AED581', a:'#558B2F', l:'#f1f8e9' },
  'Moderne':     { name:'Moderne',     p:'#607D8B', s:'#90A4AE', a:'#263238', l:'#eceff1' },
  'Classique':   { name:'Classique',   p:'#B71C1C', s:'#E57373', a:'#C9921A', l:'#ffebee' },
  'Exotique':    { name:'Exotique',    p:'#FF6F00', s:'#FFB74D', a:'#E65100', l:'#fff3e0' },
  'Pastel':      { name:'Pastel',      p:'#CE93D8', s:'#E1BEE7', a:'#7B1FA2', l:'#f3e5f5' },
};

// Thèmes pour les CADEAUX
export const THEMES_CADEAU: Record<string, Theme> = {
  'Gourmand':    { name:'Gourmand',    p:'#5D4037', s:'#8D6E63', a:'#D4A574', l:'#efebe9' },
  'Bien-être':   { name:'Bien-être',   p:'#00897B', s:'#4DB6AC', a:'#004D40', l:'#e0f2f1' },
  'Luxe':        { name:'Luxe',        p:'#C9921A', s:'#FFD54F', a:'#8B1A2F', l:'#fffde7' },
  'Détente':     { name:'Détente',     p:'#7986CB', s:'#9FA8DA', a:'#303F9F', l:'#e8eaf6' },
  'Célébration': { name:'Célébration', p:'#EC407A', s:'#F48FB1', a:'#AD1457', l:'#fce4ec' },
};

// Thèmes par défaut (tous combinés pour compatibilité)
export const DEFAULT_THEMES: Record<string, Theme> = {
  ...THEMES_PANIER,
  ...THEMES_BOUQUET,
  ...THEMES_CADEAU,
};

// ── TAILLES PAR TYPE ─────────────────────────────────────────────────────────

// Tailles pour les PANIERS (fiançailles)
export const SIZES_PANIER: Size[] = [
  { id:'S',  label:'Petite',  sub:'3 articles',  price:49,  slots:3  },
  { id:'M',  label:'Moyenne', sub:'5 articles',  price:79,  slots:5,  popular:true },
  { id:'L',  label:'Grande',  sub:'8 articles',  price:99,  slots:8  },
  { id:'XL', label:'Royale',  sub:'12 articles', price:149, slots:12 },
];

// Tailles pour les BOUQUETS
export const SIZES_BOUQUET: Size[] = [
  { id:'S',  label:'Bouquet Simple',    sub:'5-7 tiges',   price:35,  slots:2  },
  { id:'M',  label:'Bouquet Élégant',   sub:'12-15 tiges', price:55,  slots:4, popular:true },
  { id:'L',  label:'Bouquet Majestueux', sub:'20-25 tiges', price:85,  slots:6  },
  { id:'XL', label:'Composition Florale', sub:'30+ tiges',  price:120, slots:8  },
];

// Tailles pour les CADEAUX
export const SIZES_CADEAU: Size[] = [
  { id:'S',  label:'Coffret Découverte', sub:'2-3 articles', price:45,  slots:3  },
  { id:'M',  label:'Coffret Plaisir',    sub:'4-5 articles', price:75,  slots:5, popular:true },
  { id:'L',  label:'Coffret Prestige',   sub:'6-8 articles', price:110, slots:8  },
  { id:'XL', label:'Coffret Royal',      sub:'10+ articles', price:160, slots:12 },
];

// Tailles par défaut (paniers pour compatibilité)
export const DEFAULT_SIZES: Size[] = SIZES_PANIER;

// ── PRODUITS ─────────────────────────────────────────────────────────────────
export const DEFAULT_PRODUCTS: Product[] = [
  // Parfums (panier, cadeau)
  { id:'p1',  cat:'parfum', brand:'Lancôme',           name:'La Vie est Belle',     price:89,  themes:['Rose Gold','Bordeaux','Dorée'],        types:['panier','cadeau'], badge:'Bestseller' },
  { id:'p2',  cat:'parfum', brand:'YSL',               name:'Black Opium',          price:99,  themes:['Bordeaux','Saphir'],                   types:['panier','cadeau'], badge:'Iconique'   },
  { id:'p3',  cat:'parfum', brand:'Dior',              name:'Miss Dior Blooming',   price:115, themes:['Rose Gold','Émeraude'],                types:['panier','cadeau'], badge:'Luxe'       },
  { id:'p4',  cat:'parfum', brand:'Chanel',            name:'Chance Eau Tendre',    price:125, themes:['Rose Gold','Saphir','Dorée'],          types:['panier','cadeau'], badge:'Prestige'   },
  { id:'p5',  cat:'parfum', brand:'Guerlain',          name:'Mon Guerlain',         price:105, themes:['Bordeaux','Dorée'],                    types:['panier','cadeau']                     },

  // Maquillage (panier, cadeau)
  { id:'p6',  cat:'makeup', brand:'Charlotte Tilbury', name:'Palette Instant Eye',  price:65,  themes:['Rose Gold','Bordeaux','Dorée'],        types:['panier','cadeau'], badge:'Must-have'  },
  { id:'p7',  cat:'makeup', brand:'NARS',              name:'Coffret Orgasm',       price:72,  themes:['Rose Gold','Dorée'],                   types:['panier','cadeau'], badge:'Iconique'   },
  { id:'p8',  cat:'makeup', brand:'Urban Decay',       name:'Naked Palette',        price:58,  themes:['Bordeaux','Émeraude','Saphir'],        types:['panier','cadeau'], badge:'Culte'      },
  { id:'p9',  cat:'makeup', brand:'Huda Beauty',       name:'Desert Dusk',          price:68,  themes:['Émeraude','Bordeaux','Dorée'],         types:['panier','cadeau'], badge:'Orientale'  },

  // Soins (panier, cadeau)
  { id:'p10', cat:'soin',   brand:"L'Occitane",        name:'Set Mains Rose',       price:42,  themes:['Rose Gold','Émeraude'],                types:['panier','cadeau']                     },
  { id:'p11', cat:'soin',   brand:'Clarins',           name:'Huile Corps Sèche',    price:55,  themes:['Émeraude','Dorée'],                    types:['panier','cadeau'], badge:'Bestseller' },
  { id:'p12', cat:'soin',   brand:'Nuxe',              name:'Huile Prodigieuse Or', price:38,  themes:['Dorée','Rose Gold'],                   types:['panier','cadeau']                     },
  { id:'p13', cat:'soin',   brand:'Rituals',           name:'Ritual of Sakura',     price:48,  themes:['Rose Gold','Saphir'],                  types:['panier','cadeau'], badge:'Luxe'       },

  // Bijoux (panier, cadeau)
  { id:'p14', cat:'bijou',  brand:'Pandora',           name:'Bague Solitaire',      price:65,  themes:['Rose Gold','Saphir'],                  types:['panier','cadeau'], badge:'Classique'  },
  { id:'p15', cat:'bijou',  brand:'Berber Arts',       name:'Khamsa Argent',        price:38,  themes:['Bordeaux','Émeraude','Dorée'],         types:['panier','cadeau'], badge:'Traditionnel'},
  { id:'p16', cat:'bijou',  brand:'Swarovski',         name:'Collier Crystale',     price:78,  themes:['Rose Gold','Saphir'],                  types:['panier','cadeau'], badge:'Prestige'   },
  { id:'p17', cat:'bijou',  brand:'Cartier',           name:'Bracelet Love',        price:250, themes:['Rose Gold','Dorée'],                   types:['panier','cadeau'], badge:'Luxe'       },

  // Fleurs (bouquet)
  { id:'f1',  cat:'fleur',  brand:'Roses',             name:'Roses Rouges (12)',    price:45,  themes:['Bordeaux','Rose Gold'],                types:['bouquet'],         badge:'Classique'  },
  { id:'f2',  cat:'fleur',  brand:'Roses',             name:'Roses Blanches (12)',  price:45,  themes:['Rose Gold','Saphir'],                  types:['bouquet']                             },
  { id:'f3',  cat:'fleur',  brand:'Roses',             name:'Roses Éternelles',     price:89,  themes:['Rose Gold','Bordeaux','Dorée'],        types:['bouquet'],         badge:'Premium'    },
  { id:'f4',  cat:'fleur',  brand:'Pivoines',          name:'Bouquet Pivoines',     price:65,  themes:['Rose Gold','Émeraude'],                types:['bouquet'],         badge:'Saison'     },
  { id:'f5',  cat:'fleur',  brand:'Lys',               name:'Lys Blancs (6)',       price:55,  themes:['Rose Gold','Saphir','Dorée'],          types:['bouquet'],         badge:'Élégant'    },
  { id:'f6',  cat:'fleur',  brand:'Tulipes',           name:'Tulipes Mixtes (20)',  price:38,  themes:['Rose Gold','Émeraude','Saphir'],       types:['bouquet']                             },
  { id:'f7',  cat:'fleur',  brand:'Orchidées',         name:'Orchidée Phalaenopsis',price:75,  themes:['Rose Gold','Émeraude','Saphir'],       types:['bouquet'],         badge:'Prestige'   },
  { id:'f8',  cat:'fleur',  brand:'Hortensia',         name:'Hortensia Bleu',       price:48,  themes:['Saphir','Émeraude'],                   types:['bouquet']                             },

  // Chocolats (cadeau, panier)
  { id:'c1',  cat:'chocolat', brand:'Godiva',          name:'Coffret Prestige',     price:65,  themes:['Dorée','Bordeaux'],                    types:['cadeau','panier'], badge:'Luxe'       },
  { id:'c2',  cat:'chocolat', brand:'La Maison du Chocolat', name:'Écrin 24 pièces',price:58, themes:['Dorée','Rose Gold'],                   types:['cadeau','panier'], badge:'Artisanal'  },
  { id:'c3',  cat:'chocolat', brand:'Pierre Marcolini', name:'Malline Découverte', price:72,  themes:['Bordeaux','Émeraude'],                 types:['cadeau','panier'], badge:'Belge'      },
  { id:'c4',  cat:'chocolat', brand:'Fauchon',         name:'Assortiment Paris',    price:55,  themes:['Rose Gold','Dorée'],                   types:['cadeau']                              },

  // Accessoires (cadeau)
  { id:'a1',  cat:'accessoire', brand:'Hermès',        name:'Carré de Soie',        price:350, themes:['Rose Gold','Bordeaux','Dorée'],        types:['cadeau','panier'], badge:'Iconique'   },
  { id:'a2',  cat:'accessoire', brand:'Louis Vuitton', name:'Porte-Clés LV',        price:195, themes:['Dorée','Saphir'],                      types:['cadeau'],          badge:'Luxe'       },
  { id:'a3',  cat:'accessoire', brand:'Diptyque',      name:'Bougie Figuier',       price:68,  themes:['Émeraude','Rose Gold'],                types:['cadeau','panier'], badge:'Bestseller' },
  { id:'a4',  cat:'accessoire', brand:'Jo Malone',     name:'Set Mini Bougies',     price:85,  themes:['Rose Gold','Saphir'],                  types:['cadeau']                              },
];

// ── CORBEILLES ───────────────────────────────────────────────────────────────
export const DEFAULT_BASKETS: Basket[] = [
  { id:'b1', name:'Sultane Dorée',   theme:'Dorée',    size:'L', price:349, tag:'Bestseller', products:['p4','p6','p14','p13'] },
  { id:'b2', name:'Fleurs de Rose',  theme:'Rose Gold', size:'M', price:199, tag:'Romantique', products:['p1','p7','p12','p16'] },
  { id:'b3', name:'Émeraude Royale', theme:'Émeraude', size:'L', price:289, tag:'Prestige',   products:['p3','p8','p11','p15'] },
  { id:'b4', name:'Nuit de Saphir',  theme:'Saphir',   size:'M', price:249, tag:'Nouveau',    products:['p2','p7','p13','p14'] },
];

// ── VIDÉOS BACKGROUND (Hero) ─────────────────────────────────────────────────
// Vidéos d'ambiance pour le Hero - dans /public/videos/background/
export const VIDEOS = [
  { id:1, file:'background/veo-studio-creation-1', label:'Ambiance 1', color:'#C9921A' },
  { id:2, file:'background/veo-studio-creation-2', label:'Ambiance 2', color:'#D4789A' },
  { id:3, file:'background/veo-studio-creation-3', label:'Ambiance 3', color:'#1A6B4A' },
  { id:4, file:'background/veo-studio-creation-4', label:'Ambiance 4', color:'#8B1A2F' },
] as const;

// ── BOUQUETS DISPONIBLES ─────────────────────────────────────────────────────
// Bouquets avec aperçu vidéo - dans /public/videos/bouquet/
export const BOUQUET_OPTIONS = [
  {
    id: 'rose-gold',
    name: 'Romance Rose',
    description: 'Un bouquet délicat aux teintes roses et dorées, parfait pour déclarer votre amour.',
    video: 'bouquet/bouquet-rose-gold',
    color: '#D4789A',
    price: 45,
    flowers: ['Roses', 'Pivoines', 'Eucalyptus'],
  },
  {
    id: 'doree',
    name: 'Éclat Doré',
    description: 'Luxueux et chaleureux, ce bouquet aux tons dorés illuminera tous vos moments.',
    video: 'bouquet/bouquet-doree',
    color: '#C9921A',
    price: 55,
    flowers: ['Roses jaunes', 'Renoncules', 'Mimosa'],
  },
  {
    id: 'emeraude',
    name: 'Jardin d\'Émeraude',
    description: 'Fraîcheur et élégance avec ce bouquet aux verts profonds et touches blanches.',
    video: 'bouquet/bouquet-emeraude',
    color: '#1A6B4A',
    price: 50,
    flowers: ['Lys', 'Fougères', 'Roses blanches'],
  },
] as const;

// ── FAQs ─────────────────────────────────────────────────────────────────────
export const FAQS = [
  { q:'Quels types de créations proposez-vous ?',  a:'Nous proposons trois types : les Bouquets (compositions florales fraîches), les Paniers de fiançailles (corbeilles avec parfums, bijoux, maquillage...), et les Cadeaux personnalisés (coffrets sur mesure pour toutes occasions).' },
  { q:'Qu\'est-ce qu\'un panier de fiançailles ?', a:'C\'est un cadeau traditionnel offert par le fiancé à sa future épouse. Il contient des produits de luxe : parfums, maquillage, bijoux, soins, chocolats... choisis avec soin pour célébrer ce moment unique.' },
  { q:'Quel délai de livraison ?',             a:'48h à 72h en Île-de-France, Suisse et Allemagne. Livraison soignée dans un emballage cadeau luxueux.' },
  { q:'Puis-je tout personnaliser ?',          a:'Absolument ! Notre configurateur vous permet de choisir le type de création, le thème, la taille, et de sélectionner chaque produit parmi les plus grandes marques.' },
  { q:'Les produits sont-ils authentiques ?',  a:'100% authentiques. Nous nous approvisionnons directement auprès des distributeurs officiels : Dior, Chanel, YSL, Lancôme, Cartier, Godiva...' },
  { q:'Pour quel budget ?',                    a:'Nos créations démarrent à 38€ (bouquet simple) jusqu\'à 500€+ pour un panier Royale complet avec bijoux et parfums prestige.' },
  { q:'Livrez-vous en dehors de l\'IDF ?',     a:'Oui ! Nous livrons en France métropolitaine, Suisse et Allemagne. Contactez-nous via WhatsApp pour les autres destinations.' },
];

// ── HELPERS ──────────────────────────────────────────────────────────────────
export function getThemeColor(themes: Record<string, Theme>, name: string): Theme {
  return themes[name] || DEFAULT_THEMES['Dorée'];
}

export function getSlotsForSize(sizes: Size[], sizeId: string): number {
  return sizes.find(s => s.id === sizeId)?.slots || 5;
}

// Récupère les thèmes pour un type de produit
export function getThemesForType(type: 'bouquet' | 'panier' | 'cadeau'): Record<string, Theme> {
  switch (type) {
    case 'bouquet': return THEMES_BOUQUET;
    case 'panier':  return THEMES_PANIER;
    case 'cadeau':  return THEMES_CADEAU;
    default:        return THEMES_PANIER;
  }
}

// Récupère les tailles pour un type de produit
export function getSizesForType(type: 'bouquet' | 'panier' | 'cadeau'): Size[] {
  switch (type) {
    case 'bouquet': return SIZES_BOUQUET;
    case 'panier':  return SIZES_PANIER;
    case 'cadeau':  return SIZES_CADEAU;
    default:        return SIZES_PANIER;
  }
}

// Configuration par type de produit
export const PRODUCT_TYPE_CONFIG = {
  bouquet: {
    title: 'Votre Bouquet',
    subtitle: 'Composez votre arrangement floral',
    icon: '🌸',
    categories: ['fleur'] as const,
    stepTitles: {
      1: 'Style & Taille',
      2: 'Vos Fleurs',
      3: 'Livraison',
    },
    emptyMessage: 'Ajoutez des fleurs à votre composition',
  },
  panier: {
    title: 'Votre Panier',
    subtitle: 'Composez votre corbeille de fiançailles',
    icon: '🎁',
    categories: ['parfum', 'makeup', 'soin', 'bijou'] as const,
    stepTitles: {
      1: 'Thème & Taille',
      2: 'Vos Produits',
      3: 'Finalisation',
    },
    emptyMessage: 'Ajoutez des produits à votre corbeille',
  },
  cadeau: {
    title: 'Votre Cadeau',
    subtitle: 'Créez un coffret personnalisé',
    icon: '✨',
    categories: ['chocolat', 'accessoire', 'parfum', 'soin'] as const,
    stepTitles: {
      1: 'Ambiance & Format',
      2: 'Vos Articles',
      3: 'Personnalisation',
    },
    emptyMessage: 'Ajoutez des articles à votre coffret',
  },
} as const;
