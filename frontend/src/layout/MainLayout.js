import React from "react";
import Navbar from "../Components/Navbar/Navbar";
import "./MainLayout.css";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />   {}
      <div className="main-wrapper">
        {children}
      </div>
    </>
  );
}
 