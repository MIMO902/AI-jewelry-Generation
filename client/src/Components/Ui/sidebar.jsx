import React, { useState } from 'react';
import { Home, User, Image, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [active, setActive] = useState('home');
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await fetch('/Signout', {
        method: 'GET',
        credentials: 'include', // make sure cookies/session are sent
      });

      if (response.redirected) {
        window.location.href = response.url; // follow backend redirect
      } else {
        // fallback in case redirect doesn’t work
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Logout failed.');
    }
  };
  const handleNavigation = (id) => {
    setActive(id);
    if (id === 'home') navigate('/LandingPage'); // Navigates directly to landing page
    if (id === 'gallery') navigate('/gallery');
    if (id === 'profile') navigate('/profile');
    if (id === 'logout') {
      // Add your logout logic here if necessary
      handleLogout();
    }
  };

  const navItems = [
    { id: 'home', icon: <Home size={24} />, label: 'Home' },
    { id: 'profile', icon: <User size={24} />, label: 'Profile' },
    { id: 'gallery', icon: <Image size={24} />, label: 'Gallery' },
    { id: 'logout', icon: <LogOut size={24} />, label: 'Logout' },
  ];

  return (
    <div className="h-screen w-16 bg-black flex flex-col justify-between items-center py-4 fixed left-0 top-0">
      {/* Navigation Icons */}
      <div className="flex flex-col gap-6 mt-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.id)}
            className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300
              ${active === item.id
                ? 'ring-2 ring-yellow-400 text-yellow-400 scale-110 bg-black animate-pulse'
                : 'text-white hover:text-yellow-400 hover:scale-110'}
            `}
            title={item.label}
          >
            {item.icon}
          </button>
        ))}
      </div>

      {/* Avatar/Profile */}
      <div className="mb-4">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
          alt="User Avatar"
          className="w-10 h-10 rounded-full border-2 border-yellow-400"
        />
      </div>
    </div>
  );
};

export default Sidebar;
