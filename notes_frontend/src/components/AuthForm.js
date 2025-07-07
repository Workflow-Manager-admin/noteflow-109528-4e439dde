import React, { useState } from 'react';

/**
 * Authentication form for login/registration.
 * Handles switching between sign in and register views.
 * @param {function} onAuthSuccess - Callback when authentication succeeds
 */
function AuthForm({ onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  // API_BASE can be set in .env or defaulted here for development
  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

  // PUBLIC_INTERFACE
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isRegister && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const endpoint = isRegister ? '/register' : '/login';
    try {
      const res = await fetch(`${API_BASE}/auth${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: form.username, password: form.password })
      });
      if (res.status === 400 || res.status === 401) {
        const data = await res.json();
        setError(data.detail || 'Authentication failed');
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      // Assume response: { token, user: {id, username} }
      onAuthSuccess(data.token, data.user);
    } catch (err) {
      setError(err.message || "Unknown error");
    }
    setLoading(false);
  };

  return (
    <div className="auth-form__container">
      <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
        <h2>{isRegister ? 'Register' : 'Login'}</h2>
        <div className="auth-form__field">
          <input
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            required
            autoFocus
          />
        </div>
        <div className="auth-form__field">
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            minLength={6}
          />
        </div>
        {isRegister && (
          <div className="auth-form__field">
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              minLength={6}
            />
          </div>
        )}
        {error && <div className="auth-form__error">{error}</div>}
        <button
          className="auth-form__submit"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Please wait...' : (isRegister ? 'Register' : 'Login')}
        </button>
        <div className="auth-form__toggle">
          {isRegister 
            ? <>Already have an account? <button type="button" onClick={() => setIsRegister(false)}>Login</button></>
            : <>No account? <button type="button" onClick={() => setIsRegister(true)}>Register</button></>
          }
        </div>
      </form>
    </div>
  );
}

export default AuthForm;
