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
