-- ============================================================================
-- VELORA - Migration 002: Suppliers & Dropshipping
-- Exécuter dans Supabase SQL Editor
-- ============================================================================

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 1 : AJOUTER COLONNES TRACKING À ORDERS                             ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Add tracking columns to orders if they don't exist
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'tracking_number')
  THEN
    ALTER TABLE orders ADD COLUMN tracking_number TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'tracking_carrier')
  THEN
    ALTER TABLE orders ADD COLUMN tracking_carrier TEXT;
  END IF;
END $$;

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 2 : TYPES ENUM POUR SUPPLIERS                                      ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Supplier status
DO $$ BEGIN
  CREATE TYPE supplier_status AS ENUM ('active', 'inactive', 'testing');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Fulfillment status
DO $$ BEGIN
  CREATE TYPE fulfillment_status AS ENUM ('pending', 'submitted', 'confirmed', 'shipped', 'delivered', 'cancelled', 'failed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Sync status
DO $$ BEGIN
  CREATE TYPE sync_status AS ENUM ('synced', 'pending', 'error');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 3 : TABLE SUPPLIERS                                                ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identification
  code TEXT UNIQUE NOT NULL,  -- 'cjdropshipping', 'spocket', 'manual'
  name TEXT NOT NULL,

  -- API Configuration
  api_endpoint TEXT,
  api_key_encrypted TEXT,     -- Encrypted with SUPPLIER_ENCRYPTION_KEY
  webhook_secret TEXT,

  -- Status
  status supplier_status DEFAULT 'inactive',

  -- Extra config (JSON)
  config JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ
);

-- Index
CREATE INDEX IF NOT EXISTS idx_suppliers_code ON suppliers(code);
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 4 : TABLE SUPPLIER_PRODUCTS (Liaison produit ↔ fournisseur)        ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS supplier_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Links
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,

  -- Supplier's product info
  supplier_product_id TEXT NOT NULL,  -- ID in supplier's system
  supplier_sku TEXT,                  -- SKU in supplier's system

  -- Pricing
  cost_price NUMERIC(10,2),           -- What we pay the supplier

  -- Settings
  is_primary BOOLEAN DEFAULT true,    -- Primary supplier for this product
  auto_fulfill BOOLEAN DEFAULT true,  -- Auto-submit orders to this supplier

  -- Sync
  sync_status sync_status DEFAULT 'pending',
  last_synced_at TIMESTAMPTZ,
  supplier_data JSONB DEFAULT '{}',   -- Raw data from supplier

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  UNIQUE(product_id, supplier_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_supplier_products_product ON supplier_products(product_id);
CREATE INDEX IF NOT EXISTS idx_supplier_products_supplier ON supplier_products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_products_primary ON supplier_products(product_id, is_primary) WHERE is_primary = true;

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 5 : TABLE SUPPLIER_ORDERS (Suivi fulfillment par item)             ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS supplier_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Links
  order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,

  -- Supplier's order info
  supplier_order_id TEXT,             -- Order ID in supplier's system
  supplier_reference TEXT,            -- Any reference number

  -- Status
  fulfillment_status fulfillment_status DEFAULT 'pending',

  -- Shipping
  tracking_number TEXT,
  carrier TEXT,
  carrier_url TEXT,

  -- Pricing
  cost_paid NUMERIC(10,2),            -- Actual amount paid to supplier
  currency TEXT DEFAULT 'EUR',

  -- Extra data
  supplier_data JSONB DEFAULT '{}',   -- Raw response from supplier
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_supplier_orders_item ON supplier_orders(order_item_id);
CREATE INDEX IF NOT EXISTS idx_supplier_orders_supplier ON supplier_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_orders_status ON supplier_orders(fulfillment_status);
CREATE INDEX IF NOT EXISTS idx_supplier_orders_supplier_order ON supplier_orders(supplier_order_id);

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 6 : TABLE SUPPLIER_SYNC_LOG (Logs pour debug)                      ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS supplier_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Context
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  action TEXT NOT NULL,               -- 'search', 'import', 'submit_order', 'get_tracking', etc.
  entity_type TEXT,                   -- 'product', 'order', 'inventory'
  entity_id TEXT,                     -- ID of the entity being synced

  -- Result
  status TEXT NOT NULL,               -- 'success', 'error', 'warning'

  -- Data
  request_payload JSONB,
  response_payload JSONB,
  error_message TEXT,

  -- Timing
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for recent logs
CREATE INDEX IF NOT EXISTS idx_sync_log_created ON supplier_sync_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_log_supplier ON supplier_sync_log(supplier_id, created_at DESC);

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 7 : COLONNES ADDITIONNELLES SUR PRODUCTS                           ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Add supplier-related columns to products
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'cost_price')
  THEN
    ALTER TABLE products ADD COLUMN cost_price NUMERIC(10,2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'supplier_id')
  THEN
    ALTER TABLE products ADD COLUMN supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'supplier_product_id')
  THEN
    ALTER TABLE products ADD COLUMN supplier_product_id TEXT;
  END IF;
END $$;

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 8 : COLONNES ADDITIONNELLES SUR ORDER_ITEMS                        ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Add fulfillment columns to order_items
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_items' AND column_name = 'fulfillment_status')
  THEN
    ALTER TABLE order_items ADD COLUMN fulfillment_status fulfillment_status DEFAULT 'pending';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_items' AND column_name = 'tracking_number')
  THEN
    ALTER TABLE order_items ADD COLUMN tracking_number TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_items' AND column_name = 'carrier')
  THEN
    ALTER TABLE order_items ADD COLUMN carrier TEXT;
  END IF;
END $$;

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 9 : TRIGGERS                                                        ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Trigger for suppliers updated_at
CREATE OR REPLACE FUNCTION update_suppliers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_suppliers_updated ON suppliers;
CREATE TRIGGER trigger_suppliers_updated
  BEFORE UPDATE ON suppliers
  FOR EACH ROW
  EXECUTE FUNCTION update_suppliers_updated_at();

-- Trigger for supplier_products updated_at
DROP TRIGGER IF EXISTS trigger_supplier_products_updated ON supplier_products;
CREATE TRIGGER trigger_supplier_products_updated
  BEFORE UPDATE ON supplier_products
  FOR EACH ROW
  EXECUTE FUNCTION update_suppliers_updated_at();

-- Trigger for supplier_orders updated_at
DROP TRIGGER IF EXISTS trigger_supplier_orders_updated ON supplier_orders;
CREATE TRIGGER trigger_supplier_orders_updated
  BEFORE UPDATE ON supplier_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_suppliers_updated_at();

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 10 : ROW LEVEL SECURITY                                             ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Enable RLS
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_sync_log ENABLE ROW LEVEL SECURITY;

-- Suppliers: service role only (backend)
CREATE POLICY "Suppliers accessible via service role only"
  ON suppliers FOR ALL
  USING (true)
  WITH CHECK (true);

-- Supplier products: service role only
CREATE POLICY "Supplier products accessible via service role only"
  ON supplier_products FOR ALL
  USING (true)
  WITH CHECK (true);

-- Supplier orders: service role only
CREATE POLICY "Supplier orders accessible via service role only"
  ON supplier_orders FOR ALL
  USING (true)
  WITH CHECK (true);

-- Sync log: service role only
CREATE POLICY "Sync log accessible via service role only"
  ON supplier_sync_log FOR ALL
  USING (true)
  WITH CHECK (true);

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ ÉTAPE 11 : DONNÉES INITIALES                                              ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Insert default "Manual" supplier (for manual fulfillment)
INSERT INTO suppliers (code, name, status, config)
VALUES ('manual', 'Fulfillment Manuel', 'active', '{"description": "Traitement manuel des commandes"}')
ON CONFLICT (code) DO NOTHING;

-- Insert CJDropshipping supplier (inactive by default)
INSERT INTO suppliers (code, name, api_endpoint, status, config)
VALUES (
  'cjdropshipping',
  'CJ Dropshipping',
  'https://developers.cjdropshipping.com/api2.0',
  'inactive',
  '{"requires_auth": true, "auth_type": "email_password"}'
)
ON CONFLICT (code) DO NOTHING;

-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ TERMINÉ !                                                                 ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

SELECT 'Migration 002_suppliers appliquée avec succès !' AS status;
SELECT COUNT(*) AS nombre_suppliers FROM suppliers;
