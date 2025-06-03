import React from 'react';

function StatusBox({ value }) {
  const isYes = value.toLowerCase() === 'yes';

  return (
    <div
      style={{
        padding: '10px 20px',
        backgroundColor: isYes ? 'lightgreen' : 'lightcoral',
        borderRadius: 8,
        color: '#222',
        fontWeight: 'bold',
        width: 80,
        textAlign: 'center',
        boxShadow: '0 0 5px rgba(0,0,0,0.2)'
      }}
    >
      {value.toUpperCase()}
    </div>
  );
}

export default StatusBox;
