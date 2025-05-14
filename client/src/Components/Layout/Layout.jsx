// src/Components/Layout/Layout.jsx
import React from "react";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {children}
    </div>
  );
}
