-- Migration: 003_sales_channels.sql
-- Sales channels (TikTok Shop, etc.) - platforms where we SELL products

-- ============================================
-- ENUMS
-- ============================================

-- Channel status
DO $$ BEGIN
  CREATE TYPE channel_status AS ENUM ('active', 'inactive', 'pending', 'suspended');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Channel product status (on the channel)
DO $$ BEGIN
  CREATE TYPE channel_product_status AS ENUM ('draft', 'pending', 'live', 'suspended', 'deleted');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Channel order status
DO $$ BEGIN
  CREATE TYPE channel_order_status AS ENUM (
    'unpaid', 'awaiting_shipment', 'awaiting_collection',
    'in_transit', 'delivered', 'completed', 'cancelled', 'refunded'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- SALES CHANNELS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS sales_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE, -- 'tiktok-shop', 'instagram-shop', etc.
  name VARCHAR(255) NOT NULL,
  status channel_status DEFAULT 'pending',
  config JSONB DEFAULT '{}', -- Stores credentials, settings, etc.
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_sales_channels_code ON sales_channels(code);
CREATE INDEX IF NOT EXISTS idx_sales_channels_status ON sales_channels(status);

-- ============================================
-- CHANNEL PRODUCTS TABLE
-- Links our products to channel products
-- ============================================

CREATE TABLE IF NOT EXISTS channel_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  channel_id UUID NOT NULL REFERENCES sales_channels(id) ON DELETE CASCADE,

  -- Product name/slug (for display without join)
  product_name VARCHAR(255),
  product_slug VARCHAR(255),

  -- Channel-specific product ID
  channel_product_id VARCHAR(255),
  channel_status channel_product_status DEFAULT 'draft',

  -- Sync state
  sync_status sync_status DEFAULT 'not_synced',
  last_synced_at TIMESTAMP WITH TIME ZONE,
  last_sync_error TEXT,

  -- Price override (if different from main site)
  channel_price DECIMAL(10,2),
  channel_compare_at_price DECIMAL(10,2),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Each product can only be linked once per channel
  UNIQUE(product_id, channel_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_channel_products_product ON channel_products(product_id);
CREATE INDEX IF NOT EXISTS idx_channel_products_channel ON channel_products(channel_id);
CREATE INDEX IF NOT EXISTS idx_channel_products_channel_product_id ON channel_products(channel_product_id);
CREATE INDEX IF NOT EXISTS idx_channel_products_sync_status ON channel_products(sync_status);

-- ============================================
-- CHANNEL ORDERS TABLE
-- Tracks orders from channels
-- ============================================

CREATE TABLE IF NOT EXISTS channel_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL REFERENCES sales_channels(id) ON DELETE CASCADE,
  channel_order_id VARCHAR(255) NOT NULL, -- Order ID on the channel
  channel_order_number VARCHAR(255), -- Display order number on channel

  -- Link to our order (after import)
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,

  -- Status tracking
  status channel_order_status DEFAULT 'unpaid',

  -- Fulfillment info (sent back to channel)
  tracking_number VARCHAR(255),
  carrier VARCHAR(100),
  shipped_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Each channel order ID is unique per channel
  UNIQUE(channel_id, channel_order_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_channel_orders_channel ON channel_orders(channel_id);
CREATE INDEX IF NOT EXISTS idx_channel_orders_order ON channel_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_channel_orders_status ON channel_orders(status);

-- ============================================
-- CHANNEL SYNC LOG
-- ============================================

CREATE TABLE IF NOT EXISTS channel_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL REFERENCES sales_channels(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL, -- 'product_create', 'product_update', 'order_import', etc.
  entity_type VARCHAR(50) NOT NULL, -- 'product', 'order', 'inventory'
  entity_id VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'success', 'failed'
  request_payload JSONB,
  response_payload JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for recent logs
CREATE INDEX IF NOT EXISTS idx_channel_sync_log_channel ON channel_sync_log(channel_id);
CREATE INDEX IF NOT EXISTS idx_channel_sync_log_created ON channel_sync_log(created_at DESC);

-- ============================================
-- ADD CHANNEL COLUMNS TO ORDERS TABLE
-- ============================================

-- Add channel reference to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS channel_id UUID REFERENCES sales_channels(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS channel_order_id VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS channel_order_number VARCHAR(255);

-- Index for channel orders
CREATE INDEX IF NOT EXISTS idx_orders_channel ON orders(channel_id);
CREATE INDEX IF NOT EXISTS idx_orders_channel_order_id ON orders(channel_order_id);

-- ============================================
-- ADD CHANNEL COLUMNS TO ORDER ITEMS
-- ============================================

ALTER TABLE order_items ADD COLUMN IF NOT EXISTS channel_item_id VARCHAR(255);

-- ============================================
-- INSERT DEFAULT TIKTOK SHOP CHANNEL
-- ============================================

INSERT INTO sales_channels (code, name, status, config) VALUES
('tiktok-shop', 'TikTok Shop', 'pending', '{
  "region": "FR",
  "sandbox": true,
  "autoSyncProducts": false,
  "autoSyncOrders": true,
  "autoSyncInventory": true,
  "credentials": {
    "appKey": "",
    "appSecret": ""
  }
}'::jsonb)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE sales_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_sync_log ENABLE ROW LEVEL SECURITY;

-- Service role policies (full access)
CREATE POLICY "Service role full access to sales_channels"
  ON sales_channels FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to channel_products"
  ON channel_products FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to channel_orders"
  ON channel_orders FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to channel_sync_log"
  ON channel_sync_log FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_channel_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_sales_channels_updated_at ON sales_channels;
CREATE TRIGGER update_sales_channels_updated_at
  BEFORE UPDATE ON sales_channels
  FOR EACH ROW EXECUTE FUNCTION update_channel_updated_at();

DROP TRIGGER IF EXISTS update_channel_products_updated_at ON channel_products;
CREATE TRIGGER update_channel_products_updated_at
  BEFORE UPDATE ON channel_products
  FOR EACH ROW EXECUTE FUNCTION update_channel_updated_at();

DROP TRIGGER IF EXISTS update_channel_orders_updated_at ON channel_orders;
CREATE TRIGGER update_channel_orders_updated_at
  BEFORE UPDATE ON channel_orders
  FOR EACH ROW EXECUTE FUNCTION update_channel_updated_at();

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE sales_channels IS 'Sales channels where we sell products (TikTok Shop, etc.)';
COMMENT ON TABLE channel_products IS 'Links our products to channel-specific product IDs';
COMMENT ON TABLE channel_orders IS 'Orders received from sales channels';
COMMENT ON TABLE channel_sync_log IS 'Log of all sync operations with channels';
