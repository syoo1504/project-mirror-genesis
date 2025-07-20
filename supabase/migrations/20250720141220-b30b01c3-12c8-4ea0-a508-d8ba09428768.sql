-- Create admin_logins table to track admin login activity
CREATE TABLE public.admin_logins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_username TEXT NOT NULL,
  admin_name TEXT,
  login_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_logins ENABLE ROW LEVEL SECURITY;

-- Create policies for admin login access
CREATE POLICY "Admins can view all admin logins" 
ON public.admin_logins 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Allow inserting admin logins" 
ON public.admin_logins 
FOR INSERT 
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_admin_logins_username ON public.admin_logins(admin_username);
CREATE INDEX idx_admin_logins_login_time ON public.admin_logins(login_time);