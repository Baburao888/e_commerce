// src/pages/Checkout.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrderApi } from "../services/api";

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setSubmitting(true);
    try {
      const orderItems = items.map((item) => ({
        productId: item.product,
        quantity: item.quantity,
      }));

      const res = await createOrderApi({
        orderItems,
        shippingAddress: formData,
        paymentMethod,
      });

      await clearCart();
      navigate(`/orders/${res.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <form className="checkout-form" onSubmit={handleSubmit}>
        <h2>Shipping Details</h2>
        {error && <p className="form-error">{error}</p>}

        <label>Full Name</label>
        <input name="name" value={formData.name} onChange={handleChange} required />

        <label>Phone</label>
        <input name="phone" value={formData.phone} onChange={handleChange} required />

        <label>Address</label>
        <input name="address" value={formData.address} onChange={handleChange} required />

        <label>City</label>
        <input name="city" value={formData.city} onChange={handleChange} required />

        <label>State</label>
        <input name="state" value={formData.state} onChange={handleChange} required />

        <label>Pincode</label>
        <input name="pincode" value={formData.pincode} onChange={handleChange} required />

        <label>Payment Method</label>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="Cash on Delivery">Cash on Delivery</option>
        </select>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Placing Order..." : "Place Order"}
        </button>
      </form>

      <div className="checkout-summary">
        <h3>Order Summary</h3>
        {items.map((item) => (
          <div key={item.product} className="checkout-summary-item">
            <span>{item.name} x {item.quantity}</span>
            <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
          </div>
        ))}
        <hr />
        <div className="checkout-summary-item">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        <div className="checkout-summary-item">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
        </div>
        <div className="checkout-summary-item total">
          <span>Total</span>
          <span>₹{total.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
