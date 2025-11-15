import React from "react";
import MainLayout from "../../layout/MainLayout";
import "./style.css";

export default function Report() {
  return (
    <MainLayout>
      <div className="mc-page-container">
        <h1 className="mc-title">Report</h1>
        <p className="mc-description">File a report for a suspicious listing or user.</p>
      </div>
    </MainLayout>
  );
}
