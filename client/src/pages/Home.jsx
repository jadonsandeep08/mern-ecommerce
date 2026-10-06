import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  useCart
} from "../context/CartContext";

import {
  useAuth
} from "../context/AuthContext";

import "../App.css";


function Home() {
  const navigate = useNavigate();

  const [products, setProducts] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const {
    addToCart,
    cartCount
  } = useCart();

  const {
    user,
    isCustomer,
    isAdmin,
    logout
  } = useAuth();


  // =====================================
  // Load Products
  // =====================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/products"
        );

        if (!response.ok) {
          throw new Error(
            "Unable to load products"
          );
        }

        const data =
          await response.json();

        setProducts(
          data.products || []
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  // =====================================
  // Categories
  // =====================================

  const categories = useMemo(() => {
    const productCategories =
      products
        .map(
          (product) =>
            product.category
        )
        .filter(Boolean);

    return [
      "All",
      ...new Set(
        productCategories
      )
    ];
  }, [products]);


  // =====================================
  // Product Search / Filter
  // =====================================

  const filteredProducts =
    products.filter(
      (product) => {
        const productName =
          product.name
            ?.toLowerCase() || "";

        const searchText =
          search.toLowerCase();

        const matchesSearch =
          productName.includes(
            searchText
          );

        const matchesCategory =
          category === "All" ||
          product.category ===
            category;

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );


  // =====================================
  // Logout
  // =====================================

  const handleLogout = () => {
    logout();

    navigate("/", {
      replace: true
    });
  };


  return (
    <div className="app">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <header className="header">

        <div className="container navbar">

          <Link
            to="/"
            className="logo"
          >
            MERN<span>Shop</span>
          </Link>


          <nav className="nav-links">

            <a href="#home">
              Home
            </a>

            <a href="#products">
              Products
            </a>

            <a href="#categories">
              Categories
            </a>

          </nav>


          <div className="header-buttons">

            {/* Customer not logged in */}

            {!user && (
              <>
                <Link
                  to="/login"
                  className="login-button"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="register-button"
                >
                  Register
                </Link>
              </>
            )}


            {/* Logged-in Customer */}

            {isCustomer && (
              <div className="customer-account">

                <span className="customer-name">
                  Hi, {user?.name}
                </span>

                <button
                  type="button"
                  className="logout-button"
                  onClick={
                    handleLogout
                  }
                >
                  Logout
                </button>

              </div>
            )}


            {/* Logged-in Admin */}

            {isAdmin && (
              <Link
                to="/admin"
                className="login-button"
              >
                Admin Panel
              </Link>
            )}


            <Link
              to="/cart"
              className="cart-button"
            >
              🛒 Cart

              <span className="cart-count">
                {cartCount}
              </span>
            </Link>

          </div>

        </div>

      </header>


      {/* ================================= */}
      {/* HERO */}
      {/* ================================= */}

      <section
        className="hero"
        id="home"
      >

        <div className="container hero-container">

          <div className="hero-content">

            <span className="hero-small-title">
              NEW COLLECTION 2026
            </span>

            <h1>
              Everything you need,
              <span>
                {" "}
                all in one place.
              </span>
            </h1>

            <p>
              Discover quality products
              at great prices. Shop
              electronics, fashion,
              footwear, accessories and
              much more.
            </p>

            <a
              href="#products"
              className="shop-now"
            >
              Shop Now →
            </a>

          </div>


          <div className="hero-box">

            <div className="shopping-icon">
              🛍️
            </div>

            <h2>
              Big Savings
            </h2>

            <p>
              Find amazing products for
              every budget.
            </p>

            <div className="offer">
              UP TO 40% OFF
            </div>

          </div>

        </div>

      </section>


      {/* ================================= */}
      {/* SEARCH */}
      {/* ================================= */}

      <section
        className="search-area"
        id="categories"
      >

        <div className="container search-container">

          <div className="search-box">

            <span>
              🔍
            </span>

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>


          <select
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value
              )
            }
          >

            {categories.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item === "All"
                    ? "All Categories"
                    : item}
                </option>
              )
            )}

          </select>

        </div>

      </section>


      {/* ================================= */}
      {/* PRODUCTS */}
      {/* ================================= */}

      <main
        className="container products-section"
        id="products"
      >

        <div className="section-header">

          <div>

            <span className="section-small">
              SHOP PRODUCTS
            </span>

            <h2>
              Featured Products
            </h2>

          </div>

          <p>
            {
              filteredProducts.length
            }{" "}
            products found
          </p>

        </div>


        {loading && (
          <div className="status-message">
            Loading products...
          </div>
        )}


        {error && (
          <div className="status-message error">
            {error}
          </div>
        )}


        {!loading &&
          !error &&
          filteredProducts.length ===
            0 && (
            <div className="status-message">
              No products found.
            </div>
          )}


        <div className="product-grid">

          {filteredProducts.map(
            (product) => (

              <div
                className="product-card"
                key={product._id}
              >

                <div className="product-image">

                  {product.image ? (

                    <img
                      src={
                        product.image
                      }
                      alt={
                        product.name
                      }
                    />

                  ) : (

                    <div className="product-placeholder">
                      📦
                    </div>

                  )}


                  <span className="category-label">
                    {
                      product.category
                    }
                  </span>

                </div>


                <div className="product-info">

                  <div className="brand">
                    {product.brand ||
                      "MERNShop"}
                  </div>

                  <h3>
                    {product.name}
                  </h3>

                  <p className="product-description">
                    {
                      product.description
                    }
                  </p>


                  <div className="stock">

                    {product.stock >
                    0 ? (
                      <>
                        ✓ In Stock (
                        {
                          product.stock
                        }
                        )
                      </>
                    ) : (
                      <span className="out-of-stock">
                        Out of Stock
                      </span>
                    )}

                  </div>


                  <div className="product-bottom">

                    <div className="price">
                      ₹
                      {Number(
                        product.price
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </div>


                    <button
                      className="add-cart"
                      onClick={() =>
                        addToCart(
                          product
                        )
                      }
                      disabled={
                        product.stock <=
                        0
                      }
                    >
                      Add to Cart
                    </button>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      </main>


      {/* ================================= */}
      {/* FEATURES */}
      {/* ================================= */}

      <section className="features">

        <div className="container feature-grid">

          <div className="feature">

            <div>
              🚚
            </div>

            <section>
              <strong>
                Free Delivery
              </strong>

              <span>
                On selected orders
              </span>
            </section>

          </div>


          <div className="feature">

            <div>
              🔒
            </div>

            <section>
              <strong>
                Secure Payment
              </strong>

              <span>
                100% secure checkout
              </span>
            </section>

          </div>


          <div className="feature">

            <div>
              ↩️
            </div>

            <section>
              <strong>
                Easy Returns
              </strong>

              <span>
                Hassle-free returns
              </span>
            </section>

          </div>


          <div className="feature">

            <div>
              💬
            </div>

            <section>
              <strong>
                24/7 Support
              </strong>

              <span>
                We're here to help
              </span>
            </section>

          </div>

        </div>

      </section>


      {/* ================================= */}
      {/* FOOTER */}
      {/* ================================= */}

      <footer className="footer">

        <div className="container footer-container">

          <div>

            <div className="footer-logo">
              MERN<span>Shop</span>
            </div>

            <p>
              Your modern MERN stack
              e-commerce store.
            </p>

          </div>


          <div>

            <h4>
              Shop
            </h4>

            <a href="#products">
              Products
            </a>

            <a href="#categories">
              Categories
            </a>

          </div>


          <div>

            <h4>
              Customer Service
            </h4>

            <a href="#home">
              Contact Us
            </a>

            <a href="#home">
              Returns
            </a>

          </div>

        </div>


        <div className="copyright">
          © 2026 MERNShop. All rights
          reserved.
        </div>

      </footer>

    </div>
  );
}

export default Home;