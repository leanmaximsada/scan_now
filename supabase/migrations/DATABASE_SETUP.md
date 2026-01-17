# Database Setup Instructions

## Quick Setup for Tables Table

The application requires a `tables` table in your Supabase database. This table stores restaurant table information for QR code-based menu ordering.

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase Project Dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the SQL from `create_tables_table_script.sql`
5. Click "Run"

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
supabase migration up
```

## Schema Overview

The `tables` table stores:
- `id`: Unique identifier (UUID)
- `user_id`: Reference to the restaurant owner (auth.users)
- `name`: Table name/number (e.g., "Table 1", "Seat 5")
- `qr_code`: QR code URL or identifier
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update

## RLS Policies

The table has Row Level Security (RLS) enabled with the following policies:
- Users can only SELECT their own tables
- Users can only INSERT tables for themselves
- Users can only UPDATE their own tables
- Users can only DELETE their own tables

## Verification

After running the migration, you should:

1. See the `tables` table in your Supabase database
2. Be able to create new restaurant tables from the dashboard
3. Be able to generate QR codes for each table
4. See the QR codes work when scanning from a customer's device
