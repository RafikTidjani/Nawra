-- ============================================================================
-- VELORA - Migration 004: Catégories et Wishlist
-- ============================================================================

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 1 : TABLE CATEGORIES                                               ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,           -- 'coiffeuse-led'
  name TEXT NOT NULL,                   -- 'Coiffeuses LED'
  description TEXT,                     -- Description optionnelle
  icon TEXT,                            -- Emoji ou icône
  color TEXT,                           -- Couleur hex pour UI
  sort_order INTEGER DEFAULT 0,         -- Ordre d'affichage
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour tri et recherche
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_sort ON categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 2 : AJOUTER category_id AUX PRODUITS                               ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Ajouter la colonne category_id si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE products ADD COLUMN category_id UUID REFERENCES categories(id);
  END IF;
END $$;

-- Index pour jointures
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 3 : MIGRER LES DONNÉES EXISTANTES                                  ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Insérer les catégories par défaut basées sur les valeurs existantes
INSERT INTO categories (slug, name, icon, color, sort_order) VALUES
  ('coiffeuse-led', 'Coiffeuses LED', '💡', '#D4A59A', 1),
  ('coiffeuse-bois', 'Coiffeuses Bois', '🪵', '#C8A97E', 2),
  ('coiffeuse-compact', 'Coiffeuses Compactes', '✨', '#F5E6E0', 3)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color;

-- Lier les produits existants à leurs catégories
UPDATE products SET category_id = (
  SELECT id FROM categories WHERE categories.slug = products.category
) WHERE category IS NOT NULL AND category_id IS NULL;

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 4 : TABLE WISHLISTS (Favoris)                                      ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, product_id)
);

-- Index pour recherche
CREATE INDEX IF NOT EXISTS idx_wishlists_customer ON wishlists(customer_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_product ON wishlists(product_id);

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 5 : ROW LEVEL SECURITY                                             ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Categories: lecture publique
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Categories are editable by service role"
  ON categories FOR ALL
  USING (true)
  WITH CHECK (true);

-- Wishlists: chaque client gère ses propres favoris
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own wishlist"
  ON wishlists FOR ALL
  USING (auth.uid() = customer_id);

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ VÉRIFICATION                                                              ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

SELECT 'Migration 004 - Categories & Wishlist terminée!' AS status;
SELECT COUNT(*) AS nombre_categories FROM categories;
SELECT COUNT(*) AS produits_avec_category_id FROM products WHERE category_id IS NOT NULL;
