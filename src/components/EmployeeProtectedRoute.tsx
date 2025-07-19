import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface EmployeeProtectedRouteProps {
  children: React.ReactNode;
}

const EmployeeProtectedRoute = ({ children }: EmployeeProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isEmployeeLoggedIn = localStorage.getItem("employeeLoggedIn");
    
    if (!isEmployeeLoggedIn) {
      navigate("/employee-login");
    }
  }, [navigate]);

  const isEmployeeLoggedIn = localStorage.getItem("employeeLoggedIn");

  if (!isEmployeeLoggedIn) {
    return null;
  }

  return <>{children}</>;
};

export default EmployeeProtectedRoute;