const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    razorpayPaymentId: {
      type: String,
      required: true,
      unique: true
    },

    razorpayOrderId: {
      type: String,
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    currency: {
      type: String,
      default: "INR"
    },

    status: {
      type: String,
      enum: ["paid", "failed", "refunded"],
      default: "paid"
    },

    customer: {
      name: String,
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
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Payment", paymentSchema);