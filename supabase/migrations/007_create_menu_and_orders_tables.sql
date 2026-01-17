-- Migration: Create Menu and Orders Tables
-- This migration creates tables for menu items, orders, and restaurant tables
-- Based on the UI requirements for QR code scanning, menu display, and order management

-- ============================================
-- 1. Categories Table
-- ============================================
-- Drop table if it exists (to ensure clean migration)
-- Note: This will delete existing categories. Re-run the INSERT below to restore defaults.
DROP TABLE IF EXISTS public.categories CASCADE;

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE, -- e.g., 'food', 'drink', 'dessert'
  icon TEXT, -- Optional: icon name or emoji
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default categories
INSERT INTO public.categories (name, slug, icon) VALUES
  ('Food', 'food', '🍽️'),
  ('Drink', 'drink', '🍹'),
  ('Dessert', 'dessert', '🍰')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 2. Menu Items Table
-- ============================================
-- Drop table if it exists (to ensure clean migration)
DROP TABLE IF EXISTS public.menu_items CASCADE;

CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'unavailable')),
  preparation_time INTEGER DEFAULT 0, -- in minutes
  is_featured BOOLEAN DEFAULT false, -- for "recommended" items
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_menu_items_user_id ON public.menu_items(user_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON public.menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_status ON public.menu_items(status);

-- ============================================
-- 3. Restaurant Tables (for QR codes)
-- ============================================
-- Drop table if it exists (to ensure clean migration)
DROP TABLE IF EXISTS public.restaurant_tables CASCADE;

CREATE TABLE public.restaurant_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  table_number TEXT NOT NULL, -- e.g., "01", "02", "Table 5"
  qr_code_data TEXT UNIQUE, -- QR code identifier or data
  qr_code_url TEXT, -- URL to the QR code image
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, table_number)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_restaurant_tables_user_id ON public.restaurant_tables(user_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_tables_qr_code_data ON public.restaurant_tables(qr_code_data);

-- ============================================
-- 4. Orders Table
-- ============================================
-- Drop table if it exists (to ensure clean migration)
DROP TABLE IF EXISTS public.orders CASCADE;

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- restaurant owner
  table_id UUID REFERENCES public.restaurant_tables(id) ON DELETE SET NULL,
  table_number TEXT, -- Denormalized for quick access
  customer_name TEXT, -- Optional: customer can provide name
  order_number TEXT NOT NULL, -- e.g., "#table-01", "#ORDER-123"
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'completed', 'cancelled')),
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  notes TEXT, -- Special instructions from customer
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_table_id ON public.orders(table_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- ============================================
-- 5. Order Items Table (Junction Table)
-- ============================================
-- Drop table if it exists (to ensure clean migration)
DROP TABLE IF EXISTS public.order_items CASCADE;

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_order DECIMAL(10, 2) NOT NULL CHECK (price_at_order >= 0), -- Price at time of order (for historical accuracy)
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0), -- quantity * price_at_order
  special_instructions TEXT, -- Item-specific notes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_menu_item_id ON public.order_items(menu_item_id);

-- ============================================
-- Enable Row Level Security (RLS)
-- ============================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies for Categories
-- ============================================
-- Categories are public (anyone can read)
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone" ON public.categories
  FOR SELECT USING (true);

-- ============================================
-- RLS Policies for Menu Items
-- ============================================
-- Restaurant owners can manage their own menu items
DROP POLICY IF EXISTS "Restaurant owners can insert own menu items" ON public.menu_items;
CREATE POLICY "Restaurant owners can insert own menu items" ON public.menu_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Restaurant owners can update own menu items" ON public.menu_items;
CREATE POLICY "Restaurant owners can update own menu items" ON public.menu_items
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Restaurant owners can delete own menu items" ON public.menu_items;
CREATE POLICY "Restaurant owners can delete own menu items" ON public.menu_items
  FOR DELETE USING (auth.uid() = user_id);

-- Public menu items are viewable by everyone (for QR code menu display)
-- Combined with restaurant owner policy, this allows:
-- - Restaurant owners to see all their items (including unavailable)
-- - Public to see only available items
DROP POLICY IF EXISTS "Available menu items are viewable by everyone" ON public.menu_items;
CREATE POLICY "Available menu items are viewable by everyone" ON public.menu_items
  FOR SELECT USING (status = 'available' OR auth.uid() = user_id);

-- ============================================
-- RLS Policies for Restaurant Tables
-- ============================================
-- Restaurant owners can manage their own tables
DROP POLICY IF EXISTS "Restaurant owners can view own tables" ON public.restaurant_tables;
CREATE POLICY "Restaurant owners can view own tables" ON public.restaurant_tables
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Restaurant owners can insert own tables" ON public.restaurant_tables;
CREATE POLICY "Restaurant owners can insert own tables" ON public.restaurant_tables
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Restaurant owners can update own tables" ON public.restaurant_tables;
CREATE POLICY "Restaurant owners can update own tables" ON public.restaurant_tables
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Restaurant owners can delete own tables" ON public.restaurant_tables;
CREATE POLICY "Restaurant owners can delete own tables" ON public.restaurant_tables
  FOR DELETE USING (auth.uid() = user_id);

-- Tables are viewable by everyone (for QR code scanning)
DROP POLICY IF EXISTS "Active tables are viewable by everyone" ON public.restaurant_tables;
CREATE POLICY "Active tables are viewable by everyone" ON public.restaurant_tables
  FOR SELECT USING (is_active = true);

-- ============================================
-- RLS Policies for Orders
-- ============================================
-- Restaurant owners can view/manage orders for their restaurant
DROP POLICY IF EXISTS "Restaurant owners can view own orders" ON public.orders;
CREATE POLICY "Restaurant owners can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- Restaurant owners can update own orders
DROP POLICY IF EXISTS "Restaurant owners can update own orders" ON public.orders;
CREATE POLICY "Restaurant owners can update own orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Customers can create orders (anonymous - no auth required for INSERT)
-- This allows QR code scanning without requiring login
-- Note: user_id must be set by the application when creating an order
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

-- ============================================
-- RLS Policies for Order Items
-- ============================================
-- Restaurant owners can view order items for their restaurant orders
DROP POLICY IF EXISTS "Restaurant owners can view own order items" ON public.order_items;
CREATE POLICY "Restaurant owners can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Anyone can insert order items (for order creation)
DROP POLICY IF EXISTS "Anyone can insert order items" ON public.order_items;
CREATE POLICY "Anyone can insert order items" ON public.order_items
  FOR INSERT WITH CHECK (true);

-- Restaurant owners can update order items for their orders
DROP POLICY IF EXISTS "Restaurant owners can update own order items" ON public.order_items;
CREATE POLICY "Restaurant owners can update own order items" ON public.order_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- ============================================
-- Triggers for updated_at timestamps
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurant_tables_updated_at BEFORE UPDATE ON public.restaurant_tables
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Function to calculate order total
-- ============================================
CREATE OR REPLACE FUNCTION calculate_order_total(order_uuid UUID)
RETURNS DECIMAL(10, 2) AS $$
BEGIN
  RETURN COALESCE(
    (SELECT SUM(subtotal) FROM public.order_items WHERE order_id = order_uuid),
    0
  );
END;
$$ LANGUAGE plpgsql;

-- Trigger to update order total when order items change
CREATE OR REPLACE FUNCTION update_order_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.orders
  SET total_amount = calculate_order_total(COALESCE(NEW.order_id, OLD.order_id))
  WHERE id = COALESCE(NEW.order_id, OLD.order_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_order_total_on_insert
  AFTER INSERT ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION update_order_total();

CREATE TRIGGER update_order_total_on_update
  AFTER UPDATE ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION update_order_total();

CREATE TRIGGER update_order_total_on_delete
  AFTER DELETE ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION update_order_total();

-- ============================================
-- Function to generate order number
-- This function is provided for reference but should be called from application code
-- with the proper user_id and table_number parameters
-- ============================================
CREATE OR REPLACE FUNCTION generate_order_number(p_user_id UUID, p_table_number TEXT DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  order_count INTEGER;
  order_number TEXT;
BEGIN
  -- Get the current order count for this user today
  SELECT COUNT(*) + 1 INTO order_count
  FROM public.orders
  WHERE user_id = p_user_id
  AND DATE(created_at) = CURRENT_DATE;
  
  -- Format: #table-01-001 or #ORDER-001
  IF p_table_number IS NOT NULL THEN
    order_number := '#' || LOWER(p_table_number) || '-' || LPAD(order_count::TEXT, 3, '0');
  ELSE
    order_number := '#ORDER-' || LPAD(order_count::TEXT, 3, '0');
  END IF;
  
  RETURN order_number;
END;
$$ LANGUAGE plpgsql;
