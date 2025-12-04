import React, { useState, useEffect } from "react";
import "./myListings.css";
import { useNavigate } from "react-router-dom";

// CSV → URLs
const getImageUrls = (images) => {
  if (!images) return [];

  return images
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((img) => {
      if (img.startsWith("http://") || img.startsWith("https://")) {
        return img;
      }
      if (img.startsWith("/uploads/")) {
        return `http://localhost:8080${img}`;
      }
      return `http://localhost:8080/uploads/${img}`;
    });
};

// Small carousel reused in MyListings
const CardImageCarousel = ({ images, alt }) => {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const prev = () =>
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () =>
    setIndex((i) => (i + 1) % images.length);

  return (
    <div className="card-image-preview">
      <img
        src={images[index]}
        alt={alt}
        className="card-image-tag"
      />
      {images.length > 1 && (
        <>
          <button className="carousel-btn prev" onClick={prev}>
            ‹
          </button>
          <button className="carousel-btn next" onClick={next}>
            ›
          </button>
        </>
      )}
    </div>
  );
};

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // for mark-as-sold modal
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [buyerIdInput, setBuyerIdInput] = useState("");
  const [soldError, setSoldError] = useState("");
  const [soldLoading, setSoldLoading] = useState(false);

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

        // 🔴 Hide SOLD items from My Listings
        const activeOnly = data.filter(
          (item) =>
            !item.status ||
            item.status.toUpperCase() !== "SOLD"
        );

        setListings(activeOnly);
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
    if (!window.confirm("Are you sure you want to delete this listing?"))
      return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/listings/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete listing");

      setListings((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete item");
    }
  };

  // Open Mark-as-Sold modal
  const openMarkAsSoldModal = (listing) => {
    setSelectedListing(listing);
    setBuyerIdInput("");
    setSoldError("");
    setShowSoldModal(true);
  };

  const closeMarkAsSoldModal = () => {
    setShowSoldModal(false);
    setSelectedListing(null);
    setBuyerIdInput("");
    setSoldError("");
  };

  // Confirm Mark as Sold (submit inside modal)
  const handleConfirmMarkAsSold = async (e) => {
    e.preventDefault();
    if (!selectedListing) return;

    const buyerId = buyerIdInput.trim();
    if (!buyerId) {
      setSoldError("Please enter the buyer's student ID.");
      return;
    }

    try {
      setSoldLoading(true);
      setSoldError("");

      const res = await fetch(
        "http://localhost:8080/api/transactions/complete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Student-Id": studentId, // seller id header
          },
          body: JSON.stringify({
            listingId: selectedListing.id,
            buyerId: buyerId,
          }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Mark as sold (my listings) failed:", res.status, text);
        setSoldError(
          text || `Could not mark as sold. (Status ${res.status})`
        );
        return;
      }

      await res.json();

      // 🔴 Remove sold listing from MyListings right away
      setListings((prev) =>
        prev.filter((item) => item.id !== selectedListing.id)
      );

      closeMarkAsSoldModal();
    } catch (err) {
      console.error(err);
      setSoldError("Could not mark as sold. Check console for details.");
    } finally {
      setSoldLoading(false);
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
          <p>You have no active listings.</p>
          <p>Start selling your unused items today!</p>
        </div>
      ) : (
        <div className="listings-grid">
          {listings.map((item) => {
            const imageUrls = getImageUrls(item.images);

            return (
              <div key={item.id} className="listing-card">
                <div className="card-image">
                  {imageUrls.length > 0 ? (
                    <CardImageCarousel
                      images={imageUrls}
                      alt={item.name}
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
                    {item.status || "ACTIVE"}
                  </span>

                  <div className="card-actions">
                    <button
                      className="mark-sold-btn"
                      onClick={() => openMarkAsSoldModal(item)}
                    >
                      Mark as Sold
                    </button>
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

      {/* MARK AS SOLD MODAL */}
      {showSoldModal && selectedListing && (
        <div className="ml-modal-backdrop" onClick={closeMarkAsSoldModal}>
          <div
            className="ml-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ml-modal-header">
              <h2>Mark as Sold</h2>
              <button
                className="ml-modal-close"
                onClick={closeMarkAsSoldModal}
                type="button"
              >
                ×
              </button>
            </div>

            <p className="ml-modal-subtitle">
              Listing: <strong>{selectedListing.name}</strong>
            </p>

            <form onSubmit={handleConfirmMarkAsSold}>
              <label className="ml-modal-label">
                Buyer&apos;s Student ID
                <input
                  type="text"
                  className="ml-modal-input"
                  value={buyerIdInput}
                  onChange={(e) => setBuyerIdInput(e.target.value)}
                  placeholder="e.g. 23-0000-916"
                />
              </label>

              {soldError && (
                <p className="ml-modal-error">{soldError}</p>
              )}

              <div className="ml-modal-actions">
                <button
                  type="button"
                  className="ml-modal-btn ml-modal-btn-secondary"
                  onClick={closeMarkAsSoldModal}
                  disabled={soldLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-modal-btn ml-modal-btn-primary"
                  disabled={soldLoading}
                >
                  {soldLoading ? "Saving..." : "Confirm Sold"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
