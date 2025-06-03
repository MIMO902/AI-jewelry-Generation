import React, { useState } from 'react';

function PhotoUploader() {
  const [photo, setPhoto] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPhoto(imageUrl);
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <label style={{ fontWeight: 'bold', marginBottom: 8, display: 'block' }}>Upload Profile Photo</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{
          padding: '8px',
          backgroundColor: '#333',
          color: 'white',
          borderRadius: 8,
          border: '1px solid #555'
        }}
      />
      {photo && (
        <img
          src={photo}
          alt="Preview"
          style={{
            marginTop: 10,
            width: 100,
            height: 100,
            borderRadius: '50%',
            border: '2px solid #D4AF37',
            objectFit: 'cover'
          }}
        />
      )}
    </div>
  );
}

export default PhotoUploader;
