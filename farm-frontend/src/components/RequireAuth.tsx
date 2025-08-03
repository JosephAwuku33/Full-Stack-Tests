// src/components/RequireAuth.tsx
import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuthStore } from "../stores/authStore";
import { isTokenExpired } from "@/utils/authHelpers";

interface RequireAuthProps {
  children: React.ReactNode;
  role?: "farmer" | "customer";
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children, role }) => {
  const { token, user, clearAuth } = useAuthStore();
  const location = useLocation();

  if (!user || !token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (isTokenExpired(token)) {
    clearAuth();
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If role specified and doesn't match, forbid / redirect
  if (role && user.role !== role) {
    // Could send to a "not authorized" page or home
    return <Navigate to="/" replace />;
  }


  return <>{children}</>;
};

export default RequireAuth;
