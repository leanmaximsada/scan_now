-- Create storage bucket for profile images
-- Run this in Supabase SQL Editor

-- Note: Storage buckets are typically created via the Supabase Dashboard
-- Go to: Storage > Create Bucket
-- Name: avatars
-- Public bucket: Yes
-- File size limit: 52428800 (50MB)
-- Allowed MIME types: image/*

-- However, you can also create it via SQL (requires superuser privileges):

-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES (
--   'avatars',
--   'avatars',
--   true,
--   52428800,
--   ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
-- )
-- ON CONFLICT (id) DO NOTHING;

-- Create storage policy: Allow authenticated users to upload their own profile images
INSERT INTO storage.policies (name, definition, check_expression, bucket_id, command)
VALUES (
  'Users can upload own profile images',
  '(bucket_id = ''avatars''::text) AND ((auth.uid())::text = (storage.foldername(name))[1])',
  '(bucket_id = ''avatars''::text) AND ((auth.uid())::text = (storage.foldername(name))[1])',
  'avatars',
  'INSERT'
)
ON CONFLICT DO NOTHING;

-- Allow authenticated users to read all profile images (public bucket)
INSERT INTO storage.policies (name, definition, check_expression, bucket_id, command)
VALUES (
  'Anyone can read profile images',
  'bucket_id = ''avatars''::text',
  'bucket_id = ''avatars''::text',
  'avatars',
  'SELECT'
)
ON CONFLICT DO NOTHING;

-- Allow users to update/delete their own profile images
INSERT INTO storage.policies (name, definition, check_expression, bucket_id, command)
VALUES (
  'Users can update own profile images',
  '(bucket_id = ''avatars''::text) AND ((auth.uid())::text = (storage.foldername(name))[1])',
  '(bucket_id = ''avatars''::text) AND ((auth.uid())::text = (storage.foldername(name))[1])',
  'avatars',
  'UPDATE'
)
ON CONFLICT DO NOTHING;

INSERT INTO storage.policies (name, definition, check_expression, bucket_id, command)
VALUES (
  'Users can delete own profile images',
  '(bucket_id = ''avatars''::text) AND ((auth.uid())::text = (storage.foldername(name))[1])',
  '(bucket_id = ''avatars''::text) AND ((auth.uid())::text = (storage.foldername(name))[1])',
  'avatars',
  'DELETE'
)
ON CONFLICT DO NOTHING;
