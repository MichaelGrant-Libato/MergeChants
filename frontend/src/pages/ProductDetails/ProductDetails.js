import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetails.css';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Get current user to check if they own the item
    const currentStudentId = localStorage.getItem('studentId');

    useEffect(() => {
        fetch(`http://localhost:8080/api/listings/${id}`)
            .then(res => res.json())
            .then(data => {
                setListing(data);
                setLoading(false);
            })
            .catch(err => console.error("Error loading listing:", err));
    }, [id]);

    if (loading) return <div className="details-container">Loading...</div>;
    if (!listing) return <div className="details-container">Item not found.</div>;

    const isOwner = currentStudentId === listing.seller;

            const handleContact = () => {
            // Redirect to messages page with the seller selected
            navigate(`/messages?user=${listing.seller}`);
            };



            
    return (
        <div className="details-container">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            
            <div className="details-grid">
                {/* Left Column: Image */}
                <div className="image-section">
                    <div className="main-image">
                         {/* Placeholder for now until we handle real image URLs */}
                        {listing.images ? (
                            <div className="img-placeholder-large">
                                <span>{listing.images.split(',')[0]}</span>
                            </div>
                        ) : (
                            <div className="no-image-large">No Image Available</div>
                        )}
                    </div>
                </div>

                {/* Right Column: Info */}
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
                            <button className="edit-btn-large" onClick={() => navigate(`/edit/${listing.id}`)}>
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
                            <li><strong>Condition:</strong> {listing.condition}</li>
                            <li><strong>Location:</strong> {listing.preferredLocation}</li>
                            <li><strong>Campus:</strong> {listing.campus || "Main Campus"}</li>
                            <li><strong>Posted:</strong> {new Date(listing.createdAt || Date.now()).toLocaleDateString()}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}