// models/User.js
// This is the schema (shape) of a User document stored in MongoDB.

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true, // MongoDB will reject duplicate emails
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false, // by default, don't return password when we query users
  },
  role: {
    type: String,
    enum: ["user", "admin"], // only these two values are allowed
    default: "user",
  },
}, {
  timestamps: true, // automatically adds createdAt and updatedAt fields
});

// -----------------------------------------------------------------
// MONGOOSE MIDDLEWARE (runs automatically before certain operations)
// -----------------------------------------------------------------
// Before saving a user, if the password field was changed, hash it.
// This means we NEVER store plain text passwords in the database.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// -----------------------------------------------------------------
// INSTANCE METHOD
// -----------------------------------------------------------------
// Compares a plain text password (from login form) with the hashed
// password stored in the database. Returns true/false.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
