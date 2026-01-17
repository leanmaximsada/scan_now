-- Diagnostic script to check trigger and table setup
-- Run this to diagnose why the trigger might be failing

-- Check if trigger exists
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Check if function exists
SELECT 
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';

-- Check table existence and structure
SELECT 'profiles' as table_name, COUNT(*) as exists_count
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'profiles'
UNION ALL
SELECT 'users' as table_name, COUNT(*) as exists_count
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'users'
UNION ALL
SELECT 'admins' as table_name, COUNT(*) as exists_count
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'admins';

-- Check RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' AND tablename IN ('profiles', 'users', 'admins');

-- Check if there are any existing users in auth.users
SELECT COUNT(*) as auth_users_count FROM auth.users;

-- Check if there are any existing users in public.users
SELECT COUNT(*) as public_users_count FROM public.users;
