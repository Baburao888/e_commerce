// src/pages/Products.jsx
// The main product listing page. Reads filters from the URL query string
// so that search/category/price filters are shareable and bookmarkable.

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProductsApi } from "../services/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const CATEGORIES = [
  "Electronics", "Mobiles", "Laptops", "Fashion", "Men",
  "Women", "Shoes", "Home", "Beauty", "Accessories", "Grocery",
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Local filter state, initialized from the URL
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "");
  const page = Number(searchParams.get("page")) || 1;

  // Whenever the URL query string changes, re-fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = Object.fromEntries(searchParams.entries());
        const res = await getProductsApi(params);
        setProducts(res.data.data);
        setPagination(res.data.pagination);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  // Sync local filter state -> URL query params (this triggers the effect above)
  const applyFilters = (overrides = {}) => {
    const params = {
      search, category, minPrice, maxPrice, sort, page: 1, limit: 12,
      ...overrides,
    };

    // Remove empty values so the URL stays clean
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
    });

    setSearchParams(params);
  };

  const goToPage = (newPage) => {
    setSearchParams({ ...Object.fromEntries(searchParams.entries()), page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="products-page">
      <aside className="filters-sidebar">
        <h3>Filters</h3>

        <label>Search</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
        />

        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label>Min Price</label>
        <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />

        <label>Max Price</label>
        <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />

        <label>Sort By</label>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="name">Name (A-Z)</option>
        </select>

        <button className="btn btn-primary" onClick={() => applyFilters()}>
          Apply Filters
        </button>
      </aside>

      <main className="products-main">
        <h2>Products ({pagination.totalProducts || 0})</h2>

        {loading ? (
          <Loader />
        ) : products.length === 0 ? (
          <p>No products found matching your filters.</p>
        ) : (
          <>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            <div className="pagination">
              <button
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
              >
                Previous
              </button>
              <span>Page {page} of {pagination.totalPages || 1}</span>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => goToPage(page + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Products;
