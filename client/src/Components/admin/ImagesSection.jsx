import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

function ImagesSection({ title, keyName, users, setUsers }) {
  const images = [];

  // Collect all images with owner info
  users.forEach(user => {
    user[keyName].forEach(img => {
      images.push({ ...img, owner: user });
    });
  });

  // Handle Delete with confirmation and undo
  const handleDelete = (code, ownerEmail) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this image?");
    if (!confirmDelete) return;

    const backupUsers = [...users]; // For undo

    const updated = users.map(user => {
      if (user.email === ownerEmail) {
        return {
          ...user,
          [keyName]: user[keyName].filter(img => img.code !== code)
        };
      }
      return user;
    });

    setUsers(updated);

    toast.success(
      <div>
        Image deleted.
        <button
          onClick={() => setUsers(backupUsers)}
          style={{
            marginLeft: 10,
            background: '#444',
            color: 'white',
            padding: '2px 8px',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          UNDO
        </button>
      </div>,
      {
        autoClose: 5000
      }
    );
  };

  return (
    <div>
      <h2 style={{ color: '#D4AF37', marginBottom: 20 }}>{title}</h2>
      <div style={{ display: 'grid', gap: 16 }}>
        {images.map((img, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              backgroundColor: '#1e1e1e',
              padding: '16px',
              borderRadius: '12px',
              alignItems: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
              transition: 'transform 0.2s',
            }}
          >
            <div style={{ marginRight: 20 }}>
              <img
                src={img.imagePath}
                alt="jewelry"
                style={{ width: 80, height: 80, borderRadius: 10 }}
              />
            </div>
            <div style={{ flexGrow: 1 }}>
              {/* No more code badge here */}

              <p style={{ color: '#D4AF37', fontWeight: 'bold', fontSize: 16, marginTop: 0 }}>Prompt</p>
              <p style={{ color: 'white', marginBottom: 6 }}>{img.prompt || 'No prompt available'}</p>

              <p style={{ color: 'lightgray', fontSize: 14 }}>
                Price: <strong style={{ color: 'white' }}>{img.price} EGP</strong> •
                Weight: <strong style={{ color: 'white' }}>{img.weight}</strong> •
                By: <strong style={{ color: '#D4AF37' }}>{img.owner.name}</strong>
              </p>
            </div>
            <button
              onClick={() => handleDelete(img.code, img.owner.email)}
              title="Delete Design"
              style={{
                backgroundColor: 'transparent',
                color: 'red',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <FaTrashAlt />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImagesSection;
