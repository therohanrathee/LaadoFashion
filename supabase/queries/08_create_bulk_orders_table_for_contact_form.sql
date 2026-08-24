-- Query 08: Create bulk_orders table for contact form
-- ==========================================
CREATE TABLE public.bulk_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_info TEXT NOT NULL,
  details TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.bulk_orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert bulk orders (public contact form)
CREATE POLICY "Enable insert for public" ON public.bulk_orders
FOR INSERT WITH CHECK (true);

-- Allow authenticated admins to view/update bulk orders
CREATE POLICY "Enable read for authenticated users" ON public.bulk_orders
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.bulk_orders
FOR UPDATE USING (auth.role() = 'authenticated');
