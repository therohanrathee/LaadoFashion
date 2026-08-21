-- Migration 01: Initial Schema for Laado Fashion & Boutique
-- User Roles Enum
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'runner', 'tailor');

-- Order Status Enum
CREATE TYPE order_status AS ENUM (
  'pending_measurement',
  'measurement_in_progress',
  'fabric_received',
  'in_stitching',
  'stitching_complete',
  'out_for_delivery',
  'delivered',
  'returned'
);

-- Profiles Table (Extends Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role DEFAULT 'customer'::user_role NOT NULL,
  active BOOLEAN DEFAULT true, -- Mainly used to toggle runner availability
  has_password BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Catalog Items Table
CREATE TABLE catalog_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  base_price NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Addons Table
CREATE TABLE addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_item_id UUID REFERENCES catalog_items(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  catalog_item_id UUID REFERENCES catalog_items(id) ON DELETE CASCADE NOT NULL,
  status order_status DEFAULT 'pending_measurement'::order_status NOT NULL,
  
  -- Geolocation & Address
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  address TEXT NOT NULL,
  
  -- Assignments
  runner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  tailor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Pricing & Payment
  total_estimated_cost NUMERIC(10, 2) NOT NULL,
  amount_paid NUMERIC(10, 2) DEFAULT 0 NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Order Addons Linking Table
CREATE TABLE order_addons (
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  addon_id UUID REFERENCES addons(id) ON DELETE CASCADE,
  PRIMARY KEY (order_id, addon_id)
);

-- Task Logs (For employee auditing & billing)
CREATE TABLE task_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL, -- e.g., 'measurement_completed', 'stitching_completed'
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Function to automatically create a profile after Supabase Auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'customer'::user_role);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run the function after user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_logs ENABLE ROW LEVEL SECURITY;

-- Note: RLS Policies will be added in the next migration or based on specific access needs.
