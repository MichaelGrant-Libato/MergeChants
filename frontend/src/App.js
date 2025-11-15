import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import layout
import MainLayout from './layout/MainLayout';

// Import pages
import Login from './pages/Login/login';
import Registration from './pages/Registration/registration';
import Dashboard from './pages/Dashboard/dashboard';
import SettingsPage from './pages/Settings/Settings';
import Messages from './pages/Messages/Messages'; // <-- 1. IMPORTED MESSAGES PAGE

import MyListings from "./pages/MyListings";
import Sell from "./pages/Sell";
import HistoryPage from "./pages/History";
import Report from "./pages/Report";


function App() {
  // TEMP authentication (replace later)
  const isAuthenticated = true;

  return (
    <Router>
      <Routes>

        {/* Redirect root route */}
        <Route
          path="/"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <MainLayout>
                <Dashboard />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Protected Settings */}
        <Route
          path="/settings"
          element={
            isAuthenticated ? (
              <MainLayout>
                <SettingsPage />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 2. ADDED PROTECTED MESSAGES ROUTE */}
        <Route
          path="/messages"
          element={
            isAuthenticated ? (
              <MainLayout>
                <Messages />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* You can add more routes here, like /my-listings, /sell, etc. */}

      </Routes>
      <Route path="/mylistings" element={<MyListings />} />
      <Route path="/sell" element={<Sell />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/report" element={<Report />} />

    </Router>
  );
}

export default App;