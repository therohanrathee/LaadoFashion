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
