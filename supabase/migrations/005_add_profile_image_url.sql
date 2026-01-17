-- Add profile_image_url column to users table
-- Run this migration to enable profile image uploads

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS profile_image_url TEXT;

-- Create storage bucket for profile images (avatars)
-- Note: You may need to create this bucket manually in Supabase Dashboard > Storage
-- The bucket name should be 'avatars' with public access

-- Instructions:
-- 1. Go to Supabase Dashboard > Storage
-- 2. Create a new bucket named 'avatars'
-- 3. Set it to 'Public bucket' 
-- 4. Set the policies to allow authenticated users to upload and read
