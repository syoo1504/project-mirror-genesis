-- Create user profiles table for extended user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  department TEXT,
  position TEXT,
  role TEXT DEFAULT 'employee' CHECK (role IN ('admin', 'employee')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can insert profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create employees table for legacy data structure compatibility
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  department TEXT,
  position TEXT,
  is_active BOOLEAN DEFAULT true,
  password_hash TEXT, -- For legacy compatibility
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for employees
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Create policies for employees
CREATE POLICY "Admins can manage all employees" 
ON public.employees 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create attendance_records table
CREATE TABLE public.attendance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id TEXT NOT NULL,
  check_in_time TIMESTAMP WITH TIME ZONE,
  check_out_time TIMESTAMP WITH TIME ZONE,
  location TEXT,
  attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'present' CHECK (status IN ('present', 'late', 'absent')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for attendance_records
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- Create policies for attendance_records
CREATE POLICY "Employees can view their own attendance" 
ON public.attendance_records 
FOR SELECT 
USING (
  employee_id = (
    SELECT employee_id FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Employees can insert their own attendance" 
ON public.attendance_records 
FOR INSERT 
WITH CHECK (
  employee_id = (
    SELECT employee_id FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all attendance records" 
ON public.attendance_records 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Insert sample admin user (this will create an auth user and profile)
-- Note: You'll need to create the admin user through Supabase Auth first
-- then update their profile with admin role

-- Insert sample employees data
INSERT INTO public.employees (employee_id, name, email, department, position, password_hash) VALUES
('EMP001', 'John Doe', 'john.doe@jks.com', 'Engineering', 'Senior Developer', crypt('emp123', gen_salt('bf'))),
('EMP002', 'Sarah Smith', 'sarah.smith@jks.com', 'Marketing', 'Marketing Manager', crypt('emp123', gen_salt('bf'))),
('EMP003', 'Mike Johnson', 'mike.johnson@jks.com', 'Sales', 'Sales Representative', crypt('emp123', gen_salt('bf'))),
('EMP004', 'Emily Davis', 'emily.davis@jks.com', 'HR', 'HR Specialist', crypt('emp123', gen_salt('bf'))),
('1106', 'Arissa Irda Binti Rais', 'arissa@jks.com', 'HR', 'HR Manager', crypt('emp123', gen_salt('bf')));

-- Insert sample attendance records
INSERT INTO public.attendance_records (employee_id, check_in_time, location, attendance_date, status) VALUES
('EMP001', now() - interval '3 hours', 'Office Main', CURRENT_DATE, 'present'),
('EMP002', now() - interval '4 hours', 'Office Branch', CURRENT_DATE, 'present'),
('EMP003', now() - interval '2.5 hours', 'Remote', CURRENT_DATE, 'late'),
('1106', now() - interval '1 hour', 'Office Main', CURRENT_DATE, 'present');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attendance_records_updated_at
  BEFORE UPDATE ON public.attendance_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the new user's email matches an existing employee
  IF NEW.email IS NOT NULL THEN
    INSERT INTO public.profiles (user_id, employee_id, name, email, department, position, role)
    SELECT 
      NEW.id,
      e.employee_id,
      e.name,
      e.email,
      e.department,
      e.position,
      'employee'
    FROM public.employees e
    WHERE e.email = NEW.email AND e.is_active = true
    ON CONFLICT (employee_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable the pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;