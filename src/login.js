import React from "react";
import "./login.css";

export default function login() {
  return (
    <div className="container">
      <div className="left-panel">
        <h1>Welcome to Your Campus Marketplace</h1>
        <p>
          Connect with fellow students, buy and sell items, and discover amazing
          deals right on your campus. Join thousands of students already using
          TeknoyHub.
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
            🛡️ Your safety matters. Only verified Teknoy accounts can buy and sell
            within the hub.
          </div>
        </div>
      </div>

      <div className="right-panel">
        <h1 className="welcome">WELCOME</h1>
        <p className="subtitle">Sign in to your account to continue</p>

        <form>
          <label>Email Address</label>
          <input type="email" placeholder="Enter your email address" required />

          <label>Password</label>
          <input type="password" placeholder="Enter your password" required />

          <div className="remember">
            <div>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="forgot">
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
            Don’t have an account? <a href="#">Create Account</a>
          </p>

          <p className="policy">
            By signing in, you agree to our{" "}
            <a href="#">Terms of Service</a>, <a href="#">Privacy Policy</a>, and{" "}
            <a href="#">Cookie Policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
}
