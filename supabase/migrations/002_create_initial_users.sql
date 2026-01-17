-- Create initial users: client and admin
-- Run this AFTER running 001_create_profiles_table.sql

-- Note: This script creates users in auth.users and then inserts them into the respective tables
-- You may need to run this manually or use Supabase Admin API

-- First, create the auth users using Supabase Auth API or Dashboard
-- Then run the INSERT statements below

-- For the client user (client@gmail.com)
-- After creating the auth user, insert into users table:
-- INSERT INTO public.users (id, email, full_name, restaurant_name, is_active)
-- SELECT id, email, 'Client User', 'Client Restaurant', true
-- FROM auth.users
-- WHERE email = 'client@gmail.com';

-- For the admin user (leanmaximsada@gmail.com)
-- After creating the auth user, insert into admins table:
-- INSERT INTO public.admins (id, email, full_name, role, is_active)
-- SELECT id, email, 'Admin User', 'admin', true
-- FROM auth.users
-- WHERE email = 'leanmaximsada@gmail.com';

-- Alternative: Use Supabase Management API or create users via the application
-- The users will be automatically created in the respective tables via the trigger
