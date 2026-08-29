CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  requirements TEXT,
  interested_in TEXT,
  status TEXT DEFAULT 'new', -- 'new', 'contacted', 'converted', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (anyone can submit a lead)
CREATE POLICY "Anyone can insert a lead" 
ON leads 
FOR INSERT WITH CHECK (true);

-- Allow service role and admins to read/update
CREATE POLICY "Admins can read leads"
ON leads
FOR SELECT USING (
  auth.role() = 'authenticated' AND 
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admins can update leads"
ON leads
FOR UPDATE USING (
  auth.role() = 'authenticated' AND 
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
