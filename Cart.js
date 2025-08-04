import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(stored);
  }, []);

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item._id !== id);
    localStorage.setItem("cart", JSON.stringify(updated));
    setCartItems(updated);
  };
  const subtotal = cartItems.reduce((total, item) => total + Number(item.price), 0);

  const deliveryCharge = subtotal > 0 ? 1000 : 0;

  const serviceCharge = subtotal * 0.05;

  const finalTotal = subtotal + deliveryCharge + serviceCharge;

  const handleBuyNow = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    navigate("/confirm-order");
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map((item) => (
              <li key={item._id} className="cart-item">
                <div className="cart-item-info">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-price">৳{item.price}</span>
                </div>
                <button className="remove-btn" onClick={() => removeItem(item._id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <p>Subtotal: ৳{subtotal.toFixed(2)}</p>
            <p>Delivery Charge: ৳{deliveryCharge.toFixed(2)}</p>
            <p>Service Charge (5%): ৳{serviceCharge.toFixed(2)}</p>
            <hr />
            <p>
              <strong>Final Total: ৳{finalTotal.toFixed(2)}</strong>
            </p>
          </div>

          <button className="buy-now-btn" onClick={handleBuyNow}>
            Buy Now
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
