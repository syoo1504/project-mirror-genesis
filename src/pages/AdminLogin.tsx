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
  const {
    toast
  } = useToast();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        variant: "destructive"
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
          description: "Welcome to Admin Dashboard"
        });
        navigate("/admin");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1000);
  };
  return <div className="min-h-screen bg-gradient-jks-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white shadow-jks-strong border-0 overflow-hidden">
          <CardHeader className="text-center pb-2 pt-8">
            {/* JKS Logo */}
            <div className="mx-auto mb-6">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-jks-medium">
                <img src="/lovable-uploads/63555184-67ab-44f8-8ab2-18d6ed91f94e.png" alt="JKS Logo" className="w-16 h-16 object-contain" />
              </div>
            </div>
            
            <div className="space-y-2">
              
              <h2 className="text-xl font-semibold text-gray-700">Admin Login</h2>
              <p className="text-gray-500 text-sm">Enter your username and password to access your portal</p>
            </div>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Username</label>
                <Input type="text" placeholder="Enter your username" value={username} onChange={e => setUsername(e.target.value)} className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20 rounded-lg transition-jks" />
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20 rounded-lg transition-jks" />
              </div>
              
              <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg shadow-jks-light transition-jks" disabled={isLoading}>
                {isLoading ? <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Logging in...
                  </div> : "Admin Login"}
              </Button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600">
                  Employee access?{" "}
                  <button onClick={() => navigate("/employee-login")} className="text-primary font-medium hover:underline transition-jks">
                    Employee Login
                  </button>
                </p>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 font-medium mb-1">Demo Credentials:</p>
                  <p className="text-xs text-gray-500">Username: <span className="font-mono">admin</span></p>
                  <p className="text-xs text-gray-500">Password: <span className="font-mono">admin123</span></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-muted-foreground text-sm">© 2025 JKS Engineering Sdn Bhd - Attendance System</p>
        </div>
      </div>
    </div>;
};
export default AdminLogin;