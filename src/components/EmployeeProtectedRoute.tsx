import { ReactNode } from "react";

interface EmployeeProtectedRouteProps {
  children: ReactNode;
}

const EmployeeProtectedRoute = ({ children }: EmployeeProtectedRouteProps) => {
  // For demo purposes, always allow access
  // In a real app, you would check authentication here
  return <>{children}</>;
};

export default EmployeeProtectedRoute;