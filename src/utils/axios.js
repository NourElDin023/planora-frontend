import axios from 'axios';
import { getCookie, getJsonCookie, removeCookie } from './cookies';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get token from cookie
const getToken = () => {
  return getCookie('accessToken');
};

// Helper function to get refresh token from cookie
const getRefreshToken = () => {
  return getCookie('refreshToken');
};

// Helper function to clear auth data from cookies
const clearAuthData = () => {
  removeCookie('accessToken');
  removeCookie('refreshToken');
  removeCookie('user');
};

// Request interceptor to add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and not already retrying
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          // No refresh token, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }

        const response = await axios.post(
          'http://localhost:8000/api/users/token/refresh/',
          { refresh: refreshToken }
        );

        if (response.data.access) {
          // Store the new access token in cookie
          document.cookie = `accessToken=${response.data.access}; path=/; SameSite=Lax`;
          
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed, clear tokens and redirect to login
        clearAuthData();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
