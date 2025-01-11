import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Home() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Grab all users from /users endpoint
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users'); // /users from your backend
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="page">
      <h2>Home</h2>
      <p>This is the public home page.</p>
      <h4>All Users</h4>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.username} ({u.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
