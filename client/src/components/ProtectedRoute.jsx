import {
  Navigate,
  useLocation
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";


function ProtectedRoute({ children }) {
  const {
    user,
    loading,
    isCustomer
  } = useAuth();

  const location = useLocation();

  // Wait until authentication state
  // has been loaded from localStorage
  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center"
        }}
      >
        Loading...
      </div>
    );
  }

  // Customer is not logged in
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname
        }}
        replace
      />
    );
  }

  // Logged-in admin cannot access
  // customer-only pages
  if (!isCustomer) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  // Customer is authenticated
  return children;
}

export default ProtectedRoute;