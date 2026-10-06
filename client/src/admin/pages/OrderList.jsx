import { useEffect, useState } from "react";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================
  // Load Orders
  // =====================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/orders"
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to load orders"
        );
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error(
        "Fetch Orders Error:",
        error
      );

      setError(
        error.message ||
          "Unable to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =====================================
  // Update Order Status
  // =====================================

  const updateOrderStatus = async (
    orderId,
    orderStatus
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            orderStatus
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to update order"
        );
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? data.order
            : order
        )
      );
    } catch (error) {
      console.error(
        "Update Order Error:",
        error
      );

      alert(
        error.message ||
          "Unable to update order status"
      );
    }
  };

  // =====================================
  // Date Format
  // =====================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleString("en-IN");
  };

  // =====================================
  // Loading
  // =====================================

  if (loading) {
    return (
      <div>
        <div className="admin-page-heading">
          <h1>Orders</h1>
          <p>
            Manage customer orders.
          </p>
        </div>

        <div className="admin-card">
          Loading orders...
        </div>
      </div>
    );
  }

  // =====================================
  // Page
  // =====================================

  return (
    <div>

      <div className="admin-page-heading">
        <h1>Orders</h1>

        <p>
          Manage customer orders and
          payment status.
        </p>
      </div>

      {error && (
        <div className="admin-card">
          <p>{error}</p>

          <button
            type="button"
            onClick={fetchOrders}
          >
            Try Again
          </button>
        </div>
      )}

      {!error && orders.length === 0 && (
        <div className="admin-card">
          <h3>No orders found</h3>

          <p>
            New customer orders will
            appear here automatically.
          </p>
        </div>
      )}

      {!error && orders.length > 0 && (
        <div
          className="admin-card"
          style={{
            overflowX: "auto"
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse"
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>
                  Order
                </th>

                <th style={thStyle}>
                  Customer
                </th>

                <th style={thStyle}>
                  Items
                </th>

                <th style={thStyle}>
                  Total
                </th>

                <th style={thStyle}>
                  Payment
                </th>

                <th style={thStyle}>
                  Payment Status
                </th>

                <th style={thStyle}>
                  Order Status
                </th>

                <th style={thStyle}>
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>

                  <td style={tdStyle}>
                    <strong>
                      #
                      {order._id
                        ?.slice(-8)
                        .toUpperCase()}
                    </strong>
                  </td>

                  <td style={tdStyle}>
                    <strong>
                      {order.customer?.name ||
                        "-"}
                    </strong>

                    <div
                      style={{
                        fontSize: "12px",
                        marginTop: "4px"
                      }}
                    >
                      {order.customer?.email ||
                        ""}
                    </div>

                    <div
                      style={{
                        fontSize: "12px"
                      }}
                    >
                      {order.customer?.phone ||
                        ""}
                    </div>
                  </td>

                  <td style={tdStyle}>
                    {order.items?.length || 0}
                  </td>

                  <td style={tdStyle}>
                    <strong>
                      ₹
                      {Number(
                        order.total || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </td>

                  <td style={tdStyle}>
                    {order.paymentMethod ===
                    "razorpay"
                      ? "Razorpay"
                      : "COD"}
                  </td>

                  <td style={tdStyle}>
                    <span
                      style={{
                        textTransform:
                          "capitalize"
                      }}
                    >
                      {order.paymentStatus ||
                        "pending"}
                    </span>
                  </td>

                  <td style={tdStyle}>
                    <select
                      value={
                        order.orderStatus ||
                        "processing"
                      }
                      onChange={(event) =>
                        updateOrderStatus(
                          order._id,
                          event.target.value
                        )
                      }
                      style={{
                        padding: "8px",
                        borderRadius: "6px",
                        border:
                          "1px solid #d1d5db"
                      }}
                    >
                      <option value="pending">
                        Pending
                      </option>

                      <option value="processing">
                        Processing
                      </option>

                      <option value="shipped">
                        Shipped
                      </option>

                      <option value="delivered">
                        Delivered
                      </option>

                      <option value="cancelled">
                        Cancelled
                      </option>
                    </select>
                  </td>

                  <td style={tdStyle}>
                    {formatDate(
                      order.createdAt
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "14px",
  borderBottom:
    "1px solid #e5e7eb",
  whiteSpace: "nowrap"
};

const tdStyle = {
  padding: "14px",
  borderBottom:
    "1px solid #e5e7eb",
  verticalAlign: "top"
};

export default OrderList;