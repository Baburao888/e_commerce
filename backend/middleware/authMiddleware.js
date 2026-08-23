// middleware/authMiddleware.js
// This middleware protects routes that require a logged-in user.
// It is used like this in a route file:
//
//   router.get("/me", authenticateUser, getMe);
//
// Express runs authenticateUser FIRST. If the token is valid, it calls
// next() and Express moves on to the actual controller (getMe).
// If not, it stops the request here and sends back a 401 error.

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateUser = async (req, res, next) => {
  let token;

  // We expect the token in the Authorization header like:
  // Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using our secret key. This throws an error
      // if the token is invalid or expired.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the logged-in user to the request object (without password)
      // so every controller after this can use req.user
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User belonging to this token no longer exists",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided",
    });
  }
};

module.exports = authenticateUser;
