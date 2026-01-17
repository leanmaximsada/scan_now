-- Fix the trigger function to handle errors better and use ON CONFLICT
-- Run this to update the trigger function

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles (with ON CONFLICT handling)
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name;
  
  -- Check if user is an admin based on metadata
  IF NEW.raw_user_meta_data->>'user_type' = 'admin' THEN
    INSERT INTO public.admins (id, email, full_name, role)
    VALUES (
      NEW.id, 
      NEW.email, 
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      'admin'
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      role = EXCLUDED.role;
  ELSE
    -- Default to regular user (client)
    INSERT INTO public.users (id, email, full_name, restaurant_name, is_active)
    VALUES (
      NEW.id, 
      COALESCE(NEW.email, ''),
      COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
      COALESCE(NULLIF(NEW.raw_user_meta_data->>'restaurant_name', ''), NULL),
      true
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      restaurant_name = EXCLUDED.restaurant_name,
      is_active = EXCLUDED.is_active;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
