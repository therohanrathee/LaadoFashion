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
