// frontend/src/pages/Reports/ReportTransactionPage.js
import React, { useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import "./ReportTransaction.css";

export default function ReportTransactionPage() {
  const { transactionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const currentStudentId = localStorage.getItem("studentId") || "";

  const role = location.state?.role || "buyer";
  const otherPartyId = location.state?.otherPartyId || "Unknown user";
  const listingName = location.state?.listingName || "this item";
  const price = location.state?.price || "";
  const listingId = location.state?.listingId || null;
  const listingImage = location.state?.listingImage || null;

  const [concerns, setConcerns] = useState("");
  const [expectedOutcome, setExpectedOutcome] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const headingText =
    role === "seller"
      ? `Report your transaction with buyer ${otherPartyId}`
      : `Report your transaction with seller ${otherPartyId}`;

  const introText =
    role === "seller"
      ? `Tell us what happened when you sold "${listingName}" to ${otherPartyId}.`
      : `Tell us what happened when you bought "${listingName}" from ${otherPartyId}.`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!listingId) {
      setErrorMsg("Missing listing information. Please go back to history and try again.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:8080/api/transaction-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionId: Number(transactionId),
          listingId: listingId,
          reporterId: currentStudentId,
          reportedUserId: otherPartyId,
          role: role,
          concerns: concerns,
          expectedOutcome: expectedOutcome,
        }),
      });

      if (!res.ok) {
        console.error("Failed to submit report", res.status);
        setErrorMsg("Could not submit report. Please try again later.");
        setSubmitting(false);
        return;
      }

      setShowSuccess(true);
      setSubmitting(false);
    } catch (err) {
      console.error("Error submitting report:", err);
      setErrorMsg("Network error. Please check if the server is running.");
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowSuccess(false);
    navigate("/history");
  };

  return (
    <div className="rt-page">
      <Link to="/history" className="rt-back-link">
        ← Back to history
      </Link>

      <div className="rt-card">
        <div className="rt-header">
          <div className="rt-thumb-wrapper">
            {listingImage ? (
              <img
                src={listingImage}
                alt={listingName}
                className="rt-thumb-image"
              />
            ) : (
              <div className="rt-thumb-placeholder">No Image</div>
            )}
          </div>

          <div className="rt-header-text">
            <h1 className="rt-title">Report Transaction</h1>
            <p className="rt-subtitle">{headingText}</p>
          </div>
        </div>

        <div className="rt-summary">
          <p>
            <strong>Transaction ID:</strong> {transactionId}
          </p>
          <p>
            <strong>Item:</strong> {listingName}
          </p>
          {price && (
            <p>
              <strong>Price:</strong> ₱{Number(price).toFixed(2)}
            </p>
          )}
          <p className="rt-intro">{introText}</p>
        </div>

        {errorMsg && <p className="rt-error">{errorMsg}</p>}

        <form className="rt-form" onSubmit={handleSubmit}>
          <label className="rt-label">
            What are your concerns during this transaction?
            <textarea
              className="rt-textarea"
              rows={6}
              placeholder="Describe what happened, including dates, agreements, and any proof you have."
              value={concerns}
              onChange={(e) => setConcerns(e.target.value)}
              required
            />
          </label>

          <label className="rt-label">
            What outcome are you expecting?
            <textarea
              className="rt-textarea"
              rows={3}
              placeholder="Example: I want this user to be warned; I want the listing to be reviewed; etc."
              value={expectedOutcome}
              onChange={(e) => setExpectedOutcome(e.target.value)}
            />
          </label>

          <button type="submit" className="rt-submit-btn" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>

      {showSuccess && (
        <div className="rt-modal-overlay">
          <div className="rt-modal">
            <h2 className="rt-modal-title">Report submitted</h2>
            <p className="rt-modal-text">
              Thank you. Your transaction report has been sent to the MergeChants team for review.
            </p>
            <button className="rt-modal-btn" onClick={closeModal}>
              Back to History
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
