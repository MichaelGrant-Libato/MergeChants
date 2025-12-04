import React, { useEffect, useState } from "react";
import "./History.css";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const rawStudentId = localStorage.getItem("studentId");
  const studentId = rawStudentId ? rawStudentId.trim() : "";

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
          <p className="mc-description">
            Your previous purchases and sales.
          </p>
        </div>
        <span className="mc-count-pill">
          {history.length} completed {history.length === 1 ? "deal" : "deals"}
        </span>
      </div>

      <div className="mc-history-grid">
        {history.map((tx) => {
          const isBuyer = tx.buyerId === studentId;

          return (
            <div key={tx.id} className="mc-history-card">
              <div className="mc-card-top-row">
                <span
                  className={`mc-role-pill ${
                    isBuyer ? "buyer" : "seller"
                  }`}
                >
                  {isBuyer ? "Purchased" : "Sold"}
                </span>
                <span className="mc-date">
                  {new Date(tx.completedAt).toLocaleString()}
                </span>
              </div>

              <h3 className="mc-item-name">{tx.listingName}</h3>

              <p className="mc-price">
                ₱{Number(tx.price).toFixed(2)}
              </p>

              <div className="mc-meta-block">
                <p className="mc-meta-line">
                  <span className="mc-meta-label">Buyer:</span>{" "}
                  {tx.buyerId}
                </p>
                <p className="mc-meta-line">
                  <span className="mc-meta-label">Seller:</span>{" "}
                  {tx.sellerId}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
