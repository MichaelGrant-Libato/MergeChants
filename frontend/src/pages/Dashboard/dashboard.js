import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";


const CARD_COLOR = "#8D0133";

// 🔹 SAME helper as in MyListings
const getFirstImageUrl = (images) => {
  if (!images) return null;

  const first = images.split(",")[0].trim();
  if (!first) return null;

  if (first.startsWith("http://") || first.startsWith("https://")) {
    return first;
  }

  if (first.startsWith("/uploads/")) {
    return `http://localhost:8080${first}`;
  }

  return `http://localhost:8080/uploads/${first}`;
};

const CardTag = ({ style }) => {
  let tagClass = "";
  if (style === "Excellent") tagClass = "tag-excellent";
  else if (style === "Very Good") tagClass = "tag-very-good";
  else if (style === "Good") tagClass = "tag-good";
  else if (style === "Like New") tagClass = "tag-like-new";
  else if (style === "New") tagClass = "tag-new";
  else if (style === "Fair") tagClass = "tag-fair";

  return <span className={`card-tag ${tagClass}`}>{style}</span>;
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const currentStudentId = localStorage.getItem("studentId");
  const isOwner = product.seller === currentStudentId;
  const [sellerName, setSellerName] = useState("Student");

  useEffect(() => {
    if (product.seller) {
      fetch(`http://localhost:8080/api/students/${encodeURIComponent(product.seller)}`)
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Failed to fetch student");
        })
        .then((data) => {
          const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim();
          if (fullName) setSellerName(fullName);
        })
        .catch((err) => {
          console.error("Failed to load seller name", err);
        });
    }
  }, [product.seller]);

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "Recently";
    const now = new Date();
    const productTime = new Date(timestamp);
    const diffMs = now - productTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const displayImage = getFirstImageUrl(product.images);

  // 🔹 Use prop/callback if passed, or default to navigate
  const handleContactClick = (e) => {
    e.stopPropagation();
    if (product.onContact) {
      product.onContact(product.id, isOwner);
    } else {
      // Fallback if not passed (though we plan to pass it from Dashboard)
      navigate(`/listing/${product.id}`);
    }
  };

  const goToDetails = (e) => {
    // Use the same logic as Contact Seller
    // Ensure we don't double trigger if clicking another button inside
    if (product.onContact) {
      product.onContact(product.id, isOwner);
    } else {
      navigate(`/listing/${product.id}`);
    }
  };

  return (
    <div className="product-card">
      <div
        className="card-header"
        style={{ backgroundColor: CARD_COLOR, cursor: "pointer" }}
        onClick={goToDetails}
      >
        {displayImage && (
          <div className="card-image-preview">
            <img
              src={displayImage}
              alt={product.name}
              className="card-image-tag"
            />
          </div>
        )}

        <CardTag style={product.condition} />
        {product.tags && product.tags.split(",").includes("Verified") && (
          <span className="verified-badge">✓ Verified</span>
        )}
      </div>

      <div className="card-body">
        <h2
          className="card-title"
          style={{ cursor: "pointer" }}
          onClick={goToDetails}
        >
          {product.name}
        </h2>

        <p className="card-subtitle">{product.subTitle}</p>

        <p className="price-info">
          <span className="current-price">
            ₱{Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </p>

        <p className="seller-info">
          <span className="seller-name">
            👤 {sellerName} ({product.seller})
          </span>
        </p>

        <p className="campus-info">📍 {product.preferredLocation || "Main Campus"}</p>
      </div>

      <div className="card-footer">
        {isOwner ? (
          <button
            className="contact-btn"
            style={{ backgroundColor: "#333" }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/edit/${product.id}`);
            }}
          >
            Edit Listing
          </button>
        ) : (
          <button
            className="contact-btn"
            onClick={handleContactClick}
          >
            Contact Seller
          </button>
        )}

        <span className="share-icon">↗</span>
        <span className="time-ago">{getTimeAgo(product.time)}</span>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  // Get current user ID for Escrow binding
  const currentStudentId = localStorage.getItem("studentId");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedCondition, setSelectedCondition] = useState("All Conditions");

  // 🔹 REAL price-range state (used by filter + inputs)
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);



  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/listings");

      if (!response.ok) {
        throw new Error("Failed to fetch listings");
      }

      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔴 Only non-sold products are visible in marketplace
  const availableProducts = products.filter(
    (p) => !(p.status && p.status.toUpperCase() === "SOLD")
  );

  const getCategoryCounts = () => {
    const counts = {
      "All Categories": availableProducts.length,
      Electronics: 0,
      Textbooks: 0,
      Clothing: 0,
      Furniture: 0,
      "Sports & Fitness": 0,
      Other: 0,
    };

    availableProducts.forEach((product) => {
      if (counts.hasOwnProperty(product.category)) {
        counts[product.category]++;
      } else {
        counts["Other"]++;
      }
    });

    return counts;
  };

  const categoryCounts = getCategoryCounts();
  const categories = [
    { name: "All Categories", count: categoryCounts["All Categories"] },
    { name: "Electronics", count: categoryCounts["Electronics"] },
    { name: "Textbooks", count: categoryCounts["Textbooks"] },
    { name: "Clothing", count: categoryCounts["Clothing"] },
    { name: "Furniture", count: categoryCounts["Furniture"] },
    { name: "Sports & Fitness", count: categoryCounts["Sports & Fitness"] },
  ];

  const conditions = [
    "All Conditions",
    "New",
    "Like New",
    "Excellent",
    "Very Good",
    "Good",
    "Fair",
  ];

  // 🔹 Apply category, condition AND price filters
  const filteredProducts = availableProducts.filter((product) => {
    const categoryMatch =
      selectedCategory === "All Categories" ||
      product.category === selectedCategory;

    const conditionMatch =
      selectedCondition === "All Conditions" ||
      product.condition === selectedCondition;

    const price = Number(product.price);
    const min = Number(minPrice) || 0;
    const max = Number(maxPrice) || Infinity;

    const priceMatch =
      !Number.isNaN(price) && price >= min && price <= max;

    return categoryMatch && conditionMatch && priceMatch;
  });

  const handleCreateListing = () => {
    navigate("/createListings");
  };

  const clearFilters = () => {
    setSelectedCategory("All Categories");
    setSelectedCondition("All Conditions");
    setMinPrice(0);
    setMaxPrice(100000);
  };

  const handleContactSeller = (listingId, isOwner) => {
    if (isOwner) {
      navigate(`/edit/${listingId}`);
    } else {
      navigate(`/listing/${listingId}`);
    }
  };



  return (
    <div className="dashboard-container">
      <div className="main-content-area">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>Filters</h2>
            <button className="clear-all-btn" onClick={clearFilters}>
              Clear All
            </button>
          </div>

          {/* Categories */}
          <div className="filter-section categories-filter">
            <h3>Categories</h3>
            {categories.map((cat) => (
              <div
                key={cat.name}
                className={`filter-item ${selectedCategory === cat.name ? "active-category" : ""
                  }`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                <span className="filter-name">{cat.name}</span>
                <span className="filter-count">{cat.count}</span>
              </div>
            ))}
          </div>

          {/* Price Range */}
          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-inputs">
              <input
                type="number"
                className="price-label"
                value={minPrice}
                min="0"
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                className="price-label"
                value={maxPrice}
                min="0"
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Condition */}
          <div className="filter-section conditions-filter">
            <h3>Condition</h3>
            {conditions.map((cond) => (
              <div
                key={cond}
                className={`filter-item condition-item ${selectedCondition === cond ? "active-condition" : ""
                  }`}
                onClick={() => setSelectedCondition(cond)}
              >
                {cond}
              </div>
            ))}
          </div>
        </aside>

        {/* Marketplace Grid */}
        <main className="marketplace-grid-container">
          <div className="marketplace-header">
            <h1 className="marketplace-title">MARKETPLACE</h1>
            <span className="item-count">
              {filteredProducts.length} items found
            </span>

            <div className="sort-controls">
              <button className="display-toggle">
                <span className="icon-placeholder">::</span>
              </button>

              <select className="sort-dropdown">
                <option>Newest First</option>
                <option>Price: Low to High</option>
                <option>Rating</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="loading-state">
              <p>Loading listings...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <p>Error: {error}</p>
              <button onClick={fetchProducts} className="retry-btn">
                Retry
              </button>
            </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="empty-state">
              <p>No listings found matching your filters.</p>
              <button onClick={clearFilters} className="clear-filters-btn">
                Clear Filters
              </button>
            </div>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{ ...product, onContact: handleContactSeller }}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* FAB */}
      <button
        className="fab-create-listing"
        onClick={handleCreateListing}
        title="Create New Listing"
      >
        <span className="fab-icon">+</span>
      </button>


    </div>
  );
}
