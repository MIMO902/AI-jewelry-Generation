import React from 'react';
import { FaTrashAlt, FaExchangeAlt, FaUserShield, FaUser } from 'react-icons/fa';

function UserList({ users, setUsers, searchQuery, setSearchQuery, roleFilter, setRoleFilter }) {
  const toggleRole = (email) => {
    const updated = users.map(u => {
      if (u.email === email) {
        return { ...u, role: u.role === 'admin' ? 'user' : 'admin' };
      }
      return u;
    });
    setUsers(updated);
  };

  const deleteUser = (email) => {
    setUsers(users.filter(u => u.email !== email));
  };

  return (
    <div>
      {setSearchQuery && (
        <div style={{ marginBottom: 20 }}>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email"
            style={{
              padding: '10px',
              width: '300px',
              borderRadius: '8px',
              border: '1px solid #ccc'
            }}
          />
          <div style={{ marginTop: 10 }}>
            {['All', 'Admin', 'User'].map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                style={{
                  backgroundColor: roleFilter === role ? '#D4AF37' : '#444',
                  color: roleFilter === role ? 'black' : 'white',
                  border: 'none',
                  borderRadius: 6,
                  marginRight: 8,
                  padding: '6px 12px',
                  cursor: 'pointer'
                }}
              >
                {role === 'Admin' ? <FaUserShield style={{ marginRight: 5 }} /> : role === 'User' ? <FaUser style={{ marginRight: 5 }} /> : '👥'}
                {role}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        {users.map((user, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px',
            backgroundColor: '#2c2c2c',
            borderRadius: '8px',
            marginBottom: '10px'
          }}>
            <div>
              <h4 style={{ color: 'white', margin: 0 }}>{user.name}</h4>
              <p style={{ color: 'gray', margin: 0 }}>{user.email}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#D4AF37', marginRight: 10 }}>{user.role}</span>
              {setSearchQuery && (
                <>
                  <button
                    onClick={() => toggleRole(user.email)}
                    title="Swap Role"
                    style={{
                      marginRight: 10,
                      backgroundColor: '#555',
                      color: 'white',
                      border: 'none',
                      padding: '6px 10px',
                      borderRadius: 6
                    }}
                  >
                    <FaExchangeAlt />
                  </button>
                  <button
                    onClick={() => deleteUser(user.email)}
                    title="Delete User"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'red',
                      border: 'none',
                      padding: '6px 10px',
                      fontSize: '18px',
                      cursor: 'pointer'
                    }}
                  >
                    <FaTrashAlt />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;
