// login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    credential: "", // studentId or outlookEmail
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const backgroundImageURL = "/cit-u_background_img.jpg";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const identifier = formData.credential.trim();
    const { password } = formData;

    const isStudentId = /^\d{2}-\d{4}-\d{3}$/.test(identifier);
    const isCitEmail = /^[a-zA-Z0-9._%+-]+@cit\.edu$/.test(identifier);

    if (!isStudentId && !isCitEmail) {
      setError(
        "Enter a valid Student ID (XX-XXXX-XXX) or CIT Outlook email (@cit.edu)."
      );
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    const loginUrl = "http://localhost:8080/api/auth/login";

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: identifier, // ✅ MUST match LoginRequest.credential
          password: password,
        }),
      });

      if (!response.ok) {
        let errorMessage = `Login failed. Status: ${response.status}`;
        try {
          const errorBody = await response.json();
          errorMessage =
            errorBody.message || errorBody.error || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      console.log("Login successful. Data:", data);

      localStorage.setItem("authToken", data.token);
      // store whatever identifier was used
      localStorage.setItem("studentId", data.studentId || identifier);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login Error:", err.message);
      setError(
        err.message.includes("failed to fetch")
          ? "Could not connect to the server."
          : "Invalid Student ID/Email or password."
      );
      setIsLoading(false);
    }
  };

  const handleGoToRegister = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      navigate("/register");
    }, 600);
  };

  return (
    <>
      <div className="container">
        {/* Left Panel */}
        <div
          className="left-panel"
          style={{
            backgroundImage: `url(${backgroundImageURL})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <header className="panel-header">Login Buyer/Seller</header>

          <main className="panel-content">
            <h1>Welcome to Your Campus Marketplace</h1>
            <p>
              Connect with fellow students, buy and sell items, and discover
              amazing deals right on your campus. Join thousands of students
              already using TeknoyHUB.
            </p>

            <div className="info-cards">
              <div className="card">
                🛍️ Get exclusive student discounts on food, gadgets, and more
                from your campus community.
              </div>
              <div className="card">
                📚 Post your preloved books, uniforms, or gadgets. Earn cash and
                find great deals fast!
              </div>
              <div className="card">
                📢 Stay updated with campus activities, job fairs, and club
                events happening near you.
              </div>
              <div className="card">
                🛡️ Your safety matters. Only verified Technologians accounts can
                buy and sell within the hub.
              </div>
            </div>
          </main>
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          <h1 className="welcome">WELCOME</h1>
          <p className="subtitle">Sign in to your account to continue</p>

          <form onSubmit={handleLogin}>
            <label htmlFor="credential">Student ID or Outlook Email</label>
            <input
              type="text"
              id="credential"
              name="credential"
              value={formData.credential}
              onChange={handleChange}
              placeholder="20-0000-001 or firstname.lastname@cit.edu"
              className={error ? "input-error" : ""}
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
              className={error ? "input-error" : ""}
              required
            />

            {error && <p className="error-message">{error}</p>}

            <div className="remember">
              <div>
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <Link to="/forgot-password" className="forgot">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="signin-btn"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In to Teknoy Hub"}
            </button>

            <p className="or">Or continue with</p>

            <div className="socials">
              <button type="button" className="google">
                Google
              </button>
              <button type="button" className="facebook">
                Facebook
              </button>
            </div>

            <p className="register">
              Don’t have an account?{" "}
              <button
                type="button"
                className="link-button"
                onClick={handleGoToRegister}
                disabled={isLoading}
              >
                Create Account
              </button>
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

      {/* FULL-SCREEN LOADING OVERLAY */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-box">
            <div className="loading-spinner"></div>
            <p className="loading-text">Please wait, loading...</p>
          </div>
        </div>
      )}
    </>
  );
}
