// src/pages/OrderDetails.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderByIdApi } from "../services/api";
import Loader from "../components/Loader";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderByIdApi(id);
        setOrder(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <p className="form-error">{error}</p>;
  if (!order) return null;

  return (
    <div className="order-details-page">
      <h2>Order #{order._id}</h2>
      <p>
        Status: <span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span>
      </p>
      <p>Placed on: {new Date(order.createdAt).toLocaleString()}</p>

      <div className="order-details-grid">
        <div>
          <h3>Shipping Address</h3>
          <p>{order.shippingAddress.name}</p>
          <p>{order.shippingAddress.address}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
          <p>Phone: {order.shippingAddress.phone}</p>
        </div>

        <div>
          <h3>Payment</h3>
          <p>Method: {order.paymentMethod}</p>
          <p>Paid: {order.isPaid ? "Yes" : "No"}</p>
          <p>Delivered: {order.isDelivered ? "Yes" : "No"}</p>
        </div>
      </div>

      <h3>Items</h3>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems.map((item, idx) => (
            <tr key={idx}>
              <td className="cart-product-cell">
                <img src={item.image} alt={item.name} />
                <span>{item.name}</span>
              </td>
              <td>₹{item.price.toLocaleString("en-IN")}</td>
              <td>{item.quantity}</td>
              <td>₹{(item.price * item.quantity).toLocaleString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="order-totals">
        <p>Items: ₹{order.itemsPrice.toLocaleString("en-IN")}</p>
        <p>Shipping: {order.shippingPrice === 0 ? "Free" : `₹${order.shippingPrice}`}</p>
        <h3>Total: ₹{order.totalPrice.toLocaleString("en-IN")}</h3>
      </div>
    </div>
  );
};

export default OrderDetails;
