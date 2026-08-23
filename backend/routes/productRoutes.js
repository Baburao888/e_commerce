// routes/productRoutes.js
const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { createReview, getProductReviews } = require("../controllers/reviewController");

const authenticateUser = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

// Public routes — anyone can view products
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin-only routes — authenticateUser confirms login, isAdmin confirms role
router.post("/", authenticateUser, isAdmin, createProduct);
router.put("/:id", authenticateUser, isAdmin, updateProduct);
router.delete("/:id", authenticateUser, isAdmin, deleteProduct);

// Reviews (nested under a product)
router.post("/:id/reviews", authenticateUser, createReview);
router.get("/:id/reviews", getProductReviews);

module.exports = router;
