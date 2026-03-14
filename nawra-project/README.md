# VELORA

Site e-commerce de coiffeuses premium pour femmes.

---

## Démarrage rapide

### 1. Cloner / ouvrir le projet
```bash
cd velora
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer les variables d'environnement
```bash
cp .env.example .env.local
# Remplir les valeurs dans .env.local
```

### 4. Créer la base de données Supabase
1. Aller sur [supabase.com](https://supabase.com) → créer un projet
2. SQL Editor → coller le contenu de `supabase/schema.sql` → Run
3. Copier les clés API dans `.env.local`

### 5. Configurer Stripe
1. [dashboard.stripe.com](https://dashboard.stripe.com) → Developers → API Keys
2. Copier `pk_test_...` et `sk_test_...` dans `.env.local`
3. Pour les webhooks en local : `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### 6. Lancer en dev
```bash
npm run dev
# → http://localhost:3000
```

---

## Stack
- **Next.js 14** App Router
- **Supabase** BDD + Storage
- **Stripe** Paiement
- **Resend** Emails
- **Vercel** Déploiement

---

## Déploiement Vercel

```bash
# Push sur GitHub, puis :
vercel deploy

# Ajouter les env vars dans Vercel Dashboard
# Ajouter le webhook Stripe avec l'URL de production
```
