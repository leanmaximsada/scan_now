# Supabase Database Setup

## Running the Migrations

### Step 1: Create Tables

**IMPORTANT:** You must run this migration FIRST before creating users!

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `migrations/001_create_profiles_table.sql`
4. Click **Run** (or press CTRL + Enter) to execute the migration
5. Verify tables were created by running `scripts/verify_tables.sql`

**If you see errors about policies existing**, that's okay - the migration will handle it by dropping and recreating them.

### Step 2: Create Initial Users

You have two options to create the initial users:

#### Option A: Using Node.js Script (Recommended)

1. Make sure you have Node.js installed
2. Set environment variables:
   ```bash
   export NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   ```
3. Run the script:
   ```bash
   node supabase/scripts/create_initial_users.js
   ```

#### Option B: Manual Creation via SQL

1. First, create the auth users in Supabase Dashboard:
   - Go to **Authentication** > **Users** > **Add User**
   - Create user: `client@gmail.com` / password: `27102006`
   - Create user: `leanmaximsada@gmail.com` / password: `Max27102006`
2. Then run the SQL from `scripts/create_initial_users.sql` in the SQL Editor

## What This Creates

### Tables

- **profiles table**: Extends Supabase's built-in `auth.users` table with additional user information
- **users table**: For clients (restaurant owners who use the digital menu service)
  - Stores: email, full_name, restaurant_name, phone, is_active
- **admins table**: For administrators who manage all clients
  - Stores: email, full_name, role, is_active

### Security

- **Row Level Security (RLS)**: Enabled on all tables
- **Policies**: 
  - Users can only access their own data
  - Admins can view and manage all users
  - Automatic profile/user/admin creation on signup

### Initial Users

- **Client**: `client@gmail.com` / `27102006`
- **Admin**: `leanmaximsada@gmail.com` / `Max27102006`

## Using Supabase Auth

Supabase handles authentication through the `auth.users` table automatically. The additional tables store:
- **profiles**: General user profile information
- **users**: Client-specific information (restaurant owners)
- **admins**: Administrator information

## Next Steps

After running the migrations, your login and register pages are already configured to use Supabase Auth:
- `supabase.auth.signUp()` for registration
- `supabase.auth.signInWithPassword()` for login
- `supabase.auth.signOut()` for logout

You can check user roles by querying the `users` or `admins` tables after authentication.
