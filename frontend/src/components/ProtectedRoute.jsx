import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRole }) {

  const {
    user,
    loading,
    isAuthenticated
  } = useAuth();

  // Wait until authentication is checked
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "18px"
        }}
      >
        Loading...
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role
  if (
    allowedRole &&
    user.role !== allowedRole
  ) {

    if (user.role === "ADMIN") {
      return (
        <Navigate
          to="/admin"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/farmer"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;