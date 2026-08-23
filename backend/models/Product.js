// models/Product.js

const mongoose = require("mongoose");

// A review is small and always belongs to a product, so we embed it
// directly inside the Product document instead of making a separate
// "Review" collection. This keeps reads fast (one query gets everything).
const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    // "ref" tells Mongoose which model this ID points to, so we can
    // later "populate" it and get the full user document (e.g. their name)
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true, // we store the reviewer's name directly for fast display
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a product name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
    min: 0,
  },
  category: {
    type: String,
    required: [true, "Please add a category"],
  },
  brand: {
    type: String,
    required: [true, "Please add a brand"],
  },
  image: {
    type: String,
    required: [true, "Please add an image URL"],
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  rating: {
    type: Number,
    default: 0, // average rating, recalculated whenever a review is added
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  reviews: [reviewSchema],
}, {
  timestamps: true, // adds createdAt / updatedAt
});

// Text index so we can do fast search on name + description.
// This powers GET /api/products?search=iphone
productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
