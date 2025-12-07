import React, { useState } from 'react';
import './Escrow.css';

const Escrow = ({ listingId, sellerId, buyerId, onConfirm, onCancel }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleConfirm = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8080/api/escrow/bind', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    listingId: listingId,
                    sellerId: sellerId,
                    buyerId: buyerId
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create escrow agreement');
            }

            // If successful, trigger the parent callback
            if (onConfirm) {
                onConfirm();
            }

        } catch (err) {
            console.error('Escrow binding error:', err);
            setError('Could not establish secure connection. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="escrow-modal-overlay">
            <div className="escrow-modal-content">
                <div className="escrow-modal-header">
                    <div className="escrow-icon-wrapper">
                        <span className="escrow-icon">!</span>
                    </div>
                    <h2>Read Before You Chat: Platform Safety Warning</h2>
                </div>

                <div className="escrow-modal-body">
                    <p>
                        <strong>Mandatory Escrow System:</strong> For your protection, user to user conversaation are logged for security purposes. (Escrow).
                    </p>
                    <p className="warning-text">
                        <strong>NEVER share personal banking details, GCash numbers, or other external payment links.</strong>
                    </p>
                    <p>
                        <strong>Legal Consequences:</strong> Any attempt to circumvent the system, phishing, or other fraudulent activities will be logged, investigated, and may result in permanent account banning and legal action.
                    </p>
                    {error && <p className="error-message">{error}</p>}
                </div>

                <div className="escrow-modal-footer">
                    <button
                        className="confirm-escrow-btn"
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Establishing Secure Connection...' : 'I Understand and Agree'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Escrow;
