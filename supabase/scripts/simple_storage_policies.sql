-- Simple storage policies for avatars bucket
-- This allows any authenticated user to upload, update, and delete in the avatars bucket
-- Run this in Supabase SQL Editor

-- First, make sure the bucket exists (create it in Dashboard if it doesn't)
-- Storage > Create Bucket > Name: avatars > Public: Yes

-- Drop all existing policies on storage.objects for avatars bucket
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname LIKE '%avatars%' OR policyname LIKE '%profile%') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON storage.objects';
    END LOOP;
END $$;

-- Policy 1: Allow authenticated users to INSERT (upload) any file to avatars bucket
CREATE POLICY "Allow authenticated upload to avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Policy 2: Allow public to SELECT (read) from avatars bucket
CREATE POLICY "Allow public read from avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Policy 3: Allow authenticated users to UPDATE files in avatars bucket
CREATE POLICY "Allow authenticated update in avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars')
WITH CHECK (bucket_id = 'avatars');

-- Policy 4: Allow authenticated users to DELETE files in avatars bucket
CREATE POLICY "Allow authenticated delete in avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'avatars');
