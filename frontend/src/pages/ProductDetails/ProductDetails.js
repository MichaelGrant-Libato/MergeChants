// frontend/src/pages/ProductDetails/ProductDetails.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./ProductDetails.css";
import Escrow from "../Escrow/Escrow";

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

const DetailsImageCarousel = ({ images, alt }) => {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="no-image-large">No Image Available</div>;
  }

  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="img-placeholder-large">
      <img src={images[index]} alt={alt} className="details-main-image" />
      {images.length > 1 && (
        <>
          <button className="details-carousel-btn prev" onClick={prev}>
            ‹
          </button>
          <button className="details-carousel-btn next" onClick={next}>
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
  const location = useLocation();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSafetyModal, setShowSafetyModal] = useState(false);

  const currentStudentId = localStorage.getItem("studentId") || "";

  // Data if opened from History
  const source = location.state?.source || "dashboard"; // "history" or "dashboard"
  const transactionId = location.state?.transactionId || null;
  const transactionRole = location.state?.role || null; // buyer | seller
  const otherPartyId = location.state?.otherPartyId || null;

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

  const isOwner = currentStudentId.trim() === String(listing.seller).trim();
  const imageUrls = getImageUrls(listing.images);
  const mainImage = imageUrls.length > 0 ? imageUrls[0] : null;

  const handleContact = () => {
    // Check if user has seen the warning
    const hasSeen = localStorage.getItem(`hasSeenEscrowWarning_${currentStudentId}`);
    if (hasSeen === 'true') {
      navigate(`/messages?user=${listing.seller}`);
    } else {
      setShowSafetyModal(true);
    }
  };

  const confirmSafetyWarning = () => {
    localStorage.setItem(`hasSeenEscrowWarning_${currentStudentId}`, 'true');
    setShowSafetyModal(false);
    navigate(`/messages?user=${listing.seller}`);
  };

  const handleEdit = () => {
    navigate(`/edit/${listing.id}`);
  };

  const handleReportTransaction = () => {
    if (!transactionId || !transactionRole || !otherPartyId) {
      console.error("Missing transaction data from history");
      return;
    }

    navigate(`/report/transaction/${transactionId}`, {
      state: {
        role: transactionRole,
        otherPartyId,
        listingName: listing.name,
        price: listing.price,
        listingId: listing.id,
        listingImage: mainImage, // ✅ pass image to report page
      },
    });
  };

  return (
    <div className="details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="details-grid">
        {/* LEFT: image / carousel */}
        <div className="image-section">
          <DetailsImageCarousel images={imageUrls} alt={listing.name} />
        </div>

        {/* RIGHT: info */}
        <div className="info-section">
          <span className="category-tag">{listing.category}</span>
          <h1>{listing.name}</h1>
          <h2 className="price">₱{listing.price.toFixed(2)}</h2>

          <div className="seller-card">
            <div className="seller-avatar">👤</div>
            <div className="seller-info">
              <p className="seller-name">
                {listing.seller}
                {isOwner && " (you)"}
              </p>
              <p className="seller-sub">Verified Student</p>
            </div>
          </div>

          <div className="action-buttons">
            {source === "history" ? (
              <button
                className="report-btn-large"
                onClick={handleReportTransaction}
              >
                Report Transaction
              </button>
            ) : isOwner ? (
              <button className="edit-btn-large" onClick={handleEdit}>
                Edit My Listing
              </button>
            ) : (
              <button className="contact-btn-large" onClick={handleContact}>
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
      {
        showSafetyModal && (
          <Escrow
            listingId={listing.id}
            sellerId={listing.seller}
            buyerId={currentStudentId}
            onConfirm={confirmSafetyWarning}
          />
        )
      }
    </div >
  );
}
