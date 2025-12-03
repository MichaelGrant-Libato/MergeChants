// frontend/src/pages/ProductDetails/ProductDetails.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetails.css";

// Turn CSV string from DB into full URLs
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

// Big carousel for details page
const DetailsImageCarousel = ({ images, alt }) => {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="no-image-large">No Image Available</div>;
  }

  const prev = () =>
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () =>
    setIndex((i) => (i + 1) % images.length);

  return (
    <div className="img-placeholder-large">
      <img
        src={images[index]}
        alt={alt}
        className="details-main-image"
      />
      {images.length > 1 && (
        <>
          <button
            className="details-carousel-btn prev"
            onClick={prev}
          >
            ‹
          </button>
          <button
            className="details-carousel-btn next"
            onClick={next}
          >
            ›
          </button>
        </>
      )}
    </div>
  );
};

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentStudentId = localStorage.getItem("studentId");

  useEffect(() => {
    fetch(`http://localhost:8080/api/listings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setListing(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading listing:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="details-container">Loading...</div>;
  if (!listing) return <div className="details-container">Item not found.</div>;

  const isOwner = currentStudentId === listing.seller;
  const imageUrls = getImageUrls(listing.images);

  const handleContact = () => {
    navigate(`/messages?user=${listing.seller}`);
  };

  return (
    <div className="details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="details-grid">
        {/* LEFT: image / carousel */}
        <div className="image-section">
          <DetailsImageCarousel
            images={imageUrls}
            alt={listing.name}
          />
        </div>

        {/* RIGHT: info */}
        <div className="info-section">
          <span className="category-tag">{listing.category}</span>
          <h1>{listing.name}</h1>
          <h2 className="price">₱{listing.price.toFixed(2)}</h2>

          <div className="seller-card">
            <div className="seller-avatar">👤</div>
            <div className="seller-info">
              <p className="seller-name">{listing.seller}</p>
              <p className="seller-sub">Verified Student</p>
            </div>
          </div>

          <div className="action-buttons">
            {isOwner ? (
              <button
                className="edit-btn-large"
                onClick={() => navigate(`/edit/${listing.id}`)}
              >
                Edit My Listing
              </button>
            ) : (
              <button
                className="contact-btn-large"
                onClick={handleContact}
              >
                Contact Seller
              </button>
            )}
          </div>

          <div className="details-block">
            <h3>Description</h3>
            <p>{listing.description}</p>
          </div>

          <div className="details-block">
            <h3>Details</h3>
            <ul className="details-list">
              <li>
                <strong>Condition:</strong> {listing.condition}
              </li>
              <li>
                <strong>Location:</strong> {listing.preferredLocation}
              </li>
              <li>
                <strong>Campus:</strong> {listing.campus || "Main Campus"}
              </li>
              <li>
                <strong>Posted:</strong>{" "}
                {new Date(
                  listing.createdAt || Date.now()
                ).toLocaleDateString()}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
