// src/pages/ProductDetails.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductByIdApi, createReviewApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState("");

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await getProductByIdApi(id);
      setProduct(res.data.data);
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/products/${id}` } });
      return;
    }

    setAddingToCart(true);
    setMessage("");
    try {
      await addItem(id, quantity);
      setMessage("Added to cart!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/products/${id}` } });
      return;
    }
    await addItem(id, quantity);
    navigate("/cart");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");

    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/products/${id}` } });
      return;
    }

    setSubmittingReview(true);
    try {
      await createReviewApi(id, { rating, comment });
      setComment("");
      setRating(5);
      await fetchProduct(); // refresh to show the new review
    } catch (error) {
      setReviewError(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Loader />;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="product-details-page">
      <div className="product-details-top">
        <img src={product.image} alt={product.name} className="product-details-image" />

        <div className="product-details-info">
          <h1>{product.name}</h1>
          <p className="product-details-rating">
            ⭐ {product.rating.toFixed(1)} ({product.numReviews} reviews)
          </p>
          <p className="product-details-price">₹{product.price.toLocaleString("en-IN")}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Brand:</strong> {product.brand}</p>
          <p><strong>Description:</strong> {product.description}</p>
          <p className={product.stock > 0 ? "in-stock" : "out-of-stock"}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
          </p>

          {product.stock > 0 && (
            <div className="quantity-selector">
              <label>Quantity:</label>
              <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
                {[...Array(Math.min(product.stock, 10)).keys()].map((n) => (
                  <option key={n + 1} value={n + 1}>{n + 1}</option>
                ))}
              </select>
            </div>
          )}

          {message && <p className="form-success">{message}</p>}

          <div className="product-details-actions">
            <button
              className="btn btn-outline"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addingToCart}
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>
            <button
              className="btn btn-primary"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <section className="reviews-section">
        <h2>Customer Reviews</h2>

        {product.reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="reviews-list">
            {product.reviews.map((review) => (
              <div key={review._id} className="review-card">
                <p className="review-stars">{"⭐".repeat(review.rating)}</p>
                <p>{review.comment}</p>
                <p className="review-author">- {review.name}</p>
              </div>
            ))}
          </div>
        )}

        <form className="review-form" onSubmit={handleReviewSubmit}>
          <h3>Write a Review</h3>
          {reviewError && <p className="form-error">{reviewError}</p>}

          <label>Rating</label>
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            <option value={5}>5 - Excellent</option>
            <option value={4}>4 - Good</option>
            <option value={3}>3 - Average</option>
            <option value={2}>2 - Poor</option>
            <option value={1}>1 - Terrible</option>
          </select>

          <label>Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={3}
          />

          <button type="submit" className="btn btn-primary" disabled={submittingReview}>
            {submittingReview ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default ProductDetails;
