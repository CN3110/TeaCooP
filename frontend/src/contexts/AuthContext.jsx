import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('user');
        console.error('Failed to parse user data', err);
      }
    }
    setLoading(false);
  }, []);

  const login = async (userId, password) => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', { 
        userId, 
        password 
      });
      
      const userData = {
        userId: userId.toUpperCase(),
        ...response.data
      };
      
      if (!userData.userType) {
        throw new Error('User type not provided by server');
      }
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw error.response?.data?.error || error.message || 'Login failed';
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAuthenticated = () => !!user?.token;

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      login, 
      logout,
      isAuthenticated 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};