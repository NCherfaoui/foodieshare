import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};