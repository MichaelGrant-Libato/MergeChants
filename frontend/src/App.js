import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Layout
import MainLayout from './layout/MainLayout';

// Pages
import Login from './pages/Login/login';
import Registration from './pages/Registration/registration';
import Dashboard from './pages/Dashboard/dashboard';
import SettingsPage from './pages/Settings/Settings';
import Messages from './pages/Messages/Messages';

import MyListings from "./pages/MyListings";
import Sell from "./pages/Sell";
import HistoryPage from "./pages/History";
import Report from "./pages/Report";

function App() {

  const isAuthenticated = true; // TEMP
 
  return (
    <Router>
      <Routes>
        
        {/* ROOT REDIRECT */}
        <Route
          path="/"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />

        {/* PROTECTED MAIN ROUTES */}
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <MainLayout>
              <SettingsPage />
            </MainLayout>
          }
        />

        <Route
          path="/messages"
          element={
            <MainLayout>
              <Messages />
            </MainLayout>
          }
        />

        {/* 🔥 NEW PAGES YOU ADDED */}
        <Route
          path="/mylistings"
          element={
            <MainLayout>
              <MyListings />
            </MainLayout>
          }
        />

        <Route
          path="/sell"
          element={
            <MainLayout>
              <Sell />
            </MainLayout>
          }
        />

        <Route
          path="/history"
          element={
            <MainLayout>
              <HistoryPage />
            </MainLayout>
          }
        />

        <Route
          path="/report"
          element={
            <MainLayout>
              <Report />
            </MainLayout>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
