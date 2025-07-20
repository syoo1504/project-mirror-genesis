-- Create a view that joins attendance_records with employee details
CREATE OR REPLACE VIEW public.attendance_with_employee_details AS
SELECT 
    ar.id,
    ar.employee_id,
    ar.check_in_time,
    ar.check_out_time,
    ar.attendance_date,
    ar.location,
    ar.status,
    ar.notes,
    ar.created_at,
    ar.updated_at,
    COALESCE(e.name, p.name) as employee_name,
    COALESCE(e.email, p.email) as employee_email,
    COALESCE(e.department, p.department) as department,
    COALESCE(e.position, p.position) as position,
    COALESCE(e.designation, '') as designation
FROM public.attendance_records ar
LEFT JOIN public.employees e ON ar.employee_id = e.employee_id
LEFT JOIN public.profiles p ON ar.employee_id = p.employee_id
ORDER BY ar.attendance_date DESC, ar.created_at DESC;

-- Enable RLS on the view
ALTER VIEW public.attendance_with_employee_details SET OWNER TO postgres;

-- Create RLS policies for the view
CREATE POLICY "Admins can view all attendance with details" 
ON public.attendance_with_employee_details 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Employees can view their own attendance with details" 
ON public.attendance_with_employee_details 
FOR SELECT 
USING (employee_id = (SELECT profiles.employee_id FROM profiles WHERE profiles.user_id = auth.uid()));