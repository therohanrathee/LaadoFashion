-- 12_enable_rls_for_dynamic_catalog.sql

-- Enable RLS just in case it isn't enabled
ALTER TABLE catalog_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- 1. Catalog Items Policies
DROP POLICY IF EXISTS "Allow public read catalog" ON catalog_items;
CREATE POLICY "Allow public read catalog" ON catalog_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access catalog" ON catalog_items;
CREATE POLICY "Allow authenticated full access catalog" ON catalog_items FOR ALL USING (auth.role() = 'authenticated');

-- 2. Addons Policies
DROP POLICY IF EXISTS "Allow public read addons" ON addons;
CREATE POLICY "Allow public read addons" ON addons FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access addons" ON addons;
CREATE POLICY "Allow authenticated full access addons" ON addons FOR ALL USING (auth.role() = 'authenticated');

-- 3. Promo Codes Policies
DROP POLICY IF EXISTS "Allow public read promos" ON promo_codes;
CREATE POLICY "Allow public read promos" ON promo_codes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access promos" ON promo_codes;
CREATE POLICY "Allow authenticated full access promos" ON promo_codes FOR ALL USING (auth.role() = 'authenticated');
