import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get token from either storage
const getToken = () => {
  // Check sessionStorage first, then fallback to localStorage
  const sessionToken = sessionStorage.getItem('accessToken');
  if (sessionToken) return sessionToken;
  
  return localStorage.getItem('accessToken');
};

// Helper function to get refresh token from either storage
const getRefreshToken = () => {
  // Check sessionStorage first, then fallback to localStorage
  const sessionRefreshToken = sessionStorage.getItem('refreshToken');
  if (sessionRefreshToken) return sessionRefreshToken;
  
  return localStorage.getItem('refreshToken');
};

// Helper function to clear auth data from both storage types
const clearAuthData = () => {
  // Clear sessionStorage
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
  sessionStorage.removeItem('user');
  
  // Clear localStorage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// Helper to determine which storage is being used
const getActiveStorage = () => {
  return sessionStorage.getItem('accessToken') ? sessionStorage : localStorage;
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
          // Store the new access token in the same storage that was being used
          const storage = getActiveStorage();
          storage.setItem('accessToken', response.data.access);
          
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
