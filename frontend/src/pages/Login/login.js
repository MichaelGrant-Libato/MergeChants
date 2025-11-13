// frontend/src/pages/Login/login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentId: '',
    password: '',
  });
  const [error, setError] = useState('');

  // Path string used for inline style
  const backgroundImageURL = '/cit-u_background_img.jpg';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const { studentId, password } = formData;

    // Client-side validation for Student ID format (XX-XXXX-XXX)
    if (!/^\d{2}-\d{4}-\d{3}$/.test(studentId.trim())) {
      setError("Please enter the Student ID in XX-XXXX-XXX format.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    // --- Simulated Successful Login ---
    console.log(`Attempting login for ID: ${studentId}`);
    
    alert("Login successful! Redirecting to Dashboard.");
    
    // 💡 CRITICAL FIX: Navigate to the route path, NOT the filename.
    navigate("/dashboard"); 
  };

  return (
    <div className="container">
      {/* CRITICAL FIX: Set ALL background properties inline */}
      <div 
        className="left-panel"
        style={{ 
            backgroundImage: `url(${backgroundImageURL})`,
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}
      >
        <h1>Welcome to Your Campus Marketplace</h1>
        <p>
          Connect with fellow students, buy and sell items, and discover amazing
          deals right on your campus. Join thousands of students already using
          MergeChants.
        </p>

        <div className="info-cards">
          <div className="card">
            🎓 Get exclusive student discounts on food, gadgets, and more from
            your campus community.
          </div>
          <div className="card">
            📚 Post your preloved books, uniforms, or gadgets. Earn cash and find
            great deals fast!
          </div>
          <div className="card">
            📅 Stay updated with campus activities, job fairs, and club events
            happening near you.
          </div>
          <div className="card">
            🛡️ Your safety matters. Only verified Technologians accounts can buy and sell
            within the hub.
          </div>
        </div>
      </div>

      <div className="right-panel">
        <h1 className="welcome">WELCOME</h1>
        <p className="subtitle">Sign in to your account to continue</p>

        <form onSubmit={handleLogin}>
          <label htmlFor="studentId">Student ID Number</label>
          <input 
            type="text" 
            id="studentId" 
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            placeholder="Enter your Student ID (e.g., 20-0000-001)" 
            className={error ? 'input-error' : ''}
            required 
          />

          <label htmlFor="loginPassword">Password</label>
          <input 
            type="password" 
            id="loginPassword" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password" 
            className={error ? 'input-error' : ''}
            required 
          />
          
          {error && <p className="error-message">{error}</p>}

          <div className="remember">
            <div>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="/" onClick={(e) => e.preventDefault()} className="forgot">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="signin-btn">
            Sign In to Teknoy Hub
          </button>

          <p className="or">or continue with</p>

          <div className="socials">
            <button type="button" className="google">Google</button>
            <button type="button" className="facebook">Facebook</button>
          </div>

          <p className="register">
            Don’t have an account? <Link to="/register">Create Account</Link>
          </p>

          <p className="policy">
            By signing in, you agree to our{" "}
            <a href="/" onClick={(e) => e.preventDefault()}>Terms of Service</a>, 
            <a href="/" onClick={(e) => e.preventDefault()}>Privacy Policy</a>, and{" "}
            <a href="/" onClick={(e) => e.preventDefault()}>Cookie Policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
}