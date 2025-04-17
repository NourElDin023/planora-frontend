import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/', // <-- Make sure this is the base path
});

export default axiosInstance;
