import React from "react";
import Navbar from "../Components/Navbar/Navbar";
import "./MainLayout.css";

export default function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-content">{children}</main>
    </div>
  );
}
