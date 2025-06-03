// ✅ src/components/Sidebar.js (fully updated with index switching only)

import React from 'react';
import './Sidebar.css';

function Sidebar({ selectedIndex, setSelectedIndex }) {
  const buttons = [
    { label: "Home", icon: "📊", index: 0 },
    { label: "All Images", icon: "🖼️", index: 1 },
    { label: "Saved Designs", icon: "💾", index: 2 },
    { label: "Users", icon: "👥", index: 3 },
    { label: "Profile", icon: "🧑‍💼", index: 6 } // ✅ profile is index-based now
  ];

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      {buttons.map((btn, i) => (
        <div
          key={i}
          className={`sidebar-button ${selectedIndex === btn.index ? 'active' : ''}`}
          onClick={() => setSelectedIndex(btn.index)}
        >
          <span className="icon">{btn.icon}</span> {btn.label}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
