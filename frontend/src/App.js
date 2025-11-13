// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'; 

// Import all components
import Login from './pages/Login/login'; 
import Registration from './pages/Registration/registration'; 
import Dashboard from './pages/Dashboard/dashboard'; 

function App() {
  // NOTE: In a real app, you would check for a session token here.
  // const isAuthenticated = checkAuthStatus();
  const isAuthenticated = true; // Set to true for dashboard testing

  return (
    <Router>
      <Routes>
        {/* Redirects root to dashboard if logged in, otherwise to login */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        
        {/* Dashboard Route (Protected) */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} 
        />
        
      </Routes>
    </Router>
  );
}

export default App;