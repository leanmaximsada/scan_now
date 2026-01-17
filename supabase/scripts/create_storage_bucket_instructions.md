# Setting Up Storage Bucket for Profile Images

## Step 1: Create the Bucket (Required)

1. Go to your Supabase Dashboard
2. Navigate to **Storage**
3. Click **"Create Bucket"**
4. Configure the bucket:
   - **Name**: `avatars`
   - **Public bucket**: Yes (check this)
   - **File size limit**: 52428800 (50MB)
   - **Allowed MIME types**: Leave empty or add `image/*`
5. Click **"Create bucket"**

## Step 2: Set Up Storage Policies (Required)

After creating the bucket, you need to set up storage policies. You have two options:

### Option A: Via SQL (Recommended - Fastest)

Run the SQL from `simple_storage_policies.sql` in the Supabase SQL Editor. This will:
- Remove any conflicting policies
- Create policies that allow authenticated users to upload/update/delete
- Allow public read access

### Option B: Via Dashboard

1. Go to **Storage** > **Policies** tab
2. For the `avatars` bucket, create these policies:

**Policy 1: Allow authenticated upload**
- Policy name: "Allow authenticated upload to avatars"
- Allowed operation: INSERT
- Target roles: authenticated
- Policy definition: `bucket_id = 'avatars'`

**Policy 2: Allow public read**
- Policy name: "Allow public read from avatars"
- Allowed operation: SELECT
- Target roles: public
- Policy definition: `bucket_id = 'avatars'`

**Policy 3: Allow authenticated update**
- Policy name: "Allow authenticated update in avatars"
- Allowed operation: UPDATE
- Target roles: authenticated
- Policy definition: `bucket_id = 'avatars'`

**Policy 4: Allow authenticated delete**
- Policy name: "Allow authenticated delete in avatars"
- Allowed operation: DELETE
- Target roles: authenticated
- Policy definition: `bucket_id = 'avatars'`

## Testing

After setting up the bucket and policies:
1. Go to the profile page at `/dashboard/profile`
2. Upload a profile image
3. Verify it displays correctly
4. Try updating the image (should replace the old one)

## Troubleshooting

If you get "new row violates row-level security policy" error:
1. Make sure you've created the bucket
2. Run `simple_storage_policies.sql` to fix the policies
3. Verify the bucket is set to "Public bucket"
