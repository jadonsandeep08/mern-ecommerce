const Order = require("../models/Order");

// =====================================
// GET ALL ORDERS
// =====================================

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error("Get Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get orders"
    });
  }
};

// =====================================
// GET SINGLE ORDER
// =====================================

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error("Get Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get order"
    });
  }
};

// =====================================
// CREATE ORDER
// Used for Cash on Delivery
// =====================================

const createOrder = async (req, res) => {
  try {
    const {
      customer,
      items,
      subtotal,
      shipping,
      total,
      paymentMethod
    } = req.body;

    if (!customer || !customer.name) {
      return res.status(400).json({
        success: false,
        message: "Customer information is required"
      });
    }

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Order items are required"
      });
    }

    if (
      !total ||
      Number(total) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order total"
      });
    }

    const method =
      paymentMethod || "cod";

    const order = await Order.create({
      customer,

      items,

      subtotal:
        Number(subtotal || 0),

      shipping:
        Number(shipping || 0),

      total:
        Number(total),

      paymentMethod:
        method,

      paymentStatus:
        method === "cod"
          ? "pending"
          : "paid",

      orderStatus:
        "processing"
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to create order"
    });
  }
};

// =====================================
// UPDATE ORDER STATUS
// =====================================

const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const {
      orderStatus
    } = req.body;

    const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled"
    ];

    if (
      !allowedStatuses.includes(
        orderStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status"
      });
    }

    const order =
      await Order.findByIdAndUpdate(
        req.params.id,
        {
          orderStatus
        },
        {
          new: true,
          runValidators: true
        }
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Order status updated successfully",
      order
    });
  } catch (error) {
    console.error(
      "Update Order Status Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update order status"
    });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus
};