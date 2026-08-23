// src/pages/AdminDashboard.jsx
// A single page with tabs for: overview stats, products, orders, and users.
// Kept intentionally simple (no separate routes) since it's one admin area.

import { useEffect, useState } from "react";
import {
  getProductsApi, createProductApi, updateProductApi, deleteProductApi,
  getAllOrdersApi, updateOrderStatusApi,
  getUsersApi, deleteUserApi,
} from "../services/api";
import Loader from "../components/Loader";

const ORDER_STATUSES = ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"];

const emptyProductForm = {
  name: "", description: "", price: "", category: "", brand: "", image: "", stock: "",
};

const AdminDashboard = () => {
  const [tab, setTab] = useState("overview");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Product add/edit form state
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [formError, setFormError] = useState("");

  const loadAll = async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        getProductsApi({ limit: 100 }),
        getAllOrdersApi(),
        getUsersApi(),
      ]);
      setProducts(productsRes.data.data);
      setOrders(ordersRes.data.data);
      setUsers(usersRes.data.data);
    } catch (error) {
      console.error("Failed to load admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // ---------------- Overview stats ----------------
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  // ---------------- Product management ----------------
  const handleProductFormChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const startEditProduct = (product) => {
    setEditingProductId(product._id);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      brand: product.brand,
      image: product.image,
      stock: product.stock,
    });
    setTab("products");
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setProductForm(emptyProductForm);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const payload = {
      ...productForm,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
    };

    try {
      if (editingProductId) {
        await updateProductApi(editingProductId, payload);
      } else {
        await createProductApi(payload);
      }
      cancelEdit();
      loadAll();
    } catch (error) {
      setFormError(error.response?.data?.message || "Failed to save product");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteProductApi(id);
    loadAll();
  };

  // ---------------- Order management ----------------
  const handleStatusChange = async (orderId, status) => {
    await updateOrderStatusApi(orderId, status);
    loadAll();
  };

  // ---------------- User management ----------------
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await deleteUserApi(id);
    loadAll();
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-page">
      <h2>Admin Dashboard</h2>

      <div className="admin-tabs">
        <button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}>Overview</button>
        <button className={tab === "products" ? "active" : ""} onClick={() => setTab("products")}>Products</button>
        <button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}>Orders</button>
        <button className={tab === "users" ? "active" : ""} onClick={() => setTab("users")}>Users</button>
      </div>

      {tab === "overview" && (
        <div className="admin-stats">
          <div className="stat-card">
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
          <div className="stat-card">
            <h3>{products.length}</h3>
            <p>Total Products</p>
          </div>
          <div className="stat-card">
            <h3>{orders.length}</h3>
            <p>Total Orders</p>
          </div>
          <div className="stat-card">
            <h3>₹{totalRevenue.toLocaleString("en-IN")}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      )}

      {tab === "products" && (
        <div className="admin-products">
          <form className="admin-product-form" onSubmit={handleProductSubmit}>
            <h3>{editingProductId ? "Edit Product" : "Add New Product"}</h3>
            {formError && <p className="form-error">{formError}</p>}

            <input name="name" placeholder="Name" value={productForm.name} onChange={handleProductFormChange} required />
            <input name="brand" placeholder="Brand" value={productForm.brand} onChange={handleProductFormChange} required />
            <input name="category" placeholder="Category" value={productForm.category} onChange={handleProductFormChange} required />
            <input name="price" type="number" placeholder="Price" value={productForm.price} onChange={handleProductFormChange} required />
            <input name="stock" type="number" placeholder="Stock" value={productForm.stock} onChange={handleProductFormChange} required />
            <input name="image" placeholder="Image URL" value={productForm.image} onChange={handleProductFormChange} required />
            <textarea name="description" placeholder="Description" value={productForm.description} onChange={handleProductFormChange} required />

            <div>
              <button type="submit" className="btn btn-primary">
                {editingProductId ? "Update Product" : "Add Product"}
              </button>
              {editingProductId && (
                <button type="button" className="btn btn-outline" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th><th>Price</th><th>Stock</th><th></th><th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>₹{p.price.toLocaleString("en-IN")}</td>
                  <td>{p.stock}</td>
                  <td><button className="link-button" onClick={() => startEditProduct(p)}>Edit</button></td>
                  <td><button className="link-button danger" onClick={() => handleDeleteProduct(p._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "orders" && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th><th>User</th><th>Total</th><th>Status</th><th>Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user?.name} ({order.user?.email})</td>
                <td>₹{order.totalPrice.toLocaleString("en-IN")}</td>
                <td>{order.status}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "users" && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Role</th><th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td><button className="link-button danger" onClick={() => handleDeleteUser(u._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
