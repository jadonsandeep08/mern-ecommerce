import { useEffect, useState } from "react";

function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    attributes: 0,
    orders: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================
  // Load Dashboard Statistics
  // =====================================

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");

      // ---------------------------------
      // Products
      // ---------------------------------

      const productResponse = await fetch(
        "http://localhost:5000/api/products"
      );

      const productData =
        await productResponse.json();

      // ---------------------------------
      // Orders
      // ---------------------------------

      const orderResponse = await fetch(
        "http://localhost:5000/api/orders"
      );

      const orderData =
        await orderResponse.json();

      // ---------------------------------
      // Product Count
      // ---------------------------------

      let productCount = 0;

      if (Array.isArray(productData)) {
        productCount =
          productData.length;
      } else if (
        Array.isArray(productData.products)
      ) {
        productCount =
          productData.products.length;
      } else if (
        productData.count !== undefined
      ) {
        productCount =
          Number(productData.count);
      }

      // ---------------------------------
      // Order Count
      // ---------------------------------

      let orderCount = 0;

      if (
        orderData.count !== undefined
      ) {
        orderCount =
          Number(orderData.count);
      } else if (
        Array.isArray(orderData.orders)
      ) {
        orderCount =
          orderData.orders.length;
      }

      // ---------------------------------
      // Update Dashboard
      // ---------------------------------

      setStats({
        products: productCount,

        // We will connect these to APIs
        // when category/attribute endpoints
        // are confirmed.
        categories: 5,
        attributes: 3,

        orders: orderCount
      });
    } catch (error) {
      console.error(
        "Dashboard Error:",
        error
      );

      setError(
        "Unable to load dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // Load on Dashboard Open
  // =====================================

  useEffect(() => {
    loadDashboardStats();
  }, []);

  // =====================================
  // Dashboard
  // =====================================

  return (
    <>
      <div className="admin-page-title">
        <div>
          <h1>Dashboard</h1>

          <p>
            Overview of your ecommerce store.
          </p>
        </div>
      </div>

      {error && (
        <div
          style={{
            marginBottom: "20px",
            padding: "12px",
            background: "#fff",
            borderRadius: "8px"
          }}
        >
          {error}

          <button
            type="button"
            onClick={
              loadDashboardStats
            }
            style={{
              marginLeft: "10px"
            }}
          >
            Try Again
          </button>
        </div>
      )}

      <div className="dashboard-cards">

        {/* Products */}

        <div className="dashboard-card">

          <div className="dashboard-icon">
            📦
          </div>

          <div>
            <span>
              Total Products
            </span>

            <strong>
              {loading
                ? "..."
                : stats.products}
            </strong>
          </div>

        </div>

        {/* Categories */}

        <div className="dashboard-card">

          <div className="dashboard-icon">
            📁
          </div>

          <div>
            <span>
              Categories
            </span>

            <strong>
              {loading
                ? "..."
                : stats.categories}
            </strong>
          </div>

        </div>

        {/* Attributes */}

        <div className="dashboard-card">

          <div className="dashboard-icon">
            ⚙️
          </div>

          <div>
            <span>
              Attributes
            </span>

            <strong>
              {loading
                ? "..."
                : stats.attributes}
            </strong>
          </div>

        </div>

        {/* Orders */}

        <div className="dashboard-card">

          <div className="dashboard-icon">
            🛒
          </div>

          <div>
            <span>
              Orders
            </span>

            <strong>
              {loading
                ? "..."
                : stats.orders}
            </strong>
          </div>

        </div>

      </div>
    </>
  );
}

export default Dashboard;