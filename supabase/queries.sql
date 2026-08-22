-- Query 02: Fix Auth Trigger (Run this to fix the database error during order booking)
-- The admin API sometimes creates the user row before injecting the raw_user_meta_data, 
-- causing the full_name NOT NULL constraint to fail. This adds a COALESCE fallback.
-- It also explicitly references public.user_role because triggers run in the auth schema.

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'New Customer'), 
    'customer'::public.user_role
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Query 03: Fix Auth Trigger Schema Path (Run this to fix the database error during order booking)
-- Triggers run in the auth schema by default, so casting to 'customer'::user_role fails 
-- because user_role is in the public schema. This explicitly references public.user_role.

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'New Customer'), 
    'customer'::public.user_role
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Query 04: Manually Sync Missing Profiles
-- If a user was created in Auth but their profile didn't generate (e.g., due to a trigger glitch), 
-- this query will find all users in the auth.users table who are missing from the public.profiles 
-- table and insert them automatically as 'customer' (which you can then change to admin/runner).

INSERT INTO public.profiles (id, full_name, role)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'full_name', 'Employee / Customer'), 
  'customer'::public.user_role
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);
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
-- Query 07: Fix Row Level Security (RLS) Policies
-- It appears RLS is enabled but policies might be missing or too restrictive, 
-- causing the dashboard to fail to load your Admin profile.
-- These policies ensure that logged-in staff can see the data they need.

-- 1. Profiles: Allow authenticated users (staff) to read all profiles
DROP POLICY IF EXISTS "Allow staff to read profiles" ON profiles;
CREATE POLICY "Allow staff to read profiles" 
  ON profiles 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- 2. Orders: Allow staff to read all orders, and public to read orders (for the tracking page)
DROP POLICY IF EXISTS "Allow public to read orders" ON orders;
CREATE POLICY "Allow public to read orders" 
  ON orders 
  FOR SELECT 
  USING (true);

-- 3. Orders: Allow staff to update orders (for runner/tailor/admin portals)
DROP POLICY IF EXISTS "Allow staff to update orders" ON orders;
CREATE POLICY "Allow staff to update orders" 
  ON orders 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');
