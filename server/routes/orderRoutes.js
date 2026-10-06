const express = require("express");

const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus
} = require("../controllers/orderController");

const router = express.Router();

// Get all orders
router.get("/", getOrders);

// Create COD order
router.post("/", createOrder);

// Get single order
router.get("/:id", getOrderById);

// Update order status
router.put(
  "/:id/status",
  updateOrderStatus
);

module.exports = router;