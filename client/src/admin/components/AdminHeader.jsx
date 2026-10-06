import {
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../../context/AuthContext";


function AdminHeader() {
  const navigate = useNavigate();

  const {
    user,
    logout
  } = useAuth();

  const handleLogout = () => {
    logout();

    navigate(
      "/admin/login",
      {
        replace: true
      }
    );
  };

  const getInitial = () => {
    if (!user?.name) {
      return "A";
    }

    return user.name
      .charAt(0)
      .toUpperCase();
  };

  return (
    <header className="admin-header">

      <div>
        <h3>Administration</h3>

        <p>
          Manage your ecommerce store
        </p>
      </div>

      <div className="admin-user">

        <div className="admin-avatar">
          {getInitial()}
        </div>

        <div className="admin-user-info">
          <strong>
            {user?.name || "Administrator"}
          </strong>

          <span>
            {user?.email || "Admin"}
          </span>
        </div>

        <button
          type="button"
          className="admin-logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </header>
  );
}

export default AdminHeader;