import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./cart.css";

function Cart() {
  const { cart, removeFromCart, updateQuantity, subtotal } = useCart();
  const shipping = subtotal >= 1000 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <header className="checkout-header">
          <Link to="/" className="checkout-logo">MERN<span>Shop</span></Link>
          <Link to="/admin" className="continue-link">Admin Panel</Link>
        </header>
        <div className="cart-container">
          <div className="empty-cart">
            <div>🛒</div>
            <h1>Your cart is empty</h1>
            <p>Add some products before proceeding to checkout.</p>
            <Link to="/" className="cart-primary-button">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <header className="checkout-header">
        <Link to="/" className="checkout-logo">MERN<span>Shop</span></Link>
        <Link to="/" className="continue-link">← Continue Shopping</Link>
      </header>
      <main className="cart-container">
        <div className="cart-title"><h1>Shopping Cart</h1><span>{cart.length} product(s)</span></div>
        <div className="cart-layout">
          <section className="cart-items">
            {cart.map((item) => (
              <article className="cart-item" key={item._id}>
                <div className="cart-product-image">{item.image ? <img src={item.image} alt={item.name} /> : <span>📦</span>}</div>
                <div className="cart-product-info">
                  <span className="cart-category">{item.category}</span>
                  <h3>{item.name}</h3><p>{item.brand || "MERNShop"}</p>
                  <button className="remove-button" onClick={() => removeFromCart(item._id)}>Remove</button>
                </div>
                <div className="quantity-control">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                </div>
                <div className="cart-item-price">₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}</div>
              </article>
            ))}
          </section>
          <aside className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-row"><span>Subtotal</span><strong>₹{subtotal.toLocaleString("en-IN")}</strong></div>
            <div className="summary-row"><span>Shipping</span><strong>{shipping === 0 ? "FREE" : `₹${shipping}`}</strong></div>
            <div className="summary-divider" />
            <div className="summary-row total"><span>Total</span><strong>₹{total.toLocaleString("en-IN")}</strong></div>
            <Link to="/checkout" className="checkout-button">Proceed to Checkout</Link>
            <p className="secure-message">🔒 Secure checkout</p>
          </aside>
        </div>
      </main>
    </div>
  );
}
export default Cart;
