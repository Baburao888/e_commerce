// src/context/AuthContext.jsx
// This context holds the currently logged-in user, and exposes
// login/register/logout functions to the whole app via useContext.

import { createContext, useState, useEffect, useContext } from "react";
import { loginApi, registerApi, getMeApi } from "../services/api";

const AuthContext = createContext();

// Small helper hook so components can do: const { user, login } = useAuth();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking for existing login

  // When the app first loads, check if a token is already saved.
  // If so, verify it's still valid by calling GET /api/auth/me.
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getMeApi();
        setUser(res.data.data);
      } catch (error) {
        // token is invalid/expired, clear it
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    const { token, ...userData } = res.data.data;
    localStorage.setItem("token", token);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await registerApi({ name, email, password });
    const { token, ...userData } = res.data.data;
    localStorage.setItem("token", token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
