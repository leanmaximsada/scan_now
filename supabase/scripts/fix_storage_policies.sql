-- Fix storage policies for avatars bucket
-- Run this to update the storage policies for profile image uploads

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own profile images" ON storage.objects;

-- Create policy: Allow authenticated users to upload files that start with their user ID
CREATE POLICY "Users can upload own profile images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Alternative simpler policy: Allow any authenticated user to upload to avatars
-- Use this if the folder-based approach doesn't work
CREATE POLICY "Authenticated users can upload to avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Allow everyone to read from avatars (public bucket)
CREATE POLICY "Anyone can read profile images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Allow authenticated users to update their own files
CREATE POLICY "Users can update own profile images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete own profile images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
