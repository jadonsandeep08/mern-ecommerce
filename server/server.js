const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

// =====================================
// Routes
// =====================================

const productRoutes = require("./routes/productRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");

// =====================================
// Connect MongoDB
// =====================================

connectDB();

const app = express();

// =====================================
// Middleware
// =====================================

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);

// =====================================
// API Home
// =====================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MERN Ecommerce API is running"
  });
});

// =====================================
// Product Routes
// =====================================

app.use(
  "/api/products",
  productRoutes
);

// =====================================
// Razorpay Payment Routes
// =====================================

app.use(
  "/api/payment",
  paymentRoutes
);

// =====================================
// Order Routes
// =====================================

app.use(
  "/api/orders",
  orderRoutes
);

// =====================================
// Authentication Routes
// =====================================

app.use(
  "/api/auth",
  authRoutes
);

// =====================================
// 404 Handler
// IMPORTANT: Must be after all routes
// =====================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

// =====================================
// Start Server
// =====================================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});