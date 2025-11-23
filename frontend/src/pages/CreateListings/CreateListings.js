import React, { useState, useEffect } from 'react'; 
import './CreateListings.css';
import { useNavigate, useParams } from 'react-router-dom';


export default function CreateListings() {
    const navigate = useNavigate();
    const { id } = useParams(); 
    const isEditing = Boolean(id); 
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        seller: localStorage.getItem('studentId') || 'TechStudent',
        name: '',
        subTitle: '',
        category: '',
        condition: '',
        price: '',
        originalPrice: '',
        campus: '',
        description: '',
        preferredLocation: '',
        availableFrom: '',
        availableUntil: '',
        meetingPreferences: {
            onCampus: false,
            publicPlace: false,
            deliveryAvailable: false
        },
        tags: [],
        images: []
    });
    const [message, setMessage] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState({
        keepCampusSafe: false,
        termsOfService: false,
        misleadingInfo: false
    });
    
    useEffect(() => {
        if (isEditing) {
            fetch(`http://localhost:8080/api/listings/${id}`)
                .then(res => res.json())
                .then(data => {
                    // Fill the form with backend data
                    setFormData({
                        seller: data.seller,
                        name: data.name,
                        subTitle: data.subTitle || '',
                        category: data.category,
                        condition: data.condition,
                        price: data.price,
                        originalPrice: data.originalPrice,
                        campus: data.campus,
                        description: data.description,
                        preferredLocation: data.preferredLocation,
                        availableFrom: data.availableFrom,
                        availableUntil: data.availableUntil,
                        meetingPreferences: data.meetingPreferences ? JSON.parse(data.meetingPreferences) : {
                            onCampus: false, publicPlace: false, deliveryAvailable: false
                        },
                        tags: data.tags ? data.tags.split(',') : [],
                        images: [] // Keeping images empty for now to avoid complexity
                    });
                })
                .catch(err => console.error("Error loading listing:", err));
        }
    }, [id, isEditing]);
   
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox' && name.startsWith('meeting_')) {
            const prefName = name.replace('meeting_', '');
            setFormData(prev => ({
                ...prev,
                meetingPreferences: {
                    ...prev.meetingPreferences,
                    [prefName]: checked
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };

    const handleTagClick = (tag) => {
        setFormData(prev => {
            const tags = prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag];
            return { ...prev, tags };
        });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + formData.images.length > 8) {
            alert('Maximum 8 images allowed');
            return;
        }
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const nextStep = () => {
        if (validateCurrentStep()) {
            setCurrentStep(prev => Math.min(prev + 1, 3));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const validateCurrentStep = () => {
        if (currentStep === 1) {
            if (!formData.name || !formData.category || !formData.condition || !formData.price) {
                alert('Please fill in all required fields');
                return false;
            }
        } else if (currentStep === 2) {
            if (!formData.description || !formData.preferredLocation) {
                alert('Please fill in description and preferred meeting location');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!agreedToTerms.keepCampusSafe || !agreedToTerms.termsOfService || !agreedToTerms.misleadingInfo) {
            alert('Please agree to all terms and conditions');
            return;
        }

        setMessage('Creating listing...');

        const listingData = {
            seller: formData.seller,
            name: formData.name,
            subTitle: formData.subTitle || "",
            category: formData.category,
            price: parseFloat(formData.price),
            originalPrice: parseFloat(formData.originalPrice) || parseFloat(formData.price),
            condition: formData.condition,
            campus: formData.campus || "",
            description: formData.description,
            preferredLocation: formData.preferredLocation,
            availableFrom: formData.availableFrom || "",
            availableUntil: formData.availableUntil || "",
            meetingPreferences: JSON.stringify(formData.meetingPreferences),
            tags: formData.tags.join(','),
            images: formData.images.map(img => img.name).join(',') || ""
        };


try {
            // DYNAMIC URL AND METHOD
            const url = isEditing 
                ? `http://localhost:8080/api/listings/${id}` 
                : 'http://localhost:8080/api/listings';
                
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(listingData),
            });

            if (response.ok) {
                const result = await response.json();
                const action = isEditing ? "Updated" : "Created";
                setMessage(`Listing "${result.name}" ${action} successfully!`);
                
                setTimeout(() => {
                    // Redirect to My Listings so they can see the change
                    window.location.href = '/mylistings'; 
                }, 2000);
            } else {
                setMessage('Error saving listing. Status: ' + response.status);
            }
        } catch (error) {
            setMessage('Network error: ' + error.message);
        }
        // =======================================================
    };

    const categories = ['Electronics', 'Textbooks', 'Clothing', 'Furniture', 'Sports & Fitness', 'Other'];
    const conditions = ['New', 'Like New', 'Excellent', 'Very Good', 'Good', 'Fair'];
    const productTags = ['Like New', 'Barely Used', 'Original Box', 'No Scratches', 'Fast Sale', 'Negotiable'];

    return (
        <div className="create-listing-page">
            <header className="listing-header">
                <button className="back-button" onClick={() => window.history.back()}>
                    ← 
                </button>
                <div className="header-content">
                    <h1>CREATE LISTING</h1>
                    <p>Share your items with the campus community</p>
                </div>
            </header>

            <div className="step-indicator">
                <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                    <div className="step-circle">1</div>
                    <span>Basic Info</span>
                </div>
                <div className="step-line"></div>
                <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                    <div className="step-circle">2</div>
                    <span>Details & Images</span>
                </div>
                <div className="step-line"></div>
                <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                    <div className="step-circle">3</div>
                    <span>Review & Publish</span>
                </div>
            </div>

            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    {/* Step 1: Basic Information */}
                    {currentStep === 1 && (
                        <div className="form-step">
                            <h2>Basic Information</h2>
                            
                            <div className="form-group">
                                <label>Item Title *</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange}
                                    placeholder="Make a descriptive title for your item"
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label>Category *</label>
                                <div className="category-grid">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            type="button"
                                            className={`category-btn ${formData.category === cat ? 'selected' : ''}`}
                                            onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Condition *</label>
                                <div className="condition-grid">
                                    {conditions.map(cond => (
                                        <button
                                            key={cond}
                                            type="button"
                                            className={`condition-btn ${formData.condition === cond ? 'selected' : ''}`}
                                            onClick={() => setFormData(prev => ({ ...prev, condition: cond }))}
                                        >
                                            {cond}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Price *</label>
                                <input 
                                    type="number" 
                                    name="price" 
                                    value={formData.price} 
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    required 
                                />
                            </div>

                            <button type="button" className="next-btn" onClick={nextStep}>
                                Next Step
                            </button>
                        </div>
                    )}

                    {/* Step 2: Details & Images */}
                    {currentStep === 2 && (
                        <div className="form-step">
                            <h2>Details & Images</h2>
                            
                            <div className="two-column-layout">
                                <div className="left-column">
                                    <div className="form-group">
                                        <label>Description *</label>
                                        <textarea 
                                            name="description" 
                                            value={formData.description} 
                                            onChange={handleChange}
                                            rows="6"
                                            placeholder="Describe your item in detail..."
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Preferred Meeting Location *</label>
                                        <select 
                                            name="preferredLocation" 
                                            value={formData.preferredLocation} 
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select a location</option>
                                            <option value="Campus North">Campus North</option>
                                            <option value="Campus South">Campus South</option>
                                            <option value="Library">Library</option>
                                            <option value="Student Center">Student Center</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Availability</label>
                                        <div className="availability-row">
                                            <input 
                                                type="text" 
                                                name="availableFrom" 
                                                value={formData.availableFrom} 
                                                onChange={handleChange}
                                                placeholder="Available From"
                                            />
                                            <input 
                                                type="text" 
                                                name="availableUntil" 
                                                value={formData.availableUntil} 
                                                onChange={handleChange}
                                                placeholder="Available Until"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Meeting Preferences</label>
                                        <div className="checkbox-group">
                                            <label className="checkbox-label">
                                                <input 
                                                    type="checkbox" 
                                                    name="meeting_onCampus"
                                                    checked={formData.meetingPreferences.onCampus}
                                                    onChange={handleChange}
                                                />
                                                On Campus
                                            </label>
                                            <label className="checkbox-label">
                                                <input 
                                                    type="checkbox" 
                                                    name="meeting_publicPlace"
                                                    checked={formData.meetingPreferences.publicPlace}
                                                    onChange={handleChange}
                                                />
                                                Public Place
                                            </label>
                                            <label className="checkbox-label">
                                                <input 
                                                    type="checkbox" 
                                                    name="meeting_deliveryAvailable"
                                                    checked={formData.meetingPreferences.deliveryAvailable}
                                                    onChange={handleChange}
                                                />
                                                Delivery Available
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="right-column">
                                    <div className="form-group">
                                        <label>Images *</label>
                                        <div className="image-upload-area">
                                            <div className="upload-placeholder">
                                                <div className="upload-icon">☁️</div>
                                                <p>Drag & drop images here</p>
                                                <button 
                                                    type="button" 
                                                    className="browse-btn"
                                                    onClick={() => document.getElementById('file-input').click()}
                                                >
                                                    Browse Files
                                                </button>
                                                <p className="upload-note">Maximum 8 images, 5MB each</p>
                                            </div>
                                            <input 
                                                id="file-input"
                                                type="file" 
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageUpload}
                                                style={{ display: 'none' }}
                                            />
                                            {formData.images.length > 0 && (
                                                <div className="image-preview-grid">
                                                    {formData.images.map((img, idx) => (
                                                        <div key={idx} className="image-preview">
                                                            <img src={URL.createObjectURL(img)} alt={`Preview ${idx}`} />
                                                            <button 
                                                                type="button" 
                                                                className="remove-img"
                                                                onClick={() => removeImage(idx)}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Tags</label>
                                        <button type="button" className="add-tag-btn">+ Add Tag</button>
                                        <div className="tags-container">
                                            <span className="tag-label">Popular tags:</span>
                                            {productTags.map(tag => (
                                                <button
                                                    key={tag}
                                                    type="button"
                                                    className={`tag-chip ${formData.tags.includes(tag) ? 'selected' : ''}`}
                                                    onClick={() => handleTagClick(tag)}
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="button-row">
                                <button type="button" className="back-btn-step" onClick={prevStep}>
                                    Back
                                </button>
                                <button type="button" className="next-btn" onClick={nextStep}>
                                    Next Step
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review & Publish */}
                    {currentStep === 3 && (
                        <div className="form-step">
                            <h2>Review & Publish</h2>
                            
                            <div className="review-layout">
                                <div className="listing-preview">
                                    <h3>Listing Preview</h3>
                                    <div className="preview-card">
                                        <div className="preview-image">
                                            {formData.images.length > 0 ? (
                                                <img src={URL.createObjectURL(formData.images[0])} alt="Preview" />
                                            ) : (
                                                <div className="no-image">Item Image</div>
                                            )}
                                        </div>
                                        <div className="preview-details">
                                            <h4>{formData.name || 'Item Name'}</h4>
                                            <p className="preview-category">{formData.category} • {formData.condition}</p>
                                            <p className="preview-description">{formData.description || 'Description...'}</p>
                                            <div className="preview-tags">
                                                {formData.tags.map(tag => (
                                                    <span key={tag} className="preview-tag">{tag}</span>
                                                ))}
                                            </div>
                                            <p className="preview-availability">
                                                {formData.availableFrom && `Available until ${formData.availableUntil || 'TBD'}`}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="listing-details-section">
                                        <h4>Listing Details</h4>
                                        <div className="detail-row">
                                            <span>Category:</span>
                                            <span>{formData.category}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span>Condition:</span>
                                            <span>{formData.condition}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span>Price:</span>
                                            <span>₱{parseFloat(formData.price || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span>Meeting Location:</span>
                                            <span>{formData.preferredLocation}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span>Available From:</span>
                                            <span>{formData.availableFrom || 'Today'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span>Available Until:</span>
                                            <span>{formData.availableUntil || 'Dec 31, 2024'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="terms-section">
                                    <div className="safety-guidelines">
                                        <h4>Safety Guidelines</h4>
                                        <ul>
                                            <li>Always meet in public places on campus</li>
                                            <li>Verify the item condition before payment</li>
                                            <li>Use secure payment methods when possible</li>
                                            <li>Report any suspicious activity to campus security</li>
                                        </ul>
                                    </div>

                                    <div className="terms-conditions">
                                        <h4>Terms & Conditions</h4>
                                        <div className="terms-checkboxes">
                                            <label className="checkbox-label">
                                                <input 
                                                    type="checkbox"
                                                    checked={agreedToTerms.keepCampusSafe}
                                                    onChange={(e) => setAgreedToTerms(prev => ({
                                                        ...prev,
                                                        keepCampusSafe: e.target.checked
                                                    }))}
                                                />
                                                I confirm that the item complies to be sell and I have the right to sell it
                                            </label>
                                            <label className="checkbox-label">
                                                <input 
                                                    type="checkbox"
                                                    checked={agreedToTerms.termsOfService}
                                                    onChange={(e) => setAgreedToTerms(prev => ({
                                                        ...prev,
                                                        termsOfService: e.target.checked
                                                    }))}
                                                />
                                                I agree to MergeChants Terms of Service and Community Guidelines
                                            </label>
                                            <label className="checkbox-label">
                                                <input 
                                                    type="checkbox"
                                                    checked={agreedToTerms.misleadingInfo}
                                                    onChange={(e) => setAgreedToTerms(prev => ({
                                                        ...prev,
                                                        misleadingInfo: e.target.checked
                                                    }))}
                                                />
                                                I understand that false or misleading information may result in account suspension
                                            </label>
                                        </div>
                                    </div>

                                    <div className="important-notice">
                                        <h4>Important Notice</h4>
                                        <p>Your listing will be reviewed by our moderation team before going live. This usually takes 2-4 hours during business hours.</p>
                                        <p>You will receive a notification once your listing is approved and published.</p>
                                    </div>
                                </div>
                            </div>

                            {message && (
                                <div className={`message ${message.includes('Error') || message.includes('Network') ? 'error' : 'success'}`}>
                                    {message}
                                </div>
                            )}

                            <div className="button-row">
                                <button type="button" className="back-btn-step" onClick={prevStep}>
                                    Back
                                </button>
                                <button type="submit" className="publish-btn">
                                    {isEditing ? 'Update Listing' : 'Publish Listing'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}