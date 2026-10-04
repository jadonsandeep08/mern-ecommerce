function AdminHeader() {
  return (
    <header className="admin-header">
      <div>
        <h3>Administration</h3>
        <p>Manage your ecommerce store</p>
      </div>

      <div className="admin-user">
        <div className="admin-avatar">A</div>

        <div>
          <strong>Administrator</strong>
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;