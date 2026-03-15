DO $$ BEGIN
  CREATE TYPE channel_status AS ENUM ('active', 'inactive', 'pending', 'suspended');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE channel_product_status AS ENUM ('draft', 'pending', 'live', 'suspended', 'deleted');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE channel_order_status AS ENUM (
    'unpaid', 'awaiting_shipment', 'awaiting_collection',
    'in_transit', 'delivered', 'completed', 'cancelled', 'refunded'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS sales_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  status channel_status DEFAULT 'pending',
  config JSONB DEFAULT '{}',
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS channel_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  channel_id UUID NOT NULL REFERENCES sales_channels(id) ON DELETE CASCADE,
  product_name VARCHAR(255),
  product_slug VARCHAR(255),
  channel_product_id VARCHAR(255),
  channel_status channel_product_status DEFAULT 'draft',
  sync_status sync_status DEFAULT 'pending',
  last_synced_at TIMESTAMP WITH TIME ZONE,
  last_sync_error TEXT,
  channel_price DECIMAL(10,2),
  channel_compare_at_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, channel_id)
);

CREATE TABLE IF NOT EXISTS channel_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL REFERENCES sales_channels(id) ON DELETE CASCADE,
  channel_order_id VARCHAR(255) NOT NULL,
  channel_order_number VARCHAR(255),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  status channel_order_status DEFAULT 'unpaid',
  tracking_number VARCHAR(255),
  carrier VARCHAR(100),
  shipped_at TIMESTAMP WITH TIME ZONE,
  synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(channel_id, channel_order_id)
);

CREATE TABLE IF NOT EXISTS channel_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL REFERENCES sales_channels(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL,
  request_payload JSONB,
  response_payload JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE orders ADD COLUMN IF NOT EXISTS channel_id UUID REFERENCES sales_channels(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS channel_order_id VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS channel_order_number VARCHAR(255);
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS channel_item_id VARCHAR(255);

INSERT INTO sales_channels (code, name, status, config) VALUES
('tiktok-shop', 'TikTok Shop', 'pending', '{"region": "FR", "sandbox": true}'::jsonb)
ON CONFLICT (code) DO NOTHING;

ALTER TABLE sales_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_sync_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access to sales_channels" ON sales_channels FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to channel_products" ON channel_products FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to channel_orders" ON channel_orders FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to channel_sync_log" ON channel_sync_log FOR ALL USING (auth.role() = 'service_role');
