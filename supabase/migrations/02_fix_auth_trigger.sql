-- Migration 02: Fix auth trigger null constraint
-- Occasionally, user_metadata might be delayed or missing during initial insert via admin API.
-- This ensures the insert doesn't fail due to a NULL full_name.

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'New Customer'), 
    'customer'::user_role
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
