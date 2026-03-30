import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Checking authentication...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.roleSlug)) {
    return <Navigate to="/" replace />;
  }

  // Redirect admin to setup if they haven't completed it yet
  if (
    user.roleSlug === "administrator" &&
    !user.setup_completed &&
    window.location.pathname !== "/setup"
  ) {
    return <Navigate to="/setup" replace />;
  }

  return children;
};

export default ProtectedRoute;