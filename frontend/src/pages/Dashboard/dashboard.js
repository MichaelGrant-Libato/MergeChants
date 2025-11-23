import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";


const CARD_COLOR = "#8D0133";


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
  const currentStudentId = localStorage.getItem("studentId"); // 1. Get who is logged in
  const isOwner = product.seller === currentStudentId;        // 2. Am I the seller?

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

  const getFirstImage = () => {
    if (!product.images) return null;
    return product.images.split(',')[0];
  };

  const displayImage = getFirstImage();

  const goToDetails = () => {
    navigate(`/listing/${product.id}`);
  };

  return (
    <div className="product-card">
      <div 
        className="card-header" 
        style={{ backgroundColor: CARD_COLOR, cursor: 'pointer' }}
        onClick={goToDetails}
      >
        {displayImage ? (
           <div className="card-image-preview">
              <span style={{color:'white'}}>Has Image</span> 
           </div>
        ) : null}

        <CardTag style={product.condition} />
        {product.tags && product.tags.split(',').includes("Verified") && (
          <span className="verified-badge">✓ Verified</span>
        )}
      </div>

      <div className="card-body">
        <h2 
            className="card-title" 
            style={{cursor: 'pointer'}}
            onClick={goToDetails}
        >
            {product.name}
        </h2>
        
        <p className="card-subtitle">{product.subTitle}</p>

        <p className="price-info">
          <span className="current-price">₱{product.price.toFixed(2)}</span>
        </p>

        <p className="seller-info">
          <span className="seller-name">👤 {product.seller}</span>
        </p>

        <p className="campus-info">📍 {product.campus}</p>
      </div>

      <div className="card-footer">
        {/* 3. CONDITIONAL BUTTON LOGIC */}
        {isOwner ? (
            <button 
                className="contact-btn" 
                style={{ backgroundColor: '#333' }} // Make it grey to differentiate
                onClick={(e) => {
                    e.stopPropagation(); // Don't open details, just go to edit
                    navigate(`/edit/${product.id}`);
                }}
            >
                Edit Listing
            </button>
        ) : (
            <button 
                className="contact-btn" 
                onClick={(e) => {
                    e.stopPropagation(); // Prevent double-click issues
                    goToDetails();
                }}
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

// --- Main Dashboard ---
export default function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedCondition, setSelectedCondition] = useState("All Conditions");
  const [priceRange] = useState({ min: 0, max: 100000 });

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/listings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }
      
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate category counts dynamically
  const getCategoryCounts = () => {
    const counts = {
      "All Categories": products.length,
      "Electronics": 0,
      "Textbooks": 0,
      "Clothing": 0,
      "Furniture": 0,
      "Sports & Fitness": 0,
      "Other": 0
    };

    products.forEach(product => {
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
    "Fair"
  ];

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === "All Categories" || product.category === selectedCategory;
    const conditionMatch = selectedCondition === "All Conditions" || product.condition === selectedCondition;
    const priceMatch = product.price >= priceRange.min && product.price <= priceRange.max;
    
    return categoryMatch && conditionMatch && priceMatch;
  });

  const handleCreateListing = () => {
    navigate('/createListings');
  };

  const clearFilters = () => {
    setSelectedCategory("All Categories");
    setSelectedCondition("All Conditions");
  };

  return (
    <div className="dashboard-container">
      <div className="main-content-area">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>Filters</h2>
            <button className="clear-all-btn" onClick={clearFilters}>Clear All</button>
          </div>

          <div className="filter-section categories-filter">
            <h3>Categories</h3>
            {categories.map((cat) => (
              <div
                key={cat.name}
                className={`filter-item ${
                  selectedCategory === cat.name ? "active-category" : ""
                }`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                <span className="filter-name">{cat.name}</span>
                <span className="filter-count">{cat.count}</span>
              </div>
            ))}
          </div>

          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-inputs">
              <span className="price-label">₱{priceRange.min}</span>
              <span className="price-label">₱{priceRange.max}</span>
            </div>
            <div className="range-slider-placeholder"></div>
          </div>

          <div className="filter-section conditions-filter">
            <h3>Condition</h3>
            {conditions.map((cond) => (
              <div
                key={cond}
                className={`filter-item condition-item ${
                  selectedCondition === cond ? "active-condition" : ""
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
            <span className="item-count">{filteredProducts.length} items found</span>

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

          {/* Loading State */}
          {loading && (
            <div className="loading-state">
              <p>Loading listings...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="error-state">
              <p>Error: {error}</p>
              <button onClick={fetchProducts} className="retry-btn">Retry</button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="empty-state">
              <p>No listings found matching your filters.</p>
              <button onClick={clearFilters} className="clear-filters-btn">Clear Filters</button>
            </div>
          )}

          {/* Product Grid */}
          {!loading && !error && filteredProducts.length > 0 && (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Floating Action Button - Create Listing */}
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