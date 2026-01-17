-- Run this AFTER creating the auth users in Supabase Dashboard
-- This will insert them into the users and admins tables

-- For Client User (client@gmail.com)
-- This assumes the auth user already exists
INSERT INTO public.users (id, email, full_name, restaurant_name, is_active)
SELECT id, email, 'Client User', 'Client Restaurant', true
FROM auth.users
WHERE email = 'client@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  restaurant_name = EXCLUDED.restaurant_name,
  is_active = EXCLUDED.is_active;

-- For Admin User (leanmaximsada@gmail.com)
-- This assumes the auth user already exists
INSERT INTO public.admins (id, email, full_name, role, is_active)
SELECT id, email, 'Admin User', 'admin', true
FROM auth.users
WHERE email = 'leanmaximsada@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- Verify the users were created
SELECT 'Users in users table:' as info;
SELECT id, email, full_name, restaurant_name, is_active FROM public.users WHERE email IN ('client@gmail.com', 'leanmaximsada@gmail.com');

SELECT 'Users in admins table:' as info;
SELECT id, email, full_name, role, is_active FROM public.admins WHERE email = 'leanmaximsada@gmail.com';
