-- ============================================================================
-- VELORA - Schéma BDD complet
-- Exécuter dans Supabase SQL Editor
-- ============================================================================

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 1 : SUPPRIMER LES ANCIENNES TABLES NAWRA                           ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS baskets CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS sizes CASCADE;
DROP TABLE IF EXISTS themes CASCADE;
DROP TABLE IF EXISTS bouquets CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;

-- Supprimer les types enum s'ils existent
DROP TYPE IF EXISTS stock_status CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 2 : CRÉER LES TYPES ENUM                                           ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TYPE stock_status AS ENUM ('in_stock', 'limited', 'out_of_stock');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled');

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 3 : TABLE PRODUCTS (Coiffeuses)                                    ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  price NUMERIC(10,2) NOT NULL,
  compare_at_price NUMERIC(10,2),
  images TEXT[] DEFAULT '{}',
  video TEXT,
  category TEXT DEFAULT 'coiffeuse',
  tags TEXT[] DEFAULT '{}',
  stock_status stock_status DEFAULT 'in_stock',
  features TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 4 : TABLE CUSTOMERS (Comptes clients)                              ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE customers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 5 : TABLE ADDRESSES (Adresses sauvegardées)                        ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  label TEXT DEFAULT 'Domicile',
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  address TEXT NOT NULL,
  address2 TEXT,
  city TEXT NOT NULL,
  zip TEXT NOT NULL,
  country TEXT DEFAULT 'France',
  phone TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_addresses_customer ON addresses(customer_id);

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 6 : TABLE ORDERS (Commandes)                                       ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,

  -- Client (peut être NULL si guest checkout)
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,

  -- Infos de livraison (toujours remplies)
  shipping_first_name TEXT NOT NULL,
  shipping_last_name TEXT NOT NULL,
  shipping_email TEXT NOT NULL,
  shipping_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_address2 TEXT,
  shipping_city TEXT NOT NULL,
  shipping_zip TEXT NOT NULL,
  shipping_country TEXT DEFAULT 'France',

  -- Totaux
  subtotal NUMERIC(10,2) NOT NULL,
  shipping_cost NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,

  -- Statut
  status order_status DEFAULT 'pending',

  -- Stripe
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,

  -- Notes
  customer_note TEXT,
  admin_note TEXT,

  -- Tracking
  tracking_number TEXT,
  tracking_carrier TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

-- Index
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_number ON orders(order_number);

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 7 : TABLE ORDER_ITEMS (Produits dans commande)                     ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,

  -- Snapshot du produit au moment de l'achat
  product_name TEXT NOT NULL,
  product_price NUMERIC(10,2) NOT NULL,
  product_image TEXT,

  quantity INTEGER NOT NULL DEFAULT 1,
  total NUMERIC(10,2) NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 8 : TABLE REVIEWS (Avis clients)                                   ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,

  author_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,

  is_verified BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved);

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 9 : TABLE ADMINS                                                   ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fonction pour hasher le mot de passe (simple mais efficace)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Fonction pour créer un admin
CREATE OR REPLACE FUNCTION create_admin(
  admin_email TEXT,
  admin_password TEXT,
  admin_name TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO admins (email, password_hash, name)
  VALUES (admin_email, crypt(admin_password, gen_salt('bf')), admin_name)
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour vérifier le login admin
CREATE OR REPLACE FUNCTION verify_admin(
  admin_email TEXT,
  admin_password TEXT
)
RETURNS TABLE (
  id UUID,
  email TEXT,
  name TEXT,
  is_valid BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.email,
    a.name,
    (a.password_hash = crypt(admin_password, a.password_hash)) AS is_valid
  FROM admins a
  WHERE a.email = admin_email
  AND a.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 10 : FONCTIONS UTILITAIRES                                         ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Générer un numéro de commande unique (VEL-20260315-XXXX)
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  date_part TEXT;
  random_part TEXT;
BEGIN
  date_part := TO_CHAR(NOW(), 'YYYYMMDD');
  random_part := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));
  new_number := 'VEL-' || date_part || '-' || random_part;
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour auto-générer le numéro de commande
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Trigger pour updated_at automatique
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_products_updated
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_orders_updated
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_customers_updated
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 11 : ROW LEVEL SECURITY (RLS)                                      ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Activer RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Admins : accessible uniquement via service role (backend)
CREATE POLICY "Admins accessible via service role only"
  ON admins FOR ALL
  USING (true)
  WITH CHECK (true);

-- Products : lecture publique
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (is_active = true);

-- Products : modification admin seulement (via service role)
CREATE POLICY "Products are editable by service role"
  ON products FOR ALL
  USING (true)
  WITH CHECK (true);

-- Customers : chaque client voit ses propres données
CREATE POLICY "Customers can view own data"
  ON customers FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Customers can update own data"
  ON customers FOR UPDATE
  USING (auth.uid() = id);

-- Addresses : chaque client voit ses propres adresses
CREATE POLICY "Users can manage own addresses"
  ON addresses FOR ALL
  USING (auth.uid() = customer_id);

-- Orders : chaque client voit ses propres commandes
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = customer_id);

-- Order items : visibles avec la commande
CREATE POLICY "Order items visible with order"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.customer_id = auth.uid()
    )
  );

-- Reviews : lecture publique des avis approuvés
CREATE POLICY "Approved reviews are public"
  ON reviews FOR SELECT
  USING (is_approved = true);

-- Reviews : les clients peuvent créer des avis
CREATE POLICY "Customers can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 12 : DONNÉES INITIALES (4 coiffeuses VELORA)                       ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

INSERT INTO products (name, slug, description, short_description, price, compare_at_price, images, video, category, tags, stock_status, features) VALUES

(
  'Coiffeuse Hollywood LED',
  'coiffeuse-hollywood-led',
  'La coiffeuse Hollywood LED est l''accessoire ultime pour créer votre coin beauté de rêve. Inspirée des loges des stars, elle dispose d''un miroir bordé de lumières LED ajustables qui offrent un éclairage parfait pour votre maquillage.

Le design élégant en blanc laqué s''intègre parfaitement dans tous les intérieurs. Les tiroirs spacieux permettent de ranger tous vos accessoires beauté. Le tabouret rembourré assorti est inclus pour un confort optimal.',
  'Miroir LED 12 ampoules, 3 modes d''éclairage, tabouret inclus',
  189.00,
  249.00,
  ARRAY['https://placeholder.com/hollywood-1.jpg', 'https://placeholder.com/hollywood-2.jpg'],
  NULL,
  'coiffeuse-led',
  ARRAY['led', 'hollywood', 'miroir lumineux', 'bestseller'],
  'limited',
  ARRAY['Miroir avec 12 ampoules LED', '3 modes d''éclairage ajustables', 'Variateur tactile intégré', '3 tiroirs de rangement', 'Tabouret rembourré inclus', 'Dimensions : 80 x 40 x 140 cm']
),

(
  'Coiffeuse Scandinave Bois',
  'coiffeuse-scandinave-bois',
  'La coiffeuse Scandinave en bois naturel apporte une touche de chaleur et d''authenticité à votre chambre. Son design minimaliste et épuré, typique du style nordique, s''harmonise avec tous les décors.

Fabriquée en bois de pin massif avec des pieds en bois de hêtre, cette coiffeuse allie solidité et esthétique. Le miroir rond pivotant permet d''ajuster l''angle selon vos besoins.',
  'Bois massif, miroir pivotant, design minimaliste nordique',
  159.00,
  NULL,
  ARRAY['https://placeholder.com/scandinave-1.jpg', 'https://placeholder.com/scandinave-2.jpg'],
  NULL,
  'coiffeuse-bois',
  ARRAY['bois', 'scandinave', 'naturel', 'minimaliste'],
  'in_stock',
  ARRAY['Bois de pin massif certifié FSC', 'Miroir rond pivotant Ø 45cm', '2 tiroirs avec poignées cuir végétal', 'Pieds en bois de hêtre', 'Finition mate naturelle', 'Dimensions : 100 x 45 x 130 cm']
),

(
  'Coiffeuse VELORA Signature',
  'coiffeuse-velora-signature',
  'Notre modèle signature, la coiffeuse VELORA combine le meilleur de nos collections : un miroir LED intelligent avec un design élégant et moderne.

Le grand miroir triptyque avec éclairage LED périmétrique offre une vision à 180° parfaite pour le maquillage. La finition blanc brillant avec détails dorés apporte une touche de luxe accessible.',
  'Miroir triptyque LED, finition dorée, 5 tiroirs, prises USB',
  239.00,
  299.00,
  ARRAY['https://placeholder.com/signature-1.jpg', 'https://placeholder.com/signature-2.jpg'],
  NULL,
  'coiffeuse-led',
  ARRAY['signature', 'led', 'luxe', 'bestseller', 'triptyque'],
  'limited',
  ARRAY['Miroir triptyque LED périmétrique', 'Variateur d''intensité tactile', '5 tiroirs dont 1 à bijoux velours', 'Prises USB intégrées (x2)', 'Tabouret capitonné velours inclus', 'Dimensions : 120 x 45 x 145 cm']
),

(
  'Coiffeuse Compact Rose',
  'coiffeuse-compact-rose',
  'La coiffeuse Compact Rose est parfaite pour les espaces réduits. Son format compact n''enlève rien à son charme : le rose poudré et les lignes courbes créent une ambiance douce et féminine.

Idéale pour les petites chambres, studios ou coins dressing, elle offre un espace de rangement optimisé avec un miroir rabattable qui cache un compartiment secret.',
  'Format compact, miroir rabattable, finition rose poudré',
  129.00,
  NULL,
  ARRAY['https://placeholder.com/compact-rose-1.jpg', 'https://placeholder.com/compact-rose-2.jpg'],
  NULL,
  'coiffeuse-compact',
  ARRAY['compact', 'rose', 'petit espace', 'féminin'],
  'in_stock',
  ARRAY['Format compact gain de place', 'Miroir rabattable avec rangement secret', 'Finition rose poudré mat', '2 tiroirs avec poignées dorées', 'Pieds en métal doré brossé', 'Dimensions : 60 x 40 x 75 cm']
);

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 13 : CRÉER LE COMPTE ADMIN PAR DÉFAUT                              ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- ⚠️  IMPORTANT : Change le mot de passe après la première connexion !
SELECT create_admin(
  'admin@velorabeauty.fr',  -- Email admin
  'Velora2024!',            -- Mot de passe (à changer !)
  'Admin VELORA'            -- Nom
);

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ TERMINÉ !                                                                 ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Vérification
SELECT 'Base de données VELORA créée avec succès !' AS status;
SELECT COUNT(*) AS nombre_produits FROM products;
SELECT email, name FROM admins;
