import React, { useState, useEffect } from 'react';
import './App.css';

import AuthForm from './components/AuthForm';
import NotesDashboard from './components/NotesDashboard';

// PUBLIC_INTERFACE
function App() {
  // App-level theme & auth state
  const [theme, setTheme] = useState('light');
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });

  // Effect to apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // PUBLIC_INTERFACE
  const handleLogin = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  // PUBLIC_INTERFACE
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <div className="App">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        {
          token ? (
            <NotesDashboard
              token={token}
              user={user}
              onLogout={handleLogout}
            />
          ) : (
            <AuthForm onAuthSuccess={handleLogin} />
          )
        }
      </header>
    </div>
  );
}

export default App;
