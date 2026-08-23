// seed/seedProducts.js
// Run this script to populate MongoDB with sample products (and an admin user).
//
//   npm run seed           -> inserts data
//   npm run seed:destroy   -> deletes all products/users
//
// It connects to MongoDB directly (not through the running server).

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

dotenv.config();

const Product = require("../models/Product");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

const products = [
  { name: "iPhone 15", description: "Apple iPhone 15 with A16 Bionic chip, 128GB storage, dual camera system.", price: 69999, category: "Mobiles", brand: "Apple", image: "https://images.unsplash.com/photo-1592286927505-1def25115558?w=500", stock: 25, rating: 4.6 },
  { name: "Samsung Galaxy S24", description: "Samsung Galaxy S24 with AMOLED display, 256GB storage, and 50MP camera.", price: 64999, category: "Mobiles", brand: "Samsung", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500", stock: 30, rating: 4.5 },
  { name: "OnePlus 12", description: "OnePlus 12 flagship with Snapdragon 8 Gen 3 and 100W fast charging.", price: 59999, category: "Mobiles", brand: "OnePlus", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500", stock: 20, rating: 4.4 },
  { name: "Xiaomi Redmi Note 13", description: "Budget-friendly Redmi Note 13 with 108MP camera and 5000mAh battery.", price: 17999, category: "Mobiles", brand: "Xiaomi", image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500", stock: 40, rating: 4.2 },
  { name: "HP Pavilion 15", description: "HP Pavilion 15 laptop with Intel i5, 16GB RAM, 512GB SSD.", price: 54999, category: "Laptops", brand: "HP", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500", stock: 15, rating: 4.3 },
  { name: "Dell Inspiron 14", description: "Dell Inspiron 14 with Intel i7, 16GB RAM, 1TB SSD, ideal for productivity.", price: 64999, category: "Laptops", brand: "Dell", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500", stock: 12, rating: 4.4 },
  { name: "Apple MacBook Air M2", description: "MacBook Air with Apple M2 chip, 8GB RAM, 256GB SSD, all-day battery.", price: 99999, category: "Laptops", brand: "Apple", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500", stock: 10, rating: 4.8 },
  { name: "Lenovo IdeaPad Slim 3", description: "Lenovo IdeaPad Slim 3 with Ryzen 5, 8GB RAM, 512GB SSD.", price: 42999, category: "Laptops", brand: "Lenovo", image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500", stock: 18, rating: 4.1 },
  { name: "Nike Air Max", description: "Nike Air Max running shoes with breathable mesh and cushioned sole.", price: 7999, category: "Shoes", brand: "Nike", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", stock: 50, rating: 4.5 },
  { name: "Adidas Ultraboost", description: "Adidas Ultraboost sneakers with responsive Boost midsole cushioning.", price: 8999, category: "Shoes", brand: "Adidas", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500", stock: 45, rating: 4.6 },
  { name: "Puma RS-X", description: "Puma RS-X chunky sneakers with retro design and comfortable fit.", price: 5999, category: "Shoes", brand: "Puma", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500", stock: 35, rating: 4.2 },
  { name: "Men's Cotton T-Shirt", description: "Premium cotton crew-neck T-shirt, breathable and comfortable for daily wear.", price: 599, category: "Men", brand: "Roadster", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500", stock: 100, rating: 4.0 },
  { name: "Women's Floral Dress", description: "Lightweight floral summer dress, perfect for casual outings.", price: 1299, category: "Women", brand: "Vero Moda", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500", stock: 60, rating: 4.3 },
  { name: "Men's Slim Fit Jeans", description: "Stretchable slim-fit denim jeans with a modern silhouette.", price: 1799, category: "Men", brand: "Levi's", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500", stock: 70, rating: 4.4 },
  { name: "Women's Handbag", description: "Elegant faux-leather handbag with multiple compartments.", price: 2499, category: "Fashion", brand: "Caprese", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500", stock: 40, rating: 4.1 },
  { name: "Sony WH-1000XM5 Headphones", description: "Industry-leading noise cancelling wireless headphones with 30-hour battery.", price: 29999, category: "Electronics", brand: "Sony", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", stock: 22, rating: 4.7 },
  { name: "boAt Rockerz 450", description: "Wireless on-ear Bluetooth headphones with up to 15 hours playback.", price: 1499, category: "Electronics", brand: "boAt", image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500", stock: 80, rating: 4.0 },
  { name: "Apple Watch Series 9", description: "Apple Watch with always-on Retina display and advanced health sensors.", price: 41999, category: "Accessories", brand: "Apple", image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500", stock: 20, rating: 4.6 },
  { name: "Noise ColorFit Pro Smart Watch", description: "Affordable smartwatch with heart rate monitor and SpO2 tracking.", price: 1999, category: "Accessories", brand: "Noise", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500", stock: 55, rating: 3.9 },
  { name: "Canon EOS 1500D DSLR Camera", description: "24.1MP DSLR camera with 18-55mm lens, ideal for beginners.", price: 34999, category: "Electronics", brand: "Canon", image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500", stock: 10, rating: 4.5 },
  { name: "Logitech MK270 Keyboard & Mouse", description: "Wireless keyboard and mouse combo with reliable 2.4GHz connection.", price: 1299, category: "Electronics", brand: "Logitech", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500", stock: 65, rating: 4.2 },
  { name: "Logitech G502 Gaming Mouse", description: "High-precision gaming mouse with customizable weights and RGB lighting.", price: 3499, category: "Electronics", brand: "Logitech", image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500", stock: 30, rating: 4.6 },
  { name: "American Tourister Backpack", description: "Durable laptop backpack with padded compartments and water resistance.", price: 1899, category: "Accessories", brand: "American Tourister", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500", stock: 50, rating: 4.3 },
  { name: "Mamaearth Vitamin C Face Wash", description: "Natural face wash with Vitamin C and Turmeric for glowing skin.", price: 249, category: "Beauty", brand: "Mamaearth", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500", stock: 120, rating: 4.1 },
  { name: "Nivea Men Face Cream", description: "Moisturizing face cream for men with 24-hour hydration.", price: 199, category: "Beauty", brand: "Nivea", image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500", stock: 100, rating: 4.0 },
  { name: "Prestige Induction Cooktop", description: "1200W induction cooktop with 8 pre-set cooking menus.", price: 2299, category: "Home", brand: "Prestige", image: "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=500", stock: 25, rating: 4.3 },
  { name: "Milton Thermosteel Flask", description: "Vacuum insulated stainless steel flask, keeps beverages hot/cold for 24 hours.", price: 899, category: "Home", brand: "Milton", image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500", stock: 90, rating: 4.4 },
  { name: "Tata Sampann Toor Dal 1kg", description: "Unpolished, naturally processed toor dal rich in protein.", price: 149, category: "Grocery", brand: "Tata Sampann", image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500", stock: 200, rating: 4.5 },
  { name: "Fortune Sunflower Oil 1L", description: "Refined sunflower oil, light and healthy for everyday cooking.", price: 179, category: "Grocery", brand: "Fortune", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500", stock: 150, rating: 4.2 },
  { name: "JBL Flip 6 Bluetooth Speaker", description: "Portable waterproof Bluetooth speaker with punchy bass and 12-hour battery.", price: 9999, category: "Electronics", brand: "JBL", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500", stock: 28, rating: 4.6 },
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    // Clear existing data first so we don't get duplicates on re-run
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();

    // Create a default admin account.
    // NOTE: password is hashed automatically by the User model's pre-save hook.
    await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    });

    // Create a normal demo user too
    await User.create({
      name: "Demo User",
      email: "user@example.com",
      password: "user1234",
      role: "user",
    });

    await Product.insertMany(products);

    console.log("Data imported successfully!");
    console.log(`${products.length} products inserted.`);
    console.log("Admin login -> email: admin@example.com | password: admin123");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();

    console.log("Data destroyed!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run "node seed/seedProducts.js -d" to destroy instead of import
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
