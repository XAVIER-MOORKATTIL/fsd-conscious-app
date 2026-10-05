import React, { useState } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <div>
      {!token ? (
        <Auth setToken={setToken} />
      ) : (
        <Dashboard logout={handleLogout} />
      )}
    </div>
  );
}