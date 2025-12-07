// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Layout
import MainLayout from "./layout/MainLayout";

// Pages
import Login from "./pages/Login/login";
import Registration from "./pages/Registration/registration";
import Dashboard from "./pages/Dashboard/dashboard";
import SettingsPage from "./pages/Settings/Settings";
import Messages from "./pages/Messages/Messages";
import MyListings from "./pages/MyListings/myListings";
import Sell from "./pages/Sell";
import HistoryPage from "./pages/History/History";
import CreateListings from "./pages/CreateListings/CreateListings";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import ReportTransaction from "./pages/Report/ReportTransaction";

function App() {
  const isAuthenticated = true; // TEMP – replace with real auth check

  return (
    <Router>
      <Routes>
        {/* ROOT REDIRECT */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />

        {/* PROTECTED ROUTES (WITH MAIN LAYOUT) */}
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

        <Route
          path="/createListings"
          element={
            <MainLayout>
              <CreateListings />
            </MainLayout>
          }
        />

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

        {/* PRODUCT DETAILS (NORMAL + HISTORY MODE) */}
        <Route
          path="/listing/:id"
          element={
            <MainLayout>
              <ProductDetails />
            </MainLayout>
          }
        />

        {/* REPORT TRANSACTION PAGE */}
        <Route
          path="/report/transaction/:transactionId"
          element={
            <MainLayout>
              <ReportTransaction/>
            </MainLayout>
          }
        />

        {/* EDIT LISTING (REUSES CREATE PAGE) */}
        <Route
          path="/edit/:id"
          element={
            <MainLayout>
              <CreateListings />
            </MainLayout>
          }
        />

        {/* OPTIONAL: 404 CATCH-ALL */}
        {/* <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
