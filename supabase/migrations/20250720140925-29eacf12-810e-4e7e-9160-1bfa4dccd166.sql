-- Create employee_logins table to track employee login activity
CREATE TABLE public.employee_logins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id TEXT NOT NULL,
  employee_name TEXT,
  login_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.employee_logins ENABLE ROW LEVEL SECURITY;

-- Create policies for employee login access
CREATE POLICY "Admins can view all employee logins" 
ON public.employee_logins 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Employees can view their own logins" 
ON public.employee_logins 
FOR SELECT 
USING (employee_id = (SELECT profiles.employee_id FROM profiles WHERE profiles.user_id = auth.uid()));

CREATE POLICY "Allow inserting employee logins" 
ON public.employee_logins 
FOR INSERT 
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_employee_logins_employee_id ON public.employee_logins(employee_id);
CREATE INDEX idx_employee_logins_login_time ON public.employee_logins(login_time);