import React, { useState } from 'react';
import Sidebar from './Sidebar';
import '../App.css'; // For styling

function AdminLayout({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(6); // 6 = Profile by default

  return (
    <div className="admin-container">
      <Sidebar selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
      <div className="admin-content">{children}</div>
    </div>
  );
}

export default AdminLayout;
