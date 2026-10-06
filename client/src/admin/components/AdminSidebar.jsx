import { NavLink } from "react-router-dom";

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        MERN<span>Shop</span>
      </div>

      <div className="admin-label">
        ADMIN PANEL
      </div>

      <nav className="admin-menu">
        <NavLink to="/admin" end>
          📊 Dashboard
        </NavLink>

        <NavLink to="/admin/products">
          📦 Products
        </NavLink>

        <NavLink to="/admin/categories">
          📁 Categories
        </NavLink>

        <NavLink to="/admin/attributes">
          ⚙️ Attributes
        </NavLink>

        <NavLink to="/admin/orders">
          🛒 Orders
        </NavLink>
      </nav>

      <div className="admin-sidebar-bottom">
        <NavLink to="/">
          ← View Store
        </NavLink>
      </div>
    </aside>
  );
}

export default AdminSidebar;