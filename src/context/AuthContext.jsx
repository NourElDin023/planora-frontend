import { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/axios';
import { setCookie, getCookie, removeCookie, setJsonCookie, getJsonCookie } from '../utils/cookies';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper functions for token retrieval
  const getToken = () => {
    return getCookie('accessToken');
  };

  const getUser = () => {
    return getJsonCookie('user');
  };

  // Clear cookies on logout
  const clearAuthData = () => {
    removeCookie('accessToken');
    removeCookie('refreshToken');
    removeCookie('user');
  };

  useEffect(() => {
    // Improved auth check that fetches fresh data from the server
    const checkAuthStatus = async () => {
      const token = getToken();
      if (token) {
        try {
          // Verify token and get fresh user data
          const response = await axiosInstance.get('users/profile/');
          setCurrentUser(response.data);
          
          // Update user data in cookie
          setJsonCookie('user', response.data);
        } catch (error) {
          console.error('Auth verification failed:', error);
          // Token invalid or expired - clear auth data
          clearAuthData();
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };
    
    checkAuthStatus();
  }, []);

  const login = async (username, password, rememberMe = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('users/login/', {
        username,
        password
      });
      
      // Store tokens in cookies - use days parameter for persistent cookies if rememberMe is true
      const options = rememberMe ? { days: 30 } : {};
      
      setCookie('accessToken', response.data.access, options);
      setCookie('refreshToken', response.data.refresh, options);
      setJsonCookie('user', response.data.user, options);
      
      setCurrentUser(response.data.user);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('users/register/', userData);
      
      // On registration, use session cookies (no days parameter)
      setCookie('accessToken', response.data.access);
      setCookie('refreshToken', response.data.refresh);
      setJsonCookie('user', response.data.user);
      
      setCurrentUser(response.data.user);
      return response.data;
    } catch (error) {
      setError(error.response?.data || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Add function to refresh user profile data
  const refreshUserData = async () => {
    try {
      const response = await axiosInstance.get('users/profile/');
      setCurrentUser(response.data);
      
      // Update user data in cookie
      setJsonCookie('user', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      throw error;
    }
  };

  const logout = () => {
    clearAuthData();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    refreshUserData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;