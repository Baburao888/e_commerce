// src/pages/Cart.jsx

import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { items, subtotal, updateItem, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const handleIncrease = (item) => {
    updateItem(item.product, item.quantity + 1);
  };

  const handleDecrease = (item) => {
    if (item.quantity <= 1) return;
    updateItem(item.product, item.quantity - 1);
  };

  if (items.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <h2>Your cart is empty</h2>
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>

      <table className="cart-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.product}>
              <td className="cart-product-cell">
                <img src={item.image} alt={item.name} />
                <span>{item.name}</span>
              </td>
              <td>₹{item.price.toLocaleString("en-IN")}</td>
              <td>
                <div className="quantity-control">
                  <button onClick={() => handleDecrease(item)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleIncrease(item)}>+</button>
                </div>
              </td>
              <td>₹{(item.price * item.quantity).toLocaleString("en-IN")}</td>
              <td>
                <button className="link-button danger" onClick={() => removeItem(item.product)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart-summary">
        <button className="link-button danger" onClick={clearCart}>Clear Cart</button>
        <h3>Subtotal: ₹{subtotal.toLocaleString("en-IN")}</h3>
        <button className="btn btn-primary" onClick={() => navigate("/checkout")}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
