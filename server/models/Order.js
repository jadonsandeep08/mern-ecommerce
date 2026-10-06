const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: {
        type: String,
        required: true
      },
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pinCode: String,
      country: String
    },

    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number
      }
    ],

    subtotal: {
      type: Number,
      default: 0
    },

    shipping: {
      type: Number,
      default: 0
    },

    total: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: ["razorpay", "cod"],
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending"
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
      ],
      default: "processing"
    },

    razorpayPaymentId: {
      type: String,
      default: ""
    },

    razorpayOrderId: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", orderSchema);