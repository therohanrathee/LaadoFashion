-- 11_dynamic_catalog_and_promos.sql

-- 1. Upgrade Catalog Items Table
ALTER TABLE catalog_items
  ADD COLUMN IF NOT EXISTS original_price NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- 2. Upgrade Addons Table
ALTER TABLE addons
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- 3. Upgrade Promo Codes Table
-- To support one-time-per-user promos
ALTER TABLE promo_codes
  ADD COLUMN IF NOT EXISTS one_time_per_user BOOLEAN DEFAULT FALSE;

-- (Note: 'free_visit' is already supported by the discount_type CHECK constraint from migration 09)
