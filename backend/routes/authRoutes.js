// routes/authRoutes.js
const express = require("express");
const router = express.Router();

const { registerUser, loginUser, logoutUser, getMe } = require("../controllers/authController");
const authenticateUser = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authenticateUser, logoutUser);
router.get("/me", authenticateUser, getMe);

module.exports = router;
