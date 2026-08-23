// src/services/api.js
// This is the ONLY file that talks directly to the backend using axios.
// Every page/component imports functions from here instead of writing
// axios.get(...) everywhere. This keeps API URLs in one place.

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create one axios instance with a base URL, so we don't repeat it everywhere
const api = axios.create({
  baseURL: API_URL,
});

// Axios "interceptor": runs before EVERY request. If the user is logged in
// (we have a token saved in localStorage), automatically attach it to the
// Authorization header so protected routes work without extra code.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------- AUTH ----------------
export const registerApi = (data) => api.post("/auth/register", data);
export const loginApi = (data) => api.post("/auth/login", data);
export const logoutApi = () => api.post("/auth/logout");
export const getMeApi = () => api.get("/auth/me");

// ---------------- PRODUCTS ----------------
// params can include: search, category, minPrice, maxPrice, sort, page, limit
export const getProductsApi = (params) => api.get("/products", { params });
export const getProductByIdApi = (id) => api.get(`/products/${id}`);
export const createProductApi = (data) => api.post("/products", data);
export const updateProductApi = (id, data) => api.put(`/products/${id}`, data);
export const deleteProductApi = (id) => api.delete(`/products/${id}`);

// ---------------- REVIEWS ----------------
export const createReviewApi = (productId, data) => api.post(`/products/${productId}/reviews`, data);

// ---------------- CART ----------------
export const getCartApi = () => api.get("/cart");
export const addToCartApi = (productId, quantity) => api.post("/cart", { productId, quantity });
export const updateCartItemApi = (productId, quantity) => api.put(`/cart/${productId}`, { quantity });
export const removeCartItemApi = (productId) => api.delete(`/cart/${productId}`);
export const clearCartApi = () => api.delete("/cart");

// ---------------- ORDERS ----------------
export const createOrderApi = (data) => api.post("/orders", data);
export const getMyOrdersApi = () => api.get("/orders/myorders");
export const getOrderByIdApi = (id) => api.get(`/orders/${id}`);
export const getAllOrdersApi = () => api.get("/orders");
export const updateOrderStatusApi = (id, status) => api.put(`/orders/${id}/status`, { status });
export const deleteOrderApi = (id) => api.delete(`/orders/${id}`);

// ---------------- USERS (admin) ----------------
export const getUsersApi = () => api.get("/users");
export const updateUserApi = (id, data) => api.put(`/users/${id}`, data);
export const deleteUserApi = (id) => api.delete(`/users/${id}`);

export default api;
