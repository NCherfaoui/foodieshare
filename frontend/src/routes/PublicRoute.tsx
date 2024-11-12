import { Navigate, Outlet } from "react-router-dom";

export const PublicRoute = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};