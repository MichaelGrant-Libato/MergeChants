// frontend/src/pages/History/HistoryPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./History.css";

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

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [listingsById, setListingsById] = useState({});

  const rawStudentId = localStorage.getItem("studentId");
  const studentId = rawStudentId ? rawStudentId.trim() : "";

  const navigate = useNavigate();

  useEffect(() => {
    if (!studentId) {
      setError("Please log in to view your transaction history.");
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/transactions/history/${studentId}`
        );
        if (!res.ok) throw new Error("Failed to load history");
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error(err);
        setError("Could not load history. Is the server running?");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [studentId]);

  useEffect(() => {
    const loadListings = async () => {
      const uniqueIds = [
        ...new Set(
          history
            .map((tx) => tx.listingId)
            .filter((id) => id !== null && id !== undefined)
        ),
      ];
      if (uniqueIds.length === 0) return;

      try {
        const entries = await Promise.all(
          uniqueIds.map(async (id) => {
            try {
              const res = await fetch(
                `http://localhost:8080/api/listings/${id}`
              );
              if (!res.ok) throw new Error("Failed to fetch listing " + id);
              const listing = await res.json();
              return [id, listing];
            } catch (error) {
              console.error("Error loading listing for history:", id, error);
              return [id, null];
            }
          })
        );

        const map = {};
        entries.forEach(([id, listing]) => {
          map[id] = listing;
        });
        setListingsById(map);
      } catch (e) {
        console.error("Error loading listings for history:", e);
      }
    };

    if (history.length > 0) {
      loadListings();
    }
  }, [history]);

  if (loading) {
    return (
      <div className="mc-page-container">
        <p>Loading transaction history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mc-page-container">
        <p className="mc-error">{error}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="mc-page-container">
        <h1 className="mc-title">Transaction History</h1>
        <p className="mc-description">
          Your previous purchases and sales will appear here.
        </p>
        <p>No completed transactions yet.</p>
      </div>
    );
  }

  return (
    <div className="mc-page-container">
      <div className="mc-header-row">
        <div>
          <h1 className="mc-title">Transaction History</h1>
          <p className="mc-description">Your previous purchases and sales.</p>
        </div>
        <span className="mc-count-pill">
          {history.length} completed {history.length === 1 ? "deal" : "deals"}
        </span>
      </div>

      <div className="mc-history-list">
        {history.map((tx) => {
          const isBuyer = tx.buyerId === studentId;
          const isSeller = tx.sellerId === studentId;

          const listing = listingsById[tx.listingId];
          const imageUrls =
            listing && listing.images ? getImageUrls(listing.images) : [];
          const imageUrl = imageUrls.length > 0 ? imageUrls[0] : null;

          const handleOpenDetails = () => {
            if (!tx.listingId) return;

            // change /listing to your actual ProductDetails route
            navigate(`/listing/${tx.listingId}`, {
              state: {
                source: "history",
                transactionId: tx.id,
                role: isBuyer ? "buyer" : "seller",
                otherPartyId: isBuyer ? tx.sellerId : tx.buyerId,
              },
            });
          };

          const handleKeyDown = (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleOpenDetails();
            }
          };

          return (
            <div
              key={tx.id}
              className="mc-history-card mc-history-card--row"
              onClick={handleOpenDetails}
              onKeyDown={handleKeyDown}
              role="button"
              tabIndex={0}
            >
              <div className="mc-card-image-wrapper mc-card-image-wrapper--small">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={tx.listingName}
                    className="mc-card-image-tag"
                  />
                ) : (
                  <div className="mc-image-placeholder">
                    <span>No Image</span>
                  </div>
                )}
              </div>

              <div className="mc-card-body mc-card-body--row">
                <div className="mc-card-header-line">
                  <h3 className="mc-item-name">{tx.listingName}</h3>
                  <p className="mc-price">₱{Number(tx.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>

                <div className="mc-card-subheader-line">
                  <span
                    className={`mc-role-pill ${isBuyer ? "buyer" : "seller"
                      }`}
                  >
                    {isBuyer ? "Purchased" : "Sold"}
                  </span>
                  <span className="mc-date">
                    {new Date(tx.completedAt).toLocaleString()}
                  </span>
                </div>

                <div className="mc-meta-block mc-meta-block--row">
                  <p className="mc-meta-line">
                    <span className="mc-meta-label">Buyer:</span>{" "}
                    {tx.buyerId}
                    {isBuyer && " (you)"}
                  </p>
                  <p className="mc-meta-line">
                    <span className="mc-meta-label">Seller:</span>{" "}
                    {tx.sellerId}
                    {isSeller && " (you)"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
