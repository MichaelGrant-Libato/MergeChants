import React, { useState, useEffect } from "react";
import "./style.css"; // We will add this CSS next

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Get the current user's ID
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    if (!studentId) {
      setError("You must be logged in to view your listings.");
      setLoading(false);
      return;
    }

    // 2. Fetch ONLY this student's items
    fetch(`http://localhost:8080/api/listings/seller/${studentId}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch listings");
        return response.json();
      })
      .then((data) => {
        setListings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load your listings. Is the server running?");
        setLoading(false);
      });
  }, [studentId]);

  // Delete Handler (Optional bonus feature)
  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this listing?")) return;

    try {
        await fetch(`http://localhost:8080/api/listings/${id}`, { method: 'DELETE' });
        // Remove from UI immediately
        setListings(listings.filter(item => item.id !== id));
    } catch (err) {
        alert("Failed to delete item");
    }
  };

  if (loading) return <div className="ml-container"><p>Loading your items...</p></div>;
  if (error) return <div className="ml-container"><p className="error-text">{error}</p></div>;

  return (
    <div className="ml-container">
      <div className="ml-header">
        <h1>My Listings</h1>
        <button className="create-btn" onClick={() => window.location.href='/createListings'}>+ Create New</button>
      </div>
      
      {listings.length === 0 ? (
        <div className="empty-state">
          <p>You haven't listed anything yet.</p>
          <p>Start selling your unused items today!</p>
        </div>
      ) : (
        <div className="listings-grid">
          {listings.map((item) => (
            <div key={item.id} className="listing-card">
              <div className="card-image">
                 {/* Handle logic for if image is empty string or file path */}
                 {item.images ? <span className="img-placeholder">Has Image</span> : <span className="no-img">No Image</span>}
              </div>
              <div className="card-content">
                <h3>{item.name}</h3>
                <span className="price">₱{item.price}</span>
                <span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span>
                
                <div className="card-actions">
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(item.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}