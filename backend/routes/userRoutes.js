// routes/userRoutes.js
const express = require("express");
const router = express.Router();

const { getUsers, getUserById, updateUser, deleteUser } = require("../controllers/userController");
const authenticateUser = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

// All user management routes require login
router.use(authenticateUser);

router.get("/", isAdmin, getUsers);
router.get("/:id", getUserById);       // ownership check happens inside controller
router.put("/:id", updateUser);        // ownership check happens inside controller
router.delete("/:id", isAdmin, deleteUser);

module.exports = router;
