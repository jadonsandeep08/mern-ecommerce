import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from "./pages/Home";

import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import ProductList from "./admin/pages/ProductList";
import ProductForm from "./admin/pages/ProductForm";
import CategoryList from "./admin/pages/CategoryList";
import AttributeList from "./admin/pages/AttributeList";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* STORE */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={<AdminLayout />}
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

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;