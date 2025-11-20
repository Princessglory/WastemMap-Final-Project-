import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create axios instance with base URL from environment variable
  const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
  });

  // Add request interceptor to include auth token - FIXED VERSION
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      console.log('🔐 Interceptor - Token found:', !!token);
      console.log('🔐 Interceptor - Request URL:', config.url);
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Authorization header added to request');
      }
      return config;
    },
    (error) => {
      console.error('❌ Interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor for debugging
  apiClient.interceptors.response.use(
    (response) => {
      console.log('✅ API Response success:', response.status, response.config.url);
      return response;
    },
    (error) => {
      console.error('❌ API Response error:', error.response?.status, error.config?.url);
      console.error('❌ Error details:', error.response?.data);
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    console.log('🔧 AuthContext initialized');
    console.log('Token exists:', !!token);
    console.log('User exists:', !!user);

    if (token && user) {
      try {
        const userData = JSON.parse(user);
        setCurrentUser(userData);
        console.log('✅ User restored from localStorage:', userData.email);
      } catch (error) {
        console.error('❌ Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 Making login request...');
      const response = await apiClient.post('/api/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      
      console.log('✅ Login successful');
      return { success: true };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('📝 Making registration request...');
      const response = await apiClient.post('/api/auth/register', userData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      
      console.log('✅ Registration successful');
      return { success: true };
    } catch (error) {
      console.error('❌ Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    console.log('👋 User logged out');
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    apiClient,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};