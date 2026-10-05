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
    <main className="app-container">
      {!token ? (
        <Auth setToken={setToken} />
      ) : (
        <Dashboard token={token} logout={handleLogout} />
      )}
    </main>
  );
}