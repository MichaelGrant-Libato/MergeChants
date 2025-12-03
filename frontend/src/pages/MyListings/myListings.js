import React, { useState, useEffect } from "react";
import "./myListings.css";
import { useNavigate } from "react-router-dom";

// 🔹 Helper: get usable image URL from CSV string
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

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const rawStudentId = localStorage.getItem("studentId");
  const studentId = rawStudentId ? rawStudentId.trim() : null;

  useEffect(() => {
    if (!studentId) {
      setError("You must be logged in to view your listings.");
      setLoading(false);
      return;
    }

    const fetchMyListings = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/listings/seller/${studentId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch listings");
        }

        const data = await response.json();
        setListings(data);
      } catch (err) {
        console.error("Error loading your listings:", err);
        setError("Could not load your listings. Is the server running?");
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, [studentId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/listings/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete listing");

      setListings((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete item");
    }
  };

  const goToCreate = () => {
    navigate("/createListings");
  };

  if (loading) {
    return (
      <div className="ml-container">
        <p>Loading your items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-container">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  return (
    <div className="ml-container">
      <div className="ml-header">
        <h1>My Listings</h1>
        <button className="create-btn" onClick={goToCreate}>
          + Create New
        </button>
      </div>

      {listings.length === 0 ? (
        <div className="empty-state">
          <p>You haven't listed anything yet.</p>
          <p>Start selling your unused items today!</p>
        </div>
      ) : (
        <div className="listings-grid">
          {listings.map((item) => {
            const firstImage = getFirstImageUrl(item.images);

            return (
              <div key={item.id} className="listing-card">
                <div className="card-image">
                  {firstImage ? (
                    <img
                      src={firstImage}
                      alt={item.name}
                      className="card-image-tag"
                    />
                  ) : (
                    <span className="no-img">No Image</span>
                  )}
                </div>
                <div className="card-content">
                  <h3>{item.name}</h3>
                  <span className="price">₱{item.price}</span>
                  <span
                    className={`status-badge ${
                      item.status?.toLowerCase() || "pending"
                    }`}
                  >
                    {item.status}
                  </span>

                  <div className="card-actions">
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/edit/${item.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
