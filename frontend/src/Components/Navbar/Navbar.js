import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; 
import { User, Bell, Settings } from "lucide-react"; 
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [userData, setUserData] = useState(null);
  const studentId = localStorage.getItem("studentId");

  // 1. Fetch User Data when Navbar loads
  useEffect(() => {
    if (studentId) {
      fetch(`http://localhost:8080/api/students/${studentId}`)
        .then((res) => res.json())
        .then((data) => setUserData(data))
        .catch((err) => console.error("Failed to load navbar profile:", err));
    }
  }, [studentId]);

  // Check if we are on the dashboard
  const isDashboard = location.pathname === "/dashboard";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-logo" onClick={() => navigate("/dashboard")}>
          <div className="logo-circle">M</div>
          <span className="logo-text">MergeChants</span>
        </div>

        {/* Search Bar - HIDDEN on other pages (keeps layout space) */}
        <div 
          className="navbar-search" 
          style={{ visibility: isDashboard ? "visible" : "hidden" }}
        >
          <input type="text" placeholder="Search for items..." />
        </div>

        {/* Navigation Links */}
        <div className="navbar-links">
          <Link to="/dashboard">Marketplace</Link>
          <Link to="/mylistings">My Listings</Link>
          <Link to="/messages">Messages</Link>
          <Link to="/createListings">Sell Item</Link>
          <Link to="/history">History</Link>
        </div>

        {/* Right Side: Dynamic Profile Section */}
        <div className="navbar-profile-section">
          <button className="icon-btn">
            <Bell size={20} color="#f1c40f" /> {/* Yellow Bell */}
          </button>

          {userData ? (
            // IF LOGGED IN: Show Name and ID
            <div className="user-profile-chip" onClick={() => navigate("/settings")}>
              <div className="chip-info">
                <span className="chip-name">{userData.firstName}</span>
                <span className="chip-id">{userData.studentNumber}</span>
              </div>
              <div className="chip-avatar">
                <User size={20} color="#555" />
              </div>
            </div>
          ) : (
            // IF NOT LOGGED IN: Show Cog only
            <button className="icon-btn" onClick={() => navigate("/settings")}>
              <Settings size={20} color="#999" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;