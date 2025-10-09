import React, { useState } from "react";
import { Link } from "react-router-dom";
import bgImage from "./imgs/cit-u_background_img.jpg";
import "./registration.css";

export default function Registration() {
  const [progress, setProgress] = useState(0);

  const handleInputChange = () => {
    const inputs = document.querySelectorAll("input, select");
    const filled = Array.from(inputs).filter(
      (input) => input.value.trim() !== ""
    ).length;
    const total = inputs.length;
    setProgress(Math.round((filled / total) * 100));
  };

  return (
    <div
      className="registration-bg"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Header section outside the form card */}
      <div className="page-header">
        <h1 className="page-title">
          Create Your <span>MergeChants</span> Account
        </h1>
        <p className="page-subtitle">
          Join the exclusive CIT-University marketplace <br />
          Already have an account?{" "}
          <Link to="/" className="signin-link">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="registration-overlay">
        <div className="registration-card">
          <div className="progress-section">
            <label>Registration Progress</label>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="progress-value">{progress}%</p>
          </div>

          <form className="registration-form" onChange={handleInputChange}>
            <div className="form-group">
              <label>Student ID Number</label>
              <input type="text" placeholder="Enter your ID number" />
            </div>

            <div className="name-row">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" placeholder="Enter your first name" />
              </div>
              <div className="form-group">
                <label>Middle Name</label>
                <input type="text" placeholder="Enter your middle name" />
              </div>
            </div>

            <div className="name-row">
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" placeholder="Enter your last name" />
              </div>
              <div className="form-group">
                <label>Year Level</label>
                <select>
                  <option value=" ">Select your year level</option>
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Program</label>
              <input
                type="text"
                placeholder="Enter your program (e.g. BSCS)"
              />
            </div>

            <button type="submit" className="submit-btn">
              Complete Form →
            </button>

            <p className="terms">
              By signing up, you agree to our{" "}
              <a href="#">Terms and Conditions</a>.
            </p>

            <div className="footer-info">
              <p>📞 266-8888 (Reception)</p>
              <p>© CIT-U Verified Platform</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
