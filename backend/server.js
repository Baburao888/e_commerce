// server.js
// This is the entry point of the backend. It wires everything together:
// loads env vars -> connects to MongoDB -> sets up Express -> mounts routes.

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config(); // loads variables from .env into process.env

const connectDB = require("./config/db");

// Route files
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Connect to MongoDB before starting the server
connectDB();

const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(cors()); // allows the React frontend (different port) to call this API
app.use(express.json()); // lets us read req.body as JSON
app.use(cookieParser());

// ---------------- ROUTES ----------------
// Every route file handles one "resource". This keeps the API organized:
//   /api/auth/*      -> authRoutes.js     -> authController.js
//   /api/products/*  -> productRoutes.js  -> productController.js / reviewController.js
//   /api/cart/*      -> cartRoutes.js     -> cartController.js
//   /api/orders/*    -> orderRoutes.js    -> orderController.js
//   /api/users/*     -> userRoutes.js     -> userController.js
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

// Simple health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

// ---------------- ERROR HANDLING ----------------
// These must be registered LAST, after all other routes.
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
