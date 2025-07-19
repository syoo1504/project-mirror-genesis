import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
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

    // Simple demo authentication
    setTimeout(() => {
      // For demo, accept any employee ID with password "emp123"
      if (password === "emp123") {
        // Set session storage to mark user as logged in
        sessionStorage.setItem('employee-logged-in', 'true');
        sessionStorage.setItem('employee-id', employeeId);
        
        toast({
          title: "Login Successful",
          description: "Welcome to AttendEase Employee Portal",
        });
        navigate("/employee/scan");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid Employee ID or password",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
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