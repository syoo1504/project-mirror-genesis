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
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);

    try {
      // Check if employee exists in the employees table
      const { data: employee, error: empError } = await supabase
        .from('employees')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('is_active', true)
        .single();

      if (empError || !employee) {
        toast({
          title: "Login Failed",
          description: "Invalid Employee ID",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Try to sign in with email if exists, otherwise use employeeId@jks.com
      const email = employee.email || `${employeeId}@jks.com`;
      
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (signInError && signInError.message.includes("Invalid login credentials")) {
        // If auth account doesn't exist, create it
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            emailRedirectTo: `${window.location.origin}/employee/scan`
          }
        });

        if (signUpError) {
          toast({
            title: "Login Failed",
            description: "Unable to create account. Please contact admin.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        // Create profile for the new user
        if (signUpData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              user_id: signUpData.user.id,
              employee_id: employee.employee_id,
              name: employee.name,
              email: email,
              department: employee.department,
              position: employee.position,
              role: 'employee'
            });

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }
        }

        toast({
          title: "Account Created",
          description: "Employee account created successfully!"
        });
        navigate("/employee/scan");
      } else if (signInError) {
        toast({
          title: "Login Failed",
          description: signInError.message,
          variant: "destructive"
        });
      } else {
        // Successful login
        toast({
          title: "Login Successful",
          description: "Welcome to AttendEase Employee Portal"
        });
        navigate("/employee/scan");
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred during login",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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