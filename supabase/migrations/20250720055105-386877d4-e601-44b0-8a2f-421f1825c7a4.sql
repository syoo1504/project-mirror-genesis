-- Fix the infinite recursion in profiles RLS policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles; 
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;

-- Create a function to check admin role without recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = $1 AND p.role = 'admin'
  )
$$;

-- Recreate policies using the function to avoid recursion
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_admin(auth.uid()) OR auth.uid() = user_id);

CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (public.is_admin(auth.uid()) OR auth.uid() = user_id);

CREATE POLICY "Admins can insert profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

-- Also fix attendance_records and employees policies to use the function
DROP POLICY IF EXISTS "Admins can manage all employees" ON public.employees;
DROP POLICY IF EXISTS "Admins can manage all attendance records" ON public.attendance_records;

CREATE POLICY "Admins can manage all employees" 
ON public.employees 
FOR ALL 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all attendance records" 
ON public.attendance_records 
FOR ALL 
USING (public.is_admin(auth.uid()));

-- Add proper composite unique constraint for attendance records
ALTER TABLE public.attendance_records 
DROP CONSTRAINT IF EXISTS attendance_records_employee_id_attendance_date_key;

ALTER TABLE public.attendance_records 
ADD CONSTRAINT attendance_records_employee_id_attendance_date_key 
UNIQUE (employee_id, attendance_date);