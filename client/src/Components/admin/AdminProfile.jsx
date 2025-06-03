// ✅ src/components/AdminProfile.js (Updated - Removed Role field)

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaUpload } from 'react-icons/fa';

function AdminProfile() {
  const [name, setName] = useState('Yahya');
  const [email, setEmail] = useState('yahya@example.com');
  const [verified, setVerified] = useState('yes');
  const [photo, setPhoto] = useState(null);

  const handleSave = () => {
    toast.success('Profile updated successfully!');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPhoto(imageUrl);
    }
  };

  return (
    <div style={{ padding: 24, color: 'white' }}>
      <h2 style={{ color: '#D4AF37', fontSize: 28, marginBottom: 24 }}>👤 Admin Profile</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          background: 'linear-gradient(135deg, #1e1e1e, #2c2c2c)',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Upload Box */}
        <div
          style={{
            border: '2px dashed #D4AF37',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <label htmlFor="file-upload" style={{ cursor: 'pointer', color: '#D4AF37' }}>
            <FaUpload size={32} style={{ marginBottom: 10 }} />
            <p>Click to upload image</p>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </label>
          {photo && (
            <img
              src={photo}
              alt="Uploaded Preview"
              style={{ marginTop: 16, width: 100, height: 100, borderRadius: '10px', objectFit: 'cover' }}
            />
          )}
        </div>

        {/* Metadata Box */}
        <div style={{
          backgroundColor: '#2c2c2c',
          padding: '20px',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div>
            <label style={{ color: '#D4AF37' }}>Is Verified?</label>
            <div style={{ marginTop: 6 }}>
              <span style={{
                padding: '8px 16px',
                borderRadius: '6px',
                backgroundColor: verified === 'yes' ? 'lightgreen' : 'lightcoral',
                color: '#111',
                fontWeight: 'bold'
              }}>{verified.toUpperCase()}</span>
            </div>
          </div>
          <div>
            <label style={{ color: '#D4AF37' }}>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ color: '#D4AF37' }}>Username (Email)</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 30 }}>
        <button
          onClick={handleSave}
          style={saveButtonStyle}
        >
          submit
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #555',
  backgroundColor: '#1a1a1a',
  color: 'white',
  marginTop: '6px'
};

const saveButtonStyle = {
  padding: '10px 24px',
  backgroundColor: '#D4AF37',
  color: 'black',
  border: 'none',
  borderRadius: 10,
  fontWeight: 'bold',
  fontSize: 16,
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
};

export default AdminProfile;
