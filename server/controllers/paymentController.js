const Razorpay = require("razorpay");
const crypto = require("crypto");

const Order = require("../models/Order");
const Payment = require("../models/Payment");

/*
|--------------------------------------------------------------------------
| Razorpay Instance
|--------------------------------------------------------------------------
*/

const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
};

/*
|--------------------------------------------------------------------------
| Create Razorpay Order
|--------------------------------------------------------------------------
*/

const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required"
      });
    }

    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount"
      });
    }

    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET
    ) {
      return res.status(500).json({
        success: false,
        message: "Razorpay API keys are not configured"
      });
    }

    const razorpay = getRazorpayInstance();

    // Razorpay amount must be in paise
    const amountInPaise = Math.round(numericAmount * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const razorpayOrder = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      order: razorpayOrder
    });
  } catch (error) {
    console.error("Create Razorpay Order Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error?.error?.description ||
        error?.message ||
        "Unable to create payment order"
    });
  }
};

/*
|--------------------------------------------------------------------------
| Verify Razorpay Payment
|--------------------------------------------------------------------------
*/

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,

      amount,
      subtotal,
      shipping,

      customer,
      items
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Validate Razorpay Response
    |--------------------------------------------------------------------------
    */

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification information is missing"
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Razorpay secret is not configured"
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Verify Razorpay Signature
    |--------------------------------------------------------------------------
    */

    const signatureBody =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(signatureBody)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed"
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Amount
    |--------------------------------------------------------------------------
    */

    const orderTotal = Number(amount || 0);
    const orderSubtotal = Number(subtotal || orderTotal);
    const shippingAmount = Number(shipping || 0);

    if (orderTotal <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount"
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Customer
    |--------------------------------------------------------------------------
    */

    const customerData = {
      name: customer?.name || "Customer",
      email: customer?.email || "",
      phone: customer?.phone || "",
      address: customer?.address || "",
      city: customer?.city || "",
      state: customer?.state || "",
      pinCode:
        customer?.pinCode ||
        customer?.pincode ||
        customer?.pin ||
        "",
      country: customer?.country || "India"
    };

    /*
    |--------------------------------------------------------------------------
    | Cart Items
    |--------------------------------------------------------------------------
    */

    const orderItems = Array.isArray(items)
      ? items.map((item) => ({
          productId:
            item.productId ||
            item._id ||
            item.id ||
            "",
          name: item.name || "Product",
          price: Number(item.price || 0),
          quantity: Number(item.quantity || 1)
        }))
      : [];

    /*
    |--------------------------------------------------------------------------
    | Create Order
    |--------------------------------------------------------------------------
    |
    | Check Payment ID first so refreshing/retrying verification does not
    | create duplicate orders.
    |
    */

    let order = await Order.findOne({
      razorpayPaymentId: razorpay_payment_id
    });

    if (!order) {
      order = await Order.create({
        customer: customerData,

        items: orderItems,

        subtotal: orderSubtotal,
        shipping: shippingAmount,
        total: orderTotal,

        paymentMethod: "razorpay",

        paymentStatus: "paid",

        orderStatus: "processing",

        razorpayPaymentId: razorpay_payment_id,

        razorpayOrderId: razorpay_order_id
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Create Payment Record
    |--------------------------------------------------------------------------
    */

    let payment = await Payment.findOne({
      razorpayPaymentId: razorpay_payment_id
    });

    if (!payment) {
      payment = await Payment.create({
        razorpayPaymentId: razorpay_payment_id,

        razorpayOrderId: razorpay_order_id,

        amount: orderTotal,

        currency: "INR",

        status: "paid",

        customer: customerData,

        items: orderItems
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Success
    |--------------------------------------------------------------------------
    */

    return res.status(200).json({
      success: true,

      message:
        "Payment verified and order created successfully",

      order,

      payment
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);

    return res.status(500).json({
      success: false,

      message:
        error?.message ||
        "Unable to verify payment"
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get All Payments
|--------------------------------------------------------------------------
*/

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    console.error("Get Payments Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get payments"
    });
  }
};

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

module.exports = {
  createRazorpayOrder,
  verifyPayment,
  getPayments
};