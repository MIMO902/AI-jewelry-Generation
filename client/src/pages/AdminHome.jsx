// ✅ src/pages/AdminHome.js (with AdminProfile integrated)

import React, { useState } from 'react';
import Sidebar from '../components/admin/Sidebar';
import StatCard from '../components/admin/StatCard';
import ImagesSection from '../components/admin/ImagesSection';
import UserList from '../components/admin/UserList';
import AdminProfile from '../components/admin/AdminProfile'; // ✅ Import profile component
import '../App.css';

const generateCode = () => `IMG${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

const initialUsers = [
  {
    name: "Yahya",
    email: "yahya@example.com",
    role: "admin",
    savedDesigns: [
      { imagePath: "/images/ring1.jpg", price: 5000, weight: "10g", code: generateCode(), prompt: "Gold ring with emerald" }
    ],
    generatedImages: [
      { imagePath: "/images/ring1.jpg", price: 5000, weight: "10g", code: generateCode(), prompt: "Emerald ring prompt" },
      { imagePath: "/images/ring2.jpg", price: 4500, weight: "8g", code: generateCode(), prompt: "Ruby ring with flowers" }
    ]
  },
  {
    name: "Noha",
    email: "noha@example.com",
    role: "user",
    savedDesigns: [
      { imagePath: "/images/ring3.jpg", price: 3200, weight: "6g", code: generateCode(), prompt: "Silver ring" }
    ],
    generatedImages: [
      { imagePath: "/images/ring3.jpg", price: 3200, weight: "6g", code: generateCode(), prompt: "Simple silver ring" }
    ]
  }
];

function AdminHome() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const updateUsers = (newList) => setUsers([...newList]);

  const getStats = () => ({
    totalUsers: users.length,
    totalAdmins: users.filter(u => u.role === 'admin').length,
    totalSaved: users.reduce((sum, u) => sum + u.savedDesigns.length, 0),
    totalGenerated: users.reduce((sum, u) => sum + u.generatedImages.length, 0),
  });

  const filteredUsers = users.filter(u => {
    const matchName = u.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchEmail = u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const roleMatch = roleFilter === 'All' || u.role === roleFilter.toLowerCase();
    return (matchName || matchEmail) && roleMatch;
  });

  const buildContent = () => {
    switch (selectedIndex) {
      case 0:
        const stats = getStats();
        return (
          <div className="stats-grid">
            <StatCard title="Total Users" value={stats.totalUsers} />
            <StatCard title="Admins" value={stats.totalAdmins} />
            <StatCard title="Saved Designs" value={stats.totalSaved} />
            <StatCard title="Generated Images" value={stats.totalGenerated} />
          </div>
        );
      case 1:
        return <ImagesSection title="All Generated Images" keyName="generatedImages" users={users} setUsers={updateUsers} />;
      case 2:
        return <ImagesSection title="Saved Designs" keyName="savedDesigns" users={users} setUsers={updateUsers} />;
      case 3:
        return (
          <UserList
            users={filteredUsers}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            setUsers={updateUsers}
          />
        );
      case 4:
        return <UserList users={users.filter(u => u.role === 'admin')} setUsers={updateUsers} allowDelete={true} />;
      case 5:
        return <UserList users={users.filter(u => u.role === 'user')} setUsers={updateUsers} allowDelete={true} />;
      case 6:
        return <AdminProfile />; // ✅ Profile page inline with layout
      default:
        return <div>Invalid selection</div>;
    }
  };

  return (
    <div className="admin-container">
      <Sidebar selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
      <div className="admin-content">{buildContent()}</div>
    </div>
  );
}

export default AdminHome;
