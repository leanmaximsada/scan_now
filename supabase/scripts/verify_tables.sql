-- Verify that all tables were created successfully
-- Run this after running the migration

SELECT 'Checking if tables exist...' as status;

-- Check profiles table
SELECT 
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles')
    THEN '✅ profiles table exists'
    ELSE '❌ profiles table does NOT exist'
  END as profiles_check;

-- Check users table
SELECT 
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users')
    THEN '✅ users table exists'
    ELSE '❌ users table does NOT exist'
  END as users_check;

-- Check admins table
SELECT 
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admins')
    THEN '✅ admins table exists'
    ELSE '❌ admins table does NOT exist'
  END as admins_check;

-- Show table structures if they exist
SELECT 'profiles table structure:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

SELECT 'users table structure:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'users'
ORDER BY ordinal_position;

SELECT 'admins table structure:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'admins'
ORDER BY ordinal_position;
