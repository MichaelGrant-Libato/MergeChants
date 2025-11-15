import React from "react";
import "./Navbar.css";

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
        <a href="/dashboard" className="mc-nav-item">Marketplace</a>
        <a href="/my-listings" className="mc-nav-item">My Listings</a>
        <a href="/messages" className="mc-nav-item">Messages</a>
        <a href="/sell" className="mc-nav-item">Sell Item</a>
        <a href="/history" className="mc-nav-item">History</a>
        <a href="/report" className="mc-nav-item">Report</a>
        <Link to="/mylistings">My Listings</Link>
<Link to="/sell">Sell Item</Link>
<Link to="/history">History</Link>
<Link to="/report">Report</Link>

      </nav>

      {/* RIGHTMOST ACTIONS */}
      <div className="mc-nav-actions">
        <div className="mc-icon">🔔</div>
        <a href="/settings" className="mc-icon settings">⚙️</a>
      </div>

    </header>
  );
}
