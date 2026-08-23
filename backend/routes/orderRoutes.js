// routes/orderRoutes.js
const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

const authenticateUser = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

// All order routes require login
router.use(authenticateUser);

// IMPORTANT: /myorders must be declared BEFORE /:id
// otherwise Express would treat "myorders" as an :id value.
router.get("/myorders", getMyOrders);

router.post("/", createOrder);
router.get("/:id", getOrderById);

// Admin-only
router.get("/", isAdmin, getAllOrders);
router.put("/:id/status", isAdmin, updateOrderStatus);
router.delete("/:id", isAdmin, deleteOrder);

module.exports = router;
