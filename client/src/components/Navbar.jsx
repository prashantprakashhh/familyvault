import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const token = localStorage.getItem('token');
  return (
    <nav>
      <Link to="/">Home</Link>
      {!token ? (
        <>
          <Link to="/signup">Signup</Link>
          <Link to="/login">Login</Link>
        </>
      ) : (
        <>
          <Link to="/protected">Protected</Link>
          <button onClick={handleLogout} style={{ background: 'none', color: 'white', border: 'none', cursor: 'pointer' }}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
}

export default Navbar;
