import React from "react";
import { useNavigate } from "react-router-dom";

function ConfirmOrder() {
  const navigate = useNavigate();

  const handleConfirm = () => {
    alert("Order Confirmed! Thank you for your purchase.");
    localStorage.removeItem("cart");
    navigate("/");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", padding: "20px" }}>
      <h2>Confirm Your Order</h2>
      <p>Please confirm your order details.</p>
      <button onClick={handleConfirm} style={{ padding: "10px 20px", marginTop: "20px" }}>
        Confirm Order
      </button>
    </div>
  );
}

export default ConfirmOrder;
