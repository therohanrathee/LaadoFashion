-- Query 09: Finalize Cart Checkout & Promo Codes Schema
-- This migration creates the promo_codes table for dynamic discounting,
-- and upgrades the orders table to store comprehensive checkout details 
-- including GPS locations, pricing breakdowns, and applied promos.

-- 1. Create Promo Codes Table
CREATE TABLE IF NOT EXISTS promo_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_delivery', 'free_visit')),
    discount_value NUMERIC(10, 2) DEFAULT 0,
    min_cart_value NUMERIC(10, 2) DEFAULT 0,
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    usage_limit INT,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Promo Codes
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Anyone can read promo codes to validate them at checkout
CREATE POLICY "Allow public to read active promo codes" 
  ON promo_codes 
  FOR SELECT 
  USING (is_active = TRUE AND (expires_at IS NULL OR expires_at > NOW()));

-- 2. Upgrade Orders Table
-- Add new columns for checkout details, billing breakdowns, and promo relationships.
ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS customer_name TEXT,
  ADD COLUMN IF NOT EXISTS customer_phone TEXT,
  ADD COLUMN IF NOT EXISTS delivery_address TEXT,
  ADD COLUMN IF NOT EXISTS location_lat NUMERIC(10, 6),
  ADD COLUMN IF NOT EXISTS location_lng NUMERIC(10, 6),
  ADD COLUMN IF NOT EXISTS customer_email TEXT,
  ADD COLUMN IF NOT EXISTS additional_remarks TEXT,
  ADD COLUMN IF NOT EXISTS subtotal NUMERIC(10, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS visit_charge NUMERIC(10, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS delivery_charge NUMERIC(10, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_applied NUMERIC(10, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS promo_code_id UUID REFERENCES promo_codes(id),
  ADD COLUMN IF NOT EXISTS total_amount NUMERIC(10, 2) DEFAULT 0;

-- 3. Allow Public Insert for Orders
-- So that unauthenticated users can place orders from the frontend
DROP POLICY IF EXISTS "Allow public to insert orders" ON orders;
CREATE POLICY "Allow public to insert orders" 
  ON orders 
  FOR INSERT 
  WITH CHECK (true);

