import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, allowedRoles, user }) => {
  if (!user) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/" replace />;
  return children;
};
