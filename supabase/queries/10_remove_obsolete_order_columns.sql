-- 10_remove_obsolete_order_columns.sql

-- 1. Drop obsolete foreign keys
-- We drop customer_id FK because we allow guest checkouts with generated UUIDs
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_customer_id_fkey;
-- We drop catalog_item_id FK because we now support multiple items via JSONB
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_catalog_item_id_fkey;

-- 2. Drop obsolete columns (replaced by new names/formats)
ALTER TABLE orders 
  DROP COLUMN IF EXISTS catalog_item_id,
  DROP COLUMN IF EXISTS address,
  DROP COLUMN IF EXISTS latitude,
  DROP COLUMN IF EXISTS longitude,
  DROP COLUMN IF EXISTS total_estimated_cost;

-- 3. Add the exact columns expected by the frontend cart payload
ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS customer_name TEXT NOT NULL DEFAULT 'Guest',
  ADD COLUMN IF NOT EXISTS customer_phone TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS customer_email TEXT,
  ADD COLUMN IF NOT EXISTS delivery_address TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS additional_remarks TEXT,
  ADD COLUMN IF NOT EXISTS location_lat NUMERIC(10, 8),
  ADD COLUMN IF NOT EXISTS location_lng NUMERIC(11, 8),
  ADD COLUMN IF NOT EXISTS cart_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS visit_charge NUMERIC(10, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS delivery_charge NUMERIC(10, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_applied NUMERIC(10, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0;

-- 4. Clean up unused relational tables (addons are now stored inside the cart_items JSON)
DROP TABLE IF EXISTS order_addons;
