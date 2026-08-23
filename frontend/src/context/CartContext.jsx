// src/context/CartContext.jsx
// This context holds the shopping cart state and syncs it with the
// backend (GET/POST/PUT/DELETE /api/cart) whenever the user is logged in.

import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import {
  getCartApi,
  addToCartApi,
  updateCartItemApi,
  removeCartItemApi,
  clearCartApi,
} from "../services/api";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Whenever the user logs in, fetch their saved cart from the database.
  // When they log out, clear the cart from local state (but not the DB).
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setItems([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await getCartApi();
      setItems(res.data.data.items || []);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId, quantity = 1) => {
    const res = await addToCartApi(productId, quantity);
    setItems(res.data.data.items);
  };

  const updateItem = async (productId, quantity) => {
    const res = await updateCartItemApi(productId, quantity);
    setItems(res.data.data.items);
  };

  const removeItem = async (productId) => {
    const res = await removeCartItemApi(productId);
    setItems(res.data.data.items);
  };

  const clearCart = async () => {
    await clearCartApi();
    setItems([]);
  };

  // Derived values, recalculated automatically whenever "items" changes
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = {
    items,
    loading,
    itemCount,
    subtotal,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
