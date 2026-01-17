-- SQL script to create initial users
-- IMPORTANT: You need to create the auth users first via Supabase Dashboard or API
-- Then run the INSERT statements below

-- Step 1: Create auth users via Supabase Dashboard > Authentication > Users > Add User
-- Or use the Supabase Management API

-- Step 2: After creating auth users, get their IDs and run these INSERT statements:

-- For Client User (client@gmail.com)
-- Replace 'USER_ID_FROM_AUTH' with the actual UUID from auth.users
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
-- Replace 'ADMIN_ID_FROM_AUTH' with the actual UUID from auth.users
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
SELECT 'Users created:' as status;
SELECT id, email, full_name, restaurant_name, is_active FROM public.users;
SELECT id, email, full_name, role, is_active FROM public.admins;
