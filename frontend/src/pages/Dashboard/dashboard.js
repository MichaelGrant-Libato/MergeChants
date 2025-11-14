// frontend/src/pages/Dashboard/dashboard.js
import React, { useState } from "react";
import "./dashboard.css";


// --- Dummy Data ---
const CARD_COLOR = "#8D0133";

const DUMMY_PRODUCTS = [
  { id: 1, name: "MacBook", subTitle: "MacBook Pro 13-inch M2", category: "Electronics", price: 899, originalPrice: 1299, condition: "Like New", rating: 4.9, reviews: 127, seller: "TechStudent", campus: "Campus North", tags: ["Verified"], time: "2h ago", style: "Like New" },
  { id: 2, name: "Books", subTitle: "Calculus Textbook Bundle", category: "Textbooks", price: 85, originalPrice: 250, condition: "Good", rating: 4.7, reviews: 43, seller: "MathMajor2024", campus: "Library District", tags: ["Verified"], time: "4h ago", style: "Good" },
  { id: 3, name: "Hoodie", subTitle: "University Hoodie - Large", category: "Clothing", price: 25, originalPrice: 65, condition: "Excellent", rating: 4.8, reviews: 85, seller: "CampusStyle", campus: "Student Center", tags: [], time: "1d ago", style: "Excellent" },
  { id: 4, name: "Chair", subTitle: "Gaming Chair - Ergonomic", category: "Furniture", price: 120, originalPrice: 200, condition: "Very Good", rating: 4.6, reviews: 67, seller: "DormDeals", campus: "East Campus", tags: ["Verified"], time: "3h ago", style: "Very Good" },
  { id: 5, name: "iPhone", subTitle: "iPhone 14 Pro - 128GB", category: "Electronics", price: 650, originalPrice: 999, condition: "Excellent", rating: 4.9, reviews: 156, seller: "PhonePro", campus: "Tech Hub", tags: ["Verified"], time: "3h ago", style: "Excellent" },
  { id: 6, name: "Lamp", subTitle: "Desk Lamp - LED", category: "Furniture", price: 15, originalPrice: 35, condition: "Good", rating: 4.5, reviews: 23, seller: "StudySpace", campus: "Dorm Area", tags: [], time: "6h ago", style: "Good" },
];

// --- Components ---
const CardTag = ({ style }) => {
  let tagClass = "";
  if (style === "Excellent") tagClass = "tag-excellent";
  else if (style === "Very Good") tagClass = "tag-very-good";
  else if (style === "Good") tagClass = "tag-good";
  else if (style === "Like New") tagClass = "tag-like-new";

  return <span className={`card-tag ${tagClass}`}>{style}</span>;
};

const ProductCard = ({ product }) => (
  <div className="product-card">
    <div className="card-header" style={{ backgroundColor: CARD_COLOR }}>
      <CardTag style={product.style} />
      {product.tags.includes("Verified") && (
        <span className="verified-badge">✓ Verified</span>
      )}
      <h2 className="card-title">{product.name}</h2>
    </div>

    <div className="card-body">
      <p className="card-subtitle">{product.subTitle}</p>

      <p className="price-info">
        <span className="current-price">${product.price}</span>
        <span className="original-price">${product.originalPrice}</span>
        <span className="discount">
          {Math.round(
            ((product.originalPrice - product.price) / product.originalPrice) *
              100
          )}
          % off
        </span>
      </p>

      <p className="seller-info">
        <span className="seller-name">👤 {product.seller}</span>
        <span className="rating">
          ★ {product.rating} ({product.reviews})
        </span>
      </p>

      <p className="campus-info">📍 {product.campus}</p>
    </div>

    <div className="card-footer">
      <button className="contact-btn">Contact Seller</button>
      <span className="share-icon">↗</span>
      <span className="time-ago">{product.time}</span>
    </div>
  </div>
);

// --- Main Dashboard ---
export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedCondition, setSelectedCondition] = useState("All Conditions");
  const [priceRange] = useState({ min: 0, max: 1000 });

  const categories = [
    { name: "All Categories", count: 1247 },
    { name: "Electronics", count: 342 },
    { name: "Textbooks", count: 189 },
    { name: "Clothing", count: 156 },
    { name: "Furniture", count: 98 },
    { name: "Sports & Fitness", count: 67 },
  ];

  const conditions = [
    "All Conditions",
    "New",
    "Like New",
    "Excellent",
    "Very Good",
    "Good",
  ];

  const filteredProducts = DUMMY_PRODUCTS;

  return (
    <div className="dashboard-container">
      {/* Global Navbar */}
      

      <div className="main-content-area">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>Filters</h2>
            <button className="clear-all-btn">Clear All</button>
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
              <span className="price-label">${priceRange.min}</span>
              <span className="price-label">${priceRange.max}</span>
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

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
