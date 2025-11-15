import React from "react";
import "./style.css";
import MainLayout from "../../layout/MainLayout";

export default function MyListings() {
  return (
    <MainLayout>
      <div className="mc-page-container">
        <h1 className="mc-title">My Listings</h1>
        <p className="mc-description">Your active and past listings will appear here.</p>
      </div>
    </MainLayout>
  );
}
