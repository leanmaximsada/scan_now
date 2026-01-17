-- Run this SQL in your Supabase SQL Editor to create the tables table
-- Go to: Dashboard > SQL Editor > New Query > Paste this content > Run

DROP TABLE IF EXISTS public.tables CASCADE;

CREATE TABLE public.tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  qr_code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tables_user_id ON public.tables(user_id);
CREATE INDEX IF NOT EXISTS idx_tables_qr_code ON public.tables(qr_code);

ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;

CREATE POLICY tables_select_own ON public.tables
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY tables_insert_own ON public.tables
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY tables_update_own ON public.tables
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY tables_delete_own ON public.tables
  FOR DELETE USING (auth.uid() = user_id);
