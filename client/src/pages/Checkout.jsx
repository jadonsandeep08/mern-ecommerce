import { useState } from "react";
import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  useCart
} from "../context/CartContext";

import "./checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const {
    cart,
    subtotal,
    clearCart
  } = useCart();

  // =====================================
  // Customer Form
  // =====================================

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India"
  });

  // =====================================
  // Payment Method
  // =====================================

  const [
    paymentMethod,
    setPaymentMethod
  ] = useState("razorpay");

  const [
    processing,
    setProcessing
  ] = useState(false);

  // =====================================
  // Price Calculation
  // =====================================

  const shipping =
    subtotal >= 1000 || subtotal === 0
      ? 0
      : 99;

  const total = subtotal + shipping;

  // =====================================
  // Form Change
  // =====================================

  const handleChange = (event) => {
    const {
      name,
      value
    } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value
    }));
  };

  // =====================================
  // Customer Data
  // =====================================

  const getCustomerData = () => {
    return {
      name:
        `${form.firstName} ${form.lastName}`.trim(),

      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      state: form.state,
      pinCode: form.postalCode,
      country: form.country
    };
  };

  // =====================================
  // Cart Items
  // =====================================

  const getOrderItems = () => {
    return cart.map((item) => ({
      productId:
        item._id ||
        item.id ||
        "",

      name:
        item.name ||
        "Product",

      price:
        Number(item.price || 0),

      quantity:
        Number(item.quantity || 1)
    }));
  };

  // =====================================
  // Razorpay Payment
  // =====================================

  const startRazorpayPayment = async () => {
    try {
      setProcessing(true);

      // ---------------------------------
      // Check Razorpay Script
      // ---------------------------------

      if (!window.Razorpay) {
        alert(
          "Razorpay checkout could not be loaded."
        );

        setProcessing(false);
        return;
      }

      // ---------------------------------
      // Create Razorpay Order
      // ---------------------------------

      const response = await fetch(
        "http://localhost:5000/api/payment/create-order",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            amount: total
          })
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to create Razorpay order"
        );
      }

      // ---------------------------------
      // Razorpay Options
      // ---------------------------------

      const options = {
        key: data.key,

        amount:
          data.order.amount,

        currency:
          data.order.currency,

        name:
          "MERNShop",

        description:
          "MERNShop Order Payment",

        order_id:
          data.order.id,

        // -------------------------------
        // Customer Information
        // -------------------------------

        prefill: {
          name:
            `${form.firstName} ${form.lastName}`,

          email:
            form.email,

          contact:
            form.phone
        },

        // -------------------------------
        // Razorpay Notes
        // -------------------------------

        notes: {
          address:
            form.address,

          city:
            form.city,

          state:
            form.state,

          postalCode:
            form.postalCode
        },

        // -------------------------------
        // Razorpay UI
        // -------------------------------

        theme: {
          color: "#2563eb"
        },

        // -------------------------------
        // Payment Success
        // -------------------------------

        handler: async function (
          paymentResponse
        ) {
          try {
            /*
            =================================
            Verify Payment + Create Order
            =================================
            */

            const verifyResponse =
              await fetch(
                "http://localhost:5000/api/payment/verify",
                {
                  method: "POST",

                  headers: {
                    "Content-Type":
                      "application/json"
                  },

                  body: JSON.stringify({
                    // Razorpay response

                    razorpay_order_id:
                      paymentResponse
                        .razorpay_order_id,

                    razorpay_payment_id:
                      paymentResponse
                        .razorpay_payment_id,

                    razorpay_signature:
                      paymentResponse
                        .razorpay_signature,

                    // Order amount

                    amount:
                      total,

                    subtotal:
                      subtotal,

                    shipping:
                      shipping,

                    // Customer

                    customer:
                      getCustomerData(),

                    // Products

                    items:
                      getOrderItems()
                  })
                }
              );

            const verifyData =
              await verifyResponse.json();

            if (
              verifyResponse.ok &&
              verifyData.success
            ) {
              /*
              ===============================
              Payment Verified
              ===============================
              */

              console.log(
                "Order Created:",
                verifyData.order
              );

              console.log(
                "Payment Saved:",
                verifyData.payment
              );

              const mongoOrderId =
                verifyData.order?._id ||
                "";

              /*
              ===============================
              Clear Cart
              ===============================
              */

              clearCart();

              /*
              ===============================
              Payment Success Page
              ===============================
              */

              navigate(
                "/payment-success",
                {
                  state: {
                    success: true,

                    mongoOrderId:
                      mongoOrderId,

                    orderId:
                      paymentResponse
                        .razorpay_order_id,

                    paymentId:
                      paymentResponse
                        .razorpay_payment_id,

                    paymentMethod:
                      "Razorpay",

                    amount:
                      total
                  }
                }
              );
            } else {
              alert(
                verifyData.message ||
                  "Payment verification failed"
              );
            }
          } catch (error) {
            console.error(
              "Payment Verification Error:",
              error
            );

            alert(
              "Payment completed but order could not be saved. Please contact support."
            );
          } finally {
            setProcessing(false);
          }
        },

        // -------------------------------
        // Razorpay Modal
        // -------------------------------

        modal: {
          ondismiss: function () {
            setProcessing(false);
          }
        }
      };

      // ---------------------------------
      // Open Razorpay
      // ---------------------------------

      const razorpay =
        new window.Razorpay(
          options
        );

      // ---------------------------------
      // Payment Failure
      // ---------------------------------

      razorpay.on(
        "payment.failed",

        function (response) {
          console.error(
            "Payment Failed:",
            response.error
          );

          alert(
            response.error
              ?.description ||
              "Payment failed. Please try again."
          );

          setProcessing(false);
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "Razorpay Error:",
        error
      );

      alert(
        error.message ||
          "Unable to start payment"
      );

      setProcessing(false);
    }
  };

  // =====================================
  // COD Order
  // =====================================

  const placeCodOrder = async () => {
    try {
      setProcessing(true);

      /*
      NOTE:
      This requires:
      POST /api/orders
      We will create this API next.
      */

      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            customer:
              getCustomerData(),

            items:
              getOrderItems(),

            subtotal:
              subtotal,

            shipping:
              shipping,

            total:
              total,

            paymentMethod:
              "cod",

            paymentStatus:
              "pending",

            orderStatus:
              "processing"
          })
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to place COD order"
        );
      }

      clearCart();

      navigate(
        "/payment-success",
        {
          state: {
            success: true,

            mongoOrderId:
              data.order?._id,

            paymentMethod:
              "Cash on Delivery",

            amount:
              total
          }
        }
      );
    } catch (error) {
      console.error(
        "COD Order Error:",
        error
      );

      alert(
        error.message ||
          "Unable to place COD order"
      );
    } finally {
      setProcessing(false);
    }
  };

  // =====================================
  // Checkout Submit
  // =====================================

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (cart.length === 0) {
        alert(
          "Your cart is empty."
        );

        return;
      }

      if (
        !form.firstName.trim() ||
        !form.lastName.trim() ||
        !form.email.trim() ||
        !form.phone.trim() ||
        !form.address.trim() ||
        !form.city.trim() ||
        !form.state.trim() ||
        !form.postalCode.trim()
      ) {
        alert(
          "Please complete all required fields."
        );

        return;
      }

      // Razorpay

      if (
        paymentMethod ===
        "razorpay"
      ) {
        await startRazorpayPayment();
        return;
      }

      // Cash on Delivery

      if (
        paymentMethod ===
        "cod"
      ) {
        await placeCodOrder();
      }
    };

  // =====================================
  // Empty Cart
  // =====================================

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <header className="checkout-header">
          <Link
            to="/"
            className="checkout-logo"
          >
            MERN<span>Shop</span>
          </Link>
        </header>

        <div className="checkout-empty">
          <h1>
            Your cart is empty
          </h1>

          <p>
            Add products before proceeding
            to checkout.
          </p>

          <Link
            to="/"
            className="place-order-button"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // =====================================
  // Checkout Page
  // =====================================

  return (
    <div className="checkout-page">

      {/* HEADER */}

      <header className="checkout-header">
        <Link
          to="/"
          className="checkout-logo"
        >
          MERN<span>Shop</span>
        </Link>

        <span className="checkout-secure">
          🔒 Secure Checkout
        </span>
      </header>

      <main className="checkout-container">

        <div className="checkout-heading">
          <h1>
            Checkout
          </h1>

          <p>
            Complete your shipping and
            payment information.
          </p>
        </div>

        <form
          className="checkout-layout"
          onSubmit={handleSubmit}
        >

          <section>

            {/* CONTACT */}

            <div className="checkout-card">

              <h2>
                Contact Information
              </h2>

              <div className="checkout-grid">

                <div className="checkout-field">
                  <label>
                    First Name *
                  </label>

                  <input
                    required
                    type="text"
                    name="firstName"
                    value={
                      form.firstName
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>

                <div className="checkout-field">
                  <label>
                    Last Name *
                  </label>

                  <input
                    required
                    type="text"
                    name="lastName"
                    value={
                      form.lastName
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>

                <div className="checkout-field">
                  <label>
                    Email *
                  </label>

                  <input
                    required
                    type="email"
                    name="email"
                    value={
                      form.email
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>

                <div className="checkout-field">
                  <label>
                    Phone *
                  </label>

                  <input
                    required
                    type="tel"
                    name="phone"
                    value={
                      form.phone
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>

              </div>
            </div>

            {/* SHIPPING */}

            <div className="checkout-card">

              <h2>
                Shipping Address
              </h2>

              <div className="checkout-field full">

                <label>
                  Address *
                </label>

                <input
                  required
                  type="text"
                  name="address"
                  value={
                    form.address
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              <div className="checkout-grid">

                <div className="checkout-field">

                  <label>
                    City *
                  </label>

                  <input
                    required
                    type="text"
                    name="city"
                    value={
                      form.city
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                <div className="checkout-field">

                  <label>
                    State *
                  </label>

                  <input
                    required
                    type="text"
                    name="state"
                    value={
                      form.state
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                <div className="checkout-field">

                  <label>
                    PIN Code *
                  </label>

                  <input
                    required
                    type="text"
                    name="postalCode"
                    value={
                      form.postalCode
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                <div className="checkout-field">

                  <label>
                    Country *
                  </label>

                  <select
                    name="country"
                    value={
                      form.country
                    }
                    onChange={
                      handleChange
                    }
                  >
                    <option value="India">
                      India
                    </option>
                  </select>

                </div>

              </div>
            </div>

            {/* PAYMENT */}

            <div className="checkout-card">

              <h2>
                Payment Method
              </h2>

              <label className="payment-option">

                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={
                    paymentMethod ===
                    "razorpay"
                  }
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target.value
                    )
                  }
                />

                <div>
                  <strong>
                    Razorpay Online Payment
                  </strong>

                  <span>
                    Pay securely using UPI,
                    Cards, Netbanking and
                    available payment methods.
                  </span>
                </div>

              </label>

              <br />

              <label className="payment-option">

                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={
                    paymentMethod ===
                    "cod"
                  }
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target.value
                    )
                  }
                />

                <div>
                  <strong>
                    Cash on Delivery
                  </strong>

                  <span>
                    Pay when your order arrives.
                  </span>
                </div>

              </label>

            </div>

          </section>

          {/* ORDER SUMMARY */}

          <aside className="checkout-summary">

            <h2>
              Your Order
            </h2>

            <div className="checkout-products">

              {cart.map((item) => (
                <div
                  className="checkout-product"
                  key={
                    item._id ||
                    item.id
                  }
                >

                  <div>
                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      Qty: {item.quantity}
                    </span>
                  </div>

                  <strong>
                    ₹
                    {(
                      Number(
                        item.price
                      ) *
                      Number(
                        item.quantity
                      )
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>
              ))}

            </div>

            <div className="checkout-line">

              <span>
                Subtotal
              </span>

              <strong>
                ₹
                {subtotal.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <div className="checkout-line">

              <span>
                Shipping
              </span>

              <strong>
                {shipping === 0
                  ? "FREE"
                  : `₹${shipping.toLocaleString(
                      "en-IN"
                    )}`}
              </strong>

            </div>

            <div className="checkout-total">

              <span>
                Total
              </span>

              <strong>
                ₹
                {total.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <button
              type="submit"
              className="place-order-button"
              disabled={processing}
            >
              {processing
                ? "Processing..."
                : paymentMethod ===
                    "razorpay"
                  ? `Pay ₹${total.toLocaleString(
                      "en-IN"
                    )}`
                  : "Place COD Order"}
            </button>

            <Link
              to="/cart"
              className="back-cart"
            >
              ← Back to Cart
            </Link>

          </aside>

        </form>

      </main>

    </div>
  );
}

export default Checkout;