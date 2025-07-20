-- Create additional columns for employees table to match the required structure
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS designation TEXT;

-- Update existing position column to designation for consistency
UPDATE public.employees SET designation = position WHERE designation IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_employees_employee_id ON public.employees(employee_id);
CREATE INDEX IF NOT EXISTS idx_employees_email ON public.employees(email);

-- Update trigger for timestamps
CREATE TRIGGER IF NOT EXISTS update_employees_updated_at
    BEFORE UPDATE ON public.employees
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();