import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import jksLogo from "@/assets/jks-logo.png";
const EmployeeLogin = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!employeeId || !password) {
      toast({
        title: "Error",
        description: "Please enter both Employee ID and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // First check localStorage for admin-added employees
      const localEmployees = JSON.parse(localStorage.getItem('employees') || '[]');
      let employeeFound = localEmployees.find((emp: any) => emp.id === employeeId);
      
      if (!employeeFound) {
        // Check if employee exists in Supabase
        const { data: employee, error } = await supabase
          .from('employees')
          .select('*')
          .eq('employee_id', employeeId)
          .eq('is_active', true)
          .maybeSingle();

        if (employee) {
          employeeFound = {
            id: employee.employee_id,
            name: employee.name,
            email: employee.email,
            department: employee.department,
            designation: employee.position || employee.designation
          };
        }
      }
      
      if (!employeeFound) {
        // Fallback to demo employees
        const demoEmployees = [
          { id: "1106", name: "Arissa Irda Binti Rais", email: "arissa@jks.com.my", department: "HR", designation: "HR Executive" },
          { id: "0123", name: "Alex", email: "alex@jks.com", department: "HR", designation: "HR Manager" },
          { id: "0107", name: "Muhammad Ilyashah Bin Nor Azman", email: "ilyashah@jks.com", department: "IT", designation: "IT Officer" },
        ];
        
        employeeFound = demoEmployees.find(emp => emp.id === employeeId);
      }
      
      if (employeeFound && password === "emp123") {
        // Store employee details for sync
        const employeeData = {
          id: employeeFound.id,
          name: employeeFound.name,
          email: employeeFound.email,
          department: employeeFound.department,
          designation: employeeFound.designation
        };
        
        sessionStorage.setItem('employee-logged-in', 'true');
        sessionStorage.setItem('employee-id', employeeId);
        localStorage.setItem('currentEmployee', JSON.stringify(employeeData));
        
        toast({
          title: "Login Successful",
          description: `Welcome ${employeeFound.name}!`,
        });
        navigate("/employee/scan");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid Employee ID or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };
  return <div className="min-h-screen bg-gradient-jks-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-jks-strong">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-6">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-jks-medium">
              <img src={jksLogo} alt="JKS Logo" className="w-16 h-16 object-contain" />
            </div>
          </div>
          <h1 className="mb-2 text-xl font-semibold text-gray-700">Employee Login</h1>
          <p className="text-sm text-gray-500">Enter your Employee ID and password to access your portal</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input type="text" placeholder="Employee ID" value={employeeId} onChange={e => setEmployeeId(e.target.value)} className="h-12" />
            </div>
            
            <div>
              <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="h-12" />
            </div>
            
            <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-medium" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button onClick={() => navigate("/admin-login")} className="text-primary hover:underline text-sm">
              Login as Admin
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Demo Credentials:</h4>
            <p className="text-sm text-gray-600">Employee ID: Any valid employee ID</p>
            <p className="text-sm text-gray-600">Password: emp123</p>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default EmployeeLogin;