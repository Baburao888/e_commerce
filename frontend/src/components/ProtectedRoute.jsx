// src/components/ProtectedRoute.jsx
// Wraps pages that require the user to be logged in (and optionally an admin).
// Usage in App.jsx:
//   <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
//   <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // While we're still checking if the user is logged in (on page refresh),
  // show a loader instead of immediately redirecting.
  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
