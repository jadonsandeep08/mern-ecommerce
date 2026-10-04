function Dashboard() {
  return (
    <>
      <div className="admin-page-title">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your ecommerce store.</p>
        </div>
      </div>

      <div className="dashboard-cards">

        <div className="dashboard-card">
          <div className="dashboard-icon">📦</div>

          <div>
            <span>Total Products</span>
            <strong>10</strong>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-icon">🗂️</div>

          <div>
            <span>Categories</span>
            <strong>5</strong>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-icon">⚙️</div>

          <div>
            <span>Attributes</span>
            <strong>3</strong>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-icon">🛒</div>

          <div>
            <span>Orders</span>
            <strong>0</strong>
          </div>
        </div>

      </div>
    </>
  );
}

export default Dashboard;