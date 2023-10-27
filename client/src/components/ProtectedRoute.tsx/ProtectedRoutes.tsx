import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthorDataStore } from "../../Storage/authorStorage";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
}: ProtectedRouteProps) => {
  const user = useAuthorDataStore((state) => state.authorData);
  if (!user?._id) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
