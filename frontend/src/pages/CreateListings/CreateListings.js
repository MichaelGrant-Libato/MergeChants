// frontend/src/pages/CreateListings/CreateListings.js

import React, { useState, useEffect } from 'react';
import './CreateListings.css';
import { useNavigate, useParams } from 'react-router-dom';

// 🔹 Helper: turn whatever is stored into a real URL
const buildImageUrl = (value) => {
  if (!value) return null;
  const trimmed = value.trim();

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  if (trimmed.startsWith('/uploads/')) {
    return `http://localhost:8080${trimmed}`;
  }
  // plain file name
  return `http://localhost:8080/uploads/${trimmed}`;
};

const categories = [
  'Electronics',
  'Textbooks',
  'Clothing',
  'Furniture',
  'Sports & Fitness',
  'Other',
];

const conditions = [
  'New',
  'Like New',
  'Excellent',
  'Very Good',
  'Good',
  'Fair',
];

const productTags = [
  'Like New',
  'Barely Used',
  'Original Box',
  'No Scratches',
  'Fast Sale',
  'Negotiable',
];

const meetingLocations = [
  'GLE Building',
  'SAL Building',
  'College Library',
  'NGE Building',
  'Senior High Library',
  'Espacio',
  'Other',
];

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default function CreateListings() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    seller: localStorage.getItem('studentId') || '',
    name: '',
    subTitle: '',
    category: '',
    condition: '',
    price: '',
    originalPrice: '',
    campus: '',
    description: '',
    preferredLocation: '',
    customLocation: '',
    // Availability
    availableDays: [],
    availableTimeFrom: '',
    availableTimeUntil: '',
    // legacy fields (still sent to backend)
    availableFrom: '',
    availableUntil: '',
    meetingPreferences: {
      onCampus: false,
      publicPlace: false,
      deliveryAvailable: false,
    },
    images: [],              // File[] (new uploads this session)
    uploadedImageNames: [],  // string[] already saved in DB
    tags: [],
  });

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState({
    keepCampusSafe: false,
    termsOfService: false,
    misleadingInfo: false,
  });

  // ====== Load existing listing when editing ======
  useEffect(() => {
    if (!isEditing) return;

    fetch(`http://localhost:8080/api/listings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const knownLocation = meetingLocations.includes(data.preferredLocation);
        const preferredLocation = knownLocation
          ? data.preferredLocation
          : data.preferredLocation
            ? 'Other'
            : '';

        const customLocation =
          !knownLocation && data.preferredLocation ? data.preferredLocation : '';

        const parsedDays = data.availableFrom
          ? data.availableFrom.split(',').map((s) => s.trim()).filter(Boolean)
          : [];
        let timeFrom = '';
        let timeUntil = '';
        if (data.availableUntil && data.availableUntil.includes('-')) {
          const [from, until] = data.availableUntil.split('-');
          timeFrom = from ? from.trim() : '';
          timeUntil = until ? until.trim() : '';
        }

        setFormData((prev) => ({
          ...prev,
          seller: data.seller,
          name: data.name,
          subTitle: data.subTitle || '',
          category: data.category || '',
          condition: data.condition || '',
          price: data.price ?? '',
          originalPrice: data.originalPrice ?? '',
          campus: data.campus || '',
          description: data.description || '',
          preferredLocation,
          customLocation,
          availableDays: parsedDays,
          availableTimeFrom: timeFrom,
          availableTimeUntil: timeUntil,
          availableFrom: data.availableFrom || '',
          availableUntil: data.availableUntil || '',
          meetingPreferences: data.meetingPreferences
            ? JSON.parse(data.meetingPreferences)
            : {
              onCampus: false,
              publicPlace: false,
              deliveryAvailable: false,
            },
          uploadedImageNames: data.images
            ? data.images
              .split(',')
              .map((s) => s.trim())
              .filter((t) => t)
            : [],
          images: [],
          tags: data.tags ? data.tags.split(',').filter((t) => t) : [],
        }));
      })
      .catch((err) => console.error('Error loading listing:', err));
  }, [id, isEditing]);

  // ====== Handlers ======
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Meeting preferences checkboxes
    if (type === 'checkbox' && name.startsWith('meeting_')) {
      const prefName = name.replace('meeting_', '');
      setFormData((prev) => ({
        ...prev,
        meetingPreferences: {
          ...prev.meetingPreferences,
          [prefName]: checked,
        },
      }));
      // clear meeting preference error
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.meetingPreferences;
        return updated;
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field when user edits
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[name];

      if (name === 'preferredLocation') {
        delete updated.preferredLocation;
        delete updated.customLocation;
      }

      // if editing times, clear time error
      if (name === 'availableTimeFrom' || name === 'availableTimeUntil') {
        delete updated.availableTime;
      }

      return updated;
    });
  };

  const toggleDay = (day) => {
    setFormData((prev) => {
      const exists = prev.availableDays.includes(day);
      return {
        ...prev,
        availableDays: exists
          ? prev.availableDays.filter((d) => d !== day)
          : [...prev.availableDays, day],
      };
    });
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated.availableDays;
      return updated;
    });
  };

  const handleTagClick = (tag) => {
    setFormData((prev) => {
      const exists = prev.tags.includes(tag);
      return {
        ...prev,
        tags: exists ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
      };
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (
      files.length +
      formData.images.length +
      formData.uploadedImageNames.length >
      8
    ) {
      alert('Maximum 8 images allowed');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    setErrors((prev) => {
      const updated = { ...prev };
      delete updated.images;
      return updated;
    });
  };

  const removeNewImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const removeExistingImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      uploadedImageNames: prev.uploadedImageNames.filter((_, i) => i !== index),
    }));
  };

  const handlePriceChange = (e) => {
    // 1. Remove anything that isn't a digit or decimal point
    let rawValue = e.target.value.replace(/[^0-9.]/g, '');

    // 2. Prevent multiple decimal points
    const parts = rawValue.split('.');
    if (parts.length > 2) {
      // If adding a second dot, ignore it
      rawValue = parts[0] + '.' + parts.slice(1).join('');
    }

    // 3. Format with commas
    // Split integer and decimal parts
    const [integer, decimal] = rawValue.split('.');

    // Add commas to integer part
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Recombine
    let formattedValue = formattedInteger;
    if (rawValue.includes('.')) {
      formattedValue += '.' + (decimal || '');
    }

    setFormData((prev) => ({
      ...prev,
      price: formattedValue,
    }));

    // Clear price error if valid
    if (formattedValue) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.price;
        return updated;
      });
    }
  };

  const validateCurrentStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Item title is required.';
      }
      if (!formData.category) {
        newErrors.category = 'Please select a category.';
      }
      if (!formData.condition) {
        newErrors.condition = 'Please select a condition.';
      }
      if (!formData.price) {
        newErrors.price = 'Price is required.';
      } else {
        const rawPrice = parseFloat(formData.price.replace(/,/g, ''));
        if (isNaN(rawPrice) || rawPrice < 0) {
          newErrors.price = 'Price must be 0 or higher.';
        }
      }
    } else if (currentStep === 2) {
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required.';
      }
      if (!formData.preferredLocation) {
        newErrors.preferredLocation = 'Please select a meeting location.';
      } else if (
        formData.preferredLocation === 'Other' &&
        !formData.customLocation.trim()
      ) {
        newErrors.customLocation = 'Please enter your meeting location.';
      }

      const totalImages =
        formData.images.length + formData.uploadedImageNames.length;
      if (totalImages === 0) {
        newErrors.images = 'Please upload at least one image.';
      }

      // ✅ At least one available day
      if (formData.availableDays.length === 0) {
        newErrors.availableDays = 'Please select at least one available day.';
      }

      // ✅ Time range required (both from and until)
      if (!formData.availableTimeFrom || !formData.availableTimeUntil) {
        newErrors.availableTime = 'Please set a start and end time range.';
      }

      // ✅ At least one meeting preference
      const anyMeetingPref =
        formData.meetingPreferences.onCampus ||
        formData.meetingPreferences.publicPlace ||
        formData.meetingPreferences.deliveryAvailable;

      if (!anyMeetingPref) {
        newErrors.meetingPreferences =
          'Select at least one meeting preference.';
      }
    }

    setErrors((prev) => {
      const updated = { ...prev };

      if (currentStep === 1) {
        ['name', 'category', 'condition', 'price'].forEach(
          (field) => delete updated[field]
        );
      } else if (currentStep === 2) {
        [
          'description',
          'preferredLocation',
          'customLocation',
          'images',
          'availableDays',
          'availableTime',
          'meetingPreferences',
        ].forEach((field) => delete updated[field]);
      }

      return { ...updated, ...newErrors };
    });

    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate terms (step 3)
    if (
      !agreedToTerms.keepCampusSafe ||
      !agreedToTerms.termsOfService ||
      !agreedToTerms.misleadingInfo
    ) {
      setErrors((prev) => ({
        ...prev,
        terms: 'Please agree to all terms and conditions.',
      }));
      return;
    }

    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      alert('You must be logged in to publish a listing.');
      return;
    }

    setMessage(isEditing ? 'Updating listing...' : 'Creating listing...');

    try {
      let uploadedNames = [];
      if (formData.images.length > 0) {
        const fd = new FormData();
        formData.images.forEach((file) => fd.append('files', file));

        const uploadRes = await fetch(
          'http://localhost:8080/api/files/upload',
          {
            method: 'POST',
            body: fd,
          }
        );

        if (!uploadRes.ok) {
          throw new Error('Image upload failed: ' + uploadRes.status);
        }

        uploadedNames = await uploadRes.json();
      }

      const allImages = [...formData.uploadedImageNames, ...uploadedNames];

      const resolvedLocation =
        formData.preferredLocation === 'Other'
          ? formData.customLocation.trim()
          : formData.preferredLocation;

      const availabilityDaysString = formData.availableDays.join(', ');
      const availabilityTimeString =
        formData.availableTimeFrom && formData.availableTimeUntil
          ? `${formData.availableTimeFrom} - ${formData.availableTimeUntil}`
          : '';

      const listingData = {
        seller: studentId,
        name: formData.name,
        subTitle: formData.subTitle || '',
        category: formData.category,
        price: parseFloat(formData.price.toString().replace(/,/g, '')),
        originalPrice:
          formData.originalPrice !== ''
            ? parseFloat(formData.originalPrice.toString().replace(/,/g, ''))
            : parseFloat(formData.price.toString().replace(/,/g, '')),
        condition: formData.condition,
        campus: formData.campus || '',
        description: formData.description,
        preferredLocation: resolvedLocation,
        availableFrom: availabilityDaysString,
        availableUntil: availabilityTimeString,
        meetingPreferences: JSON.stringify(formData.meetingPreferences),
        tags: formData.tags.join(','),
        images: allImages.join(','),
      };

      const url = isEditing
        ? `http://localhost:8080/api/listings/${id}`
        : 'http://localhost:8080/api/listings';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listingData),
      });

      if (response.ok) {
        const result = await response.json();
        const action = isEditing ? 'updated' : 'created';
        setMessage(`Listing "${result.name}" ${action} successfully!`);

        setTimeout(() => {
          navigate('/myListings');
        }, 1200);
      } else {
        setMessage('Error saving listing. Status: ' + response.status);
      }
    } catch (error) {
      console.error(error);
      setMessage('Network or upload error: ' + error.message);
    }
  };

  // ====== JSX ======
  return (
    <div className="create-listing-page">
      <header className="listing-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <div className="header-content">
          <h1>{isEditing ? 'EDIT LISTING' : 'CREATE LISTING'}</h1>
          <p>Share your items with the campus community</p>
        </div>
      </header>

      {/* Step indicator */}
      <div className="step-indicator">
        <div
          className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''
            }`}
        >
          <div className="step-circle">1</div>
          <span>Basic Info</span>
        </div>
        <div className="step-line"></div>
        <div
          className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''
            }`}
        >
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
          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="form-step basic-info-step">
              <h2>Basic Information</h2>

              <div className="form-group">
                <label>Item Title *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Make a descriptive title for your item"
                  className={errors.name ? 'error' : ''}
                  required
                />
                {errors.name && (
                  <p className="error-text">{errors.name}</p>
                )}
              </div>

              <div className="form-group">
                <label>Category *</label>
                <div className="category-grid">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`category-btn ${formData.category === cat ? 'selected' : ''
                        } ${errors.category ? 'error' : ''}`}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, category: cat }));
                        setErrors((prev) => {
                          const updated = { ...prev };
                          delete updated.category;
                          return updated;
                        });
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                {errors.category && (
                  <p className="error-text">{errors.category}</p>
                )}
              </div>

              <div className="form-group">
                <label>Condition *</label>
                <div className="condition-grid">
                  {conditions.map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      className={`condition-btn ${formData.condition === cond ? 'selected' : ''
                        } ${errors.condition ? 'error' : ''}`}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, condition: cond }));
                        setErrors((prev) => {
                          const updated = { ...prev };
                          delete updated.condition;
                          return updated;
                        });
                      }}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
                {errors.condition && (
                  <p className="error-text">{errors.condition}</p>
                )}
              </div>

              <div className="form-group">
                <label>Price *</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handlePriceChange}
                  placeholder="0.00"
                  className={errors.price ? 'error' : ''}
                  required
                />
                {errors.price && (
                  <p className="error-text">{errors.price}</p>
                )}
              </div>

              <button type="button" className="next-btn" onClick={nextStep}>
                Next Step
              </button>
            </div>
          )}

          {/* STEP 2 */}
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
                      className={errors.description ? 'error' : ''}
                      required
                    />
                    {errors.description && (
                      <p className="error-text">{errors.description}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Preferred Meeting Location *</label>
                    <select
                      name="preferredLocation"
                      value={formData.preferredLocation}
                      onChange={handleChange}
                      className={errors.preferredLocation ? 'error' : ''}
                      required
                    >
                      <option value="">Select a location</option>
                      {meetingLocations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                    {errors.preferredLocation && (
                      <p className="error-text">
                        {errors.preferredLocation}
                      </p>
                    )}

                    {formData.preferredLocation === 'Other' && (
                      <div className="form-group mt-2">
                        <input
                          type="text"
                          name="customLocation"
                          value={formData.customLocation}
                          onChange={handleChange}
                          placeholder="Enter meeting location"
                          className={errors.customLocation ? 'error' : ''}
                        />
                        {errors.customLocation && (
                          <p className="error-text">
                            {errors.customLocation}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Availability *</label>

                    <div className="availability-days">
                      <p className="availability-label">Days available:</p>
                      <div className="availability-days-grid">
                        {daysOfWeek.map((day) => (
                          <label key={day} className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={formData.availableDays.includes(day)}
                              onChange={() => toggleDay(day)}
                            />
                            {day}
                          </label>
                        ))}
                      </div>
                      {errors.availableDays && (
                        <p className="error-text">
                          {errors.availableDays}
                        </p>
                      )}
                    </div>

                    <div className="availability-times">
                      <p className="availability-label">Time range:</p>
                      <div className="availability-row">
                        <input
                          type="time"
                          name="availableTimeFrom"
                          value={formData.availableTimeFrom}
                          onChange={handleChange}
                        />
                        <span className="time-separator">to</span>
                        <input
                          type="time"
                          name="availableTimeUntil"
                          value={formData.availableTimeUntil}
                          onChange={handleChange}
                        />
                      </div>
                      {errors.availableTime && (
                        <p className="error-text">{errors.availableTime}</p>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Meeting Preferences *</label>
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
                          checked={
                            formData.meetingPreferences.deliveryAvailable
                          }
                          onChange={handleChange}
                        />
                        Delivery Available
                      </label>
                    </div>
                    {errors.meetingPreferences && (
                      <p className="error-text">
                        {errors.meetingPreferences}
                      </p>
                    )}
                  </div>
                </div>

                <div className="right-column">
                  <div className="form-group">
                    <label>Images *</label>
                    <div className={`image-upload-area ${errors.images ? 'error' : ''}`}>
                      <div className="upload-placeholder">
                        <div className="upload-icon">☁️</div>
                        <p>Drag & drop images here</p>
                        <button
                          type="button"
                          className="browse-btn"
                          onClick={() =>
                            document.getElementById('file-input').click()
                          }
                        >
                          Browse Files
                        </button>
                        <p className="upload-note">
                          Maximum 8 images, 5MB each
                        </p>
                      </div>
                      <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />

                      {formData.uploadedImageNames.length > 0 && (
                        <div className="image-preview-grid">
                          {formData.uploadedImageNames.map((name, idx) => {
                            const url = buildImageUrl(name);
                            return (
                              <div key={`ex-${idx}`} className="image-preview">
                                {url && (
                                  <img src={url} alt={`Existing ${idx}`} />
                                )}
                                <button
                                  type="button"
                                  className="remove-img"
                                  onClick={() => removeExistingImage(idx)}
                                >
                                  ×
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {formData.images.length > 0 && (
                        <div className="image-preview-grid">
                          {formData.images.map((img, idx) => (
                            <div key={`new-${idx}`} className="image-preview">
                              <img
                                src={URL.createObjectURL(img)}
                                alt={`Preview ${idx}`}
                              />
                              <button
                                type="button"
                                className="remove-img"
                                onClick={() => removeNewImage(idx)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.images && (
                      <p className="error-text">{errors.images}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Tags</label>
                    <div className="tags-container">
                      <span className="tag-label">Popular tags:</span>
                      {productTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          className={`tag-chip ${formData.tags.includes(tag) ? 'selected' : ''
                            }`}
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
                <button
                  type="button"
                  className="back-btn-step"
                  onClick={prevStep}
                >
                  Back
                </button>
                <button type="button" className="next-btn" onClick={nextStep}>
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="form-step">
              <h2>Review & Publish</h2>

              <div className="review-layout">
                <div className="listing-preview">
                  <h3>Listing Preview</h3>
                  <div className="preview-card">
                    <div className="preview-image">
                      {formData.uploadedImageNames.length > 0 ? (
                        (() => {
                          const url = buildImageUrl(
                            formData.uploadedImageNames[0]
                          );
                          return url ? (
                            <img src={url} alt="Preview" />
                          ) : (
                            <div className="no-image">Item Image</div>
                          );
                        })()
                      ) : formData.images.length > 0 ? (
                        <img
                          src={URL.createObjectURL(formData.images[0])}
                          alt="Preview"
                        />
                      ) : (
                        <div className="no-image">Item Image</div>
                      )}
                    </div>
                    <div className="preview-details">
                      <h4>{formData.name || 'Item Name'}</h4>
                      <p className="preview-category">
                        {formData.category || 'Category'} •{' '}
                        {formData.condition || 'Condition'}
                      </p>
                      <p className="preview-description">
                        {formData.description || 'Description...'}
                      </p>
                      <div className="preview-tags">
                        {formData.tags.map((tag) => (
                          <span key={tag} className="preview-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="preview-availability">
                        {formData.availableDays.length > 0 && (
                          <>
                            Available:{' '}
                            {formData.availableDays.join(', ')}{' '}
                            {formData.availableTimeFrom &&
                              formData.availableTimeUntil &&
                              `(${formData.availableTimeFrom}–${formData.availableTimeUntil})`}
                          </>
                        )}
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
                      <span>
                        ₱{parseFloat(formData.price.toString().replace(/,/g, '') || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span>Meeting Location:</span>
                      <span>
                        {formData.preferredLocation === 'Other'
                          ? formData.customLocation
                          : formData.preferredLocation}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span>Availability (Days):</span>
                      <span>
                        {formData.availableDays.length > 0
                          ? formData.availableDays.join(', ')
                          : 'Not specified'}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span>Availability (Time):</span>
                      <span>
                        {formData.availableTimeFrom &&
                          formData.availableTimeUntil
                          ? `${formData.availableTimeFrom} - ${formData.availableTimeUntil}`
                          : 'Not specified'}
                      </span>
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

                  <div className={`terms-conditions ${errors.terms ? 'error' : ''}`}>
                    <h4>Terms & Conditions</h4>
                    <div className="terms-checkboxes">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={agreedToTerms.keepCampusSafe}
                          onChange={(e) => {
                            setAgreedToTerms((prev) => ({
                              ...prev,
                              keepCampusSafe: e.target.checked,
                            }));
                            setErrors((prev) => {
                              const updated = { ...prev };
                              delete updated.terms;
                              return updated;
                            });
                          }}
                        />
                        I confirm that the item complies to be sold and I have
                        the right to sell it
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={agreedToTerms.termsOfService}
                          onChange={(e) => {
                            setAgreedToTerms((prev) => ({
                              ...prev,
                              termsOfService: e.target.checked,
                            }));
                            setErrors((prev) => {
                              const updated = { ...prev };
                              delete updated.terms;
                              return updated;
                            });
                          }}
                        />
                        I agree to MergeChants Terms of Service and Community
                        Guidelines
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={agreedToTerms.misleadingInfo}
                          onChange={(e) => {
                            setAgreedToTerms((prev) => ({
                              ...prev,
                              misleadingInfo: e.target.checked,
                            }));
                            setErrors((prev) => {
                              const updated = { ...prev };
                              delete updated.terms;
                              return updated;
                            });
                          }}
                        />
                        I understand that false or misleading information may
                        result in account suspension
                      </label>
                    </div>
                    {errors.terms && (
                      <p className="error-text">{errors.terms}</p>
                    )}
                  </div>

                  <div className="important-notice">
                    <h4>Important Notice</h4>
                    <p>
                      Your listing will be reviewed by our moderation team
                      before going live. This usually takes 2–4 hours during
                      business hours.
                    </p>
                    <p>
                      You will receive a notification once your listing is
                      approved and published.
                    </p>
                  </div>
                </div>
              </div>

              {message && (
                <div
                  className={`message ${message.includes('Error') ||
                    message.includes('Network') ||
                    message.includes('failed')
                    ? 'error'
                    : 'success'
                    }`}
                >
                  {message}
                </div>
              )}

              <div className="button-row">
                <button
                  type="button"
                  className="back-btn-step"
                  onClick={prevStep}
                >
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