// middleware/errorMiddleware.js
// Centralized error handling. Instead of writing try/catch error-formatting
// logic in every single controller, controllers can just throw an error or
// call next(error), and it will land here.
//
// This is registered LAST in server.js, after all routes:
//   app.use(notFound);
//   app.use(errorHandler);

// Runs when a request hits a URL that doesn't match any route.
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error); // passes the error along to errorHandler below
};

// Express recognizes this as an error handler because it takes 4 arguments.
const errorHandler = (err, req, res, next) => {
  // Sometimes an error comes in with status 200 by mistake, default to 500
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose "CastError" happens when an invalid MongoDB ID is used,
  // e.g. GET /api/products/123 (123 is not a valid ObjectId)
  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found";
  }

  // Mongoose duplicate key error (e.g. registering with an email that
  // already exists, since email is set to unique: true in the User model)
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
  }

  // Mongoose validation error (e.g. missing required field)
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message: message || "Server Error",
    // only show the stack trace in development, never in production
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
