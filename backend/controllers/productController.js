// controllers/productController.js

const Product = require("../models/Product");

// @route   GET /api/products
// @access  Public
// Supports: search, category, minPrice, maxPrice, sort, page, limit
// Example: /api/products?search=phone&category=Mobiles&minPrice=10000&maxPrice=80000&sort=price_asc&page=1&limit=10
const getProducts = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page, limit } = req.query;

    // Build the MongoDB query object step by step
    const query = {};

    if (search) {
      // $or means "match ANY of these conditions"
      // $regex with "i" option means case-insensitive search
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice); // greater than or equal
      if (maxPrice) query.price.$lte = Number(maxPrice); // less than or equal
    }

    // Sorting options
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "rating") sortOption = { rating: -1 };
    if (sort === "name") sortOption = { name: 1 };

    // Pagination
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 12;
    const skip = (pageNumber - 1) * pageSize;

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        totalProducts,
        totalPages: Math.ceil(totalProducts / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, brand, image, stock } = req.body;

    if (!name || !description || !price || !category || !brand || !image) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required product fields",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      brand,
      image,
      stock: stock || 0,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Only update the fields that were actually sent in the request body.
    // This lets the admin update just the price, or just the stock, etc.
    const fields = ["name", "description", "price", "category", "brand", "image", "stock"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
