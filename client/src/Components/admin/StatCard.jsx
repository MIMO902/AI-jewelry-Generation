import React from 'react';

function StatCard({ title, value }) {
  return (
    <div style={{
      backgroundColor: '#1e1e1e',
      border: '2px solid #D4AF37',
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h3 style={{ color: 'white', fontWeight: 'normal' }}>{title}</h3>
      <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#D4AF37' }}>{value}</p>
    </div>
  );
}

export default StatCard;
