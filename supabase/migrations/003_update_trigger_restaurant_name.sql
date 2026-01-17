-- Update the trigger function to include restaurant_name
-- Run this if you already ran 001_create_profiles_table.sql before

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  
  -- Check if user is an admin based on email or metadata
  IF NEW.raw_user_meta_data->>'user_type' = 'admin' THEN
    INSERT INTO public.admins (id, email, full_name, role)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 'admin');
  ELSE
    -- Default to regular user (client)
    INSERT INTO public.users (id, email, full_name, restaurant_name)
    VALUES (
      NEW.id, 
      NEW.email, 
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'restaurant_name', NULL)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
