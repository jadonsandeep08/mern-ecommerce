import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

// =====================================
// Store Pages
// =====================================

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";

import Login from "./pages/Login";
import Register from "./pages/Register";

// =====================================
// Route Protection
// =====================================

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// =====================================
// Admin
// =====================================

import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import Dashboard from "./admin/pages/Dashboard";
import ProductList from "./admin/pages/ProductList";
import ProductForm from "./admin/pages/ProductForm";
import CategoryList from "./admin/pages/CategoryList";
import AttributeList from "./admin/pages/AttributeList";
import OrderList from "./admin/pages/OrderList";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================================= */}
        {/* Public Store */}
        {/* ================================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* ================================= */}
        {/* Customer Authentication */}
        {/* ================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ================================= */}
        {/* Customer Protected Checkout */}
        {/* ================================= */}

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment-success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />

        {/* ================================= */}
        {/* Admin Login */}
        {/* IMPORTANT: Outside AdminRoute */}
        {/* ================================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* ================================= */}
        {/* Protected Admin Panel */}
        {/* ================================= */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >

          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="products"
            element={<ProductList />}
          />

          <Route
            path="products/create"
            element={<ProductForm />}
          />

          <Route
            path="products/edit/:id"
            element={<ProductForm />}
          />

          <Route
            path="categories"
            element={<CategoryList />}
          />

          <Route
            path="attributes"
            element={<AttributeList />}
          />

          <Route
            path="orders"
            element={<OrderList />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;