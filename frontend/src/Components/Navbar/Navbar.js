import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, Bell, Settings } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    const fetchProfile = () => {
      if (studentId) {
        fetch(`http://localhost:8080/api/students/${studentId}`)
          .then((res) => res.json())
          .then((data) => {
            setUserData(data);
            if (data.studentNumber) {
              return fetch(`http://localhost:8080/api/profiles/student/${data.studentNumber}`);
            }
          })
          .then((res) => {
            if (res && res.ok) return res.json();
          })
          .then((profileData) => {
            if (profileData) {
              setUserData(prev => ({ ...prev, profilePic: profileData.profilePic }));
            }
          })
          .catch((err) => console.error("Failed to load navbar profile:", err));
      }
    };

    fetchProfile();
    window.addEventListener("profileUpdated", fetchProfile);
    return () => window.removeEventListener("profileUpdated", fetchProfile);
  }, [studentId]);

  const isDashboard = location.pathname === "/dashboard";

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* LEFT: Logo */}
        <div className="navbar-logo" onClick={() => navigate("/dashboard")}>
          <div className="logo-circle">M</div>
          <span className="logo-text">MergeChants</span>
        </div>

        {/* CENTER: Search Bar */}
        <div
          className="navbar-search"
          style={{ visibility: isDashboard ? "visible" : "hidden" }}
        >
          <input type="text" placeholder="Search for items..." />
        </div>

        {/* RIGHT: Links + Profile (Grouped for Layout) */}
        <div className="navbar-right-section">
          <div className="navbar-links">
            <Link to="/dashboard">Marketplace</Link>
            <Link to="/mylistings">My Listings</Link>
            <Link to="/messages">Messages</Link>
            <Link to="/createListings">Sell Item</Link>
            <Link to="/history">History</Link>
          </div>

          <div className="navbar-profile-section">
            <button className="icon-btn">
              <Bell size={20} color="#f1c40f" />
            </button>

            {userData ? (
              <div className="user-profile-chip" onClick={() => navigate("/settings")}>
                <div className="chip-info">
                  <span className="chip-name">{userData.firstName}</span>
                  <span className="chip-id">{userData.studentNumber}</span>
                </div>
                <div className="chip-avatar">
                  {userData.profilePic ? (
                    <img
                      src={`http://localhost:8080${userData.profilePic}`}
                      alt="Profile"
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <User size={20} color="#555" />
                  )}
                </div>
              </div>
            ) : (
              <button className="icon-btn" onClick={() => navigate("/settings")}>
                <Settings size={20} color="#999" />
              </button>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;