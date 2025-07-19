import { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface EmployeeProtectedRouteProps {
  children: ReactNode;
}

const EmployeeProtectedRoute = ({ children }: EmployeeProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in (simple demo check)
    const isLoggedIn = sessionStorage.getItem('employee-logged-in');
    if (!isLoggedIn) {
      navigate("/employee-login");
    }
  }, [navigate]);

  return <>{children}</>;
};

export default EmployeeProtectedRoute;