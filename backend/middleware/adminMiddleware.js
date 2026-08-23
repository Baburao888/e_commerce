// middleware/adminMiddleware.js
// This middleware must run AFTER authenticateUser (because it needs req.user).
// Used like this on admin-only routes:
//
//   router.post("/", authenticateUser, isAdmin, createProduct);
//
// authenticateUser runs first (confirms the user is logged in),
// then isAdmin runs (confirms the logged-in user has role "admin").

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // user is an admin, allow the request to continue
  } else {
    res.status(403).json({
      success: false,
      message: "Access denied. Admins only.",
    });
  }
};

module.exports = isAdmin;
