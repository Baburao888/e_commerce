// src/pages/Home.jsx
// The landing page. Shows category shortcuts and a handful of featured products.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProductsApi } from "../services/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const CATEGORIES = [
  "Electronics", "Mobiles", "Laptops", "Fashion", "Men",
  "Women", "Shoes", "Home", "Beauty", "Accessories", "Grocery",
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await getProductsApi({ limit: 8, sort: "rating" });
        setFeatured(res.data.data);
      } catch (error) {
        console.error("Failed to load featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <h1>Welcome to ShopEasy</h1>
        <p>Everything you need, delivered to your doorstep.</p>
        <Link to="/products" className="btn btn-primary">
          Shop Now
        </Link>
      </section>

      <section className="categories-section">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          {CATEGORIES.map((cat) => (
            <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} className="category-chip">
              {cat}
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-section">
        <h2>Top Rated Products</h2>
        {loading ? (
          <Loader />
        ) : (
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
