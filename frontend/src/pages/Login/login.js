//login.js
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
  const [isLoading, setIsLoading] = useState(false); 

  
  const backgroundImageURL = '/cit-u_background_img.jpg';

  const handleChange = (e) => {
    const value = e.target.name === 'studentId' ? e.target.value.trim() : e.target.value;
    
    setFormData({ ...formData, [e.target.name]: value });
    setError(''); 
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); 

    const cleanStudentId = formData.studentId.trim();
    const { password } = formData;

    
    if (!/^\d{2}-\d{4}-\d{3}$/.test(cleanStudentId)) {
      setError("Please enter the Student ID in XX-XXXX-XXX format (e.g., 20-0000-001).");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    // API Configuration (Matches your Spring Boot setup)
    const loginUrl = 'http://localhost:8080/api/auth/login'; 

    try {
      // Send POST request to Spring Boot
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          studentId: cleanStudentId, 
          password: password,
        }),
      });

      // Check for non-success status codes 
      if (!response.ok) {
        let errorMessage = `Login failed. Status: ${response.status}`;
        try {
            const errorBody = await response.json(); 
            errorMessage = errorBody.message || errorBody.error || errorMessage;
        } catch (e) {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
        }

        throw new Error(errorMessage);
      }

      // Process successful response 
      const data = await response.json();
      
      console.log("Login successful. Data:", data);

      // Store authentication token and user ID
      localStorage.setItem('authToken', data.token); 
      localStorage.setItem('userId', cleanStudentId);
      

      alert("Login successful! Redirecting to Dashboard.");
      navigate("/dashboard"); 

    } catch (err) {
      console.error("Login Error:", err.message);
      setError(err.message.includes("failed to fetch") ? "Could not connect to the server." : err.message); 

    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="container">
      {/* 1. Left Panel: Background Image and Info */}
      <div 
        className="left-panel"
        style={{ 
          backgroundImage: `url(${backgroundImageURL})`,
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* The overlay is handled by the ::before pseudo-element in login.css */}
        {/* The content must be wrapped or separated for the z-index to work against ::before */}
        <header className="panel-header">Login Buyer/Seller</header> 
        
        <main className="panel-content">
          <h1>Welcome to Your Campus Marketplace</h1>
          <p>
            Connect with fellow students, buy and sell items, and discover amazing
            deals right on your campus. Join thousands of students already using
            TeknoyHUB.
          </p>

          <div className="info-cards">
            {/* Using basic emojis/characters; replace with proper icons (FaPercent etc.) if available */}
            <div className="card">
              🛍️ Get exclusive student discounts on food, gadgets, and more from
              your campus community.
            </div>
            <div className="card">
              📚 Post your preloved books, uniforms, or gadgets. Earn cash and find
              great deals fast!
            </div>
            <div className="card">
              📢 Stay updated with campus activities, job fairs, and club events
              happening near you.
            </div>
            <div className="card">
              🛡️ Your safety matters. Only verified Technologians accounts can buy and sell
              within the hub.
            </div>
          </div>
        </main>
      </div>

      {/* 2. Right Panel: Login Form */}
      <div className="right-panel">
        <h1 className="welcome">WELCOME</h1>
        <p className="subtitle">Sign in to your account to continue</p>

        <form onSubmit={handleLogin}>
          <label htmlFor="studentId">Email Address (Student ID)</label>
          <input 
            type="text" 
            id="studentId" 
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            
            placeholder="Enter your Student ID (e.g., 20-0000-001)" 
            // Apply error class only if error is present
            className={error ? 'input-error' : ''} 
            required 
          />
          {/* Display error message right after the field that caused it, 
          or use a single error block below all inputs */}
          
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
          
          {/* Centralized error message display */}
          {error && <p className="error-message">{error}</p>}

          <div className="remember">
            <div>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            {/* Use Link or simple anchor for navigation, preventing full reload */}
            <Link to="/forgot-password" className="forgot"> 
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="signin-btn" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In to Teknoy Hub'}
          </button>

          <p className="or">Or continue with</p>

          <div className="socials">
            {/* The icons (FaGoogle, FaFacebookF) should be imported and used here for professional look */}
            <button type="button" className="google">Google</button>
            <button type="button" className="facebook">Facebook</button>
          </div>

          <p className="register">
            Don’t have an account? <Link to="/register">Create Account</Link>
          </p>

          <div className="policy">
            By signing in, you agree to our 
            <Link to="/terms">Terms of Service</Link> • 
            <Link to="/privacy">Privacy Policy</Link> • 
            <Link to="/cookies">Cookie Policy</Link>
          </div>
        </form>
      </div>
    </div>
  );
}