import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Demo admin login (username: admin, password: admin123)
    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("currentAdmin", JSON.stringify({
          username: username,
          name: "System Administrator",
          role: "Admin"
        }));
        
        toast({
          title: "Login Successful",
          description: "Welcome to Admin Dashboard",
        });
        
        navigate("/admin");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Login</h1>
          <p className="text-gray-600">Access the administrative dashboard</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
              className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Admin Login"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Employee access?{" "}
              <button
                onClick={() => navigate("/employee-login")}
                className="text-blue-600 hover:underline"
              >
                Employee Login
              </button>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Demo: admin / admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
