# VELORA

Site e-commerce de coiffeuses premium pour femmes 18-30 ans.
Marché : France métropolitaine.
Concept : "Le Princess Room accessible" — univers luxe, prix 2x moins chers (150€–250€)

---

## Stack technique

- **Framework** : Next.js 14 (App Router)
- **Language** : TypeScript
- **Styles** : Tailwind CSS + CSS Modules pour les animations complexes
- **BDD** : Supabase (PostgreSQL)
- **Paiement** : Stripe
- **Emails** : Resend
- **Déploiement** : Vercel

---

## Structure du projet

```
velora/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Home page
│   │   ├── layout.tsx          # Root layout (fonts, metadata)
│   │   ├── collections/
│   │   │   └── page.tsx        # Catalogue produits
│   │   ├── products/
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # Page produit dynamique
│   │   ├── cart/
│   │   │   └── page.tsx        # Page panier
│   │   ├── configure/
│   │   │   └── page.tsx        # Configurateur packs
│   │   ├── admin/
│   │   │   └── page.tsx        # Panel admin
│   │   └── api/
│   │       ├── orders/route.ts    # POST /api/orders
│   │       ├── checkout/route.ts  # POST /api/checkout (Stripe)
│   │       └── webhooks/stripe/route.ts
│   │
│   ├── components/
│   │   ├── ui/                 # Composants atomiques réutilisables
│   │   │   ├── Logo.tsx
│   │   │   └── ...
│   │   ├── sections/           # Sections de la home
│   │   │   ├── Hero.tsx
│   │   │   ├── BrandPromise.tsx
│   │   │   ├── Bestsellers.tsx
│   │   │   ├── UniversSection.tsx
│   │   │   ├── ReviewsSection.tsx
│   │   │   ├── FooterVelora.tsx
│   │   │   └── ...
│   │   ├── ProductCard.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── AddToCartButton.tsx
│   │   ├── CartDrawer.tsx
│   │   └── admin/              # Composants admin
│   │
│   ├── lib/
│   │   ├── supabase.ts         # Client Supabase
│   │   ├── stripe.ts           # Client Stripe
│   │   ├── resend.ts           # Client Resend (emails)
│   │   └── data.ts             # Products, videos, etc.
│   │
│   ├── types/
│   │   └── index.ts            # Types TypeScript partagés
│   │
│   └── hooks/
│       ├── useCart.ts          # Hook panier (localStorage)
│       └── ...
│
├── public/
│   ├── videos/
│   │   ├── background/         # Vidéos hero
│   │   └── products/           # Vidéos showcase produits
│   └── images/
│
├── CLAUDE.md                   # CE FICHIER — toujours lire en premier
├── .env.local                  # Variables d'env (ne jamais committer)
├── .env.example                # Template des variables d'env
└── supabase/
    └── schema.sql              # Schéma BDD à exécuter dans Supabase
```

---

## Design system

### Couleurs
```
--primary:        #1A1A1A    (texte, backgrounds dark)
--secondary:      #C9A84C    (accent doré)
--accent:         #F5F0E8    (fond clair sections)
--background:     #FAFAF8    (fond principal)
--text:           #1A1A1A    (texte principal)
--text-secondary: #6B6B6B    (texte secondaire)
```

### Fonts (Google Fonts — déjà dans layout.tsx)
- **Cormorant Garamond** (400, 500, 600, 700) : titres
- **DM Sans** (400, 500, 700) : body, nav, labels

### Conventions CSS
- `border-radius: 8px` sur les boutons/cards modernes
- Transitions : `cubic-bezier(0.16, 1, 0.3, 1)`
- Style épuré et premium, pas de grain overlay

---

## Types TypeScript

```typescript
// src/types/index.ts

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  compare_at_price?: number;
  images: string[];
  category: string;
  tags: string[];
  stock_status: 'in_stock' | 'out_of_stock' | 'limited';
  aliexpress_url?: string; // interne
  features: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id?: string;
  products: string[];
  total: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
    message?: string;
  };
  status: 'pending' | 'paid' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  stripeSessionId?: string;
  createdAt?: string;
}
```

---

## Variables d'environnement requises

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend (emails)
RESEND_API_KEY=
RESEND_FROM_EMAIL=contact@velorabeauty.fr

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_SECRET=  # mot de passe admin simple pour MVP
```

---

## Commandes utiles

```bash
npm run dev          # Dev server localhost:3000
npm run build        # Build production
npm run lint         # ESLint
```

---

## Produits (Coiffeuses)

1. **Coiffeuse Hollywood LED** — 189€ (compare: 249€) — limited
2. **Coiffeuse Scandinave Bois** — 159€ — in_stock
3. **Coiffeuse VELORA Signature** — 239€ (compare: 299€) — limited
4. **Coiffeuse Compact Rose** — 129€ — in_stock

---

## Règles pour Claude Code

1. **Toujours typer** — pas de `any`, utiliser les types de `src/types/index.ts`
2. **Server Components par défaut** — `'use client'` uniquement si nécessaire (hooks, events)
3. **Pas de librairies UI** — zéro shadcn, zéro MUI, styles inline ou Tailwind uniquement
4. **Fonts via next/font** — pas de @import Google Fonts direct
5. **Images via next/image** — pas de balise `<img>` directe
6. **Env vars** — jamais hardcoder les clés, toujours via `process.env`

---

## Contact / Notes

- Livraison : France métropolitaine, offerte
- Paiement : CB uniquement via Stripe
- Admin : protégé par variable d'env `ADMIN_SECRET`
- Vidéos : format MP4, aspect ratio 9:16, déposées dans `/public/videos/`
