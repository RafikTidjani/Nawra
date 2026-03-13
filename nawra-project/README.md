# نـوّرة Nawra

Site e-commerce de corbeilles de fiançailles personnalisées.

---

## Démarrage rapide avec Claude Code

### 1. Installer Claude Code
```bash
npm install -g @anthropic-ai/claude-code
```

### 2. Cloner / ouvrir le projet
```bash
cd nawra
claude   # lance Claude Code dans ce dossier
```

> Claude Code va automatiquement lire `CLAUDE.md` en premier.  
> Il connaîtra toute l'architecture du projet avant de toucher au code.

### 3. Installer les dépendances
```bash
npm install
```

### 4. Configurer les variables d'environnement
```bash
cp .env.example .env.local
# Remplir les valeurs dans .env.local
```

### 5. Créer la base de données Supabase
1. Aller sur [supabase.com](https://supabase.com) → créer un projet
2. SQL Editor → coller le contenu de `supabase/schema.sql` → Run
3. Copier les clés API dans `.env.local`

### 6. Configurer Stripe
1. [dashboard.stripe.com](https://dashboard.stripe.com) → Developers → API Keys
2. Copier `pk_test_...` et `sk_test_...` dans `.env.local`
3. Pour les webhooks en local : `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### 7. Lancer en dev
```bash
npm run dev
# → http://localhost:3000
```

---

## Commandes Claude Code utiles

Une fois dans Claude Code (`claude`), tu peux lui dire :

```
# Implémenter le formulaire de commande dans StepSummary
"Ajoute le formulaire client dans le step 3 du configurateur avec les champs : 
nom, email, téléphone, adresse, ville, code postal, message optionnel, date souhaitée.
Connecte-le à l'API /api/checkout."

# Connecter Supabase
"Connecte la home page à Supabase pour charger les thèmes, corbeilles et produits 
depuis la BDD au lieu des données statiques dans lib/data.ts"

# Ajouter le bouton WhatsApp
"Ajoute un bouton WhatsApp flottant en bas à droite avec le numéro +33XXXXXXXXX"

# Page de confirmation
"Crée la page /order/success qui récupère la session Stripe et affiche la confirmation"
```

---

## Structure MVP

```
✅ Home page          → src/app/page.tsx (à créer depuis nawra-home-v2.jsx)
✅ Configurateur      → src/app/configure/page.tsx
✅ Admin              → src/app/admin/page.tsx
✅ API Checkout       → src/app/api/checkout/route.ts
✅ API Webhook        → src/app/api/webhooks/stripe/route.ts
✅ Types              → src/types/index.ts
✅ Data               → src/lib/data.ts
✅ Supabase schema    → supabase/schema.sql

❌ src/app/page.tsx   → Convertir nawra-home-v2.jsx en Next.js
❌ Formulaire client  → Dans src/components/configurator/StepSummary.tsx
❌ Page succès        → src/app/order/success/page.tsx
❌ Auth admin simple  → middleware.ts
```

---

## Déploiement Vercel

```bash
# Push sur GitHub, puis :
vercel deploy

# Ajouter les env vars dans Vercel Dashboard
# Ajouter le webhook Stripe avec l'URL de production
```

---

## Stack
- **Next.js 14** App Router
- **Supabase** BDD + Storage
- **Stripe** Paiement
- **Resend** Emails
- **Vercel** Déploiement
