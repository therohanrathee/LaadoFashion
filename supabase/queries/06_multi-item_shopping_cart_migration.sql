-- Query 06: Multi-Item Shopping Cart Migration
-- This upgrades the orders table to support multiple items (a shopping cart) 
-- instead of just a single item per order.

ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS cart_items JSONB DEFAULT '[]'::jsonb;

-- Drop the old single-item columns introduced in Query 05
ALTER TABLE orders 
  DROP COLUMN IF EXISTS catalog_item_id,
  DROP COLUMN IF EXISTS item_name,
  DROP COLUMN IF EXISTS item_price,
  DROP COLUMN IF EXISTS selected_addons;
