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
  const { toast } = useToast();

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
    
    // Demo login - accept any valid employee ID with password "emp123"
    setTimeout(() => {
      if (password === "emp123") {
        localStorage.setItem("employeeLoggedIn", "true");
        localStorage.setItem("currentEmployee", JSON.stringify({
          id: employeeId,
          name: `Employee ${employeeId}`,
          department: "General"
        }));
        
        toast({
          title: "Login Successful",
          description: "Welcome to AttendEase Employee Portal",
        });
        
        navigate("/employee/scan");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Use password: emp123",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #ADD8E6 0%, #87CEEB 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-2xl">JKS</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Employee Login</h1>
          <p className="text-gray-600">Enter your Employee ID and password to access your portal</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="h-12"
              />
            </div>
            
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-gray-800 hover:bg-gray-900 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/admin-login")}
              className="text-blue-600 hover:underline text-sm"
            >
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
    </div>
  );
};

export default EmployeeLogin;
