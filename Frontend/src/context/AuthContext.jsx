// src/context/AuthContext.js
import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setCurrentUser(null);
        } 
        // else {
        //   fetchUserData();
        // }
      } catch (err) {
        localStorage.removeItem('token');
        setCurrentUser(null);
      }
    }
    setLoading(false);
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/me');
      setCurrentUser(response.data);
    } catch (err) {
      setError('Failed to fetch user data');
      logout();
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/register/', userData);
      localStorage.setItem('token', response.data.token);
      setCurrentUser(response.data.user);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await api.post('/login/', credentials);
      localStorage.setItem('token', response.data.access);
      setCurrentUser(response.data.user);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/update-profile/', profileData);

      setCurrentUser(response.data.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};