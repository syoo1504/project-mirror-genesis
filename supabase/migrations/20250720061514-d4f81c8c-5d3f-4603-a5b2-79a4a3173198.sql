-- Fix the migration and admin setup issues

-- First, create a temporary bypass for data migration by admins
-- This allows initial data setup and migration when no admin profile exists yet

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can manage all employees" ON public.employees;
DROP POLICY IF EXISTS "Admins can manage all attendance records" ON public.attendance_records;

-- Create more permissive policies for initial setup
-- These allow authenticated users to perform initial data migration
CREATE POLICY "Allow initial employee migration"
ON public.employees
FOR ALL
USING (
  -- Allow if user is admin OR if this is initial data migration (no profiles exist yet)
  public.is_admin(auth.uid()) OR 
  NOT EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin')
);

CREATE POLICY "Allow initial attendance migration"
ON public.attendance_records
FOR ALL
USING (
  -- Allow if user is admin OR if this is initial data migration
  public.is_admin(auth.uid()) OR 
  NOT EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin')
);

-- Insert an initial admin profile for the authenticated user if none exists
-- This should be run after the first user authenticates
-- Note: This will need to be done through the application after auth

-- Ensure employees table has all required columns with proper defaults
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS designation TEXT;

-- Update any existing records where designation is null but position exists
UPDATE public.employees 
SET designation = position 
WHERE designation IS NULL AND position IS NOT NULL;

-- Add a function to create admin profile for the first authenticated user
CREATE OR REPLACE FUNCTION public.ensure_admin_exists()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only create admin if no admin exists and there's an authenticated user
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin') 
     AND auth.uid() IS NOT NULL THEN
    INSERT INTO public.profiles (
      user_id, 
      employee_id, 
      name, 
      email, 
      role,
      department,
      position
    ) VALUES (
      auth.uid(),
      'ADMIN001',
      'System Administrator',
      auth.email(),
      'admin',
      'IT',
      'Administrator'
    ) ON CONFLICT (employee_id) DO NOTHING;
  END IF;
END;
$$;