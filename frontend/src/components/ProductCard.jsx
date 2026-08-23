// src/components/ProductCard.jsx
// Displays one product as a card in the product listing grid.

import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const inStock = product.stock > 0;

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`}>
        <img src={product.image} alt={product.name} className="product-card-image" />
      </Link>

      <div className="product-card-body">
        <Link to={`/products/${product._id}`} className="product-card-name">
          {product.name}
        </Link>

        <p className="product-card-price">₹{product.price.toLocaleString("en-IN")}</p>

        <p className="product-card-rating">
          ⭐ {product.rating ? product.rating.toFixed(1) : "New"} ({product.numReviews} reviews)
        </p>

        <p className={inStock ? "in-stock" : "out-of-stock"}>
          {inStock ? `In Stock (${product.stock})` : "Out of Stock"}
        </p>

        <div className="product-card-actions">
          <Link to={`/products/${product._id}`} className="btn btn-outline">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
