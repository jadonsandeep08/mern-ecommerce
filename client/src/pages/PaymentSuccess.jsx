import {
  Link,
  useLocation
} from "react-router-dom";


function PaymentSuccess() {

  const location =
    useLocation();

  const payment =
    location.state || {};


  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f7f8fc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px"
      }}
    >

      <div
        style={{
          background: "#ffffff",
          padding: "50px",
          borderRadius: "14px",
          maxWidth: "550px",
          width: "100%",
          textAlign: "center"
        }}
      >

        <div
          style={{
            fontSize: "70px"
          }}
        >
          ✅
        </div>


        <h1>
          Order Successful!
        </h1>


        <p>
          Thank you for your order.
        </p>


        {payment.paymentId && (

          <p>
            <strong>
              Payment ID:
            </strong>

            <br />

            {payment.paymentId}
          </p>

        )}


        {payment.orderId && (

          <p>
            <strong>
              Razorpay Order ID:
            </strong>

            <br />

            {payment.orderId}
          </p>

        )}


        {payment.paymentMethod && (

          <p>
            <strong>
              Payment:
            </strong>

            {" "}

            {payment.paymentMethod}
          </p>

        )}


        {payment.amount && (

          <h2>
            ₹
            {Number(
              payment.amount
            ).toLocaleString(
              "en-IN"
            )}
          </h2>

        )}


        <Link
          to="/"
          style={{
            display: "inline-block",
            marginTop: "20px",
            padding:
              "13px 25px",
            background:
              "#2563eb",
            color: "#ffffff",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "700"
          }}
        >
          Continue Shopping
        </Link>

      </div>

    </div>

  );

}


export default PaymentSuccess;