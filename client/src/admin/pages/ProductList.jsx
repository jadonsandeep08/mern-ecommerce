import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/products"
      );

      const data = await response.json();

      setProducts(data.products || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error("Unable to delete product");
      }

      loadProducts();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <div className="admin-page-title">

        <div>
          <h1>Products</h1>
          <p>Manage your store products.</p>
        </div>

        <Link
          to="/admin/products/create"
          className="admin-primary-button"
        >
          + Add Product
        </Link>

      </div>

      <div className="admin-card">

        {loading ? (
          <p>Loading products...</p>
        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {products.map((product) => (

                  <tr key={product._id}>

                    <td>
                      <div className="table-product">

                        <div className="table-image">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                            />
                          ) : (
                            "📦"
                          )}
                        </div>

                        <strong>
                          {product.name}
                        </strong>

                      </div>
                    </td>

                    <td>
                      {product.category}
                    </td>

                    <td>
                      {product.brand || "-"}
                    </td>

                    <td>
                      ₹
                      {Number(
                        product.price
                      ).toLocaleString("en-IN")}
                    </td>

                    <td>
                      {product.stock}
                    </td>

                    <td>
                      <span
                        className={
                          product.isActive
                            ? "status active"
                            : "status inactive"
                        }
                      >
                        {product.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td>

                      <div className="table-actions">

                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="edit-button"
                        >
                          Edit
                        </Link>

                        <button
                          className="delete-button"
                          onClick={() =>
                            deleteProduct(product._id)
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>
    </>
  );
}

export default ProductList;