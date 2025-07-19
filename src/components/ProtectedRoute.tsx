import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // For demo purposes, always allow access
  // In a real app, you would check authentication here
  return <>{children}</>;
};

export default ProtectedRoute;