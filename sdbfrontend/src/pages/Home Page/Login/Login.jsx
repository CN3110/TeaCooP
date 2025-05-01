import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`http://localhost:3001/api/auth/login`, { userId, password });

      // Save token and user info as needed
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.role);
      localStorage.setItem('userId', response.data.userId);
      if (response.data.name) localStorage.setItem('userName', response.data.name);

      // Redirect based on user role
      switch (response.data.role) {
        case 'supplier':
          navigate('/supplier-dashboard');
          break;
        case 'driver':
          navigate('/driver-dashboard');
          break;
        case 'broker':
          navigate('/broker-dashboard');
          break;
        default:
          setError('Unknown user role.');
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login (Supplier / Driver / Broker)</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>User ID</label>
          <input
            type="text"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            placeholder="Enter your User ID (e.g. S123, D456, B789)"
            required
            autoFocus
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default Login;
