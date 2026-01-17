-- Migration: Create Tables Table for QR Code Restaurant Tables
-- This migration creates a simplified 'tables' table for restaurant table management
-- with QR code support

-- ============================================
-- Create Tables Table (simplified from restaurant_tables)
-- ============================================
DROP TABLE IF EXISTS public.tables CASCADE;

CREATE TABLE public.tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- Table name/number (e.g., "Table 1", "Seat 5")
  qr_code TEXT UNIQUE, -- QR code URL or data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_tables_user_id ON public.tables(user_id);
CREATE INDEX IF NOT EXISTS idx_tables_qr_code ON public.tables(qr_code);

-- Enable RLS
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own tables
CREATE POLICY tables_select_own ON public.tables
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own tables
CREATE POLICY tables_insert_own ON public.tables
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own tables
CREATE POLICY tables_update_own ON public.tables
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policy: Users can delete their own tables
CREATE POLICY tables_delete_own ON public.tables
  FOR DELETE USING (auth.uid() = user_id);
