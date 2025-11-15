import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";   // ✅ REQUIRED IMPORT

export default function Navbar() {
  return (
    <header className="mc-navbar">

      {/* LEFT: LOGO */}
      <div className="mc-logo-area">
        <div className="mc-logo-icon">M</div>
        <div className="mc-logo-text">
          <span className="mc-logo-merge">Merge</span>Chants
        </div>
      </div>

      {/* CENTER: SEARCH BAR */}
      <div className="mc-search-bar">
        <span className="mc-search-icon">🔍</span>
        <input 
          type="text" 
          placeholder="Search for items..." 
          className="mc-search-input"
        />
      </div>

      {/* RIGHT: NAVIGATION */}
      <nav className="mc-nav-links">
        <Link to="/dashboard" className="mc-nav-item">Marketplace</Link>
        <Link to="/mylistings" className="mc-nav-item">My Listings</Link>
        <Link to="/messages" className="mc-nav-item">Messages</Link>
        <Link to="/sell" className="mc-nav-item">Sell Item</Link>
        <Link to="/history" className="mc-nav-item">History</Link>
        <Link to="/report" className="mc-nav-item">Report</Link>
      </nav>

      {/* RIGHTMOST ACTIONS */}
      <div className="mc-nav-actions">
        <div className="mc-icon">🔔</div>
        <Link to="/settings" className="mc-icon settings">⚙️</Link>
      </div>

    </header>
  );
}
 