import {
  Navigate,
  useLocation
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";


function AdminRoute({ children }) {
  const {
    user,
    loading,
    isAdmin
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

  // Admin is not logged in
  if (!user) {
    return (
      <Navigate
        to="/admin/login"
        state={{
          from: location.pathname
        }}
        replace
      />
    );
  }

  // Logged-in customer cannot access
  // admin pages
  if (!isAdmin) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // Admin is authenticated
  return children;
}

export default AdminRoute;