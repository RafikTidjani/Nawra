# Nawra — نـوّرة

Site e-commerce de corbeilles de fiançailles personnalisées.
Marché : familles franco-maghrébines en France,suisse,allemagne.

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
nawra/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Home page
│   │   ├── layout.tsx          # Root layout (fonts, metadata)
│   │   ├── configure/
│   │   │   └── page.tsx        # Configurateur 3 steps
│   │   ├── admin/
│   │   │   └── page.tsx        # Panel admin
│   │   └── api/
│   │       ├── orders/route.ts    # POST /api/orders
│   │       ├── checkout/route.ts  # POST /api/checkout (Stripe)
│   │       └── webhooks/stripe/route.ts
│   │
│   ├── components/
│   │   ├── ui/                 # Composants atomiques réutilisables
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Badge.tsx
│   │   ├── sections/           # Sections de la home
│   │   │   ├── Hero.tsx
│   │   │   ├── ThemesGrid.tsx
│   │   │   ├── BasketCatalogue.tsx
│   │   │   ├── VideoSection.tsx
│   │   │   ├── SplitEmail.tsx
│   │   │   ├── FaqSection.tsx
│   │   │   └── Footer.tsx
│   │   ├── configurator/       # Composants du configurateur
│   │   │   ├── StepTheme.tsx
│   │   │   ├── StepProducts.tsx
│   │   │   ├── StepSummary.tsx
│   │   │   └── SidePreview.tsx
│   │   └── admin/              # Composants admin
│   │       ├── TabBaskets.tsx
│   │       ├── TabProducts.tsx
│   │       ├── TabThemes.tsx
│   │       └── TabSizes.tsx
│   │
│   ├── lib/
│   │   ├── supabase.ts         # Client Supabase
│   │   ├── stripe.ts           # Client Stripe
│   │   ├── resend.ts           # Client Resend (emails)
│   │   └── data.ts             # DEFAULT_THEMES, DEFAULT_PRODUCTS, etc.
│   │
│   ├── types/
│   │   └── index.ts            # Types TypeScript partagés
│   │
│   └── hooks/
│       ├── useScrollY.ts
│       └── useWindowWidth.ts
│
├── public/
│   ├── videos/                 # Vidéos 360° bouquets
│   │   ├── bouquet-rose-gold.mp4
│   │   ├── bouquet-doree.mp4     
│   │   └── bouquet-emeraude.mp4
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
--dark:      #0D0608    (background hero/sections dark)
--dark-2:    #1A0A00    (navbar admin, footer)
--cream:     #FAF3E8    (background principal clair)
--gold:      #C9921A    (accent principal)
--gold-light:#F5C842    (or clair, logo)
--bordeaux:  #8B1A2F    (CTA primary)
```

### Fonts (Google Fonts — déjà dans layout.tsx)
- **Amiri** : titres, prix, logo arabe
- **Cormorant Garamond** : body, nav, labels

### Conventions CSS
- `border-radius: 2px` sur tous les boutons/cards (jamais de pills)
- Transitions : `cubic-bezier(0.16, 1, 0.3, 1)`
- Pattern arabesque SVG en background sur sections dark
- Grain overlay fixe sur toute la page (z-index 9999)

---

## Types TypeScript

```typescript
// src/types/index.ts

export interface Theme {
  name: string;
  p: string;   // couleur principale
  s: string;   // secondaire
  a: string;   // accent
  l: string;   // fond clair
}

export interface Product {
  id: string;
  cat: 'parfum' | 'makeup' | 'soin' | 'bijou';
  brand: string;
  name: string;
  price: number;
  themes: string[];  // noms des thèmes compatibles
  badge?: string;
  img?: string;
}

export interface Basket {
  id: string;
  name: string;
  theme: string;
  size: 'S' | 'M' | 'L' | 'XL';
  price: number;
  tag?: string;
  products: string[];  // ids de produits
  img?: string;
}

export interface Size {
  id: string;
  label: string;
  sub: string;
  price: number;
  popular?: boolean;
  slots: number;  // nombre d'articles max
}

export interface Order {
  id?: string;
  theme: string;
  size: string;
  products: string[];
  total: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
  };
  deliveryDate?: string;
  status: 'pending' | 'paid' | 'preparing' | 'delivered';
  stripeSessionId?: string;
  createdAt?: string;
}
```

---

## Base de données Supabase

Tables à créer (voir supabase/schema.sql) :
- `themes` — thèmes disponibles
- `products` — catalogue produits
- `baskets` — corbeilles prêtes
- `sizes` — tailles disponibles
- `orders` — commandes clients

RLS (Row Level Security) :
- `orders` : lecture/écriture publique pour création, lecture admin uniquement
- `themes/products/baskets/sizes` : lecture publique, écriture admin uniquement

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
RESEND_FROM_EMAIL=nawra@nawra.fr

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
npx supabase start   # Supabase local (si installé)
```

---

## MVP — Fonctionnalités à implémenter

### ✅ Fait (composants React prêts)
- [ ] Home page complète (Hero, Thèmes, Catalogue, Vidéos, Split email, FAQ, Footer)
- [ ] Configurateur 3 steps avec sidebar preview
- [ ] Admin panel (Corbeilles, Produits, Thèmes, Tailles)
- [ ] Design system complet (couleurs, fonts, animations)

### ❌ À faire en priorité
1. **Connexion Supabase** — charger/sauvegarder les données depuis la BDD
2. **Formulaire commande** — Step 3 du configurateur → nom, email, téléphone, adresse, date souhaitée
3. **Checkout Stripe** — POST /api/checkout → Stripe Checkout Session
4. **Webhook Stripe** — confirmer paiement → update order status
5. **Email confirmation** — Resend → email client + email admin
6. **Page confirmation** — /order/[id] après paiement réussi
- Page /admin protégée par mot de passe simple (MVP)


### 🟡 Nice to have MVP
- WhatsApp button flottant (rapide)

- SEO meta tags + Open Graph

---

## Règles pour Claude Code

1. **Toujours typer** — pas de `any`, utiliser les types de `src/types/index.ts`
2. **Server Components par défaut** — `'use client'` uniquement si nécessaire (hooks, events)
3. **Pas de librairies UI** — zéro shadcn, zéro MUI, styles inline ou Tailwind uniquement
4. **Fonts via next/font** — pas de @import Google Fonts direct
5. **Images via next/image** — pas de balise `<img>` directe
6. **Env vars** — jamais hardcoder les clés, toujours via `process.env`
7. **Composants atomiques** — garder les composants `src/components/ui/` purs et réutilisables
8. **Pattern arabesque** — le SVG est dans `src/lib/data.ts` comme constante, importer depuis là

---

## Contact / Notes

- Livraison :
- Paiement : CB uniquement via Stripe 
- Admin : protégé par variable d'env `ADMIN_SECRET`
- Vidéos : format MP4, aspect ratio 9:16, déposées dans `/public/videos/`
