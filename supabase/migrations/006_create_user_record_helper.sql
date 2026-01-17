-- Helper function to create user record if it doesn't exist
-- This function runs with SECURITY DEFINER so it bypasses RLS
-- Run this to add a helper function for creating user records

CREATE OR REPLACE FUNCTION public.ensure_user_record_exists()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user record already exists
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = NEW.id) THEN
    -- Create user record
    INSERT INTO public.users (id, email, full_name, restaurant_name, is_active)
    VALUES (
      NEW.id,
      COALESCE(NEW.email, ''),
      COALESCE(NULLIF(NEW.raw_user_meta_data->>'full_name', ''), NULL),
      COALESCE(NULLIF(NEW.raw_user_meta_data->>'restaurant_name', ''), NULL),
      true
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- This function can be called from the application if needed
CREATE OR REPLACE FUNCTION public.create_user_record_if_missing(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_email TEXT;
  user_full_name TEXT;
  user_restaurant_name TEXT;
BEGIN
  -- Get user data from auth.users
  SELECT 
    email,
    raw_user_meta_data->>'full_name',
    raw_user_meta_data->>'restaurant_name'
  INTO user_email, user_full_name, user_restaurant_name
  FROM auth.users
  WHERE id = user_id;
  
  -- Check if record exists
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = user_id) THEN
    -- Create user record
    INSERT INTO public.users (id, email, full_name, restaurant_name, is_active)
    VALUES (
      user_id,
      COALESCE(user_email, ''),
      COALESCE(NULLIF(user_full_name, ''), NULL),
      COALESCE(NULLIF(user_restaurant_name, ''), NULL),
      true
    );
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
