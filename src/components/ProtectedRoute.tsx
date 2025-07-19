import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn");
    
    if (!isAdminLoggedIn) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const isAdminLoggedIn = localStorage.getItem("adminLoggedIn");

  if (!isAdminLoggedIn) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;