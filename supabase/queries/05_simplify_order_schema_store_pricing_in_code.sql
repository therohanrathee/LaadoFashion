-- Query 05: Simplify Order Schema (Store Pricing in Code)
-- This removes the strict foreign keys to the catalog_items table, 
-- allowing the orders table to simply store the name and price of what was ordered.
-- This greatly simplifies the architecture by keeping pricing logic entirely in the codebase.

ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_catalog_item_id_fkey;

ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS item_name TEXT,
  ADD COLUMN IF NOT EXISTS item_price NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS selected_addons JSONB DEFAULT '[]'::jsonb;

-- (Optional) If you want to clean up the now-unused catalog tables, you can run these:
-- DROP TABLE IF EXISTS order_addons CASCADE;
-- DROP TABLE IF EXISTS addons CASCADE;
-- DROP TABLE IF EXISTS catalog_items CASCADE;
